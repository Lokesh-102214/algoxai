import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIChat } from '@/hooks/useAIChat';
import { useAgentDetect } from '@/hooks/useAgentDetect';
import { classifyMessage } from '@/lib/agent-classifier';
import { ChatSession, useChatHistory } from '@/hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import CanvasPanel, { CanvasState, CanvasType } from './CanvasPanel';

interface ChatWindowProps {
  session: ChatSession | null;
  onSessionUpdate: (messages: ReturnType<typeof useAIChat>['messages']) => void;
  onNewSession: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, onSessionUpdate, onNewSession }) => {
  const { messages, isLoading, activeAgent, sendMessage, loadMessages, setHelpful } = useAIChat();
  const { manualAgent, setManualAgent, detectAgent } = useAgentDetect();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Canvas state
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvas, setCanvas] = useState<CanvasState | null>(null);

  // Load messages when session switches
  useEffect(() => {
    if (session) {
      loadMessages(session.messages);
    }
  }, [session?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync messages back to history
  useEffect(() => {
    if (messages.length > 0) {
      onSessionUpdate(messages);
    }
  }, [messages]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSend = useCallback(
    (text: string) => {
      if (!session) onNewSession();
      const agent = detectAgent(text);
      const classification = classifyMessage(text);

      // Auto-open canvas for code/diagram responses
      if (classification.canvasType && !canvasOpen) {
        // Canvas will open when AI responds — set a pending intent
        setCanvas(null);
        setCanvasOpen(false);
      }

      sendMessage(text, 'ai-dashboard', manualAgent !== 'auto' ? manualAgent : undefined);
    },
    [session, detectAgent, manualAgent, sendMessage, canvasOpen, onNewSession],
  );

  const handleOpenCanvas = useCallback(
    (content: string, type: CanvasType) => {
      setCanvas({ type, content, language: type === 'code' ? guessLang(content) : undefined });
      setCanvasOpen(true);
    },
    [],
  );

  // Auto-open canvas when AI finishes a response with code/diagrams
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || isLoading) return;
    if (canvasOpen) return; // already open

    // Only auto-open for refactorer/trouble-shooter (code canvas)
    if (last.agent === 'refactorer' || last.agent === 'trouble-shooter') {
      const codeMatch = last.content.match(/```[\w]*\n([\s\S]*?)```/);
      if (codeMatch) {
        setCanvas({
          type: 'code',
          content: codeMatch[1].trim(),
          language: last.content.match(/```(\w+)/)?.[1] ?? 'plaintext',
        });
        setCanvasOpen(true);
      }
    }
    // For concept-breaker: open document canvas on long detailed responses
    if (last.agent === 'concept-breaker' && last.content.length > 600) {
      if (!canvasOpen) {
        setCanvas({ type: 'document', content: last.content });
        setCanvasOpen(true);
      }
    }
  }, [messages, isLoading]);

  const handleTryInEditor = (code: string) => {
    navigate('/practice', { state: { code } });
  };

  // Last assistant message that is currently streaming
  const lastMsg = messages[messages.length - 1];
  const streamingMsgId = isLoading && lastMsg?.role === 'assistant' ? lastMsg.id : null;

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Chat column */}
      <div className="flex flex-col flex-1 overflow-hidden bg-[var(--chat-window-bg)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scroll">
          {messages.length === 0 && !isLoading ? (
            <ChatSuggestions onSelect={handleSend} />
          ) : (
            <div className="pb-4 pt-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={msg.id === streamingMsgId}
                  onHelpful={setHelpful}
                  onOpenCanvas={handleOpenCanvas}
                  onTryInEditor={handleTryInEditor}
                />
              ))}
              {/* Thinking indicator when no assistant message yet */}
              {isLoading && lastMsg?.role === 'user' && (
                <div className="w-full py-5 px-4 sm:px-6">
                  <div className="max-w-3xl mx-auto flex gap-3 items-center">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">AI</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          style={{ animationDelay: `${delay}ms` }}
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-[var(--chat-border)] pt-3 bg-[var(--chat-window-bg)]">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            manualAgent={manualAgent}
            activeAgent={activeAgent}
            onAgentToggle={setManualAgent}
          />
        </div>
      </div>

      {/* Canvas panel — responsive width */}
      {canvasOpen && canvas && (
        <div className="hidden lg:flex flex-col" style={{ width: 'var(--chat-canvas-width)' }}>
          <CanvasPanel
            canvas={canvas}
            isOpen={canvasOpen}
            onClose={() => setCanvasOpen(false)}
            onContentChange={(c) => setCanvas((prev) => prev ? { ...prev, content: c } : null)}
            onTryInEditor={handleTryInEditor}
          />
        </div>
      )}

      {/* Canvas mobile modal */}
      {canvasOpen && canvas && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end">
          <div className="w-full bg-[var(--chat-canvas-bg)] rounded-t-2xl max-h-[90vh] flex flex-col">
            <CanvasPanel
              canvas={canvas}
              isOpen={canvasOpen}
              onClose={() => setCanvasOpen(false)}
              onContentChange={(c) => setCanvas((prev) => prev ? { ...prev, content: c } : null)}
              onTryInEditor={handleTryInEditor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function guessLang(code: string): string {
  const m = code.match(/^```(\w+)/);
  if (m) return m[1];
  if (code.includes('#include')) return 'cpp';
  if (code.includes('def ')) return 'python';
  if (code.includes('public static')) return 'java';
  return 'javascript';
}

export default ChatWindow;
