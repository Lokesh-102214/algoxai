import TopicCard from "../components/TopicCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Zap,
  BarChart3,
  GitBranch,
  Layers,
  Search,
  Shuffle,
  Target,
  Bot,
  Play,
  GraduationCap,
  Code2,
  ArrowRight,
  ShieldCheck,
  Github,
  Box,
  MousePointer2,
  Workflow,
  BookOpen,
  Share2,
  Download,
  Compass,
} from "lucide-react";

const HomePage = () => {
  const cpTopics = [
    {
      title: "Dynamic Programming",
      description: "Master breaking problems into optimal subproblems with memoization and tabulation.",
      difficulty: "Hard" as const,
      problems: 150,
      icon: <Layers className="w-5 h-5" />,
      slug: "dynamic-programming",
      estimatedTime: "2-3 weeks",
      popularity: 95,
    },
    {
      title: "Graph Algorithms",
      description: "Explore BFS, DFS, shortest path algorithms, and graph traversals with interactive canvas.",
      difficulty: "Medium" as const,
      problems: 120,
      icon: <GitBranch className="w-5 h-5" />,
      slug: "graph-algorithms",
      estimatedTime: "2 weeks",
      popularity: 92,
    },
    {
      title: "Greedy Algorithms",
      description: "Learn to make locally optimal choices to achieve verified globally optimal solutions.",
      difficulty: "Medium" as const,
      problems: 80,
      icon: <Target className="w-5 h-5" />,
      slug: "greedy-algorithms",
      estimatedTime: "1 week",
      popularity: 88,
    },
    {
      title: "Binary Search",
      description: "Master divide-and-conquer searching and binary search over solution spaces.",
      difficulty: "Easy" as const,
      problems: 60,
      icon: <Search className="w-5 h-5" />,
      slug: "binary-search",
      estimatedTime: "3-5 days",
      popularity: 90,
    },
    {
      title: "Sorting Algorithms",
      description: "Understand sorting techniques from divide-and-conquer to non-comparison sorts.",
      difficulty: "Easy" as const,
      problems: 45,
      icon: <BarChart3 className="w-5 h-5" />,
      slug: "sorting-algorithms",
      estimatedTime: "1 week",
      popularity: 85,
    },
    {
      title: "Backtracking",
      description: "Solve combinatorial and constraint satisfaction problems with pruned recursion.",
      difficulty: "Hard" as const,
      problems: 70,
      icon: <Shuffle className="w-5 h-5" />,
      slug: "backtracking",
      estimatedTime: "1-2 weeks",
      popularity: 82,
    },
  ];

  const platformPillars = [
    {
      icon: Box,
      title: "3D Spatial Labs",
      description: "Rotate, zoom, and explore data structures spatially so depth, tree balancing, and relationships become intuitive.",
      badge: "Spatial 3D",
    },
    {
      icon: Code2,
      title: "Observable Engines",
      description: "Pure TypeScript algorithm engines decoupled from the UI. Zero dependencies, fully tested, and reusable in CLIs or Node.",
      badge: "Zero-Dep API",
    },
    {
      icon: Share2,
      title: "Developer Permalinks",
      description: "Encode custom inputs and exact steps into URLs. Share reproducible algorithm states in PR reviews and team docs.",
      badge: "PR-Friendly",
    },
    {
      icon: Download,
      title: "JSON Trace Export",
      description: "Download immutable step arrays to generate reproducible test fixtures or ground LLM prompts with exact execution traces.",
      badge: "LLM Ready",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border/40">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Box className="w-3.5 h-3.5" />
            <span>Open-Source Observable Algorithm Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            See algorithms think. <br className="hidden sm:inline" />
            <span className="text-primary">From code to intuition.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AlgoXAI turns abstract data structures into observable, testable, and embeddable developer tools.
            Test custom edge-case inputs in 3D and 2D, export JSON execution traces, and share live states across your team.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/visualizations">
              <Button size="lg" className="px-8 text-base shadow-sm">
                Open Visualizer Lab
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="https://github.com/Lokesh-102214/algoxai" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="px-8 text-base border-border/80">
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
              </Button>
            </a>
          </div>

          {/* Platform Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {platformPillars.map(({ icon: Icon, title, description, badge }) => (
              <Card key={title} className="p-5 border-border/60 bg-card/60 hover:bg-card transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                Core Algorithm Modules
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl">
                Systematic learning paths curated for competitive programming and systems engineering.
              </p>
            </div>
            <Link to="/learning-hub" className="mt-4 md:mt-0 text-sm font-medium text-primary hover:underline flex items-center">
              View all modules
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cpTopics.map((topic) => (
              <TopicCard key={topic.slug} {...topic} />
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Adoption / Infrastructure Banner */}
      <section className="py-16 px-4 border-t border-border/40 bg-card/30">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
            Reusable as an npm Component Library
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            The visualizers and algorithm engines are built to be embedded into your own docs, wikis, or internal tools.
            Install via npm or fork the repository to build your own custom visualizers.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 border border-border/80 font-mono text-xs text-slate-300 mb-8">
            <span>npm install algoxai</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/visualizations?tool=pathfinding">
              <Button variant="secondary" size="sm" className="gap-2">
                <Compass className="w-4 h-4" /> Try A* Pathfinding
              </Button>
            </Link>
            <Link to="/visualizations?tool=bst3d">
              <Button variant="secondary" size="sm" className="gap-2">
                <Box className="w-4 h-4" /> Try 3D BST
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
