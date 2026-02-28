import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code2, FileText, GitCommit, BarChart3, Copy, CheckCircle, AlertTriangle,
  Info, Flame, TrendingUp, Calendar, Sparkles, Loader2
} from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// ─── Code Review Tab ──────────────────────────────────────────
const CodeReviewTab = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [code, setCode] = useState('');

  const handleReview = () => {
    if (!code.trim()) return;
    clearMessages();
    sendMessage(
      `Review this code for readability, naming conventions, edge cases, and CP-specific optimizations:\n\n\`\`\`\n${code}\n\`\`\``,
      'productivity/code-review',
      'code-analyzer'
    );
  };

  const lastResponse = messages.filter(m => m.role === 'assistant').pop();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Paste your code (up to 500 lines)</label>
        <Textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="font-mono text-sm min-h-[200px] bg-muted/20 border-border/50"
          rows={12}
        />
      </div>
      <Button onClick={handleReview} disabled={isLoading || !code.trim()}>
        {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Thinking...</> : <><Code2 className="w-4 h-4 mr-2" />Analyze Code</>}
      </Button>

      {lastResponse && (
        <Card className="p-5 bg-muted/10 border-border/50 animate-fade-in-up">
          <MarkdownRenderer content={lastResponse.content} />
        </Card>
      )}
    </div>
  );
};

// ─── Analytics Tab ────────────────────────────────────────────
const AnalyticsTab = () => {
  // Demo data
  const dailyData = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    problems: Math.floor(Math.random() * 8) + 1,
  }));

  const radarData = [
    { topic: 'Arrays', score: 85 },
    { topic: 'DP', score: 45 },
    { topic: 'Graphs', score: 60 },
    { topic: 'Greedy', score: 75 },
    { topic: 'Search', score: 90 },
    { topic: 'Backtrack', score: 40 },
  ];

  const streak = 7;

  return (
    <div className="space-y-6">
      {/* Streak */}
      <Card className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-cp-medium" />
          <div>
            <p className="text-2xl font-bold text-foreground">{streak}-day streak!</p>
            <p className="text-sm text-muted-foreground">Keep it going — consistency is key.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card className="p-5 bg-card/80 border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Daily Activity (14 days)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="problems" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Topic Coverage */}
        <Card className="p-5 bg-card/80 border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-secondary" /> Topic Coverage
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <PolarRadiusAxis tick={false} domain={[0, 100]} />
                <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── PR Summary Tab ───────────────────────────────────────────
const PRSummaryTab = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [diff, setDiff] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!diff.trim()) return;
    clearMessages();
    sendMessage(
      `Generate a concise, professional Git commit message and a 3-bullet PR description for these changes:\n\n${diff}`,
      'productivity/pr-summary',
      'code-analyzer'
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const lastResponse = messages.filter(m => m.role === 'assistant').pop();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Paste a code diff or describe your changes</label>
        <Textarea
          value={diff}
          onChange={e => setDiff(e.target.value)}
          placeholder="Paste your git diff or describe changes made..."
          className="font-mono text-sm min-h-[160px] bg-muted/20 border-border/50"
          rows={8}
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading || !diff.trim()}>
        {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Thinking...</> : <><GitCommit className="w-4 h-4 mr-2" />Generate Summary</>}
      </Button>

      {lastResponse && (
        <Card className="p-5 bg-muted/10 border-border/50 animate-fade-in-up">
          <div className="flex justify-end gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={() => handleCopy(lastResponse.content, 'all')}>
              {copied === 'all' ? <CheckCircle className="w-3 h-3 mr-1 text-cp-easy" /> : <Copy className="w-3 h-3 mr-1" />}
              Copy All
            </Button>
          </div>
          <MarkdownRenderer content={lastResponse.content} />
        </Card>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
const ProductivityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Productivity Suite</h1>
        <p className="text-muted-foreground mt-1">Code review, analytics, and commit summaries — all AI-powered.</p>
      </div>

      <Tabs defaultValue="review">
        <TabsList className="mb-6">
          <TabsTrigger value="review" className="gap-1"><Code2 className="w-4 h-4" />Code Review</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="w-4 h-4" />Analytics</TabsTrigger>
          <TabsTrigger value="pr" className="gap-1"><GitCommit className="w-4 h-4" />PR Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="review"><CodeReviewTab /></TabsContent>
        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        <TabsContent value="pr"><PRSummaryTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductivityPage;
