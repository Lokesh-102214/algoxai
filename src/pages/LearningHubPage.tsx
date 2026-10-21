import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Play, Bot, Puzzle, GraduationCap, ChevronRight,
  RotateCcw, CheckCircle, ArrowRight, Sparkles, TrendingUp,
  Clock, Target, Video, HelpCircle
} from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ─── Quiz Data with Explanations ────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    topic: 'arrays',
    question: 'What is the time complexity of accessing an element by index in a contiguous array?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 0,
    explanation: 'Array elements are placed contiguously in memory. Memory address calculation `base + index * size` is arithmetic, giving true O(1) random access.',
  },
  {
    topic: 'recursion',
    question: 'What is the primary role of a base case in a recursive algorithm?',
    options: [
      'The condition that terminates recursion and prevents infinite stack growth',
      'The initial line specifying parameter types',
      'The step that breaks input into smaller subproblems',
      'The memory allocation for stack frames',
    ],
    correct: 0,
    explanation: 'The base case provides a terminating condition that returns a value directly, halting further recursive calls and preventing stack overflow.',
  },
  {
    topic: 'graphs',
    question: 'Which algorithm is guaranteed to find the shortest path in an unweighted graph?',
    options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Floyd-Warshall', 'Topological Sort'],
    correct: 1,
    explanation: 'Breadth-First Search (BFS) explores all vertices at distance d before inspecting vertices at distance d+1, guaranteeing shortest paths on unweighted edges.',
  },
  {
    topic: 'dp',
    question: 'Which two key properties must a problem satisfy to be solvable with Dynamic Programming?',
    options: [
      'Overlapping subproblems & optimal substructure',
      'Greedy choice property & sorted inputs',
      'Acyclic state space & linear constraints',
      'Divide-and-conquer independence & deterministic branching',
    ],
    correct: 0,
    explanation: 'Overlapping subproblems permit memoization/tabulation without redundant recomputation; optimal substructure means global optimal solutions derive from optimal subproblem solutions.',
  },
  {
    topic: 'binary-search',
    question: 'What prerequisite property is required for Binary Search over an array?',
    options: [
      'Elements must be sorted (monotonic)',
      'All elements must be distinct',
      'Array length must be an exact power of two',
      'Elements must be non-negative integers',
    ],
    correct: 0,
    explanation: 'Binary search requires monotonicity (sorted order) so that comparing the target with the midpoint definitively eliminates half the search interval.',
  },
];

// ─── Topics ────────────────────────────────────────────────────
const TOPICS = [
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    readTime: '8 min',
    videoUrl: 'https://www.youtube.com/embed/P3YID7liBug',
    videoTitle: 'Binary Search - CS Dojo',
    description: 'Efficiently search sorted data by repeatedly halving the search space in logarithmic time.',
  },
  {
    slug: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    difficulty: 'Easy',
    readTime: '12 min',
    videoUrl: 'https://www.youtube.com/embed/kPRA0W1kECg',
    videoTitle: 'Sorting Visualized - Fireship',
    description: 'Arrange data efficiently with divide-and-conquer and comparison sorting techniques.',
  },
  {
    slug: 'graph-algorithms',
    title: 'Graph Algorithms',
    difficulty: 'Medium',
    readTime: '15 min',
    videoUrl: 'https://www.youtube.com/embed/tWVWeAqZ0WU',
    videoTitle: 'Graph Algorithms - freeCodeCamp',
    description: 'Traverse and analyze networks with BFS, DFS, and shortest path algorithms.',
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    difficulty: 'Hard',
    readTime: '20 min',
    videoUrl: 'https://www.youtube.com/embed/oBt53YbR9Kk',
    videoTitle: 'Dynamic Programming - freeCodeCamp',
    description: 'Break complex problems into overlapping subproblems with memoization and tabulation.',
  },
  {
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    difficulty: 'Medium',
    readTime: '10 min',
    videoUrl: 'https://www.youtube.com/embed/bC7o8P_Ste4',
    videoTitle: 'Greedy Algorithms - Abdul Bari',
    description: 'Make locally optimal choices at each step to reach verified globally optimal solutions.',
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    difficulty: 'Hard',
    readTime: '18 min',
    videoUrl: 'https://www.youtube.com/embed/DKCbsiDBN6c',
    videoTitle: 'Backtracking - Back To Back SWE',
    description: 'Systematically explore search trees using recursive DFS with constraint pruning.',
  },
];

const difficultyClass = (d: string) =>
  d === 'Easy' ? 'cp-difficulty-easy' : d === 'Medium' ? 'cp-difficulty-medium' : 'cp-difficulty-hard';

