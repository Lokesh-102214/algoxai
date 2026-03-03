import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  ArrowUp,
  Paperclip,
  Mic,
  MicOff,
  Square,
  Brain,
  Wrench,
  Bug,
  Shuffle,
  Code2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AgentType, AGENT_META } from '@/lib/agent-classifier';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  manualAgent: AgentType | 'auto';
  activeAgent: AgentType | null;
  onAgentToggle: (agent: AgentType | 'auto') => void;
  placeholder?: string;
}

const AGENT_ICONS: Record<AgentType, React.ElementType> = {
  'concept-breaker': Brain,
  refactorer: Wrench,
  'trouble-shooter': Bug,
};

const MIN_ROWS = 1;
const MAX_ROWS = 8;

export default function ChatInput({
  onSend,
  isLoading,
  manualAgent,
  activeAgent,
  onAgentToggle,
  placeholder = 'Ask anything about algorithms, paste code, or describe a bug…',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [codeMode, setCodeMode] = useState(false);

  // ─── Auto-resize textarea ────────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * MAX_ROWS + 24;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [value]);

  // ─── Voice input (Web Speech API) ───────────────────────────────────────
  const recognitionRef = useRef<any>(null);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // ─── File attach ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const ext = file.name.split('.').pop() ?? '';
      const wrapped = `\`\`\`${ext}\n${content}\n\`\`\``;
      setValue((prev) => (prev ? prev + '\n\n' + wrapped : wrapped));
      setAttachedFile(file.name);
      setCodeMode(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ─── Send ────────────────────────────────────────────────────────────────
  const handleSend = () => {
    const text = value.trim();
    if (!text || isLoading) return;
    onSend(text);
    setValue('');
    setAttachedFile(null);
    setCodeMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !codeMode) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Agent pill label ────────────────────────────────────────────────────
  const displayAgent = manualAgent !== 'auto' ? manualAgent : activeAgent;
  const agentMeta = displayAgent ? AGENT_META[displayAgent] : null;
  const AgentIcon = displayAgent ? AGENT_ICONS[displayAgent] : Shuffle;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 pb-4">
      {/* Attached file badge */}
      {attachedFile && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-xs text-muted-foreground bg-muted/40 border border-border rounded-full px-2.5 py-0.5 flex items-center gap-1.5">
            <Paperclip size={10} />
            {attachedFile}
            <button
              onClick={() => {
                setAttachedFile(null);
                setValue('');
                setCodeMode(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={10} />
            </button>
          </span>
        </div>
      )}

      {/* Main input container */}
      <div
        className={`relative rounded-2xl border bg-[var(--chat-input-bg)] transition-all duration-150
          ${isLoading ? 'border-border/30' : 'border-border focus-within:border-primary/40'}
        `}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          rows={MIN_ROWS}
          className={`w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed
            ${codeMode ? 'font-mono' : 'font-sans'}
          `}
        />

        {/* Bottom toolbar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-2.5 py-2">
          {/* Attach file */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg shrink-0"
              >
                <Paperclip size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach code file</TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept=".py,.js,.ts,.cpp,.c,.java,.txt,.jsx,.tsx,.go,.rs"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Code mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCodeMode(!codeMode)}
                disabled={isLoading}
                className={`h-8 w-8 p-0 rounded-lg shrink-0 ${
                  codeMode ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{codeMode ? 'Switch to text mode' : 'Switch to code mode'}</TooltipContent>
          </Tooltip>

          {/* Voice */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                disabled={isLoading}
                className={`h-8 w-8 p-0 rounded-lg shrink-0 ${
                  isListening
                    ? 'text-red-400 bg-red-400/10 animate-pulse'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isListening ? 'Stop listening' : 'Voice input'}</TooltipContent>
          </Tooltip>

          {/* Agent quick-switch pill */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  const agents: (AgentType | 'auto')[] = [
                    'auto',
                    'concept-breaker',
                    'refactorer',
                    'trouble-shooter',
                  ];
                  const current = agents.indexOf(manualAgent);
                  onAgentToggle(agents[(current + 1) % agents.length]);
                }}
                disabled={isLoading}
                className={`h-8 flex items-center gap-1.5 px-2.5 rounded-lg text-xs font-medium border transition-all duration-150
                  ${
                    agentMeta
                      ? `${agentMeta.bgClass} ${agentMeta.borderClass} ${agentMeta.textClass}`
                      : 'border-border/50 text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                <AgentIcon size={12} />
                <span className="hidden sm:inline">
                  {manualAgent === 'auto'
                    ? activeAgent
                      ? `Auto · ${AGENT_META[activeAgent].label.split(' ')[0]}`
                      : 'Auto'
                    : agentMeta?.label}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Cycle agent — currently:{' '}
              {manualAgent === 'auto' ? 'Auto (AI picks)' : agentMeta?.label}
            </TooltipContent>
          </Tooltip>

          {/* Send / Stop */}
          <div className="ml-auto">
            {isLoading ? (
              <Button
                size="sm"
                onClick={() => {/* stop streaming — future: cancel token */}}
                className="h-8 w-8 p-0 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border"
              >
                <Square size={12} fill="currentColor" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!value.trim() || isLoading}
                className="h-8 w-8 p-0 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 transition-opacity"
              >
                <ArrowUp size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
        Press <kbd className="font-mono">Enter</kbd> to send ·{' '}
        <kbd className="font-mono">Shift+Enter</kbd> for new line in text mode
      </p>
    </div>
  );
}
