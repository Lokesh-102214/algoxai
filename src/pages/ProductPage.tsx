import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Bot,
  Play,
  Code2,
  BarChart3,
  Building2,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Sparkles,
} from 'lucide-react';

const ProductPage: React.FC = () => {
  const modules = [
    {
      icon: GraduationCap,
      title: 'Adaptive Learning Hub',
      badge: 'Personalized Roadmap',
      description:
        'A diagnostic assessment tests your algorithmic fundamentals across dynamic programming, graph traversal, greedy choices, binary search, and recursion. It identifies your weakest topics and constructs a structured, prerequisite-aware curriculum.',
      capabilities: [
        '5-to-15 question diagnostic assessment',
        'Automatic weakest-first curriculum sequence',
        'Curated video lessons & reading guides',
        'Progress tracking across core topics',
      ],
      link: '/learning-hub',
    },
    {
      icon: Bot,
      title: 'Specialized Multi-Agent AI System',
      badge: 'Agentic Intelligence',
      description:
        'Rather than a generic chatbot, AlgoXAI employs dedicated micro-agents with tailored system prompts, structured response formats, and automatic intent classification.',
      capabilities: [
        'Concept Explainer: Real-world analogies, formal complexity tables, C++ examples',
        'Code Reviewer: Line-by-line inspection, correctness verification, optimizations',
        'Debug Assistant: Root cause diagnosis, edge-case warning, and corrected implementations',
        'Live Server-Sent Events (SSE) streaming with active agent indicator',
      ],
      link: '/ai',
    },
    {
      icon: Play,
      title: 'Interactive Algorithm Visualizers',
      badge: 'Intuitive Mechanics',
      description:
        'Understand algorithmic operations by visualizing internal state step-by-step. Adjust execution speed, tweak array sizes, and interact directly with data structures.',
      capabilities: [
        'Sorting Visualizer: Bubble, Selection, and Insertion sorts with animated comparisons',
        'Graph Traversal: HTML5 Canvas graph editor with animated BFS & DFS exploration',
        'Tower of Hanoi: Recursive state solver with move counting and optimal comparison',
      ],
      link: '/visualizations',
    },
    {
      icon: Code2,
      title: 'Rating-Aware Practice Library',
      badge: 'Targeted Practice',
      description:
        'Solve curated problems from LeetCode and Codeforces categorized by difficulty, topic, and expected completion time to systematically advance your skills.',
      capabilities: [
        'Curated problems mapped across Easy, Medium, and Hard tiers',
        'Real-time search and multi-criteria topic filtering',
        'Direct problem launch and code-editor simulation integration',
      ],
      link: '/practice',
    },
    {
      icon: Building2,
      title: 'Architecture & Design Explainer',
      badge: 'System Visualization',
      description:
        'Upload code, paste snippets, or describe an architectural system to instantly generate Mermaid.js dependency diagrams and extract key software design patterns.',
      capabilities: [
        'Automatic Mermaid.js graph generation (TD / LR)',
        'Design pattern extraction (Singleton, Factory, Observer, etc.)',
        'Bottleneck and architectural debt identification',
      ],
      link: '/ai',
    },
    {
      icon: BarChart3,
      title: 'Productivity & Analytics Suite',
      badge: 'Developer Velocity',
      description:
        'Accelerate routine engineering workflows with AI-assisted code reviews, radar skill maps, and automated Git commit & PR summary generators.',
      capabilities: [
        '14-day activity streak tracker and Recharts analytics',
        'Radar topic coverage mastery chart',
        'Git diff to Conventional Commit & PR description generator',
      ],
      link: '/productivity',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-4 text-xs font-medium text-primary border-primary/30 bg-primary/5">
          Platform Architecture
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          An Integrated Learning System
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          AlgoXAI connects diagnostic evaluation, interactive visualization, agentic tutoring, and targeted practice into a continuous learning cycle.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="p-7 border-border/60 bg-card flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {m.badge}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{m.description}</p>

                <div className="space-y-2 mb-6">
                  {m.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Link to={m.link}>
                  <Button variant="ghost" size="sm" className="w-full justify-between hover:text-primary">
                    <span>Try {m.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Learning Loop Section */}
      <Card className="p-8 md:p-12 border-border/60 bg-muted/10 mb-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Workflow className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Continuous Learning Cycle
          </h2>
          <p className="text-sm text-muted-foreground">
            How the components combine to produce rapid, measurable skill acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <span className="text-xs font-bold text-primary mb-1 block">STEP 1</span>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Diagnostic Assessment</h4>
            <p className="text-xs text-muted-foreground">Identify exact conceptual gaps across algorithms</p>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <span className="text-xs font-bold text-primary mb-1 block">STEP 2</span>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Personalized Roadmap</h4>
            <p className="text-xs text-muted-foreground">Tailor topic sequencing prioritized by greatest deficit</p>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <span className="text-xs font-bold text-primary mb-1 block">STEP 3</span>
            <h4 className="font-semibold text-sm mb-1 text-foreground">AI Scaffolding</h4>
            <p className="text-xs text-muted-foreground">Specialist agents clarify theory and debug errors</p>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card">
            <span className="text-xs font-bold text-primary mb-1 block">STEP 4</span>
            <h4 className="font-semibold text-sm mb-1 text-foreground">Measurable Mastery</h4>
            <p className="text-xs text-muted-foreground">Solve matched problems and update proficiency</p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-4">Start your personalized algorithm roadmap</h3>
        <Link to="/auth">
          <Button size="lg" className="px-8 gap-2">
            <Sparkles className="w-4 h-4" />
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
