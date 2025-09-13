import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw, Pause } from "lucide-react";
import { toast } from "sonner";

interface Disk {
  id: number;
  size: number;
}

type Tower = Disk[];

const TowerOfHanoi = () => {
  const [towers, setTowers] = useState<[Tower, Tower, Tower]>([[], [], []]);
  const [numDisks, setNumDisks] = useState(3);
  const [moves, setMoves] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [solution, setSolution] = useState<Array<{from: number, to: number}>>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [speed, setSpeed] = useState(500);

  // Initialize towers
  const initializeTowers = () => {
    const firstTower: Tower = [];
    for (let i = numDisks; i >= 1; i--) {
      firstTower.push({ id: i, size: i });
    }
    setTowers([firstTower, [], []]);
    setMoves(0);
    setSolution([]);
    setCurrentMoveIndex(0);
  };

  // Generate solution using recursive algorithm
  const generateSolution = (n: number, from: number, to: number, aux: number): Array<{from: number, to: number}> => {
    if (n === 1) {
      return [{ from, to }];
    }
    
    const moves: Array<{from: number, to: number}> = [];
    
    // Move n-1 disks from source to auxiliary
    moves.push(...generateSolution(n - 1, from, aux, to));
    
    // Move the largest disk from source to destination
    moves.push({ from, to });
    
    // Move n-1 disks from auxiliary to destination
    moves.push(...generateSolution(n - 1, aux, to, from));
    
    return moves;
  };

  // Execute a single move
  const executeMove = (from: number, to: number) => {
    setTowers(prevTowers => {
      const newTowers: [Tower, Tower, Tower] = [
        [...prevTowers[0]],
        [...prevTowers[1]], 
        [...prevTowers[2]]
      ];
      
      const disk = newTowers[from].pop();
      if (disk) {
        newTowers[to].push(disk);
      }
      
      return newTowers;
    });
    setMoves(prev => prev + 1);
  };

  // Delay function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Solve the puzzle
  const solvePuzzle = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    
    // Generate the complete solution
    const moves = generateSolution(numDisks, 0, 2, 1);
    setSolution(moves);
    
    try {
      for (let i = 0; i < moves.length; i++) {
        if (isPaused) {
          // Wait for unpause
          while (isPaused) {
            await delay(100);
          }
        }
        
        setCurrentMoveIndex(i);
        executeMove(moves[i].from, moves[i].to);
        await delay(1001 - speed);
      }
      
      toast.success(`Puzzle solved in ${moves.length} moves! (Optimal solution)`);
    } catch (error) {
      toast.error("Solution interrupted");
    } finally {
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  // Pause/Resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Reset puzzle
  const resetPuzzle = () => {
    setIsRunning(false);
    setIsPaused(false);
    initializeTowers();
  };

  // Initialize on component mount and when number of disks changes
  useEffect(() => {
    initializeTowers();
  }, [numDisks]);

  // Calculate minimum moves required
  const minMoves = Math.pow(2, numDisks) - 1;

  // Get disk color based on size
  const getDiskColor = (size: number) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500', 
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    return colors[(size - 1) % colors.length];
  };

  // Get disk width based on size
  const getDiskWidth = (size: number) => {
    const baseWidth = 40;
    return baseWidth + (size * 20);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Number of Disks: {numDisks}</Label>
          <Input
            type="range"
            min="3"
            max="8"
            value={numDisks}
            onChange={(e) => setNumDisks(Number(e.target.value))}
            disabled={isRunning}
            className="w-32"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Speed: {speed}ms</Label>
          <Input
            type="range"
            min="100"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
        
        <div className="flex space-x-2">
          {!isRunning ? (
            <Button 
              onClick={solvePuzzle}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Play className="w-4 h-4 mr-2" />
              Solve
            </Button>
          ) : (
            <Button onClick={togglePause} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          
          <Button 
            onClick={resetPuzzle}
            variant="outline"
            disabled={isRunning && !isPaused}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{moves}</div>
          <div className="text-sm text-muted-foreground">Current Moves</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{minMoves}</div>
          <div className="text-sm text-muted-foreground">Minimum Moves</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{numDisks}</div>
          <div className="text-sm text-muted-foreground">Number of Disks</div>
        </Card>
      </div>

      {/* Towers Visualization */}
      <div className="border rounded-lg p-8 bg-muted/20 min-h-96">
        <div className="flex justify-center items-end space-x-16 h-80">
          {towers.map((tower, towerIndex) => (
            <div key={towerIndex} className="flex flex-col items-center">
              {/* Tower label */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  {towerIndex === 0 ? 'Source' : towerIndex === 1 ? 'Auxiliary' : 'Destination'}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Tower {String.fromCharCode(65 + towerIndex)}
                </div>
              </div>
              
              {/* Tower structure */}
              <div className="relative flex flex-col-reverse items-center">
                {/* Base */}
                <div className="w-60 h-4 bg-gray-600 rounded-sm mb-2"></div>
                
                {/* Rod */}
                <div className="absolute bottom-6 w-2 bg-gray-700 rounded-sm" style={{ height: '250px' }}></div>
                
                {/* Disks */}
                <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 mb-6">
                  {tower.map((disk, diskIndex) => (
                    <div
                      key={disk.id}
                      className={`h-6 rounded-sm ${getDiskColor(disk.size)} border-2 border-gray-700 flex items-center justify-center text-white text-sm font-bold transition-all duration-300`}
                      style={{ 
                        width: `${getDiskWidth(disk.size)}px`,
                        zIndex: diskIndex + 1
                      }}
                    >
                      {disk.id}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Move Info */}
      {isRunning && solution.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Current Move: {currentMoveIndex + 1} / {solution.length}</h4>
              {solution[currentMoveIndex] && (
                <p className="text-sm text-muted-foreground">
                  Moving disk from Tower {String.fromCharCode(65 + solution[currentMoveIndex].from)} to Tower {String.fromCharCode(65 + solution[currentMoveIndex].to)}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-lg font-semibold">
                {Math.round((currentMoveIndex / solution.length) * 100)}%
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Algorithm Explanation */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold mb-3">🗼 Tower of Hanoi Algorithm</h3>
        <div className="text-sm space-y-2">
          <p><strong>Objective:</strong> Move all disks from the source tower to the destination tower.</p>
          <p><strong>Rules:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Only one disk can be moved at a time</li>
            <li>A disk can only be placed on top of a larger disk</li>
            <li>All disks start on the source tower in descending order</li>
          </ul>
          <p><strong>Minimum moves:</strong> 2ⁿ - 1 (where n is the number of disks)</p>
        </div>
      </Card>
    </div>
  );
};

export default TowerOfHanoi;