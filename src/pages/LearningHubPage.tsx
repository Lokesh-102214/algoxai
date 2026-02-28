import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen, Play, Bot, Puzzle, GraduationCap, ChevronRight,
  RotateCcw, CheckCircle, ArrowRight, Sparkles, TrendingUp,
  Clock, Target, Video
} from 'lucide-react';
import { useAIChat } from '@/hooks/useAIChat';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useNavigate } from 'react-router-dom';

// ─── Quiz Data ─────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    topic: 'arrays',
    question: 'What is the time complexity of accessing an element by index in an array?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'Not sure'],
    correct: 0,
  },
  {
    topic: 'recursion',
    question: 'What is a base case in recursion?',
    options: [
      'The condition where the function stops calling itself',
      'The first line of the recursive function',
      'The recursive call itself',
      'Not sure',
    ],
    correct: 0,
  },
  {
    topic: 'graphs',
    question: 'Which algorithm finds the shortest path in an unweighted graph?',
    options: ['DFS', 'BFS', 'Dijkstra', 'Not sure'],
    correct: 1,
  },
  {
    topic: 'dp',
    question: 'What property must a problem have to be solvable by Dynamic Programming?',
    options: [
      'Overlapping subproblems & optimal substructure',
      'Greedy choice property',
      'No cycles in the state space',
      'Not sure',
    ],
    correct: 0,
  },
  {
    topic: 'binary-search',
    question: 'Binary search requires the input to be:',
    options: ['Sorted', 'Unique', 'Positive integers only', 'Not sure'],
    correct: 0,
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
    description: 'Efficiently search sorted data by halving the search space.',
  },
  {
    slug: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    difficulty: 'Easy',
    readTime: '12 min',
    videoUrl: 'https://www.youtube.com/embed/kPRA0W1kECg',
    videoTitle: 'Sorting Visualized - Beyond Fireship',
    description: 'Arrange data efficiently with various comparison and non-comparison algorithms.',
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
    description: 'Break complex problems into overlapping subproblems for optimal solutions.',
  },
  {
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    difficulty: 'Medium',
    readTime: '10 min',
    videoUrl: 'https://www.youtube.com/embed/bC7o8P_Ste4',
    videoTitle: 'Greedy Algorithms - Abdul Bari',
    description: 'Make locally optimal choices at each step to find global optima.',
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    difficulty: 'Hard',
    readTime: '18 min',
    videoUrl: 'https://www.youtube.com/embed/DKCbsiDBN6c',
    videoTitle: 'Backtracking - Back To Back SWE',
    description: 'Explore all possibilities using recursive DFS with pruning.',
  },
];

const difficultyClass = (d: string) =>
  d === 'Easy' ? 'cp-difficulty-easy' : d === 'Medium' ? 'cp-difficulty-medium' : 'cp-difficulty-hard';

