import React, { useState, useCallback, Suspense, lazy } from 'react';
import { X, Copy, Download, RefreshCw, Code2, GitBranch, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

// ─── Types ────────────────────────────────────────────────────────────────────

export type CanvasType = 'code' | 'diagram' | 'document';

export interface CanvasState {
  type: CanvasType;
  content: string;
  language?: string;   // for code canvas
  title?: string;
}

interface CanvasPanelProps {
  canvas: CanvasState | null;
  isOpen: boolean;
  onClose: () => void;
  onContentChange?: (content: string) => void;
  onTryInEditor?: (code: string) => void;
}

// ─── Header ───────────────────────────────────────────────────────────────────

const TYPE_ICONS = {
  code: Code2,
  diagram: GitBranch,
  document: FileText,
};

const TYPE_LABELS = {
  code: 'Code Canvas',
  diagram: 'Diagram Canvas',
  document: 'Document Canvas',
};

function CanvasHeader({
  canvas,
  onClose,
  onCopy,
  onDownload,
  onTypeChange,
}: {
  canvas: CanvasState;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onTypeChange: (type: CanvasType) => void;
}) {
  const [showTypePicker, setShowTypePicker] = useState(false);
  const Icon = TYPE_ICONS[canvas.type];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--chat-border)] bg-[var(--chat-canvas-bg)] shrink-0">
      {/* Left — type + title */}
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-primary shrink-0" />
        <div className="relative">
          <button
            onClick={() => setShowTypePicker(!showTypePicker)}
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {TYPE_LABELS[canvas.type]}
            <ChevronDown size={12} />
          </button>
          {showTypePicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--chat-sidebar-bg)] border border-[var(--chat-border)] rounded-xl p-1 shadow-xl min-w-[160px]">
              {(['code', 'diagram', 'document'] as CanvasType[]).map((t) => {
                const TIcon = TYPE_ICONS[t];
                return (
                  <button
                    key={t}
                    onClick={() => { onTypeChange(t); setShowTypePicker(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors
                      ${canvas.type === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                  >
                    <TIcon size={12} />
                    {TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {canvas.title && (
          <span className="text-xs text-muted-foreground truncate max-w-[140px]">· {canvas.title}</span>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <Copy size={12} /> Copy
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <Download size={12} /> Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Code Canvas ──────────────────────────────────────────────────────────────

function CodeCanvas({
  content,
  language = 'javascript',
  onChange,
  onTryInEditor,
}: {
  content: string;
  language?: string;
  onChange: (v: string) => void;
  onTryInEditor?: (code: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0d1117] border-b border-white/5 shrink-0">
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
          {language}
        </span>
        {onTryInEditor && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTryInEditor(content)}
            className="h-6 px-2 text-[10px] text-primary gap-1"
          >
            <RefreshCw size={10} /> Try in Editor
          </Button>
        )}
      </div>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
            <span className="text-xs text-muted-foreground">Loading editor…</span>
          </div>
        }
      >
        <MonacoEditor
          height="100%"
          language={language}
          value={content}
          onChange={(v) => onChange(v ?? '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            smoothScrolling: true,
            cursorBlinking: 'phase',
            tabSize: 2,
          }}
        />
      </Suspense>
    </div>
  );
}

// ─── Diagram Canvas (Mermaid) ─────────────────────────────────────────────────

function DiagramCanvas({ content, onChange }: { content: string; onChange: (v: string) => void }) {
  const [view, setView] = useState<'source' | 'preview'>('preview');

  // Extract mermaid code from markdown code block if present
  const mermaidSrc = content.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '').trim();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-4 border-b border-[var(--chat-border)] shrink-0 bg-[var(--chat-canvas-bg)]">
        {['preview', 'source'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab as typeof view)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors capitalize -mb-px
              ${view === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {view === 'preview' ? (
        <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
          <MermaidRenderer src={mermaidSrc} />
        </div>
      ) : (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><span className="text-xs text-muted-foreground">Loading…</span></div>}>
          <MonacoEditor
            height="100%"
            language="markdown"
            value={content}
            onChange={(v) => onChange(v ?? '')}
            theme="vs-dark"
            options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', padding: { top: 12, bottom: 12 } }}
          />
        </Suspense>
      )}
    </div>
  );
}

// Mermaid renderer using iframe + CDN (avoids npm import issues)
function MermaidRenderer({ src }: { src: string }) {
  const encoded = encodeURIComponent(src);
  const url = `https://mermaid.ink/svg/${btoa(unescape(encodeURIComponent(src)))}`;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <img
        src={url}
        alt="Mermaid diagram"
        className="max-w-full rounded-xl border border-border shadow-lg bg-white/5"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <p className="text-[10px] text-muted-foreground">
        Rendered via mermaid.ink · Switch to Source to edit
      </p>
    </div>
  );
}

// ─── Document Canvas ──────────────────────────────────────────────────────────

function DocumentCanvas({ content, onChange }: { content: string; onChange: (v: string) => void }) {
  const [view, setView] = useState<'preview' | 'edit'>('preview');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-0 px-4 border-b border-[var(--chat-border)] shrink-0 bg-[var(--chat-canvas-bg)]">
        {['preview', 'edit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab as typeof view)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors capitalize -mb-px
              ${view === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {view === 'preview' ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto prose-sm">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      ) : (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><span className="text-xs text-muted-foreground">Loading…</span></div>}>
          <MonacoEditor
            height="100%"
            language="markdown"
            value={content}
            onChange={(v) => onChange(v ?? '')}
            theme="vs-dark"
            options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', padding: { top: 12, bottom: 12 }, lineNumbers: 'off' }}
          />
        </Suspense>
      )}
    </div>
  );
}

// ─── Download helper ─────────────────────────────────────────────────────────

function downloadContent(content: string, type: CanvasType) {
  const ext = type === 'code' ? 'txt' : type === 'diagram' ? 'md' : 'md';
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `canvas.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

const CanvasPanel: React.FC<CanvasPanelProps> = ({
  canvas,
  isOpen,
  onClose,
  onContentChange,
  onTryInEditor,
}) => {
  const [localContent, setLocalContent] = useState(canvas?.content ?? '');
  const [localType, setLocalType] = useState<CanvasType>(canvas?.type ?? 'document');

  // Sync when canvas from outside changes
  React.useEffect(() => {
    if (canvas) {
      setLocalContent(canvas.content);
      setLocalType(canvas.type);
    }
  }, [canvas?.content, canvas?.type]);

  const handleChange = useCallback(
    (v: string) => {
      setLocalContent(v);
      onContentChange?.(v);
    },
    [onContentChange],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent);
    toast({ title: 'Copied', description: 'Canvas content copied' });
  };

  const handleDownload = () => {
    downloadContent(localContent, localType);
  };

  if (!isOpen || !canvas) return null;

  const fakeCanvas: CanvasState = { ...canvas, content: localContent, type: localType };

  return (
    <div className="canvas-enter flex flex-col h-full border-l border-[var(--chat-border)] bg-[var(--chat-canvas-bg)]">
      <CanvasHeader
        canvas={fakeCanvas}
        onClose={onClose}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onTypeChange={setLocalType}
      />

      {localType === 'code' && (
        <CodeCanvas
          content={localContent}
          language={canvas.language ?? guessLanguage(localContent)}
          onChange={handleChange}
          onTryInEditor={onTryInEditor}
        />
      )}
      {localType === 'diagram' && (
        <DiagramCanvas content={localContent} onChange={handleChange} />
      )}
      {localType === 'document' && (
        <DocumentCanvas content={localContent} onChange={handleChange} />
      )}
    </div>
  );
};

// Guess language from code content
function guessLanguage(code: string): string {
  const match = code.match(/^```(\w+)/);
  if (match) return match[1];
  if (code.includes('#include')) return 'cpp';
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
  if (code.includes('public static') || code.includes('System.out')) return 'java';
  if (code.includes('function') || code.includes('const ') || code.includes('=>')) return 'javascript';
  return 'plaintext';
}

export default CanvasPanel;
