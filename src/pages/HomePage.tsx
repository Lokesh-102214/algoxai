import TopicCard from "../components/TopicCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, BarChart3, GitBranch, Layers, Search, Shuffle, Target, Sparkles, CheckCircle2, Bot, Code2, Brain } from "lucide-react";
const HomePage = () => {
  const navigate = useNavigate();
  const cpTopics = [{
    title: "Dynamic Programming",
    description: "Master the art of breaking problems into optimal subproblems with memoization techniques.",
    difficulty: "Hard" as const,
    problems: 150,
    icon: <Layers className="w-6 h-6" />,
    slug: "dynamic-programming",
    estimatedTime: "2-3 weeks",
    popularity: 95
  }, {
    title: "Graph Algorithms",
    description: "Explore BFS, DFS, shortest paths, and complex graph traversal problems.",
    difficulty: "Medium" as const,
    problems: 120,
    icon: <GitBranch className="w-6 h-6" />,
    slug: "graph-algorithms",
    estimatedTime: "2 weeks",
    popularity: 92
  }, {
    title: "Greedy Algorithms",
    description: "Learn to make locally optimal choices for globally optimal solutions.",
    difficulty: "Medium" as const,
    problems: 80,
    icon: <Target className="w-6 h-6" />,
    slug: "greedy-algorithms",
    estimatedTime: "1 week",
    popularity: 88
  }, {
    title: "Binary Search",
    description: "Master the divide-and-conquer approach for searching in sorted arrays.",
    difficulty: "Easy" as const,
    problems: 60,
    icon: <Search className="w-6 h-6" />,
    slug: "binary-search",
    estimatedTime: "3-5 days",
    popularity: 90
  }, {
    title: "Sorting Algorithms",
    description: "Understand various sorting techniques from bubble sort to advanced algorithms.",
    difficulty: "Easy" as const,
    problems: 45,
    icon: <BarChart3 className="w-6 h-6" />,
    slug: "sorting-algorithms",
    estimatedTime: "1 week",
    popularity: 85
  }, {
    title: "Backtracking",
    description: "Solve complex problems by exploring all possible solutions systematically.",
    difficulty: "Hard" as const,
    problems: 70,
    icon: <Shuffle className="w-6 h-6" />,
    slug: "backtracking",
    estimatedTime: "1-2 weeks",
    popularity: 82
  }];
  return <div className="min-h-screen pt-16 animate-fade-in-up">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[88vh] flex items-center px-4 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #2dd4bf 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-48 w-[32rem] h-[32rem] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-48 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── LEFT ── */}
            <div className="space-y-7 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-400 text-sm font-medium w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                AI-powered algorithm learning
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight">
                Master algorithms<br />
                <span className="text-muted-foreground/70 font-semibold text-4xl md:text-5xl">with your personal</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400">
                  AI tutor
                </span>
              </h1>

              {/* Feature bullets */}
              <div className="space-y-2.5">
                {[
                  { icon: Brain,  text: "3 specialized AI agents — Concept Breaker, Refactorer, Trouble Shooter" },
                  { icon: Code2,  text: "Live code canvas with Monaco editor & complexity analysis" },
                  { icon: Bot,    text: "Algorithm visualizations powered by D3.js — see it, feel it" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-1">
                <Button size="lg" onClick={() => navigate('/learning-hub')} className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_28px_rgba(45,212,191,0.5)] hover:scale-105 transition-all duration-200 px-8">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/ai')} className="border-teal-500/40 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/60 hover:scale-105 transition-all duration-200 px-8">
                  <Bot className="w-4 h-4 mr-2" />
                  Try AI Assistant
                </Button>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-6 pt-1 border-t border-border/30">
                {[
                  { value: "25K+",   label: "Active learners" },
                  { value: "1.2M+",  label: "Problems solved" },
                  { value: "87%",    label: "Success rate" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-bold text-teal-400">{value}</div>
                    <div className="text-[11px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Code demo card ── */}
            <div className="hidden lg:block relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Floating agent badge */}
              <div className="absolute -top-5 right-8 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-teal-500/40 shadow-lg text-xs font-semibold text-teal-400">
                <Brain className="w-3 h-3" /> Concept Breaker is typing…
              </div>

              {/* Code card */}
              <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border/60 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_50px_rgba(45,212,191,0.08)] transition-shadow duration-500">
                {/* Terminal bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/30 border-b border-border/30">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">bfs_shortest_path.py</span>
                </div>

                {/* Syntax-highlighted code */}
                <pre className="px-5 py-5 text-[13px] font-mono leading-relaxed overflow-x-auto">
<code><span className="text-slate-400"># BFS — shortest path in unweighted graph</span>{"\n"}<span className="text-indigo-400">from</span> <span className="text-teal-300">collections</span> <span className="text-indigo-400">import</span> deque{"\n\n"}<span className="text-indigo-400">def</span> <span className="text-yellow-300">bfs</span>(<span className="text-orange-300">graph</span>, <span className="text-orange-300">start</span>, <span className="text-orange-300">end</span>):{"\n"}{"  "}<span className="text-slate-400">"""Returns shortest path or -1"""</span>{"\n"}{"  "}visited = <span className="text-teal-300">set</span>([start]){"\n"}{"  "}queue = deque([(start, <span className="text-amber-300">0</span>)]){"\n\n"}{"  "}<span className="text-indigo-400">while</span> queue:{"\n"}{"    "}node, dist = queue.<span className="text-yellow-300">popleft</span>(){"\n"}{"    "}<span className="text-indigo-400">if</span> node == end:{"\n"}{"      "}<span className="text-indigo-400">return</span> dist{"\n"}{"    "}<span className="text-indigo-400">for</span> nb <span className="text-indigo-400">in</span> graph[node]:{"\n"}{"      "}<span className="text-indigo-400">if</span> nb <span className="text-indigo-400">not in</span> visited:{"\n"}{"        "}visited.<span className="text-yellow-300">add</span>(nb){"\n"}{"        "}queue.<span className="text-yellow-300">append</span>((nb, dist + <span className="text-amber-300">1</span>)){"\n"}{"  "}<span className="text-indigo-400">return</span> <span className="text-amber-300">-1</span></code>
                </pre>

                {/* Complexity footer */}
                <div className="flex items-center gap-3 px-5 py-3 bg-muted/20 border-t border-border/30">
                  <span className="text-[11px] text-muted-foreground">Complexity:</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-mono">Time: O(V + E)</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">Space: O(V)</span>
                </div>
              </div>

              {/* Floating topic chips */}
              <div className="flex gap-3 mt-5 justify-end">
                {["Graphs", "BFS/DFS", "Dynamic Programming", "Binary Search"].map((t, i) => (
                  <span key={t}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-card border border-border/50 text-muted-foreground hover:border-teal-500/40 hover:text-teal-400 transition-colors cursor-pointer"
                    style={{ animationDelay: `${i * 0.1}s` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Topics Grid */}
      <section className="py-24 px-4 relative">
        {/* Subtle section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent pointer-events-none" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16 space-y-4">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
              <Layers className="w-3.5 h-3.5" />
              Curated curriculum
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                Competitive Programming
              </span>
              {" "}Topics
            </h2>

            {/* Gradient underline bar */}
            <div className="mx-auto w-20 h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500" />

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From dynamic programming to graph traversal — every topic comes with theory, curated
              problems, and AI-assisted explanations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cpTopics.map((topic, index) => <div key={topic.slug} style={{ animationDelay: `${index * 0.08}s` }} className="animate-fade-in-up">
                <TopicCard {...topic} />
              </div>)}
          </div>

          {/* CTA below grid */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate('/learning-hub')}
              className="border-teal-500/40 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/60 hover:scale-105 transition-all duration-200 px-10">
              View all topics →
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Links */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 gradient-text">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {[{
            label: "Daily Challenge",
            delay: "0s"
          }, {
            label: "Random Problem",
            delay: "0.1s"
          }, {
            label: "Contest Leaderboard",
            delay: "0.2s"
          }, {
            label: "Algorithm Visualizer",
            delay: "0.3s"
          }].map(({
            label,
            delay
          }) => <Button key={label} variant="outline" size="lg" className="px-6 py-3 border-border hover:border-primary/50 hover:bg-primary/10 
                           hover:shadow-[var(--shadow-glow-primary)] transition-[var(--transition-bounce)] 
                           hover:scale-105 animate-fade-in-up" style={{
            animationDelay: delay
          }}>
                {label}
              </Button>)}
          </div>
        </div>
      </section>
    </div>;
};
export default HomePage;