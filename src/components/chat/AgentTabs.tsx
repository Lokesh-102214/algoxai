import React from 'react';
import { Brain, Wrench, Bug, Shuffle } from 'lucide-react';
import { AgentType, AGENT_META } from '@/lib/agent-classifier';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AgentTabsProps {
  selected: AgentType | 'auto';
  onChange: (agent: AgentType | 'auto') => void;
  activeAgent?: AgentType | null; // auto-detected live
}

const ICONS: Record<AgentType, React.ElementType> = {
  'concept-breaker': Brain,
  refactorer: Wrench,
  'trouble-shooter': Bug,
};

const AGENTS: AgentType[] = ['concept-breaker', 'refactorer', 'trouble-shooter'];

const AgentTabs: React.FC<AgentTabsProps> = ({ selected, onChange, activeAgent }) => {
  return (
    <div className="flex flex-col gap-1 px-3 pb-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-1">
        Agent
      </p>

      {/* Auto tab */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onChange('auto')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left border
              ${
                selected === 'auto'
                  ? 'bg-primary/10 border-primary/40 text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
          >
            <Shuffle size={14} />
            <span>Auto Route</span>
            {selected === 'auto' && activeAgent && (
              <span
                className={`ml-auto text-[10px] font-normal px-1.5 py-0.5 rounded-full border
                  ${AGENT_META[activeAgent].bgClass} ${AGENT_META[activeAgent].borderClass} ${AGENT_META[activeAgent].textClass}`}
              >
                {AGENT_META[activeAgent].label.split(' ')[0]}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs max-w-[200px]">
          AI classifies your message and picks the best agent automatically
        </TooltipContent>
      </Tooltip>

      {/* Individual agent tabs */}
      {AGENTS.map((agent) => {
        const meta = AGENT_META[agent];
        const Icon = ICONS[agent];
        const isActive = selected === agent;

        return (
          <Tooltip key={agent}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onChange(isActive ? 'auto' : agent)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left border
                  ${
                    isActive
                      ? `${meta.bgClass} ${meta.borderClass} ${meta.textClass} font-medium`
                      : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                <Icon size={14} />
                <span className="truncate">{meta.label}</span>
                {isActive && (
                  <span
                    className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotClass}`}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-[220px]">
              {meta.description}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default AgentTabs;
