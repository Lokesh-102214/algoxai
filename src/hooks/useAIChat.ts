import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { AgentType } from '@/lib/agent-classifier';
import { algoxChat } from '@/lib/aws-chat-client';

// Re-export for backward compatibility
export type { AgentType };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: AgentType;
  confidence?: number;
  timestamp: Date;
  wasHelpful?: boolean | null;
}

// AWS WebSocket is the primary backend.
// Falls back to Supabase SSE if VITE_AWS_API_WS_URL is not set (dev/local).
const AWS_WS_URL = import.meta.env.VITE_AWS_API_WS_URL as string | undefined;
const SUPABASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-orchestrator`;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── helper: upsert the streaming assistant message ─────────────────────────
  const upsertAssistant = useCallback((
    content: string,
    agent?: AgentType,
  ) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant') {
        return prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content, agent: agent ?? m.agent }
            : m
        );
      }
      return [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content,
        agent,
        timestamp: new Date(),
        wasHelpful: null,
      }];
    });
  }, []);

  // ── AWS WebSocket send ─────────────────────────────────────────────────────
  const sendViaWS = useCallback(async (
    input: string,
    sessionId: string | undefined,
    userId: string,
    pageContext: string,
    forceAgent?: AgentType,
    history: ChatMessage[] = [],
  ) => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let streamContent = '';
    let streamAgent: AgentType | undefined;

    await algoxChat.send({
      message: input,
      sessionId,
      userId,
      forceAgent,
      pageContext,
      history: history.map(m => ({ role: m.role, content: m.content })),
      signal: ctrl.signal,

      onAgentDetected: (agent) => {
        streamAgent = agent as AgentType;
        setActiveAgent(agent as AgentType);
      },

      onToken: (token) => {
        streamContent += token;
        upsertAssistant(streamContent, streamAgent);
      },

      onDone: () => {
        abortRef.current = null;
      },

      onError: (err) => {
        abortRef.current = null;
        throw new Error(err);
      },
    });
  }, [upsertAssistant]);

  // ── Supabase SSE fallback (used when AWS WS URL not configured) ────────────
  const sendViaSSE = useCallback(async (
    input: string,
    pageContext: string,
    forceAgent?: AgentType,
  ) => {
    const resp = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ message: input, pageContext, forceAgent }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errData.error || `Error ${resp.status}`);
    }
    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamContent = '';
    let streamAgent: AgentType | undefined;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, nl);
        textBuffer = textBuffer.slice(nl + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.meta) {
            streamAgent = parsed.agent as AgentType;
            setActiveAgent(streamAgent ?? null);
            continue;
          }
          const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (chunk) {
            streamContent += chunk;
            upsertAssistant(streamContent, streamAgent);
          }
        } catch { /* ignore incomplete chunks */ }
      }
    }
  }, [upsertAssistant]);

  // ── main sendMessage ───────────────────────────────────────────────────────
  const sendMessage = useCallback(async (
    input: string,
    pageContext: string = '',
    forceAgent?: AgentType,
    opts?: { sessionId?: string; userId?: string },
  ) => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (AWS_WS_URL) {
        await sendViaWS(
          input,
          opts?.sessionId,
          opts?.userId ?? 'anonymous',
          pageContext,
          forceAgent,
          messages,
        );
      } else {
        await sendViaSSE(input, pageContext, forceAgent);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get response';
      if (msg !== 'Aborted') {
        console.error('AI chat error:', e);
        toast({ title: 'AI Error', description: msg, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, sendViaWS, sendViaSSE]);

  // ── stop streaming ─────────────────────────────────────────────────────────
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setActiveAgent(null);
  }, []);

  const loadMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
    const lastAgent = [...msgs].reverse().find((m) => m.agent)?.agent ?? null;
    setActiveAgent(lastAgent);
  }, []);

  const setHelpful = useCallback((messageId: string, helpful: boolean) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, wasHelpful: helpful } : m)
    );
  }, []);

  return {
    messages,
    isLoading,
    activeAgent,
    sendMessage,
    stopStreaming,
    clearMessages,
    loadMessages,
    setHelpful,
  };
}
