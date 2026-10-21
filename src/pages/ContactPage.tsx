import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    toast.success('Thank you! Your message has been received.');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Contact & Feedback
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Questions, bug reports, feature requests, or partnership inquiries? We read every message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 border-border/60 bg-card">
            <Mail className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground text-base mb-1">Direct Contact</h3>
            <p className="text-xs text-muted-foreground mb-4">
              For general inquiries or educator partnerships:
            </p>
            <p className="text-xs font-mono text-primary bg-primary/10 p-2 rounded border border-primary/20 break-all">
              support@algoxai.com
            </p>
          </Card>

          <Card className="p-6 border-border/60 bg-card">
            <MessageSquare className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground text-base mb-1">Community & Issues</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Found a bug in a visualizer or want to contribute a problem?
            </p>
            <p className="text-xs text-muted-foreground">
              Submit ideas through our feedback form or connect via our community discussions.
            </p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-8 border-border/60 bg-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Message Dispatched</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out, {name}! We appreciate your feedback and will get back to you shortly at {email}.
                </p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setMessage(''); setSubject(''); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Topic</Label>
                  <Input
                    id="contact-subject"
                    placeholder="e.g. Bug Report, Question, Partnership"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
