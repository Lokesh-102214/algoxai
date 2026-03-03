import React from 'react';
import { Brain, Wrench, Bug, BookOpen, Sparkles, Hash } from 'lucide-react';

interface Suggestion {
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Brain,
    label: 'Explain a concept',
    prompt: 'Explain dynamic programming with a simple real-world analogy',
    color: 'text-sky-400',
  },
  {
    icon: Wrench,
    label: 'Review my code',
    prompt: 'Review this code for time complexity and clean-up opportunities:\n```cpp\n// paste your code here\n```',
    color: 'text-emerald-400',
  },
  {
    icon: Bug,
    label: 'Debug an error',
    prompt: "I'm getting a wrong answer on this problem. Here's my code and the failing test case:",
    color: 'text-orange-400',
  },
  {
    icon: BookOpen,
    label: 'Learning path',
    prompt: 'Give me a structured learning path for graph algorithms from beginner to advanced',
    color: 'text-violet-400',
  },
  {
    icon: Hash,
    label: 'Trace an algorithm',
    prompt: 'Walk me through quicksort step-by-step with the array [5, 2, 9, 1, 7]',
    color: 'text-pink-400',
  },
  {
    icon: Sparkles,
    label: 'Practice problem',
    prompt: 'Give me a medium-difficulty problem on binary trees with hints',
    color: 'text-amber-400',
  },
];

interface ChatSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 max-w-2xl mx-auto w-full">
      {/* Logo / greeting */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4 border border-primary/20">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1.5">
          What can I help you learn today?
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Ask anything — algorithms, code reviews, debugging. I'll route to the right specialist automatically.
        </p>
      </div>

      {/* Suggestion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onSelect(s.prompt)}
              className="suggestion-chip flex items-start gap-3 text-left px-4 py-3.5 rounded-xl
                border border-border/60 hover:border-border bg-card/40 hover:bg-card/70
                group transition-all duration-150"
            >
              <Icon size={15} className={`${s.color} mt-0.5 shrink-0`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {s.prompt.split('\n')[0]}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSuggestions;
