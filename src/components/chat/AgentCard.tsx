import React from 'react';
import { Brain, Wrench, Bug } from 'lucide-react';
import { AgentType, AGENT_META } from '@/lib/agent-classifier';

interface AgentCardProps {
  agent: AgentType;
  isThinking?: boolean;
  confidence?: number;
  compact?: boolean;
}

const ICONS: Record<AgentType, React.ElementType> = {
  'concept-breaker': Brain,
  refactorer: Wrench,
  'trouble-shooter': Bug,
};

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isThinking = false,
  confidence,
  compact = false,
}) => {
  const meta = AGENT_META[agent];
  const Icon = ICONS[agent];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
          ${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}
      >
        <Icon size={11} weight="bold" />
        {meta.label}
        {confidence !== undefined && (
          <span className="opacity-60 font-normal">· {confidence}%</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm font-medium
        ${meta.bgClass} ${meta.borderClass} ${meta.textClass}
        ${isThinking ? 'agent-thinking' : ''}`}
    >
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.bgClass}`}>
        <Icon size={14} weight="bold" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="leading-tight">{meta.label}</span>
        {isThinking && (
          <span className="text-[10px] font-normal opacity-60 leading-tight">Thinking…</span>
        )}
      </div>
      {!isThinking && confidence !== undefined && (
        <span
          className="ml-auto text-[10px] font-normal opacity-60 shrink-0"
          title="Classification confidence"
        >
          {confidence}%
        </span>
      )}
    </div>
  );
};

export default AgentCard;
