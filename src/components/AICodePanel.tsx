import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, Bug, FileText, Loader2, CheckCircle, AlertTriangle,
  ChevronUp, ChevronDown, Code2
} from 'lucide-react';
import { useAIChat, AgentType } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface AICodePanelProps {
  code: string;
  context?: string;
  onApplyCode?: (code: string) => void;
}

const AICodePanel: React.FC<AICodePanelProps> = ({ code, context = 'algorithm-page', onApplyCode }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState<'analyze' | 'debug' | 'docs' | null>(null);
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();

  const handleAction = (action: 'analyze' | 'debug' | 'docs') => {
    setActiveAction(action);
    setExpanded(true);
    clearMessages();

    const agentMap: Record<string, AgentType> = {
      analyze: 'code-analyzer',
      debug: 'debugging-assistant',
      docs: 'code-analyzer',
    };

    const promptMap: Record<string, string> = {
      analyze: `Analyze this code for correctness, time/space complexity, and potential optimizations:\n\n\`\`\`\n${code}\n\`\`\``,
      debug: `Debug this code. Find any bugs, edge cases, or potential runtime errors:\n\n\`\`\`\n${code}\n\`\`\``,
      docs: `Generate documentation for this code. Return ONLY a documentation comment block:\n\n\`\`\`\n${code}\n\`\`\``,
    };

    sendMessage(promptMap[action], context, agentMap[action]);
  };

  const lastResponse = messages.filter(m => m.role === 'assistant').pop();

  // Extract code blocks from response for "Apply Fix"
  const codeMatch = lastResponse?.content.match(/```(?:cpp|c\+\+|python|java|javascript)?\n([\s\S]*?)```/);
  const extractedCode = codeMatch?.[1]?.trim();

  return (
    <div className="mt-4 space-y-2">
      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction('analyze')}
          disabled={isLoading}
          className="border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
        >
          {isLoading && activeAction === 'analyze' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
          Analyze with AI
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction('debug')}
          disabled={isLoading}
          className="border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
        >
          {isLoading && activeAction === 'debug' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Bug className="w-3 h-3 mr-1" />}
          Debug
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction('docs')}
          disabled={isLoading}
          className="border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
        >
          {isLoading && activeAction === 'docs' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileText className="w-3 h-3 mr-1" />}
          Generate Docs
        </Button>
      </div>

      {/* Results Panel */}
      {(expanded && (lastResponse || isLoading)) && (
        <Card className="border-border/50 bg-card/80 overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              {activeAction === 'analyze' && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">Code Analyzer</Badge>}
              {activeAction === 'debug' && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-[10px]">Debug Assistant</Badge>}
              {activeAction === 'docs' && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-[10px]">Documentation</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {extractedCode && onApplyCode && (
                <Button size="sm" variant="ghost" onClick={() => onApplyCode(extractedCode)} className="h-7 text-xs text-cp-easy">
                  <CheckCircle className="w-3 h-3 mr-1" /> Apply Fix
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setExpanded(false)} className="h-7 w-7 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 max-h-[400px] overflow-y-auto">
            {isLoading && !lastResponse ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            ) : lastResponse ? (
              <div className="prose-sm">
                <MarkdownRenderer content={lastResponse.content} />
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AICodePanel;
