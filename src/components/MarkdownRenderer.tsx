import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github-dark.css';
import { Button } from '@/components/ui/button';
import { Copy, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', cpp);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);

interface MarkdownRendererProps {
  content: string;
  onTryInEditor?: (code: string) => void;
}

const CodeBlock = ({ code, language, onTryInEditor }: { code: string; language?: string; onTryInEditor?: (code: string) => void }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      try {
        hljs.highlightElement(codeRef.current);
      } catch { /* ignore */ }
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Code copied to clipboard' });
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{language || 'code'}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
            <Copy className="w-3 h-3 mr-1" /> Copy
          </Button>
          {onTryInEditor && (
            <Button variant="ghost" size="sm" onClick={() => onTryInEditor(code)} className="h-7 px-2 text-xs text-primary">
              <Play className="w-3 h-3 mr-1" /> Try in Editor
            </Button>
          )}
        </div>
      </div>
      <pre className="p-4 overflow-x-auto bg-[#0d1117]">
        <code ref={codeRef} className={language ? `language-${language}` : ''}>
          {code}
        </code>
      </pre>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onTryInEditor }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeStr = String(children).replace(/\n$/, '');
          
          if (match || codeStr.includes('\n')) {
            return <CodeBlock code={codeStr} language={match?.[1]} onTryInEditor={onTryInEditor} />;
          }
          return <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm" {...props}>{children}</code>;
        },
        table({ children }) {
          return (
            <div className="my-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-muted/50">{children}</thead>;
        },
        th({ children }) {
          return <th className="px-4 py-2 text-left font-semibold text-foreground border-b border-border">{children}</th>;
        },
        td({ children }) {
          return <td className="px-4 py-2 text-muted-foreground border-b border-border/50">{children}</td>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold mt-3 mb-1 text-foreground">{children}</h3>;
        },
        p({ children }) {
          return <p className="mb-2 leading-relaxed text-muted-foreground">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside mb-2 space-y-1 text-muted-foreground">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-2 space-y-1 text-muted-foreground">{children}</ol>;
        },
        strong({ children }) {
          return <strong className="text-foreground font-semibold">{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
