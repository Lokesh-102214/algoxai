/**
 * AlgoX.ai — WebSocket Orchestrator Lambda
 * Handles: $connect, $disconnect, $default (chat messages)
 * Streams Claude 3.5 Sonnet tokens back via ApiGateway WebSocket
 * Uses unified Bedrock ConverseStream API
 */

import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import { AGENTS, classifyAgent } from '../shared/agents.mjs';

// ── clients ────────────────────────────────────────────────────────────────
const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION ?? 'us-east-1' });
const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });

const WS_TABLE = process.env.WS_CONNECTIONS_TABLE ?? 'WsConnectionsTable';
const HISTORY_TABLE = process.env.CHAT_HISTORY_TABLE ?? 'ChatHistoryTable';
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-5-sonnet-20241022-v2:0';
const TTL_SEC = 24 * 60 * 60; // 24 h connection TTL

// ── helpers ─────────────────────────────────────────────────────────────────
function mgmtClient(event) {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  return new ApiGatewayManagementApiClient({
    endpoint: `https://${domain}/${stage}`,
  });
}

async function send(mgmt, connectionId, data) {
  const payload = Buffer.from(JSON.stringify(data));
  try {
    await mgmt.send(new PostToConnectionCommand({ ConnectionId: connectionId, Data: payload }));
  } catch (err) {
    if (err.statusCode === 410) {
      // Stale connection — clean up
      await dynamo.send(new DeleteItemCommand({
        TableName: WS_TABLE,
        Key: { connectionId: { S: connectionId } },
      }));
      throw err; // re-throw so the stream stops
    }
    throw err;
  }
}

// ── $connect ────────────────────────────────────────────────────────────────
async function handleConnect(event) {
  const connectionId = event.requestContext.connectionId;
  const userId = event.queryStringParameters?.userId ?? 'anonymous';
  const ttl = Math.floor(Date.now() / 1000) + TTL_SEC;

  await dynamo.send(new PutItemCommand({
    TableName: WS_TABLE,
    Item: {
      connectionId: { S: connectionId },
      userId: { S: userId },
      connectedAt: { N: String(Date.now()) },
      ttl: { N: String(ttl) },
    },
  }));

  console.log('Connected:', connectionId, 'userId:', userId);
  return { statusCode: 200, body: 'Connected' };
}

// ── $disconnect ──────────────────────────────────────────────────────────────
async function handleDisconnect(event) {
  const connectionId = event.requestContext.connectionId;

  await dynamo.send(new DeleteItemCommand({
    TableName: WS_TABLE,
    Key: { connectionId: { S: connectionId } },
  }));

  console.log('Disconnected:', connectionId);
  return { statusCode: 200, body: 'Disconnected' };
}

// ── $default (chat) ──────────────────────────────────────────────────────────
async function handleChat(event) {
  const connectionId = event.requestContext.connectionId;
  const mgmt = mgmtClient(event);

  let body;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    await send(mgmt, connectionId, { type: 'error', message: 'Invalid JSON' });
    return { statusCode: 400 };
  }

  const {
    action,
    message = '',
    sessionId,
    userId = 'anonymous',
    forceAgent,        // 'concept-breaker' | 'refactorer' | 'trouble-shooter' | undefined
    history = [],      // [{role:'user'|'assistant', content:string}]
    pageContext,       // optional context from current page
  } = body;

  if (action !== 'chat') {
    return { statusCode: 200, body: 'ok' };
  }

  // 1. Classify agent
  const agentId = forceAgent && AGENTS[forceAgent] ? forceAgent : classifyAgent(message);
  const agent = AGENTS[agentId];

  // 2. Notify client which agent is responding
  await send(mgmt, connectionId, { type: 'agent', agent: agentId, label: agent.label });

  // 3. Build messages array for Bedrock Converse API (last 20 turns)
  const contextWindow = history.slice(-20);
  const converseMessages = [
    ...contextWindow.map(m => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
    {
      role: 'user',
      content: [{ text: pageContext ? `[Page context: ${pageContext}]\n\n${message}` : message }],
    },
  ];

  // 4. Stream response via ConverseStream (unified Bedrock API)
  let fullText = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const streamResp = await bedrock.send(new ConverseStreamCommand({
      modelId: MODEL_ID,
      system: [{ text: agent.systemPrompt }],
      messages: converseMessages,
      inferenceConfig: { maxTokens: 4096 },
    }));

    for await (const event of streamResp.stream) {
      if (event.contentBlockDelta?.delta?.text) {
        const token = event.contentBlockDelta.delta.text;
        fullText += token;
        await send(mgmt, connectionId, { type: 'token', content: token });
      } else if (event.metadata?.usage) {
        inputTokens = event.metadata.usage.inputTokens ?? 0;
        outputTokens = event.metadata.usage.outputTokens ?? 0;
      }
    }
  } catch (err) {
    console.error('Bedrock stream error:', err);
    try {
      await send(mgmt, connectionId, {
        type: 'error',
        message: err.message ?? 'Bedrock error',
      });
    } catch { /* connection may be gone */ }
    return { statusCode: 500 };
  }

  // 5. Persist assistant message to DynamoDB chat history
  if (sessionId) {
    try {
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await dynamo.send(new UpdateItemCommand({
        TableName: HISTORY_TABLE,
        Key: {
          userId: { S: userId },
          sessionId: { S: sessionId },
        },
        UpdateExpression:
          'SET #msgs = list_append(if_not_exists(#msgs, :empty), :newMsgs), updatedAt = :now',
        ExpressionAttributeNames: { '#msgs': 'messages' },
        ExpressionAttributeValues: {
          ':newMsgs': {
            L: [
              {
                M: {
                  id: { S: `msg_${Date.now() - 1}_usr` },
                  role: { S: 'user' },
                  content: { S: message },
                  agent: { S: agentId },
                  ts: { N: String(Date.now() - 1) },
                },
              },
              {
                M: {
                  id: { S: msgId },
                  role: { S: 'assistant' },
                  content: { S: fullText },
                  agent: { S: agentId },
                  ts: { N: String(Date.now()) },
                },
              },
            ],
          },
          ':empty': { L: [] },
          ':now': { N: String(Date.now()) },
        },
      }));
    } catch (dbErr) {
      console.error('DynamoDB persist error (non-fatal):', dbErr);
    }
  }

  // 6. Send done event with metadata
  await send(mgmt, connectionId, {
    type: 'done',
    agent: agentId,
    usage: { inputTokens, outputTokens },
  });

  return { statusCode: 200 };
}

// ── handler ──────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  const route = event.requestContext?.routeKey;

  switch (route) {
    case '$connect':    return handleConnect(event);
    case '$disconnect': return handleDisconnect(event);
    case '$default':    return handleChat(event);
    default:
      return { statusCode: 400, body: `Unknown route: ${route}` };
  }
};
