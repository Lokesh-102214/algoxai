import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from '@/hooks/useAIChat';
import { AgentType, AGENT_META } from '@/lib/agent-classifier';
import AgentCard from './AgentCard';
import StreamingCursor from './StreamingCursor';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { toast } from '@/hooks/use-toast';
import { Brain, Wrench, Bug } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onHelpful?: (id: string, helpful: boolean) => void;
  onOpenCanvas?: (content: string, type: 'code' | 'diagram' | 'document') => void;
  onTryInEditor?: (code: string) => void;
}

const AI_ICONS: Record<AgentType, React.ElementType> = {
  'concept-breaker': Brain,
  refactorer: Wrench,
  'trouble-shooter': Bug,
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function extractFirstCode(content: string): string | null {
  const match = content.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function detectCanvasType(content: string, agent?: AgentType): 'code' | 'diagram' | 'document' {
  const hasCode = /```/.test(content);
  if (agent === 'refactorer' || agent === 'trouble-shooter') return 'code';
  if (hasCode) return 'code';
  if (agent === 'concept-breaker') return 'document';
  return 'document';
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  onHelpful,
  onOpenCanvas,
  onTryInEditor,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const agent = message.agent as AgentType | undefined;
  const agentMeta = agent ? AGENT_META[agent] : null;
  const AgentIcon = agent ? AI_ICONS[agent] : null;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({ title: 'Copied', description: 'Message copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCanvas = () => {
    if (!onOpenCanvas) return;
    const type = detectCanvasType(message.content, agent);
    const code = extractFirstCode(message.content);
    onOpenCanvas(code ?? message.content, type);
  };

  if (isUser) {
    return (
      <div className="chat-msg-enter group w-full py-5 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-1">
          {/* Label row */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs font-medium text-muted-foreground">You</span>
            <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>
          {/* Bubble */}
          <div className="self-end max-w-[85%]">
            <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/25 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="chat-msg-enter group w-full py-5 px-4 sm:px-6 hover:bg-white/[0.015] transition-colors duration-150">
      <div className="max-w-3xl mx-auto flex gap-3">
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 mt-0.5
            ${agentMeta ? `${agentMeta.bgClass} ${agentMeta.borderClass}` : 'bg-muted/30 border-border'}`}
        >
          {AgentIcon ? (
            <AgentIcon size={13} className={agentMeta?.textClass} />
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground">AI</span>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {agent && (
              <AgentCard
                agent={agent}
                isThinking={isStreaming && !message.content}
                confidence={message.confidence}
                compact
              />
            )}
            <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Thinking dots (before first token) */}
          {isStreaming && !message.content && (
            <div className="flex items-center gap-1.5 py-2">
              <span
                className={`w-2 h-2 rounded-full ${agentMeta?.dotClass ?? 'bg-primary'} animate-bounce`}
                style={{ animationDelay: '0ms' }}
              />
              <span
                className={`w-2 h-2 rounded-full ${agentMeta?.dotClass ?? 'bg-primary'} animate-bounce`}
                style={{ animationDelay: '150ms' }}
              />
              <span
                className={`w-2 h-2 rounded-full ${agentMeta?.dotClass ?? 'bg-primary'} animate-bounce`}
                style={{ animationDelay: '300ms' }}
              />
            </div>
          )}

          {/* Markdown content */}
          {message.content && (
            <div className="prose-sm text-sm leading-relaxed text-foreground">
              <MarkdownRenderer content={message.content} onTryInEditor={onTryInEditor} />
              {isStreaming && <StreamingCursor />}
            </div>
          )}

          {/* Action row — only when done streaming */}
          {!isStreaming && message.content && (
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {/* Copy */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyMessage}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <Copy size={12} />
                {copied ? 'Copied' : 'Copy'}
              </Button>

              {/* Open in Canvas */}
              {onOpenCanvas && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenCanvas}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <ExternalLink size={12} />
                  Canvas
                </Button>
              )}

              {/* Thumbs */}
              <div className="flex items-center gap-0.5 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHelpful?.(message.id, true)}
                  className={`h-7 w-7 p-0 ${
                    message.wasHelpful === true
                      ? 'text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ThumbsUp size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHelpful?.(message.id, false)}
                  className={`h-7 w-7 p-0 ${
                    message.wasHelpful === false
                      ? 'text-red-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ThumbsDown size={12} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
