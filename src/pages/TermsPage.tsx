import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-3 text-xs text-primary border-primary/30">
          Legal Agreement
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026 • Effective for all AlgoXAI users
        </p>
      </div>

      <Card className="p-8 border-border/60 bg-card space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AlgoXAI, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Educational Purpose & AI Disclaimers</h2>
          <p>
            AlgoXAI is an educational software platform designed for learning computer science algorithms, competitive programming techniques, and mathematical reasoning.
          </p>
          <p>
            While our multi-agent AI system aims to provide accurate complexity analyses, bug diagnoses, and code reviews, generative AI outputs may occasionally contain errors or limitations. Learners should verify code behavior against empirical test cases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Fair Play & Contest Integrity</h2>
          <p>
            AlgoXAI encourages honest, independent learning. During timed contests or live coding assessments, users agree not to employ automated bots, unauthorized third-party solvers, or unfair collaboration that undermines the integrity of competitive standings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Acceptable Use Policy</h2>
          <p>
            You agree not to probe, scan, or test the vulnerability of the system, inject malicious prompts designed to bypass backend guardrails, or submit abusive queries that disrupt serverless function quotas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Termination & Modifications</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate acceptable use guidelines. We may update these terms periodically to reflect new platform capabilities.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default TermsPage;
