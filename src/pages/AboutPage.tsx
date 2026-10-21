import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Milestone,
  Mail,
  ArrowRight,
  Code,
  CheckCircle2,
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const roadmapItems = [
    {
      quarter: 'Current (Phase 0 & 1)',
      status: 'In Progress',
      title: 'Foundations & Learning Hub',
      items: [
        'Personalized diagnostic assessment & weakest-first curriculum',
        'Specialized multi-agent AI system with real-time SSE streaming',
        'Interactive Canvas graph, sorting, and Hanoi visualizers',
        'Secure user authentication and topic progress persistence',
      ],
    },
    {
      quarter: 'Near-Term (Phase 2)',
      status: 'Planned',
      title: 'AI Evaluation & MathForces Practice',
      items: [
        'Anthropic Claude API integration for advanced mathematical proofs & deep reasoning',
        'Curated 50+ problem mathematics problem bank (combinatorics, number theory)',
        'Benchmarked comparative evaluation across AI tutoring models',
        'Real Codeforces public handle sync and rating-bracket recommendations',
      ],
    },
    {
      quarter: 'Future (Phase 3)',
      status: 'Upcoming',
      title: 'Real-Time Contests & Community',
      items: [
        'Timed rated mathematics contests with Elo-style rating updates',
        'Multiplayer algorithm duels with anti-cheat test suites',
        'Collaborative study groups and peer code reviews',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-4 text-xs font-medium text-primary border-primary/30 bg-primary/5">
          Company & Mission
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          Building the Future of Algorithm Education
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          AlgoXAI was created to make competitive programming and advanced algorithmic thinking accessible, structured, and rewarding through thoughtful AI pedagogy.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 border-border/60 bg-card">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">The Problem</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Most students learning algorithms face two extremes: dry theoretical textbooks or unstructured problem grinding on platforms with thousands of questions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Without diagnostic feedback, learners either solve problems that are too easy (wasting time) or get stuck on problems that are too hard (becoming discouraged). Generic AI chatbots either hallucinate solutions or immediately dump full answers, depriving the learner of critical problem-solving practice.
          </p>
        </Card>

        <Card className="p-8 border-border/60 bg-card">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Our Approach</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We believe algorithmic mastery requires a closed feedback loop: diagnostic evaluation, visual mental models, scaffolded hints, and targeted difficulty.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our multi-agent architecture acts like an experienced coach: breaking down problems with real-world analogies, pointing out edge cases you missed, and challenging you to optimize time and space complexity without giving away the entire solution prematurely.
          </p>
        </Card>
      </div>

      {/* Startup Disclosure */}
      <Card className="p-8 border-border/60 bg-muted/20 mb-16">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Early-Stage Transparency</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AlgoXAI is an independent, early-stage educational project. We don't make fabricated claims about millions of users or proprietary secret algorithms. We focus on engineering genuine product value: working code analyzers, authentic algorithm visualizers, and honest, privacy-conscious data practices.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We actively welcome input from students, competitive programmers, and computer science educators to help refine our learning roadmaps and tutoring agents.
            </p>
          </div>
        </div>
      </Card>

      {/* Product Roadmap */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <Milestone className="w-8 h-8 text-primary mx-auto mb-2" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Product Roadmap</h2>
          <p className="text-sm text-muted-foreground">Our planned milestones and public commitments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapItems.map((phase) => (
            <Card key={phase.title} className="p-6 border-border/60 bg-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-muted-foreground">{phase.quarter}</span>
                  <Badge variant={phase.status === 'In Progress' ? 'default' : 'secondary'} className="text-[10px]">
                    {phase.status}
                  </Badge>
                </div>

                <h4 className="font-bold text-foreground mb-4 text-base">{phase.title}</h4>

                <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <Card className="p-8 md:p-12 text-center border-border/60 bg-card">
        <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="text-2xl font-bold mb-2">Have Feedback or Want to Collaborate?</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
          Whether you're a competitive programmer with suggestion for new topics or an educator looking to use our visualizers in class, we'd love to hear from you.
        </p>
        <Link to="/contact">
          <Button className="gap-2">
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default AboutPage;