// ─── Adaptive Quiz Component ──────────────────────────────────
const AdaptiveQuiz = ({ onComplete }: { onComplete: (scores: Record<string, number>) => void }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const scores: Record<string, number> = {};
      QUIZ_QUESTIONS.forEach((q, i) => {
        scores[q.topic] = next[i] === q.correct ? 100 : next[i] === 3 ? 0 : 30;
      });
      onComplete(scores);
    }
  };

  const q = QUIZ_QUESTIONS[current];
  const progress = ((current) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Skill Assessment</h2>
        <p className="text-muted-foreground">Answer 5 questions so we can personalize your learning path.</p>
      </div>

      <Progress value={progress} className="mb-6 h-2" />
      <p className="text-xs text-muted-foreground mb-4">Question {current + 1} of {QUIZ_QUESTIONS.length}</p>

      <Card className="p-6 bg-card/80 border-border/50">
        <Badge className="mb-3 text-xs" variant="outline">{q.topic}</Badge>
        <h3 className="text-lg font-semibold text-foreground mb-4">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-foreground"
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Progress Ring ────────────────────────────────────────────
const ProgressRing = ({ value, size = 56, stroke = 4, label }: { value: number; size?: number; stroke?: number; label?: string }) => {
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
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [aiInput, setAiInput] = useState('');
  const navigate = useNavigate();

  const handleAiAsk = () => {
    if (!aiInput.trim()) return;
    sendMessage(aiInput, `learning-hub/${topic.slug}`, 'concept-explainer');
    setAiInput('');
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card/80 hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-fade-in-up">
      <div className="p-5 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-lg">{topic.title}</h3>
            <Badge className={difficultyClass(topic.difficulty)}>{topic.difficulty}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.readTime}</span>
          </div>
        </div>
        <ProgressRing value={score} />
      </div>

      <Tabs defaultValue="read" className="px-5 pb-5">
        <TabsList className="w-full grid grid-cols-4 h-9">
          <TabsTrigger value="read" className="text-xs gap-1"><BookOpen className="w-3 h-3" />Read</TabsTrigger>
          <TabsTrigger value="video" className="text-xs gap-1"><Video className="w-3 h-3" />Video</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs gap-1"><Bot className="w-3 h-3" />AI Explain</TabsTrigger>
          <TabsTrigger value="practice" className="text-xs gap-1"><Puzzle className="w-3 h-3" />Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="mt-3">
          <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
          <Button size="sm" variant="outline" onClick={() => navigate(`/algorithm/${topic.slug}`)}>
            Read Full Guide <ChevronRight className="w-3 h-3 ml-1" />
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
          <p className="text-xs text-muted-foreground mt-2">{topic.videoTitle}</p>
        </TabsContent>

        <TabsContent value="ai" className="mt-3">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messages.filter(m => m.role === 'assistant').slice(-2).map(m => (
              <div key={m.id} className="bg-muted/20 border border-border/30 rounded-xl p-3 text-sm animate-fade-in-up">
                <MarkdownRenderer content={m.content} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiAsk()}
              placeholder={`Ask about ${topic.title}...`}
              className="flex-1 h-9 px-3 rounded-lg border border-border/50 bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <Button size="sm" onClick={handleAiAsk} disabled={isLoading || !aiInput.trim()}>
              {isLoading ? <span className="animate-pulse">...</span> : <Sparkles className="w-3 h-3" />}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="mt-3">
          <Button size="sm" onClick={() => navigate('/practice')}>
            <Play className="w-3 h-3 mr-1" /> Go to Practice
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// ─── Learning Path Stepper ────────────────────────────────────
const LearningPathStepper = ({ path, scores }: { path: string[]; scores: Record<string, number> }) => (
  <Card className="p-5 bg-card/80 border-border/50 mb-6">
    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
      <Target className="w-5 h-5 text-primary" /> Your Learning Path
    </h3>
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {path.map((slug, i) => {
        const topic = TOPICS.find(t => t.slug === slug);
        const score = scores[slug] || 0;
        const done = score >= 70;
        return (
          <React.Fragment key={slug}>
            {i > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-shrink-0 transition-all ${done ? 'border-cp-easy/40 bg-cp-easy/5' : 'border-border/50 bg-muted/10'}`}>
              {done ? <CheckCircle className="w-4 h-4 text-cp-easy" /> : <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>}
              <span className="text-sm font-medium text-foreground">{topic?.title || slug}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  </Card>
);

// ─── Main Page ────────────────────────────────────────────────
const LearningHubPage: React.FC = () => {
  const [quizDone, setQuizDone] = useState(false);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});
  const [learningPath, setLearningPath] = useState<string[]>([]);

  // Map quiz topics to topic slugs
  const topicMap: Record<string, string> = {
    arrays: 'sorting-algorithms',
    recursion: 'backtracking',
    graphs: 'graph-algorithms',
    dp: 'dynamic-programming',
    'binary-search': 'binary-search',
  };

  const handleQuizComplete = (scores: Record<string, number>) => {
    // Map scores to topic slugs
    const mapped: Record<string, number> = {};
    Object.entries(scores).forEach(([k, v]) => {
      const slug = topicMap[k] || k;
      mapped[slug] = v;
    });
    // Fill in missing with 50
    TOPICS.forEach(t => { if (!(t.slug in mapped)) mapped[t.slug] = 50; });
    setSkillScores(mapped);

    // Generate path: weakest first
    const sorted = Object.entries(mapped).sort((a, b) => a[1] - b[1]).map(([slug]) => slug);
    setLearningPath(sorted);
    setQuizDone(true);
  };

  const handleRetake = () => {
    setQuizDone(false);
    setSkillScores({});
    setLearningPath([]);
  };

  // Find weakest topic for "Next Challenge"
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Hub</h1>
          <p className="text-muted-foreground mt-1">Personalized competitive programming roadmap</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetake}>
          <RotateCcw className="w-3 h-3 mr-1" /> Retake Quiz
        </Button>
      </div>

      {/* Learning Path Stepper */}
      <LearningPathStepper path={learningPath} scores={skillScores} />

      {/* Next Challenge */}
      {weakestTopic && (
        <Card className="p-5 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Next Challenge: {weakestTopic.title}</p>
                <p className="text-xs text-muted-foreground">Your weakest area — focus here to improve fastest</p>
              </div>
            </div>
            <Button size="sm" onClick={() => window.location.hash = weakestTopic.slug}>
              Start <ChevronRight className="w-3 h-3 ml-1" />
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
