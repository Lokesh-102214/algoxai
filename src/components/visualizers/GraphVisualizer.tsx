import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Node {
  id: number;
  x: number;
  y: number;
  visited: boolean;
  inQueue: boolean;
  isStart: boolean;
  isEnd: boolean;
}

interface Edge {
  from: number;
  to: number;
  highlighted: boolean;
}

const GraphVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [algorithm, setAlgorithm] = useState("bfs");
  const [isRunning, setIsRunning] = useState(false);
  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [path, setPath] = useState<number[]>([]);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([]);

  // Initialize graph
  useEffect(() => {
    generateGraph();
  }, []);

  // Generate a sample graph
  const generateGraph = () => {
    const newNodes: Node[] = [
      { id: 0, x: 100, y: 100, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 1, x: 300, y: 100, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 2, x: 500, y: 100, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 3, x: 100, y: 250, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 4, x: 300, y: 250, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 5, x: 500, y: 250, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 6, x: 200, y: 400, visited: false, inQueue: false, isStart: false, isEnd: false },
      { id: 7, x: 400, y: 400, visited: false, inQueue: false, isStart: false, isEnd: false },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, highlighted: false },
      { from: 0, to: 3, highlighted: false },
      { from: 1, to: 2, highlighted: false },
      { from: 1, to: 4, highlighted: false },
      { from: 2, to: 5, highlighted: false },
      { from: 3, to: 4, highlighted: false },
      { from: 3, to: 6, highlighted: false },
      { from: 4, to: 5, highlighted: false },
      { from: 4, to: 6, highlighted: false },
      { from: 4, to: 7, highlighted: false },
      { from: 5, to: 7, highlighted: false },
      { from: 6, to: 7, highlighted: false },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(null);
    setEndNode(null);
    setPath([]);
    setVisitedOrder([]);
    
    // Set default start and end nodes
    setTimeout(() => {
      setStartNode(0);
      setEndNode(7);
      setNodes(prev => prev.map(node => ({
        ...node,
        isStart: node.id === 0,
        isEnd: node.id === 7
      })));
    }, 100);
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 25;
    });

    if (clickedNode) {
      if (startNode === null) {
        setStartNode(clickedNode.id);
        setNodes(prev => prev.map(node => ({
          ...node,
          isStart: node.id === clickedNode.id,
          isEnd: node.isEnd && node.id !== clickedNode.id
        })));
        toast.success("Start node set!");
      } else if (endNode === null && clickedNode.id !== startNode) {
        setEndNode(clickedNode.id);
        setNodes(prev => prev.map(node => ({
          ...node,
          isEnd: node.id === clickedNode.id
        })));
        toast.success("End node set!");
      } else {
        // Reset and set new start
        setStartNode(clickedNode.id);
        setEndNode(null);
        setNodes(prev => prev.map(node => ({
          ...node,
          isStart: node.id === clickedNode.id,
          isEnd: false,
          visited: false,
          inQueue: false
        })));
        setPath([]);
        setVisitedOrder([]);
      }
    }
  };

  // Delay function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // BFS Algorithm
  const bfs = async () => {
    if (startNode === null || endNode === null) {
      toast.error("Please set start and end nodes");
      return;
    }

    const queue = [startNode];
    const visited = new Set<number>();
    const parent = new Map<number, number>();
    const visitOrder: number[] = [];

    setNodes(prev => prev.map(node => ({ ...node, visited: false, inQueue: false })));
    setEdges(prev => prev.map(edge => ({ ...edge, highlighted: false })));

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      visitOrder.push(current);
      setVisitedOrder([...visitOrder]);
      
      setNodes(prev => prev.map(node => ({
        ...node,
        visited: node.id === current || visited.has(node.id),
        inQueue: queue.includes(node.id)
      })));

      await delay(800);

      if (current === endNode) {
        // Reconstruct path
        const pathNodes: number[] = [];
        let node = endNode;
        while (node !== undefined) {
          pathNodes.unshift(node);
          node = parent.get(node)!;
        }
        setPath(pathNodes);
        
        // Highlight path edges
        setEdges(prev => prev.map(edge => ({
          ...edge,
          highlighted: pathNodes.includes(edge.from) && pathNodes.includes(edge.to) &&
                      Math.abs(pathNodes.indexOf(edge.from) - pathNodes.indexOf(edge.to)) === 1
        })));
        
        toast.success(`Path found! Distance: ${pathNodes.length - 1}`);
        return;
      }

      // Add neighbors to queue
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor));

      for (const neighbor of neighbors) {
        if (!parent.has(neighbor)) {
          parent.set(neighbor, current);
        }
        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    
    toast.error("No path found!");
  };

  // DFS Algorithm
  const dfs = async () => {
    if (startNode === null || endNode === null) {
      toast.error("Please set start and end nodes");
      return;
    }

    const visited = new Set<number>();
    const parent = new Map<number, number>();
    const visitOrder: number[] = [];

    setNodes(prev => prev.map(node => ({ ...node, visited: false, inQueue: false })));
    setEdges(prev => prev.map(edge => ({ ...edge, highlighted: false })));

    const dfsRecursive = async (current: number): Promise<boolean> => {
      visited.add(current);
      visitOrder.push(current);
      setVisitedOrder([...visitOrder]);
      
      setNodes(prev => prev.map(node => ({
        ...node,
        visited: visited.has(node.id),
        inQueue: node.id === current
      })));

      await delay(800);

      if (current === endNode) {
        return true;
      }

      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          parent.set(neighbor, current);
          if (await dfsRecursive(neighbor)) {
            return true;
          }
        }
      }

      return false;
    };

    const found = await dfsRecursive(startNode);
    
    if (found) {
      // Reconstruct path
      const pathNodes: number[] = [];
      let node = endNode;
      while (node !== undefined) {
        pathNodes.unshift(node);
        node = parent.get(node)!;
      }
      setPath(pathNodes);
      
      // Highlight path edges
      setEdges(prev => prev.map(edge => ({
        ...edge,
        highlighted: pathNodes.includes(edge.from) && pathNodes.includes(edge.to) &&
                    Math.abs(pathNodes.indexOf(edge.from) - pathNodes.indexOf(edge.to)) === 1
      })));
      
      toast.success(`Path found! Distance: ${pathNodes.length - 1}`);
    } else {
      toast.error("No path found!");
    }
  };

  // Start algorithm
  const startAlgorithm = async () => {
    setIsRunning(true);
    try {
      if (algorithm === "bfs") {
        await bfs();
      } else {
        await dfs();
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Reset visualization
  const resetVisualization = () => {
    setNodes(prev => prev.map(node => ({ ...node, visited: false, inQueue: false })));
    setEdges(prev => prev.map(edge => ({ ...edge, highlighted: false })));
    setPath([]);
    setVisitedOrder([]);
  };

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.highlighted ? '#10b981' : '#6b7280';
        ctx.lineWidth = edge.highlighted ? 4 : 2;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      // Node fill color
      if (node.isStart) {
        ctx.fillStyle = '#10b981'; // Green for start
      } else if (node.isEnd) {
        ctx.fillStyle = '#ef4444'; // Red for end
      } else if (path.includes(node.id)) {
        ctx.fillStyle = '#f59e0b'; // Orange for path
      } else if (node.visited) {
        ctx.fillStyle = '#8b5cf6'; // Purple for visited
      } else if (node.inQueue) {
        ctx.fillStyle = '#06b6d4'; // Cyan for in queue
      } else {
        ctx.fillStyle = '#3b82f6'; // Blue for unvisited
      }
      
      ctx.fill();
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.id.toString(), node.x, node.y + 5);
    });
  }, [nodes, edges, path]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={setAlgorithm} disabled={isRunning}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">BFS</SelectItem>
              <SelectItem value="dfs">DFS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={startAlgorithm}
            disabled={isRunning || startNode === null || endNode === null}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Play className="w-4 h-4 mr-2" />
            Start {algorithm.toUpperCase()}
          </Button>

          <Button onClick={resetVisualization} variant="outline" disabled={isRunning}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button onClick={generateGraph} variant="outline" disabled={isRunning}>
            <MapPin className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        <div className="flex space-x-2">
          <Badge variant="outline">
            Start: {startNode !== null ? startNode : "Not set"}
          </Badge>
          <Badge variant="outline">
            End: {endNode !== null ? endNode : "Not set"}
          </Badge>
        </div>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg bg-muted/20">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          onClick={handleCanvasClick}
          className="cursor-pointer"
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Start Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>End Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span>Path</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
          <span>In Queue</span>
        </div>
      </div>

      {/* Results */}
      {path.length > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Results</h4>
          <p className="text-sm">
            <strong>Path:</strong> {path.join(' → ')} <br />
            <strong>Path Length:</strong> {path.length - 1} <br />
            <strong>Nodes Visited:</strong> {visitedOrder.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;