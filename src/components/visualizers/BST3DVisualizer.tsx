import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Search, Plus, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const INITIAL_VALUES = [50, 30, 70, 20, 40, 60, 80];
const NODE_RADIUS = 0.38;

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
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.65} />
    </line>
  );
}

function TreeScene({ tree, activeNode, visitedNodes }: {
  tree: BSTState;
  activeNode: number | null;
  visitedNodes: Set<number>;
}) {
  const nodes = [...tree.nodes.values()];

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <pointLight position={[-5, 2, 3]} color="#a855f7" intensity={10} />
      {nodes.map((node) => {
        const parent = node.parent === null ? null : tree.nodes.get(node.parent);
        return parent ? <Connection key={`${parent.id}-${node.id}`} from={parent} to={node} /> : null;
      })}
      {nodes.map((node) => {
        const isActive = node.id === activeNode;
        const isVisited = visitedNodes.has(node.id);
        const [x, y, z] = positionOf(node);
        const color = isActive ? "#fbbf24" : isVisited ? "#34d399" : "#8b5cf6";

        return (
          <group key={node.id} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[isActive ? NODE_RADIUS * 1.18 : NODE_RADIUS, 32, 32]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.55 : 0.16} roughness={0.25} metalness={0.3} />
            </mesh>
            <Text position={[0, 0, NODE_RADIUS + 0.02]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
              {node.value}
            </Text>
          </group>
        );
      })}
      <gridHelper args={[14, 14, "#6d28d9", "#312e81"]} position={[0, -5.25, 0]} />
      <OrbitControls enablePan enableZoom minDistance={4} maxDistance={18} target={[0, -2, 0]} />
    </>
  );
}

const BST3DVisualizer = () => {
  const [tree, setTree] = useState<BSTState>(() => buildBSTFromArray(INITIAL_VALUES));
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Drag to orbit, scroll to zoom, and use an operation to follow the BST.");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const stopPlayback = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setIsRunning(false);
  };

  const playSteps = (steps: BSTStep[], onComplete?: () => void) => {
    stopPlayback();
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
    playSteps(bstInsertSteps(tree, next), () => setValue(""));
  };

  const search = () => {
    const target = readValue();
    if (target === null) return setMessage("Enter a whole number between -999 and 999.");
    playSteps(bstSearchSteps(tree, target));
  };

  const traverse = () => playSteps(bstInOrderSteps(tree));

  const reset = () => {
    stopPlayback();
    setTree(buildBSTFromArray(INITIAL_VALUES));
    setActiveNode(null);
    setVisitedNodes(new Set());
    setValue("");
    setMessage("Reset to the balanced starter tree.");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <label htmlFor="bst-value" className="text-sm font-medium">Node value</label>
          <Input id="bst-value" className="w-32" type="number" min="-999" max="999" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => event.key === "Enter" && insert()} disabled={isRunning} placeholder="e.g. 45" />
        </div>
        <Button onClick={insert} disabled={isRunning}><Plus className="mr-2 h-4 w-4" />Insert</Button>
        <Button onClick={search} variant="outline" disabled={isRunning}><Search className="mr-2 h-4 w-4" />Search</Button>
        <Button onClick={traverse} variant="outline" disabled={isRunning}><Play className="mr-2 h-4 w-4" />In-order</Button>
        <Button onClick={reset} variant="ghost"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-3"><p className="text-2xl font-bold text-primary">{tree.nodes.size}</p><p className="text-xs text-muted-foreground">Nodes</p></Card>
        <Card className="p-3"><p className="text-2xl font-bold text-primary">{bstHeight(tree)}</p><p className="text-xs text-muted-foreground">Height</p></Card>
        <Card className="p-3"><p className="text-sm font-medium text-foreground">O(h)</p><p className="text-xs text-muted-foreground">Search / insert</p></Card>
      </div>

      <div className="h-[440px] overflow-hidden rounded-xl border border-primary/20 bg-slate-950">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#020617"]} />
          <TreeScene tree={tree} activeNode={activeNode} visitedNodes={visitedNodes} />
        </Canvas>
      </div>

      <Card className="flex gap-3 p-4 text-sm">
        <Box className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>{message}</p>
      </Card>
    </div>
  );
};

export default BST3DVisualizer;
