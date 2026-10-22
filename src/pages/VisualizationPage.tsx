import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SortingVisualizer from "../components/visualizers/SortingVisualizer";
import GraphVisualizer from "../components/visualizers/GraphVisualizer";
import TowerOfHanoi from "../components/visualizers/TowerOfHanoi";
import BST3DVisualizer from "../components/visualizers/BST3DVisualizer";
import PathfindingVisualizer from "../components/visualizers/PathfindingVisualizer";
import { Eye, Box, Github, Layers, Compass, Code2 } from "lucide-react";

type VisualizerTool = "bst3d" | "pathfinding" | "sorting" | "graph" | "hanoi";

const VisualizationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTool = searchParams.get("tool") as VisualizerTool | null;
  const initialTool: VisualizerTool =
    requestedTool && ["bst3d", "pathfinding", "sorting", "graph", "hanoi"].includes(requestedTool)
      ? requestedTool
      : "bst3d";

  const [activeVisualizer, setActiveVisualizer] = useState<VisualizerTool>(initialTool);

  const visualizers = [
    {
      id: "bst3d" as const,
      title: "3D Binary Search Tree",
      description: "Insert, search, and traverse spatial trees in interactive 3D with customizable input & trace export",
      difficulty: "Medium",
      icon: "🌳",
      badge: "3D Spatial",
      features: ["3D orbit & zoom", "Custom array input", "JSON trace export"],
    },
    {
      id: "pathfinding" as const,
      title: "Pathfinding (A* & Dijkstra)",
      description: "Solve shortest paths across obstacle grids with Manhattan heuristics and step-by-step exploration",
      difficulty: "Hard",
      icon: "🧭",
      badge: "New Engine",
      features: ["Interactive walls", "A* & Dijkstra engines", "Heuristic comparison"],
    },
    {
      id: "sorting" as const,
      title: "Sorting Algorithms",
      description: "Compare Bubble, Selection, and Insertion sorts with custom arrays, speed controls, and traces",
      difficulty: "Easy",
      icon: "📊",
      badge: "Replayable",
      features: ["Custom array inputs", "Real-time step logs", "Trace export"],
    },
    {
      id: "graph" as const,
      title: "Graph Traversal",
      description: "Watch BFS and DFS algorithms explore cyclic graph structures with path reconstruction",
      difficulty: "Medium",
      icon: "🌐",
      badge: "Canvas 2D",
      features: ["BFS/DFS engines", "Interactive nodes", "Shortest path resolution"],
    },
    {
      id: "hanoi" as const,
      title: "Tower of Hanoi",
      description: "Classic recursive divide-and-conquer problem with optimal move count calculations",
      difficulty: "Medium",
      icon: "🗼",
      badge: "Recursive",
      features: ["Optimal 2ⁿ - 1 moves", "Step playback", "Disk count controls"],
    },
  ];

  const selectVisualizer = (id: VisualizerTool) => {
    setActiveVisualizer(id);
    setSearchParams({ tool: id });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "cp-difficulty-easy";
      case "Medium":
        return "cp-difficulty-medium";
      case "Hard":
        return "cp-difficulty-hard";
      default:
        return "cp-difficulty-easy";
    }
  };

  const renderVisualizer = () => {
    switch (activeVisualizer) {
      case "bst3d":
        return <BST3DVisualizer />;
      case "pathfinding":
        return <PathfindingVisualizer />;
      case "sorting":
        return <SortingVisualizer />;
      case "graph":
        return <GraphVisualizer />;
      case "hanoi":
        return <TowerOfHanoi />;
      default:
        return <BST3DVisualizer />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center">
          <Eye className="w-8 h-8 mr-3 text-primary" />
          Observable Algorithm Workbench
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Interactive, observable data structure visualizers backed by pure TypeScript algorithm engines.
          Inspect state transitions, test custom edge-case inputs, export JSON execution traces, and share live states.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 bg-card">
            <Box className="h-3.5 w-3.5 text-primary" /> 3D Spatial Renders
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 bg-card">
            <Compass className="h-3.5 w-3.5 text-emerald-500" /> A* & Dijkstra Grid Engine
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 bg-card">
            <Code2 className="h-3.5 w-3.5 text-amber-500" /> Zero-Dep Algorithm Engines
          </span>
          <a
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 hover:text-foreground transition-colors bg-card"
            href="https://github.com/Lokesh-102214/algoxai"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-3.5 w-3.5" /> Open Source on GitHub
          </a>
        </div>
      </div>

      {/* Visualizer Selection Grid */}
      <div className="grid md:grid-cols-5 gap-3 mb-8">
        {visualizers.map((viz) => (
          <Card
            key={viz.id}
            className={`p-3.5 cursor-pointer transition-all hover:shadow-md ${
              activeVisualizer === viz.id
                ? "ring-2 ring-primary bg-primary/5 border-primary/40"
                : "hover:bg-muted/40 bg-card border-border/70"
            }`}
            onClick={() => selectVisualizer(viz.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl">{viz.icon}</div>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getDifficultyColor(viz.difficulty)}`}>
                {viz.badge}
              </Badge>
            </div>

            <h3 className="text-sm font-semibold mb-1 text-foreground truncate">{viz.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{viz.description}</p>

            <div className="space-y-0.5">
              {viz.features.map((feature, index) => (
                <div key={index} className="text-[11px] text-muted-foreground flex items-center">
                  <div className="w-1 h-1 bg-primary rounded-full mr-1.5" />
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Active Visualizer Panel */}
      <Card className="p-6 bg-card border-border/70">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              {visualizers.find((v) => v.id === activeVisualizer)?.title}
            </h2>
            <Badge className={getDifficultyColor(visualizers.find((v) => v.id === activeVisualizer)?.difficulty || "Easy")}>
              {visualizers.find((v) => v.id === activeVisualizer)?.difficulty}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Observable Engine
            </Badge>
            <Badge variant="outline" className="text-xs border-border">
              Permalinks Enabled
            </Badge>
          </div>
        </div>

        {/* Visualizer Component */}
        {renderVisualizer()}

        {/* Integration Instructions */}
        <div className="mt-6 p-4 bg-muted/40 rounded-lg border border-border/50">
          <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2">
            Engineering & Developer Usage:
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              • <strong>Shareable Permalinks:</strong> Click "Share Link" on any visualizer to get a URL that re-creates the exact state, custom inputs, and algorithm for PR comments, docs, or bug reports.
            </p>
            <p>
              • <strong>Step Trace Export:</strong> Click "Export Trace" to download immutable JSON step arrays for unit test reproduction, LLM reasoning, or documentation snapshots.
            </p>
            <p>
              • <strong>Engine Reuse:</strong> All algorithms are pure functions decoupled from renderers. Import from <code className="text-foreground">algoxai</code> to use the logic directly in your own tools or CLIs.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VisualizationPage;