// ─── Adaptive Quiz Component ──────────────────────────────────
const AdaptiveQuiz = ({ onComplete }: { onComplete: (scores: Record<string, number>) => void }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    const next = [...answers, selectedIdx];
    setAnswers(next);
    setShowExplanation(false);
    setSelectedIdx(null);

    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const scores: Record<string, number> = {};
      QUIZ_QUESTIONS.forEach((q, i) => {
        scores[q.topic] = next[i] === q.correct ? 100 : 35;
      });
      onComplete(scores);
    }
  };

  const q = QUIZ_QUESTIONS[current];
  const progress = ((current) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Algorithmic Skill Assessment</h2>
        <p className="text-sm text-muted-foreground">
          5 fundamental diagnostic questions to pinpoint your knowledge distribution and construct your roadmap.
        </p>
      </div>

      <Progress value={progress} className="mb-4 h-2" />
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
        <span>Question {current + 1} of {QUIZ_QUESTIONS.length}</span>
        <Badge variant="outline" className="text-[10px] uppercase font-mono">{q.topic}</Badge>
      </div>

      <Card className="p-6 border-border/60 bg-card">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-5">{q.question}</h3>

        <div className="space-y-2.5 mb-6">
          {q.options.map((opt, i) => {
            let btnStyle = 'border-border/50 bg-muted/10 hover:bg-muted/20 text-foreground';
            if (showExplanation) {
              if (i === q.correct) {
                btnStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400 font-medium';
              } else if (i === selectedIdx) {
                btnStyle = 'border-red-500/60 bg-red-500/10 text-red-400';
              } else {
                btnStyle = 'border-border/20 opacity-50 text-muted-foreground';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                disabled={showExplanation}
                className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all duration-150 ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 mb-4 animate-fade-in text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Explanation</span>
            </div>
            <p className="text-muted-foreground">{q.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="flex justify-end">
            <Button size="sm" onClick={handleNext} className="gap-1.5">
              <span>{current < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Personalized Roadmap'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// ─── Progress Ring ────────────────────────────────────────────
const ProgressRing = ({ value, size = 52, stroke = 4, label }: { value: number; size?: number; stroke?: number; label?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 70 ? 'hsl(var(--cp-easy))' : value >= 40 ? 'hsl(var(--cp-medium))' : 'hsl(var(--cp-hard))';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="text-xs font-bold text-foreground">{value}%</span>
      {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
    </div>
  );
};

// ─── Topic Card with Tabs ─────────────────────────────────────
const TopicContentCard = ({ topic, score }: { topic: typeof TOPICS[0]; score: number }) => {
  const { messages, isLoading, sendMessage } = useAIChat();
  const [aiInput, setAiInput] = useState('');
  const navigate = useNavigate();

  const handleAiAsk = () => {
    if (!aiInput.trim()) return;
    sendMessage(aiInput, `learning-hub/${topic.slug}`, 'concept-explainer');
    setAiInput('');
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card hover:border-primary/40 transition-colors">
      <div className="p-5 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-base">{topic.title}</h3>
            <Badge className={difficultyClass(topic.difficulty)}>{topic.difficulty}</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.readTime}</span>
          </div>
        </div>
        <ProgressRing value={score} />
      </div>

      <Tabs defaultValue="read" className="px-5 pb-5">
        <TabsList className="w-full grid grid-cols-4 h-8">
          <TabsTrigger value="read" className="text-xs gap-1"><BookOpen className="w-3 h-3" />Guide</TabsTrigger>
          <TabsTrigger value="video" className="text-xs gap-1"><Video className="w-3 h-3" />Video</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs gap-1"><Bot className="w-3 h-3" />Ask AI</TabsTrigger>
          <TabsTrigger value="practice" className="text-xs gap-1"><Puzzle className="w-3 h-3" />Solve</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="mt-3">
          <p className="text-xs text-muted-foreground mb-3">{topic.description}</p>
          <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => navigate(`/algorithm/${topic.slug}`)}>
            Read Full Theory & Implementations <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </TabsContent>

        <TabsContent value="video" className="mt-3">
          <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
            <iframe
              src={topic.videoUrl}
              title={topic.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">{topic.videoTitle}</p>
        </TabsContent>

        <TabsContent value="ai" className="mt-3">
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {messages.filter(m => m.role === 'assistant').slice(-2).map(m => (
              <div key={m.id} className="bg-muted/20 border border-border/30 rounded-lg p-3 text-xs leading-relaxed">
                <MarkdownRenderer content={m.content} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2.5">
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiAsk()}
              placeholder={`Ask AI about ${topic.title}...`}
              className="flex-1 h-8 px-2.5 rounded-md border border-border/50 bg-muted/20 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <Button size="sm" className="h-8 px-2.5" onClick={handleAiAsk} disabled={isLoading || !aiInput.trim()}>
              {isLoading ? <span className="animate-pulse">...</span> : <Sparkles className="w-3 h-3" />}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="mt-3">
          <Button size="sm" className="text-xs h-8" onClick={() => navigate('/practice')}>
            <Play className="w-3 h-3 mr-1" /> Practice {topic.title} Problems
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// ─── Learning Path Stepper ────────────────────────────────────
const LearningPathStepper = ({ path, scores }: { path: string[]; scores: Record<string, number> }) => (
  <Card className="p-5 bg-card border-border/60 mb-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" /> Personalized Roadmap Sequence
      </h3>
      <span className="text-[11px] text-muted-foreground">Prioritized by Greatest Skill Deficit</span>
    </div>
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {path.map((slug, i) => {
        const topic = TOPICS.find(t => t.slug === slug);
        const score = scores[slug] || 0;
        const done = score >= 70;
        return (
          <React.Fragment key={slug}>
            {i > 0 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0 transition-all ${done ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/50 bg-muted/10'}`}>
              {done ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <span className="text-xs font-mono font-bold text-muted-foreground">{i + 1}</span>}
              <span className="text-xs font-medium text-foreground">{topic?.title || slug}</span>
              <span className="text-[10px] text-muted-foreground font-mono">({score}%)</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  </Card>
);

// ─── Main Page ────────────────────────────────────────────────
const LearningHubPage: React.FC = () => {
  const { user } = useAuth();
  const [quizDone, setQuizDone] = useState(false);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});
  const [learningPath, setLearningPath] = useState<string[]>([]);

  // Load saved state from localStorage or Supabase on mount
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('algoxai_quiz_scores');
      const savedPath = localStorage.getItem('algoxai_learning_path');

      if (savedScores && savedPath) {
        setSkillScores(JSON.parse(savedScores));
        setLearningPath(JSON.parse(savedPath));
        setQuizDone(true);
      } else if (user) {
        // Attempt fetch from Supabase
        supabase
          .from('learning_paths')
          .select('skill_scores, recommended_path')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .then(({ data }) => {
            if (data && data.length > 0) {
              const row = data[0];
              setSkillScores(row.skill_scores as any);
              setLearningPath(row.recommended_path as any);
              setQuizDone(true);
            }
          });
      }
    } catch {
      // ignore parse errors
    }
  }, [user]);

  const topicMap: Record<string, string> = {
    arrays: 'sorting-algorithms',
    recursion: 'backtracking',
    graphs: 'graph-algorithms',
    dp: 'dynamic-programming',
    'binary-search': 'binary-search',
  };

  const handleQuizComplete = async (scores: Record<string, number>) => {
    const mapped: Record<string, number> = {};
    Object.entries(scores).forEach(([k, v]) => {
      const slug = topicMap[k] || k;
      mapped[slug] = v;
    });

    TOPICS.forEach(t => {
      if (!(t.slug in mapped)) mapped[t.slug] = 50;
    });

    const sorted = Object.entries(mapped).sort((a, b) => a[1] - b[1]).map(([slug]) => slug);

    setSkillScores(mapped);
    setLearningPath(sorted);
    setQuizDone(true);

    // Save locally
    localStorage.setItem('algoxai_quiz_scores', JSON.stringify(mapped));
    localStorage.setItem('algoxai_learning_path', JSON.stringify(sorted));

    // Save to Supabase if authenticated
    if (user) {
      try {
        await supabase.from('learning_paths').insert({
          user_id: user.id,
          skill_scores: mapped,
          recommended_path: sorted,
        });

        for (const [slug, score] of Object.entries(mapped)) {
          await supabase.from('user_topic_progress').insert({
            user_id: user.id,
            topic_slug: slug,
            quiz_score: score,
            last_activity: new Date().toISOString(),
          });
        }
        toast.success('Assessment results saved to your profile!');
      } catch (err) {
        console.error('Failed to sync quiz with Supabase:', err);
      }
    } else {
      toast.info('Assessment saved to browser. Sign in to sync across devices.');
    }
  };

  const handleRetake = () => {
    setQuizDone(false);
    setSkillScores({});
    setLearningPath([]);
    localStorage.removeItem('algoxai_quiz_scores');
    localStorage.removeItem('algoxai_learning_path');
  };

  const weakest = learningPath[0];
  const weakestTopic = TOPICS.find(t => t.slug === weakest);

  if (!quizDone) {
    return (
      <div className="container mx-auto px-4">
        <AdaptiveQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Learning Hub</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personalized algorithmic progression roadmap based on your diagnostic results.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetake} className="gap-1.5 text-xs h-8">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Assessment</span>
        </Button>
      </div>

      {/* Learning Path Stepper */}
      <LearningPathStepper path={learningPath} scores={skillScores} />

      {/* Next Priority Focus Area */}
      {weakestTopic && (
        <Card className="p-5 mb-8 bg-primary/5 border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Top Priority Focus: {weakestTopic.title}</p>
                <p className="text-xs text-muted-foreground">
                  Your greatest assessed deficit ({skillScores[weakestTopic.slug] || 0}%). Prioritizing this topic will yield the fastest performance gains.
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate(`/algorithm/${weakestTopic.slug}`)} className="text-xs h-8 flex-shrink-0">
              Study Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TOPICS.map(topic => (
          <TopicContentCard key={topic.slug} topic={topic} score={skillScores[topic.slug] || 50} />
        ))}
      </div>
    </div>
  );
};

export default LearningHubPage;
