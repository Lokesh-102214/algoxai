import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Search, Plus, Box, Share2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  bstHeight,
  bstInOrderSteps,
  bstInsertSteps,
  bstSearchSteps,
  buildBSTFromArray,
  type BSTNode,
  type BSTState,
  type BSTStep,
} from "@/lib/algorithms/trees";

const DEFAULT_INITIAL_VALUES = [50, 30, 70, 20, 40, 60, 80];
const NODE_RADIUS = 0.38;

function parseInputArray(raw: string | null): number[] {
  if (!raw) return DEFAULT_INITIAL_VALUES;
  try {
    const nums = raw
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n >= -999 && n <= 999);
    return nums.length > 0 ? nums : DEFAULT_INITIAL_VALUES;
  } catch {
    return DEFAULT_INITIAL_VALUES;
  }
}

function positionOf(node: BSTNode): [number, number, number] {
  return [node.x * 1.45, -node.depth * 1.55, 0];
}

function Connection({ from, to }: { from: BSTNode; to: BSTNode }) {
  const points = useMemo(() => [positionOf(from), positionOf(to)], [from, to]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(points.flat()), 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.65} />
    </line>
  );
}

function TreeScene({
  tree,
  activeNode,
  visitedNodes,
}: {
  tree: BSTState;
  activeNode: number | null;
  visitedNodes: Set<number>;
}) {
  const nodes = [...tree.nodes.values()];

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <pointLight position={[-5, 2, 3]} color="#3b82f6" intensity={10} />
      {nodes.map((node) => {
        const parent = node.parent === null ? null : tree.nodes.get(node.parent);
        return parent ? <Connection key={`${parent.id}-${node.id}`} from={parent} to={node} /> : null;
      })}
      {nodes.map((node) => {
        const isActive = node.id === activeNode;
        const isVisited = visitedNodes.has(node.id);
        const [x, y, z] = positionOf(node);
        const color = isActive ? "#f59e0b" : isVisited ? "#10b981" : "#3b82f6";

        return (
          <group key={node.id} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[isActive ? NODE_RADIUS * 1.18 : NODE_RADIUS, 32, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 0.55 : 0.16}
                roughness={0.25}
                metalness={0.3}
              />
            </mesh>
            <Text
              position={[0, 0, NODE_RADIUS + 0.02]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {node.value}
            </Text>
          </group>
        );
      })}
      <gridHelper args={[14, 14, "#1e293b", "#0f172a"]} position={[0, -5.25, 0]} />
      <OrbitControls enablePan enableZoom minDistance={4} maxDistance={18} target={[0, -2, 0]} />
    </>
  );
}

