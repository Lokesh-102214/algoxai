import TopicCard from "../components/TopicCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Zap, 
  BarChart3, 
  GitBranch, 
  Layers, 
  Search, 
  Shuffle, 
  Target, 
  Timer,
  TrendingUp,
  Award,
  Users,
  Calendar
} from "lucide-react";

const HomePage = () => {
  const cpTopics = [
    {
      title: "Dynamic Programming",
      description: "Master the art of breaking problems into optimal subproblems with memoization techniques.",
      difficulty: "Hard" as const,
      problems: 150,
      icon: <Layers className="w-6 h-6" />,
      slug: "dynamic-programming",
      estimatedTime: "2-3 weeks",
      popularity: 95
    },
    {
      title: "Graph Algorithms",
      description: "Explore BFS, DFS, shortest paths, and complex graph traversal problems.",
      difficulty: "Medium" as const,
      problems: 120,
      icon: <GitBranch className="w-6 h-6" />,
      slug: "graph-algorithms",
      estimatedTime: "2 weeks",
      popularity: 92
    },
    {
      title: "Greedy Algorithms",
      description: "Learn to make locally optimal choices for globally optimal solutions.",
      difficulty: "Medium" as const,
      problems: 80,
      icon: <Target className="w-6 h-6" />,
      slug: "greedy-algorithms",
      estimatedTime: "1 week",
      popularity: 88
    },
    {
      title: "Binary Search",
      description: "Master the divide-and-conquer approach for searching in sorted arrays.",
      difficulty: "Easy" as const,
      problems: 60,
      icon: <Search className="w-6 h-6" />,
      slug: "binary-search",
      estimatedTime: "3-5 days",
      popularity: 90
    },
    {
      title: "Sorting Algorithms",
      description: "Understand various sorting techniques from bubble sort to advanced algorithms.",
      difficulty: "Easy" as const,
      problems: 45,
      icon: <BarChart3 className="w-6 h-6" />,
      slug: "sorting-algorithms",
      estimatedTime: "1 week",
      popularity: 85
    },
    {
      title: "Backtracking",
      description: "Solve complex problems by exploring all possible solutions systematically.",
      difficulty: "Hard" as const,
      problems: 70,
      icon: <Shuffle className="w-6 h-6" />,
      slug: "backtracking",
      estimatedTime: "1-2 weeks",
      popularity: 82
    }
  ];

  const stats = [
    { label: "Active Users", value: "25K+", icon: Users, color: "text-primary" },
    { label: "Problems Solved", value: "1.2M+", icon: Award, color: "text-secondary" },
    { label: "Daily Challenges", value: "365", icon: Calendar, color: "text-accent" },
    { label: "Success Rate", value: "87%", icon: TrendingUp, color: "text-cp-easy" }
  ];

  return (
    <div className="min-h-screen pt-16 animate-fade-in-up">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-10 animate-pulse-slow" />
        <div className="absolute top-32 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" 
             style={{animationDelay: '1.5s'}} />
        <div className="absolute top-48 right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" 
             style={{animationDelay: '3s'}} />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8 animate-scale-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master{" "}
              <span className="gradient-text animate-pulse-glow">
                Competitive Programming
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Elevate your coding skills with our comprehensive platform. Practice algorithms, 
              visualize data structures, and compete with developers worldwide.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up" 
               style={{animationDelay: '0.3s'}}>
            <Button 
              size="lg" 
              className="bg-[var(--gradient-primary)] text-primary-foreground px-8 py-4 text-lg
                         shadow-[var(--shadow-glow-primary)] hover:shadow-[var(--shadow-glow-secondary)]
                         transition-[var(--transition-bounce)] hover:scale-110 btn-glow"
            >
              <Zap className="w-5 h-5 mr-2 animate-pulse" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-primary/50 text-primary hover:bg-primary/10 
                         hover:shadow-[var(--shadow-glow-primary)] transition-[var(--transition-bounce)] 
                         hover:scale-105 glow-border"
            >
              <Timer className="w-5 h-5 mr-2" />
              Take Challenge
            </Button>
          </div>

          {/* Enhanced Stats with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up" 
               style={{animationDelay: '0.5s'}}>
            {stats.map(({ label, value, icon: Icon, color }, index) => (
              <div 
                key={label} 
                className="cp-card-interactive text-center animate-scale-in"
                style={{animationDelay: `${0.7 + index * 0.1}s`}}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${color} animate-float 
                                 group-hover:scale-125 transition-[var(--transition-bounce)]`} 
                      style={{animationDelay: `${index * 0.5}s`}} />
                <div className="text-3xl font-bold mb-2 group-hover:gradient-text 
                                transition-[var(--transition-smooth)]">{value}</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground 
                                transition-[var(--transition-smooth)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Topics Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Competitive Programming Topics
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Master fundamental algorithms and data structures used in competitive programming.
              Each topic includes theory, practice problems, and interactive visualizations.
            </p>
          </div>
          
          <div className="cp-grid">
            {cpTopics.map((topic, index) => (
              <div
                key={topic.slug}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                className="animate-fade-in-up"
              >
                <TopicCard {...topic} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Quick Links */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 gradient-text">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Daily Challenge", delay: "0s" },
              { label: "Random Problem", delay: "0.1s" },
              { label: "Contest Leaderboard", delay: "0.2s" },
              { label: "Algorithm Visualizer", delay: "0.3s" }
            ].map(({ label, delay }) => (
              <Button 
                key={label}
                variant="outline" 
                size="lg"
                className="px-6 py-3 border-border hover:border-primary/50 hover:bg-primary/10 
                           hover:shadow-[var(--shadow-glow-primary)] transition-[var(--transition-bounce)] 
                           hover:scale-105 animate-fade-in-up"
                style={{animationDelay: delay}}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;