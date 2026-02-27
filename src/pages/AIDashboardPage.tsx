import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Bot, Send, BookOpen, Code2, Bug, Sparkles, ThumbsUp, ThumbsDown,
  MessageCircle, Trash2, Zap, Brain, Shield, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useAIChat, AgentType, ChatMessage } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const AGENTS = [
  {
    id: 'concept-explainer' as AgentType,
    name: 'Concept Explainer',
    icon: BookOpen,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    description: 'Explains algorithms & data structures with analogies and examples',
  },
  {
    id: 'code-analyzer' as AgentType,
    name: 'Code Analyzer',
    icon: Code2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Reviews code for correctness, complexity, and optimization',
  },
  {
    id: 'debugging-assistant' as AgentType,
    name: 'Debug Assistant',
    icon: Bug,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    description: 'Finds bugs, fixes errors, and identifies edge cases',
  },
];

const QUICK_PROMPTS = [
  { label: 'Explain this topic', icon: BookOpen },
  { label: 'Review my code', icon: Code2 },
  { label: 'I have a bug', icon: Bug },
  { label: 'Give me a harder problem', icon: Zap },
  { label: 'Quiz me', icon: Brain },
];

function getAgentInfo(agentId?: AgentType) {
  return AGENTS.find(a => a.id === agentId) || AGENTS[0];
}

const AIDashboardPage: React.FC = () => {
  const { messages, isLoading, activeAgent, sendMessage, clearMessages, setHelpful } = useAIChat();
  const [input, setInput] = useState('');
  const [codeMode, setCodeMode] = useState(false);
  const [forcedAgent, setForcedAgent] = useState<AgentType | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const pageContext = location.state?.context || 'ai-dashboard';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, pageContext, forcedAgent);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt, pageContext, forcedAgent);
  };

  const handleTryInEditor = (code: string) => {
    navigate('/practice', { state: { code } });
  };

  const currentAgent = activeAgent ? getAgentInfo(activeAgent) : null;

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
      <div className="flex gap-4 h-full">
        {/* LEFT PANEL - 30% */}
        <div className="w-[30%] flex flex-col gap-4 min-w-[280px]">
          {/* Active Agent */}
          <Card className="p-4 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Active Agent</h3>
            {currentAgent ? (
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${currentAgent.bgColor}`}>
                <currentAgent.icon className={`w-6 h-6 ${currentAgent.color}`} />
                <div>
                  <p className={`font-semibold ${currentAgent.color}`}>{currentAgent.name}</p>
                  <p className="text-xs text-muted-foreground">Auto-detected</p>
                </div>
                <div className="ml-auto">
                  <div className={`w-2 h-2 rounded-full ${currentAgent.color.replace('text-', 'bg-')} animate-pulse`} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                <Bot className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Waiting for input...</p>
              </div>
            )}
          </Card>

          {/* Context Pill */}
          <Card className="p-4 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Context</h3>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {pageContext === 'ai-dashboard' ? 'General CP Help' : `Studying: ${pageContext}`}
            </Badge>
          </Card>

          {/* Session Stats */}
          <Card className="p-4 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Session</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted/20">
                <p className="text-2xl font-bold text-foreground">{messages.filter(m => m.role === 'user').length}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/20">
                <p className="text-2xl font-bold text-foreground">
                  {new Set(messages.filter(m => m.agent).map(m => m.agent)).size}
                </p>
                <p className="text-xs text-muted-foreground">Agents Used</p>
              </div>
            </div>
          </Card>

          {/* Agent Selector */}
          <Card className="p-4 bg-card/80 backdrop-blur border-border/50 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Agent Override</h3>
              {forcedAgent && (
                <Button variant="ghost" size="sm" onClick={() => setForcedAgent(undefined)} className="h-6 text-xs text-muted-foreground">
                  Auto
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setForcedAgent(forcedAgent === agent.id ? undefined : agent.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                    forcedAgent === agent.id
                      ? agent.bgColor + ' shadow-lg'
                      : 'border-border/30 hover:border-border bg-muted/10 hover:bg-muted/20'
                  }`}
                >
                  <agent.icon className={`w-5 h-5 ${forcedAgent === agent.id ? agent.color : 'text-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${forcedAgent === agent.id ? agent.color : 'text-foreground'}`}>{agent.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Prompts */}
          <Card className="p-4 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Prompts</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(p => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(p.label)}
                  disabled={isLoading}
                  className="text-xs h-8"
                >
                  <p.icon className="w-3 h-3 mr-1" />
                  {p.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER PANEL - 70% */}
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur border-border/50 overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow-primary)]">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">CP Multi-Agent Assistant</h2>
                <p className="text-xs text-muted-foreground">Powered by Lovable AI • Auto-routing enabled</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Agent CP Assistant</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask about algorithms, paste code for review, or describe a bug. The system auto-routes to the best specialist agent.
                  </p>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  {msg.role === 'assistant' && (
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${getAgentInfo(msg.agent).bgColor}`}>
                      {React.createElement(getAgentInfo(msg.agent).icon, { className: `w-4 h-4 ${getAgentInfo(msg.agent).color}` })}
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                    {msg.role === 'assistant' && msg.agent && (
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-[10px] h-5 ${getAgentInfo(msg.agent).badgeColor} border`}>
                          {getAgentInfo(msg.agent).name}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 border border-border/50'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose-sm">
                          <MarkdownRenderer content={msg.content} onTryInEditor={handleTryInEditor} />
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">Was this helpful?</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHelpful(msg.id, true)}
                          className={`h-6 w-6 p-0 ${msg.wasHelpful === true ? 'text-emerald-400' : 'text-muted-foreground'}`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHelpful(msg.id, false)}
                          className={`h-6 w-6 p-0 ${msg.wasHelpful === false ? 'text-red-400' : 'text-muted-foreground'}`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="text-right mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted/30 border border-border/50 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-border/50 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCodeMode(!codeMode)}
                className="h-7 text-xs text-muted-foreground"
              >
                {codeMode ? <ToggleRight className="w-4 h-4 mr-1 text-primary" /> : <ToggleLeft className="w-4 h-4 mr-1" />}
                {codeMode ? 'Code Mode' : 'Text Mode'}
              </Button>
              {forcedAgent && (
                <Badge className={`text-[10px] h-5 ${getAgentInfo(forcedAgent).badgeColor} border`}>
                  <Shield className="w-3 h-3 mr-1" />
                  Routing to: {getAgentInfo(forcedAgent).name}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={codeMode ? 'Paste your code here...' : 'Ask about algorithms, paste code, or describe a bug...'}
                className={`flex-1 resize-none border-primary/20 focus:border-primary bg-muted/30 ${
                  codeMode ? 'font-mono text-sm min-h-[120px]' : 'min-h-[48px] max-h-[120px]'
                }`}
                rows={codeMode ? 6 : 1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-auto bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary shadow-[var(--shadow-glow-primary)] transition-all"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIDashboardPage;
