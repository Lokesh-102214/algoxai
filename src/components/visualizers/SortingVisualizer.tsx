import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Shuffle, Share2, Download, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  type SortingStep,
} from "@/lib/algorithms/sorting";

function parseArrayString(raw: string | null): number[] | null {
  if (!raw) return null;
  try {
    const nums = raw
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && Number.isFinite(n) && n > 0);
    return nums.length >= 2 ? nums : null;
  } catch {
    return null;
  }
}

const SortingVisualizer = () => {
  const initialData = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = parseArrayString(params.get("input"));
    const algoParam = params.get("algo");
    return {
      arr: parsed || Array.from({ length: 20 }, () => Math.floor(Math.random() * 280) + 15),
      algo: algoParam === "selection" || algoParam === "insertion" ? algoParam : "bubble",
    };
  }, []);

  const [array, setArray] = useState<number[]>(initialData.arr);
  const [customInput, setCustomInput] = useState<string>(initialData.arr.join(", "));
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<string>(initialData.algo);
  const [speed, setSpeed] = useState(80);
  const [arraySize, setArraySize] = useState(initialData.arr.length);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [stepDescription, setStepDescription] = useState<string>("Ready to sort. Adjust parameters or start visualization.");
  const [lastTrace, setLastTrace] = useState<SortingStep[]>([]);

  // Generate random array
  const generateArray = () => {
    if (sorting) return;
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 280) + 15
    );
    setArray(newArray);
    setCustomInput(newArray.join(", "));
    setCurrentIndices([]);
    setSortedIndices([]);
    setStepDescription("New random array generated.");
  };

  const applyCustomArray = () => {
    if (sorting) return;
    const parsed = parseArrayString(customInput);
    if (!parsed || parsed.length < 2) {
      toast.error("Please enter at least 2 positive numbers separated by commas.");
      return;
    }
    setArray(parsed);
    setArraySize(parsed.length);
    setCurrentIndices([]);
    setSortedIndices([]);
    setStepDescription(`Custom array loaded with ${parsed.length} elements.`);
    toast.success("Custom array applied successfully!");
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Bubble Sort Algorithm
  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndices([j, j + 1]);
        setStepDescription(`Comparing [${j}] (${arr[j]}) and [${j + 1}] (${arr[j + 1]})`);
        await delay(501 - speed);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setStepDescription(`Swapped [${j}] and [${j + 1}]`);
        }
      }
      setSortedIndices((prev) => [...prev, n - 1 - i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setCurrentIndices([]);
    setStepDescription("Bubble sort complete: array is fully sorted in O(n²) time.");
  };

  // Selection Sort Algorithm
  const selectionSort = async () => {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentIndices([i]);

      for (let j = i + 1; j < n; j++) {
        setCurrentIndices([i, j, minIdx]);
        setStepDescription(`Checking candidate minimum at index ${j} (${arr[j]}) vs current minimum (${arr[minIdx]})`);
        await delay(501 - speed);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        setStepDescription(`Placed minimum value ${arr[i]} into sorted position index ${i}`);
      }

      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setCurrentIndices([]);
    setStepDescription("Selection sort complete: array is fully sorted.");
  };

  // Insertion Sort Algorithm
  const insertionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([0]);

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      setCurrentIndices([i]);
      setStepDescription(`Selected key element ${key} at index ${i}`);
      await delay(501 - speed);

      while (j >= 0 && arr[j] > key) {
        setCurrentIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setStepDescription(`Shifted element ${arr[j]} rightward to position ${j + 1}`);
        await delay(501 - speed);
        j--;
      }

      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices((prev) => [...prev, i]);
      setStepDescription(`Inserted key ${key} into correct position ${j + 1}`);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setCurrentIndices([]);
    setStepDescription("Insertion sort complete.");
  };

  const startSorting = async () => {
    if (sorting) return;

    // Cache pure algorithm trace for export
    let trace: SortingStep[] = [];
    if (algorithm === "bubble") trace = bubbleSortSteps(array);
    else if (algorithm === "selection") trace = selectionSortSteps(array);
    else if (algorithm === "insertion") trace = insertionSortSteps(array);
    setLastTrace(trace);

    setSorting(true);
    setSortedIndices([]);
    setCurrentIndices([]);

    try {
      switch (algorithm) {
        case "bubble":
          await bubbleSort();
          break;
        case "selection":
          await selectionSort();
          break;
        case "insertion":
          await insertionSort();
          break;
        default:
          await bubbleSort();
      }
      toast.success(`${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} sort completed!`);
    } catch {
      toast.error("Sorting interrupted");
    } finally {
      setSorting(false);
    }
  };

  const resetArray = () => {
    setSorting(false);
    setSortedIndices([]);
    setCurrentIndices([]);
    setStepDescription("Array reset to initial state.");
  };

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", "sorting");
    url.searchParams.set("algo", algorithm);
    url.searchParams.set("input", array.join(","));
    navigator.clipboard.writeText(url.toString());
    toast.success("Shareable URL permalink copied to clipboard!");
  };

  const exportTraceJson = () => {
    let trace = lastTrace;
    if (trace.length === 0) {
      if (algorithm === "bubble") trace = bubbleSortSteps(array);
      else if (algorithm === "selection") trace = selectionSortSteps(array);
      else if (algorithm === "insertion") trace = insertionSortSteps(array);
    }

    const exportData = {
      engine: "algoxai-sorting",
      algorithm,
      initialArray: array,
      stepCount: trace.length,
      trace: trace.map((s, i) => ({
        step: i + 1,
        type: s.type,
        indices: s.indices,
        description: s.description,
        snapshot: s.snapshot,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `algoxai-${algorithm}-sort-trace.json`;
    link.click();
    toast.success("Sorting step trace exported as JSON!");
  };

  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "bg-emerald-500";
    }
    if (currentIndices.includes(index)) {
      return "bg-amber-500";
    }
    return "bg-primary/80 hover:bg-primary";
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap gap-4 items-end justify-between bg-card p-4 rounded-xl border border-border/70">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm} disabled={sorting}>
              <SelectTrigger className="w-40 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="bubble">Bubble Sort</SelectItem>
                <SelectItem value="selection">Selection Sort</SelectItem>
                <SelectItem value="insertion">Insertion Sort</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Array Size: {array.length}</Label>
            <Input
              type="range"
              min="8"
              max="40"
              value={arraySize}
              onChange={(e) => {
                const s = Number(e.target.value);
                setArraySize(s);
                const newArray = Array.from({ length: s }, () => Math.floor(Math.random() * 280) + 15);
                setArray(newArray);
                setCustomInput(newArray.join(", "));
              }}
              disabled={sorting}
              className="w-28 accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Speed: {speed}ms</Label>
            <Input
              type="range"
              min="10"
              max="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-28 accent-primary"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={startSorting} disabled={sorting} className="px-5 shadow-sm">
              <Play className="w-4 h-4 mr-2" />
              Start Sort
            </Button>
            <Button onClick={resetArray} variant="outline" disabled={sorting} className="border-border">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={generateArray} variant="outline" disabled={sorting} className="border-border">
              <Shuffle className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
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
        <span className="font-medium text-muted-foreground">Custom Array:</span>
        <Input
          className="flex-1 min-w-[200px] h-8 text-xs bg-card border-border"
          placeholder="Comma-separated numbers, e.g. 54, 26, 93, 17, 77, 31, 44"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          disabled={sorting}
        />
        <Button onClick={applyCustomArray} disabled={sorting} size="sm" variant="secondary" className="h-8 text-xs">
          <RefreshCw className="mr-1.5 h-3 w-3" /> Apply Array
        </Button>
      </div>

      {/* Visualization Area */}
      <div className="border border-border/70 rounded-xl p-6 bg-card min-h-96 shadow-sm">
        <div className="flex items-end justify-center space-x-1 h-80">
          {array.map((value, index) => {
            const maxVal = Math.max(...array, 1);
            return (
              <div
                key={index}
                className={`transition-all duration-150 rounded-t-sm shadow-none ${getBarColor(index)}`}
                style={{
                  height: `${(value / maxVal) * 270}px`,
                  width: `${Math.max(800 / array.length - 3, 6)}px`,
                }}
                title={`Index: ${index}, Value: ${value}`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-8 mt-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary/80 rounded-sm"></div>
            <span className="font-medium text-muted-foreground">Unsorted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
            <span className="font-medium text-muted-foreground">Comparing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span className="font-medium text-muted-foreground">Sorted</span>
          </div>
        </div>
      </div>

      {/* Step Log Box */}
      <Card className="flex items-center gap-3 p-3.5 bg-card border-border/70 text-sm">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-foreground text-xs sm:text-sm font-mono truncate">{stepDescription}</p>
      </Card>

      {/* Algorithm Theoretical Complexity */}
      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 bg-card border border-border/70 rounded-lg">
          <h4 className="font-semibold mb-1 text-foreground">Time Complexity</h4>
          <p className="text-muted-foreground">
            {algorithm === "bubble" && "O(n²) average/worst, O(n) best"}
            {algorithm === "selection" && "O(n²) all cases"}
            {algorithm === "insertion" && "O(n²) average/worst, O(n) best"}
          </p>
        </div>
        <div className="p-3 bg-card border border-border/70 rounded-lg">
          <h4 className="font-semibold mb-1 text-foreground">Space Complexity</h4>
          <p className="text-muted-foreground">O(1) Auxiliary - In-place comparison</p>
        </div>
        <div className="p-3 bg-card border border-border/70 rounded-lg">
          <h4 className="font-semibold mb-1 text-foreground">Stability & Reusability</h4>
          <p className="text-muted-foreground">
            {algorithm === "bubble" && "Stable · Pure engine available via algoxai"}
            {algorithm === "selection" && "Not stable · Pure engine available via algoxai"}
            {algorithm === "insertion" && "Stable · Pure engine available via algoxai"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