const BST3DVisualizer = () => {
  const initialNumbers = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInputArray(urlParams.get("input"));
  }, []);

  const [currentValues, setCurrentValues] = useState<number[]>(initialNumbers);
  const [customArrayInput, setCustomArrayInput] = useState<string>(initialNumbers.join(", "));
  const [tree, setTree] = useState<BSTState>(() => buildBSTFromArray(initialNumbers));
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Drag to orbit, scroll to zoom, and use an operation to follow the 3D BST.");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [lastTrace, setLastTrace] = useState<BSTStep[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const stopPlayback = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setIsRunning(false);
  };

  const playSteps = (steps: BSTStep[], onComplete?: () => void) => {
    stopPlayback();
    setLastTrace(steps);
    setIsRunning(true);
    setVisitedNodes(new Set());
    steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        setTree(step.state);
        setMessage(step.description);
        setActiveNode(step.nodeId);
        if (step.type === "visit" || step.type === "found") {
          setVisitedNodes((current) => new Set([...current, ...(step.nodeId === null ? [] : [step.nodeId])]));
        }
        if (index === steps.length - 1) {
          setIsRunning(false);
          onComplete?.();
        }
      }, index * 650);
      timers.current.push(timer);
    });
  };

  const readValue = () => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= -999 && parsed <= 999 ? parsed : null;
  };

  const insert = () => {
    const next = readValue();
    if (next === null) return setMessage("Enter a whole number between -999 and 999.");
    setCurrentValues((prev) => [...prev, next]);
    playSteps(bstInsertSteps(tree, next), () => setValue(""));
  };

  const search = () => {
    const target = readValue();
    if (target === null) return setMessage("Enter a whole number between -999 and 999.");
    playSteps(bstSearchSteps(tree, target));
  };

  const traverse = () => playSteps(bstInOrderSteps(tree));

  const applyCustomTree = () => {
    stopPlayback();
    const nums = parseInputArray(customArrayInput);
    setCurrentValues(nums);
    setTree(buildBSTFromArray(nums));
    setActiveNode(null);
    setVisitedNodes(new Set());
    setMessage(`Built 3D BST with ${nums.length} custom nodes: [${nums.join(", ")}].`);
    toast.success("Custom BST structure built successfully");
  };

  const reset = () => {
    stopPlayback();
    setCurrentValues(DEFAULT_INITIAL_VALUES);
    setCustomArrayInput(DEFAULT_INITIAL_VALUES.join(", "));
    setTree(buildBSTFromArray(DEFAULT_INITIAL_VALUES));
    setActiveNode(null);
    setVisitedNodes(new Set());
    setValue("");
    setMessage("Reset to the default balanced starter tree.");
  };

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", "bst3d");
    url.searchParams.set("input", currentValues.join(","));
    navigator.clipboard.writeText(url.toString());
    toast.success("Shareable URL permalink copied to clipboard!");
  };

  const exportTraceJson = () => {
    const stepsToExport = lastTrace.length > 0 ? lastTrace : bstInOrderSteps(tree);
    const exportData = {
      engine: "algoxai-bst",
      treeNodes: [...tree.nodes.values()],
      height: bstHeight(tree),
      stepCount: stepsToExport.length,
      trace: stepsToExport.map((s, i) => ({
        step: i + 1,
        type: s.type,
        activeNode: s.nodeId,
        description: s.description,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "algoxai-bst-trace.json";
    link.click();
    toast.success("BST execution step trace exported as JSON!");
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Operation Bar */}
      <div className="flex flex-wrap items-end gap-3 justify-between bg-card p-4 rounded-xl border border-border/70">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label htmlFor="bst-value" className="text-xs font-medium text-muted-foreground">
              Node value
            </label>
            <Input
              id="bst-value"
              className="w-28 bg-card border-border"
              type="number"
              min="-999"
              max="999"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && insert()}
              disabled={isRunning}
              placeholder="e.g. 45"
            />
          </div>
          <Button onClick={insert} disabled={isRunning} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Insert
          </Button>
          <Button onClick={search} variant="outline" disabled={isRunning} size="sm" className="border-border">
            <Search className="mr-1.5 h-4 w-4" />
            Search
          </Button>
          <Button onClick={traverse} variant="outline" disabled={isRunning} size="sm" className="border-border">
            <Play className="mr-1.5 h-4 w-4" />
            In-order
          </Button>
          <Button onClick={reset} variant="ghost" size="sm">
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={copyShareLink} variant="outline" size="sm" className="border-border text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share Link
          </Button>
          <Button onClick={exportTraceJson} variant="outline" size="sm" className="border-border text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Trace
          </Button>
        </div>
      </div>

      {/* Custom Array Input Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border/50 text-xs">
        <span className="font-medium text-muted-foreground">Custom Tree Input:</span>
        <Input
          className="flex-1 min-w-[200px] h-8 text-xs bg-card border-border"
          placeholder="Comma-separated numbers, e.g. 10, 5, 20, 3, 8, 15, 25"
          value={customArrayInput}
          onChange={(e) => setCustomArrayInput(e.target.value)}
          disabled={isRunning}
        />
        <Button onClick={applyCustomTree} disabled={isRunning} size="sm" variant="secondary" className="h-8 text-xs">
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Rebuild Tree
        </Button>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-3 bg-card border-border/70">
          <p className="text-2xl font-bold text-primary">{tree.nodes.size}</p>
          <p className="text-xs text-muted-foreground">Active Nodes</p>
        </Card>
        <Card className="p-3 bg-card border-border/70">
          <p className="text-2xl font-bold text-primary">{bstHeight(tree)}</p>
          <p className="text-xs text-muted-foreground">Tree Height (h)</p>
        </Card>
        <Card className="p-3 bg-card border-border/70">
          <p className="text-sm font-medium text-foreground">O(h) log n average</p>
          <p className="text-xs text-muted-foreground">Complexity per operation</p>
        </Card>
      </div>

      {/* 3D Scene Viewport */}
      <div className="h-[440px] overflow-hidden rounded-xl border border-primary/20 bg-slate-950 shadow-inner">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#020617"]} />
          <TreeScene tree={tree} activeNode={activeNode} visitedNodes={visitedNodes} />
        </Canvas>
      </div>

      {/* Operational Step Log */}
      <Card className="flex gap-3 p-4 text-sm bg-card border-border/70">
        <Box className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-foreground">{message}</p>
      </Card>
    </div>
  );
};

export default BST3DVisualizer;
