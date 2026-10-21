import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Brain,
  Route,
  Play,
  Bug,
  LineChart,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Target,
      title: 'Diagnose Your Baseline',
      subtitle: 'Identify real conceptual gaps in minutes',
      description:
        'Instead of guessing where to begin or grinding random problems, take a targeted 5-to-15 question diagnostic test that evaluates your understanding of arrays, recursion, graphs, dynamic programming, and binary search.',
      detail: 'Each question assesses specific cognitive milestones rather than rote syntax.',
    },
    {
      number: '02',
      icon: Brain,
      title: 'Analyze Strengths & Deficits',
      subtitle: 'Algorithmic weakness prioritization',
      description:
        'The diagnostic scores each core topic and calculates your skill distribution. Rather than reviewing concepts you already understand, the platform prioritizes your highest-impact deficits first.',
      detail: 'Generates a skill radar and topic breakdown to visualize where time is best invested.',
    },
    {
      number: '03',
      icon: Route,
      title: 'Generate Personalized Roadmap',
      subtitle: 'Prerequisite-aware progression sequence',
      description:
        'AlgoXAI compiles an adaptive study plan arranged so that foundational competencies (such as recursion or sorting) are mastered before advanced paradigms (like dynamic programming or tree traversals).',
      detail: 'Each roadmap step combines curated readings, video lessons, and interactive challenges.',
    },
    {
      number: '04',
      icon: Play,
      title: 'Build Visual Intuition',
      subtitle: 'Interactive state manipulation',
      description:
        'Abstract algorithmic logic becomes tangible through real-time visualizations. Step forward and backward through sorting comparisons, inspect graph nodes during BFS and DFS queueing, or watch the optimal recursive steps of Tower of Hanoi.',
      detail: 'Immediate visual feedback cements spatial and structural intuition.',
    },
    {
      number: '05',
      icon: Bug,
      title: 'AI Tutoring & Rubber-Duck Debugging',
      subtitle: 'Specialized assistance without giving away answers',
      description:
        'When you get stuck, the multi-agent AI system routes your prompt to specialist agents: Concept Explainer uses intuitive real-world analogies; Debug Assistant highlights overlooked edge cases and time complexity limits (TLE/MLE/WA).',
      detail: 'Get constructive guidance that teaches you how to think, not just copy-paste answers.',
    },
    {
      number: '06',
      icon: LineChart,
      title: 'Measure Mastery & Advance',
      subtitle: 'Continuous adaptation as you solve',
      description:
        'As you submit solutions, practice problems, and retake assessments, AlgoXAI updates your topic mastery scores, reflects your practice streak, and continuously tunes upcoming recommendations.',
      detail: 'Demonstrates tangible progress through data, accuracy rates, and topic completion.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-4 text-xs font-medium text-primary border-primary/30 bg-primary/5">
          Methodology
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          How AlgoXAI Works
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A systematic learning methodology designed to eliminate wasted practice time and build durable computer science problem-solving capabilities.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-8 mb-20">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={step.number} className="p-6 md:p-8 border-border/60 bg-card/80 hover:border-primary/40 transition-all">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-3xl font-extrabold text-primary/40 font-mono">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {step.subtitle}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {step.description}
                  </p>

                  <div className="inline-flex items-center text-xs text-foreground/80 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>{step.detail}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Final Action Banner */}
      <Card className="p-8 md:p-12 text-center bg-muted/20 border-border/60">
        <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Ready to diagnose your skills?
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Take the 5-minute diagnostic quiz to identify your current skill distribution and generate your tailored learning roadmap.
        </p>
        <Link to="/learning-hub">
          <Button size="lg" className="px-8 gap-2">
            Start Skill Assessment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default HowItWorksPage;
