import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Code2, Upload, FileText, Layers, Loader2, Sparkles } from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark', themeVariables: { primaryColor: '#38bdf8', lineColor: '#64748b', textColor: '#e2e8f0' } });

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !chart.trim()) return;
    const id = `mermaid-${Date.now()}`;
    mermaid.render(id, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    }).catch(() => {
      if (ref.current) ref.current.innerHTML = '<p class="text-muted-foreground text-sm">Could not render diagram</p>';
    });
  }, [chart]);

  return <div ref={ref} className="overflow-x-auto py-4" />;
};

const ArchitectureExplainer: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [inputTab, setInputTab] = useState('paste');
  const [codeInput, setCodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [combinedCode, setCombinedCode] = useState('');
  const [combinedText, setCombinedText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileContent(reader.result as string);
    reader.readAsText(file);
  };

  const getInput = () => {
    switch (inputTab) {
      case 'paste': return codeInput;
      case 'upload': return fileContent;
      case 'describe': return textInput;
      case 'combined': return `Description: ${combinedText}\n\nCode:\n\`\`\`\n${combinedCode}\n\`\`\``;
      default: return '';
    }
  };

  const handleAnalyze = () => {
    const input = getInput();
    if (!input.trim()) return;
    clearMessages();
    sendMessage(
      `Analyze this codebase/description and return: (1) a component breakdown list, (2) a dependency map as a Mermaid.js diagram (use graph TD syntax, no emojis), (3) explanation of key design patterns used, (4) potential bottlenecks or improvements.\n\n${input}`,
      'ai-dashboard/architecture',
      'concept-explainer'
    );
  };

  const lastResponse = messages.filter(m => m.role === 'assistant').pop();

  // Extract mermaid diagram from response
  const mermaidMatch = lastResponse?.content.match(/```mermaid\n([\s\S]*?)```/);
  const mermaidChart = mermaidMatch?.[1]?.trim() || '';

  // Extract design patterns (look for words after "Pattern" or tagged items)
  const patternMatches = lastResponse?.content.match(/\*\*([^*]+Pattern[^*]*)\*\*/gi) || [];
  const patterns = patternMatches.map(p => p.replace(/\*\*/g, ''));

  return (
    <div className="space-y-4">
      <Tabs value={inputTab} onValueChange={setInputTab}>
        <TabsList className="w-full grid grid-cols-4 h-9">
          <TabsTrigger value="paste" className="text-xs gap-1"><Code2 className="w-3 h-3" />Paste Code</TabsTrigger>
          <TabsTrigger value="upload" className="text-xs gap-1"><Upload className="w-3 h-3" />Upload File</TabsTrigger>
          <TabsTrigger value="describe" className="text-xs gap-1"><FileText className="w-3 h-3" />Describe</TabsTrigger>
          <TabsTrigger value="combined" className="text-xs gap-1"><Layers className="w-3 h-3" />Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-3">
          <Textarea value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="Paste your code here..." className="font-mono text-sm min-h-[160px] bg-muted/20 border-border/50" />
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <input type="file" accept=".ts,.tsx,.js,.jsx,.py,.cpp,.c,.java,.go,.rs" onChange={handleFileUpload} className="text-sm text-muted-foreground" />
          {fileContent && <p className="text-xs text-muted-foreground mt-2">{fileContent.split('\n').length} lines loaded</p>}
        </TabsContent>
        <TabsContent value="describe" className="mt-3">
          <Textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Describe your system architecture in plain English..." className="min-h-[160px] bg-muted/20 border-border/50" />
        </TabsContent>
        <TabsContent value="combined" className="mt-3 space-y-3">
          <Textarea value={combinedText} onChange={e => setCombinedText(e.target.value)} placeholder="Describe the system..." className="min-h-[80px] bg-muted/20 border-border/50" />
          <Textarea value={combinedCode} onChange={e => setCombinedCode(e.target.value)} placeholder="Paste code..." className="font-mono text-sm min-h-[100px] bg-muted/20 border-border/50" />
        </TabsContent>
      </Tabs>

      <Button onClick={handleAnalyze} disabled={isLoading || !getInput().trim()}>
        {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" />Analyze Architecture</>}
      </Button>

      {lastResponse && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Mermaid Diagram */}
          {mermaidChart && (
            <Card className="p-5 bg-card/80 border-border/50">
              <h3 className="font-semibold text-foreground mb-3">Dependency Map</h3>
              <MermaidDiagram chart={mermaidChart} />
            </Card>
          )}

          {/* Design Patterns */}
          {patterns.length > 0 && (
            <Card className="p-5 bg-card/80 border-border/50">
              <h3 className="font-semibold text-foreground mb-3">Design Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {patterns.map((p, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-primary/5 border-primary/30 text-primary">{p}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Full Analysis */}
          <Card className="p-5 bg-muted/10 border-border/50">
            <MarkdownRenderer content={lastResponse.content} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default ArchitectureExplainer;
