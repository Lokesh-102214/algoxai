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

  // Get bar color based on state
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "bg-green-500"; // Sorted
    }
    if (currentIndices.includes(index)) {
      return "bg-red-500"; // Currently comparing
    }
    return "bg-primary"; // Default
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm} disabled={sorting}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Array Size: {arraySize}</Label>
          <Input
            type="range"
            min="10"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={sorting}
            className="w-32"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Speed: {speed}ms</Label>
          <Input
            type="range"
            min="10"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={startSorting}
            disabled={sorting}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Sort
          </Button>
          
          <Button 
            onClick={resetArray}
            variant="outline"
            disabled={sorting}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            onClick={generateArray}
            variant="outline"
            disabled={sorting}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="border rounded-lg p-4 bg-muted/20 min-h-96">
        <div className="flex items-end justify-center space-x-1 h-80">
          {array.map((value, index) => (
            <div
              key={index}
              className={`transition-all duration-200 ${getBarColor(index)} rounded-t-sm`}
              style={{
                height: `${(value / Math.max(...array)) * 280}px`,
                width: `${Math.max(800 / array.length - 2, 8)}px`,
              }}
              title={`Value: ${value}, Index: ${index}`}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span>Unsorted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Sorted</span>
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