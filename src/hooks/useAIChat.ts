import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export type AgentType = 'concept-explainer' | 'code-analyzer' | 'debugging-assistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: AgentType;
  confidence?: number;
  timestamp: Date;
  wasHelpful?: boolean | null;
}

const ORCHESTRATOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-orchestrator`;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);

  const sendMessage = useCallback(async (
    input: string,
    pageContext: string = '',
    forceAgent?: AgentType
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

    let assistantContent = '';
    let detectedAgent: AgentType | undefined;
    let detectedConfidence: number | undefined;

    try {
      const resp = await fetch(ORCHESTRATOR_URL, {
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

      const upsertAssistant = (content: string, agent?: AgentType, confidence?: number) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content, agent: agent || m.agent, confidence: confidence || m.confidence } : m);
          }
          return [...prev, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content,
            agent,
            confidence,
            timestamp: new Date(),
            wasHelpful: null,
          }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            
            // Handle metadata line from orchestrator
            if (parsed.meta) {
              detectedAgent = parsed.agent;
              detectedConfidence = parsed.confidence;
              setActiveAgent(parsed.agent);
              continue;
            }

            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              upsertAssistant(assistantContent, detectedAgent, detectedConfidence);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              upsertAssistant(assistantContent, detectedAgent, detectedConfidence);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      console.error('AI chat error:', e);
      toast({ title: 'AI Error', description: e.message || 'Failed to get response', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setActiveAgent(null);
  }, []);

  const setHelpful = useCallback((messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, wasHelpful: helpful } : m));
  }, []);

  return { messages, isLoading, activeAgent, sendMessage, clearMessages, setHelpful };
}
