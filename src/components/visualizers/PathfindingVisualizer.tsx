import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Play, RotateCcw, Share2, Download, ShieldAlert, Sparkles, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import {
  createGrid,
  dijkstraGrid,
  aStarGrid,
  type GridCoord,
  type GridMap,
  type PathfindingResult,
} from "@/lib/algorithms/pathfinding";

const ROWS = 14;
const COLS = 26;
const DEFAULT_START: GridCoord = { row: 6, col: 3 };
const DEFAULT_TARGET: GridCoord = { row: 6, col: 22 };

const PathfindingVisualizer: React.FC = () => {
  const [grid, setGrid] = useState<GridMap>(() => createGrid(ROWS, COLS, DEFAULT_START, DEFAULT_TARGET));
  const [algorithm, setAlgorithm] = useState<"astar" | "dijkstra">("astar");
  const [speed, setSpeed] = useState<number>(30); // ms per step
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());
  const [pathSet, setPathSet] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<{ visited: number; pathLength: number; status: string }>({
    visited: 0,
    pathLength: 0,
    status: "Ready",
  });
  const [lastResult, setLastResult] = useState<PathfindingResult | null>(null);

  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleMouseDown = (r: number, c: number) => {
    if (isRunning) return;
    if ((r === DEFAULT_START.row && c === DEFAULT_START.col) || (r === DEFAULT_TARGET.row && c === DEFAULT_TARGET.col)) return;
    setIsMousePressed(true);
    toggleWall(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isMousePressed || isRunning) return;
    if ((r === DEFAULT_START.row && c === DEFAULT_START.col) || (r === DEFAULT_TARGET.row && c === DEFAULT_TARGET.col)) return;
    toggleWall(r, c);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const toggleWall = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c].isWall = !next[r][c].isWall;
      return next;
    });
  };

  const clearPath = () => {
    clearTimers();
    setIsRunning(false);
    setVisitedSet(new Set());
    setPathSet(new Set());
    setStats({ visited: 0, pathLength: 0, status: "Path cleared" });
  };

  const clearWalls = () => {
    clearPath();
    setGrid(createGrid(ROWS, COLS, DEFAULT_START, DEFAULT_TARGET));
    setStats({ visited: 0, pathLength: 0, status: "Walls cleared" });
  };

  const addPresetBarrier = () => {
    clearPath();
    const newGrid = createGrid(ROWS, COLS, DEFAULT_START, DEFAULT_TARGET);
    // Vertical wall in middle with a gap
    for (let r = 1; r < ROWS - 1; r++) {
      if (r !== 6 && r !== 7) {
        newGrid[r][13].isWall = true;
      }
    }
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, status: "Preset wall barrier placed" });
  };

  const addRandomMaze = () => {
    clearPath();
    const newGrid = createGrid(ROWS, COLS, DEFAULT_START, DEFAULT_TARGET);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r === DEFAULT_START.row && c === DEFAULT_START.col) || (r === DEFAULT_TARGET.row && c === DEFAULT_TARGET.col)) continue;
        if (Math.random() < 0.28) {
          newGrid[r][c].isWall = true;
        }
      }
    }
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, status: "Random obstacles generated" });
  };

  const runPathfinding = () => {
    if (isRunning) return;
    clearPath();
    setIsRunning(true);
    setStats((prev) => ({ ...prev, status: `Running ${algorithm.toUpperCase()}...` }));

    const result = algorithm === "astar"
      ? aStarGrid(grid, DEFAULT_START, DEFAULT_TARGET)
      : dijkstraGrid(grid, DEFAULT_START, DEFAULT_TARGET);

    setLastResult(result);

    const visitedList = result.visitedNodes;
    const finalPath = result.path;

    visitedList.forEach((coord, i) => {
      const timer = window.setTimeout(() => {
        setVisitedSet((prev) => new Set([...prev, `${coord.row},${coord.col}`]));
        setStats({
          visited: i + 1,
          pathLength: 0,
          status: `Exploring: (${coord.row}, ${coord.col})`,
        });

        if (i === visitedList.length - 1) {
          // Finished exploration -> Animate shortest path
          if (result.found) {
            animatePath(finalPath, visitedList.length);
          } else {
            setIsRunning(false);
            setStats({
              visited: visitedList.length,
              pathLength: 0,
              status: "Target unreachable — no path exists!",
            });
            toast.error("Target is unreachable due to obstacles");
          }
        }
      }, i * speed);
      timers.current.push(timer);
    });
  };

  const animatePath = (path: GridCoord[], totalVisited: number) => {
    path.forEach((coord, i) => {
      const timer = window.setTimeout(() => {
        setPathSet((prev) => new Set([...prev, `${coord.row},${coord.col}`]));
        setStats({
          visited: totalVisited,
          pathLength: i + 1,
          status: `Reconstructing path step ${i + 1}/${path.length}`,
        });

        if (i === path.length - 1) {
          setIsRunning(false);
          setStats({
            visited: totalVisited,
            pathLength: path.length,
            status: `Optimal path found (${path.length - 1} steps)`,
          });
          toast.success(`Shortest path resolved in ${path.length - 1} steps!`);
        }
      }, i * (speed * 1.5));
      timers.current.push(timer);
    });
  };

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", "pathfinding");
    url.searchParams.set("algo", algorithm);
    navigator.clipboard.writeText(url.toString());
    toast.success("Shareable URL copied to clipboard!");
  };

  const exportTraceJson = () => {
    const execution = lastResult || (algorithm === "astar"
      ? aStarGrid(grid, DEFAULT_START, DEFAULT_TARGET)
      : dijkstraGrid(grid, DEFAULT_START, DEFAULT_TARGET));

    const exportData = {
      engine: "algoxai-pathfinding",
      algorithm,
      start: DEFAULT_START,
      target: DEFAULT_TARGET,
      found: execution.found,
      totalCost: execution.totalCost,
      pathLength: execution.path.length,
      path: execution.path,
      visitedCount: execution.visitedNodes.length,
      steps: execution.steps,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `algoxai-${algorithm}-trace.json`;
    link.click();
    toast.success("Algorithm step trace exported as JSON!");
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp}>
      {/* Controls Bar */}
      <div className="flex flex-wrap items-end gap-3 justify-between bg-card p-4 rounded-xl border border-border/70">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Algorithm</Label>
            <Select value={algorithm} onValueChange={(val: "astar" | "dijkstra") => setAlgorithm(val)} disabled={isRunning}>
              <SelectTrigger className="w-44 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="astar">A* Search (Heuristic)</SelectItem>
                <SelectItem value="dijkstra">Dijkstra (Guaranteed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Delay: {speed}ms</Label>
            <Input
              type="range"
              min="5"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="w-28 accent-primary"
            />
          </div>

          <Button onClick={runPathfinding} disabled={isRunning} className="px-5 shadow-sm">
            <Play className="w-4 h-4 mr-2" /> Find Path
          </Button>

          <Button onClick={clearPath} variant="outline" disabled={isRunning} className="border-border">
            <RotateCcw className="w-4 h-4 mr-2" /> Clear Path
          </Button>

          <Button onClick={clearWalls} variant="outline" disabled={isRunning} className="border-border">
            Clear Walls
          </Button>

          <Button onClick={addPresetBarrier} variant="ghost" disabled={isRunning} size="sm" className="text-xs">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-primary" /> Barrier
          </Button>

          <Button onClick={addRandomMaze} variant="ghost" disabled={isRunning} size="sm" className="text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" /> Maze
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

      {/* Real-Time Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Card className="p-3 bg-card border-border/70">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="font-semibold text-foreground truncate">{stats.status}</p>
        </Card>
        <Card className="p-3 bg-card border-border/70">
          <p className="text-xs text-muted-foreground">Cells Explored</p>
          <p className="text-xl font-bold text-primary">{stats.visited}</p>
        </Card>
        <Card className="p-3 bg-card border-border/70">
          <p className="text-xs text-muted-foreground">Path Distance</p>
          <p className="text-xl font-bold text-emerald-500">{stats.pathLength > 0 ? stats.pathLength - 1 : 0} steps</p>
        </Card>
        <Card className="p-3 bg-card border-border/70">
          <p className="text-xs text-muted-foreground">Complexity</p>
          <p className="font-semibold text-foreground">{algorithm === "astar" ? "O(E) with Manhattan" : "O(V²)"}</p>
        </Card>
      </div>

      {/* Grid Canvas */}
      <div className="border border-border/70 rounded-xl p-4 bg-slate-950 overflow-x-auto shadow-sm">
        <div
          className="grid gap-[2px] mx-auto select-none"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(18px, 1fr))`,
            maxWidth: "880px",
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === DEFAULT_START.row && c === DEFAULT_START.col;
              const isTarget = r === DEFAULT_TARGET.row && c === DEFAULT_TARGET.col;
              const isWall = cell.isWall;
              const key = `${r},${c}`;
              const isPath = pathSet.has(key);
              const isVisited = visitedSet.has(key);

              let bgClass = "bg-slate-900/80 border border-slate-800/60";
              if (isWall) bgClass = "bg-slate-700 border-slate-600 scale-95";
              else if (isStart) bgClass = "bg-emerald-500 border-emerald-400 text-white shadow-sm";
              else if (isTarget) bgClass = "bg-rose-500 border-rose-400 text-white shadow-sm";
              else if (isPath) bgClass = "bg-amber-400 border-amber-300 scale-105 shadow-sm transition-all duration-150";
              else if (isVisited) bgClass = "bg-primary/50 border-primary/40 transition-colors duration-200";

              return (
                <div
                  key={key}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  className={`aspect-square rounded-sm flex items-center justify-center cursor-pointer transition-transform ${bgClass}`}
                  title={`(${r}, ${c})`}
                >
                  {isStart && <Navigation className="w-3 h-3 text-slate-950 fill-current" />}
                  {isTarget && <MapPin className="w-3 h-3 text-white fill-current" />}
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
            <span>Start Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
            <span>Target Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-slate-700"></div>
            <span>Wall / Obstacle (Click & drag to draw)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/50"></div>
            <span>Visited Cell</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-400"></div>
            <span>Shortest Path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
