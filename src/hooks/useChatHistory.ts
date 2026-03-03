import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/hooks/useAIChat';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  agentUsed?: string;
}

const STORAGE_KEY = 'algoxai_chat_history';
const MAX_SESSIONS = 50;

// ─── DynamoDB REST helpers ────────────────────────────────────────────────────

const HTTP_URL = import.meta.env.VITE_AWS_API_HTTP_URL as string | undefined;

function getUserId(): string {
  // Prefer Cognito-derived id stored by auth hook; fall back to stable anon id
  return (
    localStorage.getItem('algoxai_user_id') ??
    (() => {
      const id = `anon_${crypto.randomUUID().slice(0, 8)}`;
      localStorage.setItem('algoxai_user_id', id);
      return id;
    })()
  );
}

async function dbListSessions(userId: string): Promise<ChatSession[]> {
  if (!HTTP_URL) return [];
  try {
    const res = await fetch(`${HTTP_URL}/history/sessions?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sessions ?? []).map((s: Record<string, unknown>) => ({
      id: s.sessionId as string,
      title: (s.title as string) ?? 'Chat',
      messages: (s.messages as ChatMessage[]) ?? [],
      createdAt: new Date((s.createdAt as number) ?? Date.now()),
      updatedAt: new Date((s.updatedAt as number) ?? Date.now()),
      agentUsed: s.agentSummary as string | undefined,
    }));
  } catch {
    return [];
  }
}

async function dbUpsertSession(userId: string, session: ChatSession): Promise<void> {
  if (!HTTP_URL) return;
  try {
    await fetch(`${HTTP_URL}/history/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        sessionId: session.id,
        title: session.title,
        messages: session.messages,
        agentSummary: session.agentUsed,
      }),
    });
  } catch { /* non-fatal */ }
}

async function dbDeleteSession(userId: string, sessionId: string): Promise<void> {
  if (!HTTP_URL) return;
  try {
    await fetch(
      `${HTTP_URL}/history/sessions/${encodeURIComponent(sessionId)}?userId=${encodeURIComponent(userId)}`,
      { method: 'DELETE' },
    );
  } catch { /* non-fatal */ }
}

// ─── Persist helpers ─────────────────────────────────────────────────────────

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((s: ChatSession) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch { /* quota exceeded — silently ignore */ }
}

function deriveTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New chat';
  const trimmed = first.content.trim();
  return trimmed.length > 48 ? trimmed.slice(0, 48) + '…' : trimmed;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // ── persist to localStorage whenever sessions change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // ── on mount: hydrate from DynamoDB if configured (merge with localStorage)
  useEffect(() => {
    if (!HTTP_URL) return;
    const userId = getUserId();
    setIsSyncing(true);
    dbListSessions(userId).then((remote) => {
      if (remote.length > 0) {
        setSessions((local) => {
          // Merge: remote wins for same id, keep local-only sessions too
          const remoteMap = new Map(remote.map((s) => [s.id, s]));
          const merged = [
            ...remote,
            ...local.filter((s) => !remoteMap.has(s.id)),
          ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
          return merged.slice(0, MAX_SESSIONS);
        });
      }
    }).finally(() => setIsSyncing(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createSession = useCallback((): string => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      title: 'New chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    // Persist to DynamoDB
    dbUpsertSession(getUserId(), session);
    return id;
  }, []);

  const updateSession = useCallback((id: string, messages: ChatMessage[]) => {
    setSessions((prev) => {
      const next = prev.map((s) =>
        s.id === id
          ? {
              ...s,
              messages,
              title: deriveTitle(messages),
              updatedAt: new Date(),
              agentUsed: [...messages].reverse().find((m) => m.agent)?.agent,
            }
          : s,
      );
      // Sync updated session to DynamoDB (fire & forget)
      const updated = next.find((s) => s.id === id);
      if (updated) dbUpsertSession(getUserId(), updated);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setActiveSessionId((prev) => (prev === id ? null : prev));
    dbDeleteSession(getUserId(), id);
  }, []);

  const clearAll = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
  }, []);

  const getSession = useCallback(
    (id: string) => sessions.find((s) => s.id === id) ?? null,
    [sessions],
  );
  // Group sessions by date label
  const grouped = sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
    const now = new Date();
    const diff = now.getTime() - s.updatedAt.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    let label: string;
    if (days < 1) label = 'Today';
    else if (days < 2) label = 'Yesterday';
    else if (days < 7) label = 'This week';
    else if (days < 30) label = 'This month';
    else label = 'Older';

    if (!acc[label]) acc[label] = [];
    acc[label].push(s);
    return acc;
  }, {});

  return {
    sessions,
    grouped,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    clearAll,
    getSession,
    isSyncing,
  };
}
