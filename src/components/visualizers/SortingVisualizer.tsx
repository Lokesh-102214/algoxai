import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { toast } from "sonner";

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  // Generate random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setCurrentIndices([]);
    setSortedIndices([]);
  };

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Delay function for visualization
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Bubble Sort Algorithm
  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndices([j, j + 1]);
        await delay(501 - speed);
        
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSortedIndices(prev => [...prev, n - 1 - i]);
    }
    setSortedIndices(prev => [...prev, 0]);
    setCurrentIndices([]);
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
        await delay(501 - speed);
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
      }
      
      setSortedIndices(prev => [...prev, i]);
    }
    setSortedIndices(prev => [...prev, n - 1]);
    setCurrentIndices([]);
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
      await delay(501 - speed);
      
      while (j >= 0 && arr[j] > key) {
        setCurrentIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await delay(501 - speed);
        j--;
      }
      
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(prev => [...prev, i]);
    }
    setCurrentIndices([]);
  };

  // Start sorting based on selected algorithm
  const startSorting = async () => {
    if (sorting) return;
    
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
    } catch (error) {
      toast.error("Sorting interrupted");
    } finally {
      setSorting(false);
    }
  };

  // Reset array and state
  const resetArray = () => {
    setSorting(false);
    generateArray();
  };

  // Get bar color based on state with enhanced styling
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "bg-secondary shadow-[var(--shadow-glow-secondary)]"; // Sorted - Neon Green
    }
    if (currentIndices.includes(index)) {
      return "bg-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.5)]"; // Currently comparing - Bright Red
    }
    return "bg-primary shadow-[var(--shadow-glow-primary)]"; // Default - Bright Cyan
  };

  return (
    <div className="space-y-6">
        {/* Enhanced Controls with animations */}
        <div className="flex flex-wrap gap-4 items-end animate-fade-in-up">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm} disabled={sorting}>
              <SelectTrigger className="w-40 bg-card border-border hover:border-primary/50 transition-[var(--transition-smooth)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="bubble">Bubble Sort</SelectItem>
                <SelectItem value="selection">Selection Sort</SelectItem>
                <SelectItem value="insertion">Insertion Sort</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Array Size: {arraySize}</Label>
            <Input
              type="range"
              min="10"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={sorting}
              className="w-32 accent-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Speed: {speed}ms</Label>
            <Input
              type="range"
              min="10"
              max="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-32 accent-primary"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={startSorting}
              disabled={sorting}
              className="bg-[var(--gradient-primary)] text-primary-foreground px-6
                         shadow-[var(--shadow-glow-primary)] hover:shadow-[var(--shadow-glow-secondary)]
                         transition-[var(--transition-bounce)] hover:scale-105 btn-glow"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Sort
            </Button>
            
            <Button 
              onClick={resetArray}
              variant="outline"
              disabled={sorting}
              className="border-border hover:border-primary/50 hover:bg-primary/10 
                         transition-[var(--transition-smooth)] hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button 
              onClick={generateArray}
              variant="outline"
              disabled={sorting}
              className="border-border hover:border-secondary/50 hover:bg-secondary/10 
                         transition-[var(--transition-smooth)] hover:scale-105"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

      {/* Enhanced Visualization Area */}
      <div className="glow-border rounded-2xl p-6 bg-[var(--gradient-card)] min-h-96 
                      shadow-[var(--shadow-card)] animate-fade-in-up">
        <div className="flex items-end justify-center space-x-1 h-80">
          {array.map((value, index) => (
            <div
              key={index}
              className={`transition-all duration-300 rounded-t-lg shadow-sm 
                         ${getBarColor(index)} 
                         ${sorting ? 'animate-pulse-slow' : 'hover:scale-105'}
                         ${currentIndices.includes(index) ? 'animate-pulse-code' : ''}`}
              style={{
                height: `${(value / Math.max(...array)) * 280}px`,
                width: `${Math.max(800 / array.length - 2, 8)}px`,
                animationDelay: `${index * 0.05}s`,
              }}
              title={`Value: ${value}, Index: ${index}`}
            />
          ))}
        </div>
        
        {/* Enhanced Legend */}
        <div className="flex justify-center space-x-8 mt-6 text-sm">
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] hover:scale-105">
            <div className="w-4 h-4 bg-primary rounded shadow-[var(--shadow-glow-primary)]"></div>
            <span className="font-medium">Unsorted</span>
          </div>
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] hover:scale-105">
            <div className="w-4 h-4 bg-destructive rounded shadow-[0_0_10px_hsl(var(--destructive)/0.4)]"></div>
            <span className="font-medium">Comparing</span>
          </div>
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] hover:scale-105">
            <div className="w-4 h-4 bg-secondary rounded shadow-[var(--shadow-glow-secondary)]"></div>
            <span className="font-medium">Sorted</span>
          </div>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-semibold mb-1">Time Complexity</h4>
          <p className="text-muted-foreground">
            {algorithm === "bubble" && "O(n²) average/worst, O(n) best"}
            {algorithm === "selection" && "O(n²) all cases"}
            {algorithm === "insertion" && "O(n²) average/worst, O(n) best"}
          </p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-semibold mb-1">Space Complexity</h4>
          <p className="text-muted-foreground">O(1) - In-place sorting</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-semibold mb-1">Stability</h4>
          <p className="text-muted-foreground">
            {algorithm === "bubble" && "Stable"}
            {algorithm === "selection" && "Not stable"}
            {algorithm === "insertion" && "Stable"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;