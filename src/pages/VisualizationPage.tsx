import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SortingVisualizer from "../components/visualizers/SortingVisualizer";
import GraphVisualizer from "../components/visualizers/GraphVisualizer";
import TowerOfHanoi from "../components/visualizers/TowerOfHanoi";
import { Play, Pause, RotateCcw, Settings, Eye } from "lucide-react";

const VisualizationPage = () => {
  const [activeVisualizer, setActiveVisualizer] = useState<"sorting" | "graph" | "hanoi">("sorting");

  const visualizers = [
    {
      id: "sorting" as const,
      title: "Sorting Algorithms",
      description: "Visualize bubble sort, selection sort, and insertion sort in action",
      difficulty: "Easy",
      icon: "📊",
      features: ["Multiple algorithms", "Speed control", "Array size control"]
    },
    {
      id: "graph" as const,
      title: "Graph Traversal",
      description: "Watch BFS and DFS algorithms explore graph structures",
      difficulty: "Medium", 
      icon: "🌐",
      features: ["BFS/DFS visualization", "Interactive nodes", "Path highlighting"]
    },
    {
      id: "hanoi" as const,
      title: "Tower of Hanoi",
      description: "Classic recursive problem visualization with move counting",
      difficulty: "Medium",
      icon: "🗼",
      features: ["Recursive solution", "Move counter", "Animation steps"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "cp-difficulty-easy";
      case "Medium": return "cp-difficulty-medium"; 
      case "Hard": return "cp-difficulty-hard";
      default: return "cp-difficulty-easy";
    }
  };

  const renderVisualizer = () => {
    switch (activeVisualizer) {
      case "sorting":
        return <SortingVisualizer />;
      case "graph":
        return <GraphVisualizer />;
      case "hanoi":
        return <TowerOfHanoi />;
      default:
        return <SortingVisualizer />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <Eye className="w-8 h-8 mr-3 text-primary" />
          Algorithm Visualizations
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive visualizations to help you understand how algorithms work step by step.
          Perfect for learning and teaching algorithmic concepts.
        </p>
      </div>

      {/* Visualizer Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {visualizers.map((viz) => (
          <Card 
            key={viz.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              activeVisualizer === viz.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => setActiveVisualizer(viz.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{viz.icon}</div>
              <Badge className={getDifficultyColor(viz.difficulty)}>
                {viz.difficulty}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{viz.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{viz.description}</p>
            
            <div className="space-y-1">
              {viz.features.map((feature, index) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Active Visualizer */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {visualizers.find(v => v.id === activeVisualizer)?.title}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Interactive
            </Badge>
            <Badge variant="outline" className="text-xs">
              Educational
            </Badge>
          </div>
        </div>

        {/* Visualizer Component */}
        {renderVisualizer()}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">How to use:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {activeVisualizer === "sorting" && (
              <>
                <p>• Click "Generate Array" to create a new random array</p>
                <p>• Select your preferred sorting algorithm</p>
                <p>• Adjust speed and array size with the controls</p>
                <p>• Click "Start Sort" to begin the visualization</p>
              </>
            )}
            {activeVisualizer === "graph" && (
              <>
                <p>• Click nodes to set start and end points</p>
                <p>• Choose between BFS and DFS algorithms</p>
                <p>• Watch as the algorithm explores the graph</p>
                <p>• Reset to try different paths</p>
              </>
            )}
            {activeVisualizer === "hanoi" && (
              <>
                <p>• Choose the number of disks (3-8 recommended)</p>
                <p>• Click "Solve" to watch the recursive solution</p>
                <p>• Observe how the algorithm moves disks optimally</p>
                <p>• The move counter shows the minimum steps needed</p>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Educational Notes */}
      <Card className="p-6 mt-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold mb-3">💡 Learning Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Visual Learning</h4>
            <p className="text-muted-foreground">
              Watching algorithms in action helps build intuition for how they work and why certain approaches are more efficient.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Pattern Recognition</h4>
            <p className="text-muted-foreground">
              Look for patterns in how different algorithms approach the same problem - this insight is valuable for competitive programming.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VisualizationPage;