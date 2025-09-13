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
      icon: <Layers className="w-6 h-6 text-primary" />,
      slug: "dynamic-programming",
      estimatedTime: "2-3 weeks",
      popularity: 95
    },
    {
      title: "Graph Algorithms",
      description: "Explore BFS, DFS, shortest paths, and complex graph traversal problems.",
      difficulty: "Medium" as const,
      problems: 120,
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      slug: "graph-algorithms",
      estimatedTime: "2 weeks",
      popularity: 92
    },
    {
      title: "Greedy Algorithms",
      description: "Learn to make locally optimal choices for globally optimal solutions.",
      difficulty: "Medium" as const,
      problems: 80,
      icon: <Target className="w-6 h-6 text-primary" />,
      slug: "greedy-algorithms",
      estimatedTime: "1 week",
      popularity: 88
    },
    {
      title: "Binary Search",
      description: "Master the divide-and-conquer approach for searching in sorted arrays.",
      difficulty: "Easy" as const,
      problems: 60,
      icon: <Search className="w-6 h-6 text-primary" />,
      slug: "binary-search",
      estimatedTime: "3-5 days",
      popularity: 90
    },
    {
      title: "Sorting Algorithms",
      description: "Understand various sorting techniques from bubble sort to advanced algorithms.",
      difficulty: "Easy" as const,
      problems: 45,
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      slug: "sorting-algorithms",
      estimatedTime: "1 week",
      popularity: 85
    },
    {
      title: "Backtracking",
      description: "Solve complex problems by exploring all possible solutions systematically.",
      difficulty: "Hard" as const,
      problems: 70,
      icon: <Shuffle className="w-6 h-6 text-primary" />,
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Master{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Competitive Programming
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elevate your coding skills with our comprehensive platform. Practice algorithms, 
            visualize data structures, and compete with developers worldwide.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button size="lg" variant="hero">
            <Zap className="w-5 h-5 mr-2" />
            Start Learning
          </Button>
          <Button size="lg" variant="outline">
            <Timer className="w-5 h-5 mr-2" />
            Take Challenge
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-4 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Topics Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Competitive Programming Topics</h2>
          <p className="text-muted-foreground">
            Master fundamental algorithms and data structures used in competitive programming
          </p>
        </div>
        
        <div className="cp-grid">
          {cpTopics.map((topic) => (
            <TopicCard key={topic.slug} {...topic} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-6">Quick Access</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" size="lg">
            Daily Challenge
          </Button>
          <Button variant="outline" size="lg">
            Random Problem
          </Button>
          <Button variant="outline" size="lg">
            Contest Leaderboard
          </Button>
          <Button variant="outline" size="lg">
            Algorithm Visualizer
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;