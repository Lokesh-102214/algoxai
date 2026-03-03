import React, { useState } from 'react';
import { PenSquare, Trash2, Brain, Wrench, Bug, Search, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatSession } from '@/hooks/useChatHistory';
import { AgentType, AGENT_META } from '@/lib/agent-classifier';
import AgentTabs from './AgentTabs';

interface ChatSidebarProps {
  sessions: ChatSession[];
  grouped: Record<string, ChatSession[]>;
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onCollapse: () => void;
  manualAgent: AgentType | 'auto';
  activeAgent: AgentType | null;
  onAgentChange: (agent: AgentType | 'auto') => void;
  collapsed?: boolean;
  onExpand?: () => void;
}

const AGENT_ICONS: Record<AgentType, React.ElementType> = {
  'concept-breaker': Brain,
  refactorer: Wrench,
  'trouble-shooter': Bug,
};

const DATE_ORDER = ['Today', 'Yesterday', 'This week', 'This month', 'Older'];

export default function ChatSidebar({
  sessions,
  grouped,
  activeSessionId,
  onSelect,
  onNew,
  onDelete,
  onCollapse,
  manualAgent,
  activeAgent,
  onAgentChange,
  collapsed = false,
  onExpand,
}: ChatSidebarProps) {
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredGrouped = search.trim()
    ? {
        Results: sessions.filter((s) =>
          s.title.toLowerCase().includes(search.toLowerCase()),
        ),
      }
    : grouped;

  const orderedKeys = Object.keys(filteredGrouped).sort(
    (a, b) =>
      (DATE_ORDER.indexOf(a) === -1 ? 99 : DATE_ORDER.indexOf(a)) -
      (DATE_ORDER.indexOf(b) === -1 ? 99 : DATE_ORDER.indexOf(b)),
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-3 px-2 h-full bg-[var(--chat-sidebar-bg)] border-r border-[var(--chat-border)] w-14">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onExpand}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
              <PanelLeft size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onNew}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
              <PenSquare size={15} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">New chat</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full bg-[var(--chat-sidebar-bg)] border-r border-[var(--chat-border)]"
      style={{ width: 'var(--chat-sidebar-width)' }}
    >
      {/* Top: Logo + New Chat + Collapse — all in one row, no overlap */}
      <div className="flex items-center justify-between px-3 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-500/60 to-indigo-500/60 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">AX</span>
          </div>
          <span className="text-sm font-semibold text-foreground truncate">AlgoX Chat</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onNew}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <PenSquare size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onCollapse}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                <PanelLeftClose size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Collapse sidebar</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Agent tabs */}
      <div className="shrink-0 border-b border-[var(--chat-border)] pb-3">
        <AgentTabs
          selected={manualAgent}
          onChange={onAgentChange}
          activeAgent={activeAgent}
        />
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-[var(--chat-border)] text-sm">
          <Search size={12} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none flex-1"
          />
        </div>
      </div>

      {/* Session history */}
      <ScrollArea className="flex-1 chat-scroll">
        <div className="px-2 pb-4">
          {sessions.length === 0 && !search && (
            <p className="text-[11px] text-muted-foreground/50 text-center py-8 px-4">
              Start a chat to see your history here
            </p>
          )}

          {orderedKeys.map((label) => {
            const group = filteredGrouped[label];
            if (!group?.length) return null;

            return (
              <div key={label} className="mb-4">
                <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1.5">
                  {label}
                </p>
                <div className="space-y-0.5">
                  {group.map((s) => {
                    const isActive = s.id === activeSessionId;
                    const AgentIcon = s.agentUsed
                      ? AGENT_ICONS[s.agentUsed as AgentType]
                      : null;
                    const agentMeta = s.agentUsed
                      ? AGENT_META[s.agentUsed as AgentType]
                      : null;

                    return (
                      <div
                        key={s.id}
                        className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-100
                          ${isActive
                            ? 'bg-white/8 text-foreground'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                          }`}
                        onClick={() => onSelect(s.id)}
                      >
                        {/* Agent dot */}
                        {AgentIcon && agentMeta ? (
                          <AgentIcon size={11} className={`shrink-0 ${agentMeta.textClass}`} />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-muted/40 shrink-0" />
                        )}

                        {/* Title */}
                        <span className="flex-1 text-xs truncate">{s.title}</span>

                        {/* Delete button — visible on hover */}
                        {confirmDelete === s.id ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(s.id); setConfirmDelete(null); }}
                              className="h-5 px-1.5 text-[10px] rounded bg-destructive/80 text-white hover:bg-destructive transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                              className="h-5 px-1 text-[10px] rounded hover:bg-white/10 text-muted-foreground"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(s.id); }}
                            className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-destructive/20 hover:text-destructive text-muted-foreground shrink-0 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
