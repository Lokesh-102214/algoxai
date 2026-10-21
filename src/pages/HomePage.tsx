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
      title: "3D algorithm labs",
      description: "Rotate, zoom, and manipulate data structures so relationships that are hard to see in 2D become intuitive.",
      badge: "Explore spatially",
    },
    {
      icon: MousePointer2,
      title: "Control every step",
      description: "Insert data, replay operations, and inspect each comparison instead of passively watching an animation.",
      badge: "Learn by doing",
    },
    {
      icon: Workflow,
      title: "Built for explanations",
      description: "Every visualizer pairs the scene with the operation, state, and complexity that explain what changed and why.",
      badge: "See the why",
    },
    {
      icon: Github,
      title: "Open source by default",
      description: "Use it freely, inspect the algorithm engines, and help grow the catalogue with a visualizer of your own.",
      badge: "MIT licensed",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border/40">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Box className="w-3.5 h-3.5" />
            <span>Open-source 3D algorithm lab</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Don&apos;t just read algorithms. <span className="text-primary">Explore them.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AlgoXAI is a hands-on visualizer for the algorithms and data structures that are easiest to misunderstand.
            Manipulate the state, follow each decision, and build intuition that static diagrams cannot give you.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/visualizations?tool=bst3d">
              <Button size="lg" className="px-8 text-base shadow-sm">
                Try the 3D BST
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="https://github.com/Lokesh-102214/algoxai" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="px-8 text-base border-border/80">
                <Github className="w-4 h-4 mr-2" />
                View the source
              </Button>
            </a>
          </div>

          {/* Genuine Platform Feature Highlights (replaces fake stats) */}
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
                <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto max-w-5xl grid gap-8 md:grid-cols-[1.1fr_.9fr] items-center">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
              <Github className="w-4 h-4" />
              FOR LEARNERS, EDUCATORS, AND CONTRIBUTORS
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">A visualizer that earns a place in your workflow.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Start without an account, share a direct link to a concept, use the pure algorithm engines in your own project,
              or contribute a new scene. The learning experience stays useful whether you are studying alone, teaching a class, or building tools.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["No account to explore", "Interactive, not autoplay-only", "Accessible source and algorithm engines", "AI guidance when you need it"].map((benefit) => (
              <Card key={benefit} className="p-4 text-sm font-medium flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 shrink-0 text-primary" />
                {benefit}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Explore by concept
            </h2>
            <p className="text-muted-foreground text-base">
              Build a mental model with an interactive scene first, then deepen it with explanations, code, and practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {cpTopics.map((topic) => (
              <TopicCard key={topic.slug} {...topic} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-14 px-4 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-2xl font-bold mb-3 text-foreground">Pick a scene. Change the state. Understand the result.</h3>
          <p className="text-muted-foreground text-sm mb-8">
            The visualizer playground is the fastest way in. The learning hub and AI tutor are there when you want more structure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/visualizations">
              <Button variant="default" className="gap-2">
                <Play className="w-4 h-4" />
                Open Visualizer Playground
              </Button>
            </Link>
            <Link to="/learning-hub">
              <Button variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Take Skill Diagnostic
              </Button>
            </Link>
            <Link to="/ai">
              <Button variant="outline" className="gap-2">
                <Bot className="w-4 h-4" />
                Consult AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
