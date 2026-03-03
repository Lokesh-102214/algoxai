/**
 * AlgoX.ai — Agent Lambda base
 * Called by orchestrator via Lambda.invoke or directly
 * Payload: { message, history, connectionId, domain, stage }
 * Returns: { content } (full response, not streamed — orchestrator handles the WS)
 */

import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION ?? 'us-east-1' });
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-5-sonnet-20241022-v2:0';

export async function runAgent({ systemPrompt, agentId, event }) {
  const {
    message = '',
    history = [],
    connectionId,
    domain,
    stage,
    pageContext,
  } = event;

  const messages = [
    ...history.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: pageContext ? `[Context: ${pageContext}]\n\n${message}` : message },
  ];

  const bedrockBody = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });

  // If called with a WebSocket connection, stream tokens back directly
  if (connectionId && domain && stage) {
    const mgmt = new ApiGatewayManagementApiClient({
      endpoint: `https://${domain}/${stage}`,
    });

    const streamResp = await bedrock.send(new InvokeModelWithResponseStreamCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: bedrockBody,
    }));

    let fullText = '';
    for await (const ev of streamResp.body) {
      if (ev.chunk?.bytes) {
        const chunk = JSON.parse(Buffer.from(ev.chunk.bytes).toString('utf-8'));
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          const token = chunk.delta.text;
          fullText += token;
          await mgmt.send(new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify({ type: 'token', content: token, agent: agentId })),
          }));
        }
      }
    }
    return { content: fullText };
  }

  // Otherwise: buffered response (for direct Lambda invoke or testing)
  const streamResp = await bedrock.send(new InvokeModelWithResponseStreamCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: bedrockBody,
  }));

  let fullText = '';
  for await (const ev of streamResp.body) {
    if (ev.chunk?.bytes) {
      const chunk = JSON.parse(Buffer.from(ev.chunk.bytes).toString('utf-8'));
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        fullText += chunk.delta.text;
      }
    }
  }
  return { content: fullText, agent: agentId };
}
