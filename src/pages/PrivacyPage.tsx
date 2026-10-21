import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-3 text-xs text-primary border-primary/30">
          Trust & Compliance
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026 • Effective for all AlgoXAI users
        </p>
      </div>

      <Card className="p-8 border-border/60 bg-card space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Our Commitment to Privacy</h2>
          <p>
            At AlgoXAI, we design educational software that respects student privacy and data security. We collect only the minimum information required to deliver personalized algorithm assessments, track your practice progress, and provide AI tutoring support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <p>We collect information in the following categories:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-foreground">Account Credentials:</strong> Email address and encrypted password hashes managed securely through Supabase Auth.</li>
            <li><strong className="text-foreground">Learning Activity:</strong> Quiz answers, topic mastery percentages, problems attempted, and roadmap sequencing.</li>
            <li><strong className="text-foreground">AI Interactions:</strong> Prompts submitted to the AI tutor and assistant feedback ratings, used exclusively to return real-time streaming responses and debug prompt quality.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. How Your Information is Used</h2>
          <p>
            Your data is used solely to provide and improve the AlgoXAI educational experience. We do not sell your personal data, and we do not use your private code submissions or user conversations to train public foundation models without explicit consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Data Storage & Row-Level Security</h2>
          <p>
            Your account data is stored in PostgreSQL databases protected by PostgreSQL Row Level Security (RLS) policies. Only your authenticated user ID can read or update your personal chat histories and topic progress records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Third-Party AI Services</h2>
          <p>
            AI tutoring requests are processed server-side through secure backend Edge Functions. API keys and service tokens are kept strictly in server secrets and are never exposed to client browsers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Data Deletion & Rights</h2>
          <p>
            You have the right to request deletion of your account and associated learning histories at any time by contacting support@algoxai.com.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPage;
