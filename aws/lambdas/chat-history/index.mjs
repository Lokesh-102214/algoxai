/**
 * AlgoX.ai — Chat History Lambda (HTTP API)
 * Routes (all require ?userId=<id> or X-User-Id header):
 *   GET    /history/sessions          — list all sessions (metadata only)
 *   GET    /history/sessions/{id}     — get one session with full messages
 *   POST   /history/sessions          — create or upsert session
 *   DELETE /history/sessions/{id}     — delete session
 */

import {
  DynamoDBClient,
  QueryCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const TABLE = process.env.CHAT_HISTORY_TABLE ?? 'ChatHistoryTable';

// ── helpers ──────────────────────────────────────────────────────────────────
function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

function getUserId(event) {
  return (
    event.queryStringParameters?.userId ??
    event.headers?.['x-user-id'] ??
    event.headers?.['X-User-Id'] ??
    null
  );
}

function getSessionId(event) {
  return event.pathParameters?.id ?? null;
}

// ── GET /history/sessions ────────────────────────────────────────────────────
async function listSessions(userId) {
  const result = await dynamo.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: marshall({ ':uid': userId }),
    ProjectionExpression: 'sessionId, title, createdAt, updatedAt, agentSummary, messageCount',
    ScanIndexForward: false, // newest first (if sort key is timestamp-prefixed)
    Limit: 100,
  }));

  const sessions = (result.Items ?? []).map(item => unmarshall(item));
  return response(200, { sessions });
}

// ── GET /history/sessions/{id} ───────────────────────────────────────────────
async function getSession(userId, sessionId) {
  const result = await dynamo.send(new GetItemCommand({
    TableName: TABLE,
    Key: marshall({ userId, sessionId }),
  }));

  if (!result.Item) {
    return response(404, { error: 'Session not found' });
  }

  return response(200, { session: unmarshall(result.Item) });
}

// ── POST /history/sessions ───────────────────────────────────────────────────
async function upsertSession(userId, body) {
  const {
    sessionId,
    title = 'New Chat',
    messages = [],
    agentSummary,
  } = body;

  if (!sessionId) {
    return response(400, { error: 'sessionId is required' });
  }

  const now = Date.now();
  const ttl = Math.floor(now / 1000) + 90 * 24 * 60 * 60; // 90 days

  const item = {
    userId,
    sessionId,
    title: title.slice(0, 120),
    messages,
    createdAt: now,
    updatedAt: now,
    messageCount: messages.length,
    agentSummary: agentSummary ?? null,
    ttl,
  };

  await dynamo.send(new PutItemCommand({
    TableName: TABLE,
    Item: marshall(item, { removeUndefinedValues: true }),
  }));

  return response(201, { sessionId, created: true });
}

// ── DELETE /history/sessions/{id} ────────────────────────────────────────────
async function deleteSession(userId, sessionId) {
  await dynamo.send(new DeleteItemCommand({
    TableName: TABLE,
    Key: marshall({ userId, sessionId }),
    ConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: marshall({ ':uid': userId }),
  }));

  return response(200, { deleted: true, sessionId });
}

// ── PATCH /history/sessions/{id}/title ───────────────────────────────────────
async function updateTitle(userId, sessionId, body) {
  const title = body?.title?.slice(0, 120) ?? 'Chat';

  await dynamo.send(new UpdateItemCommand({
    TableName: TABLE,
    Key: marshall({ userId, sessionId }),
    UpdateExpression: 'SET title = :t, updatedAt = :now',
    ConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: marshall({ ':t': title, ':now': Date.now(), ':uid': userId }),
  }));

  return response(200, { sessionId, title });
}

// ── handler ──────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return response(200, {});
  }

  const method = event.requestContext?.http?.method ?? event.httpMethod;
  const rawPath = event.rawPath ?? event.path ?? '';
  const userId = getUserId(event);
  const sessionId = getSessionId(event);

  if (!userId) {
    return response(401, { error: 'userId is required (query param or X-User-Id header)' });
  }

  let body = {};
  if (event.body) {
    try { body = JSON.parse(event.body); } catch { /* ignore */ }
  }

  try {
    // GET /history/sessions
    if (method === 'GET' && !sessionId) return listSessions(userId);

    // GET /history/sessions/{id}
    if (method === 'GET' && sessionId) return getSession(userId, sessionId);

    // POST /history/sessions
    if (method === 'POST') return upsertSession(userId, body);

    // PATCH /history/sessions/{id}
    if ((method === 'PATCH' || method === 'PUT') && sessionId) return updateTitle(userId, sessionId, body);

    // DELETE /history/sessions/{id}
    if (method === 'DELETE' && sessionId) return deleteSession(userId, sessionId);

    return response(405, { error: `Method ${method} not allowed` });
  } catch (err) {
    console.error('Handler error:', err);
    if (err.name === 'ConditionalCheckFailedException') {
      return response(403, { error: 'Forbidden or not found' });
    }
    return response(500, { error: err.message ?? 'Internal server error' });
  }
};
