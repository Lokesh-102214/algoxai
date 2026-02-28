import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CodeEditor from "../components/CodeEditor";
import AICodePanel from "../components/AICodePanel";
import { ArrowLeft, BookOpen, Code2, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

const AlgorithmPage = () => {
  const { topic } = useParams<{ topic: string }>();
  
  // Sample algorithm data - in real app, this would come from API/database
  const algorithmData = {
    "dynamic-programming": {
      title: "Dynamic Programming",
      difficulty: "Hard",
      description: "Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable to problems exhibiting the properties of overlapping subproblems and optimal substructure.",
      concepts: [
        "Memoization - Top-down approach",
        "Tabulation - Bottom-up approach", 
        "Optimal Substructure Property",
        "Overlapping Subproblems"
      ],
      examples: [
        {
          title: "Fibonacci Sequence (Memoized)",
          code: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
private:
    vector<int> memo;
    
public:
    int fibonacci(int n) {
        if (n <= 1) return n;
        
        if (memo.size() <= n) {
            memo.resize(n + 1, -1);
        }
        
        if (memo[n] != -1) {
            return memo[n];
        }
        
        memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
        return memo[n];
    }
};

int main() {
    Solution sol;
    int n = 10;
    cout << "Fibonacci(" << n << ") = " << sol.fibonacci(n) << endl;
    return 0;
}`,
          explanation: "This example demonstrates memoization by storing previously computed Fibonacci numbers to avoid redundant calculations."
        },
        {
          title: "0/1 Knapsack Problem",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class KnapsackSolver {
public:
    int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
        int n = weights.size();
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
        
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i-1] <= w) {
                    dp[i][w] = max(
                        values[i-1] + dp[i-1][w - weights[i-1]],
                        dp[i-1][w]
                    );
                } else {
                    dp[i][w] = dp[i-1][w];
                }
            }
        }
        
        return dp[n][capacity];
    }
};

int main() {
    vector<int> weights = {10, 20, 30};
    vector<int> values = {60, 100, 120};
    int capacity = 50;
    
    KnapsackSolver solver;
    cout << "Maximum value: " << solver.knapsack(weights, values, capacity) << endl;
    return 0;
}`,
          explanation: "The 0/1 Knapsack problem showcases how DP can find optimal solutions by considering all possible combinations efficiently."
        }
      ]
    },
    "graph-algorithms": {
      title: "Graph Algorithms",
      difficulty: "Medium",
      description: "Graph algorithms are used to solve problems on graphs, which are data structures consisting of vertices (nodes) connected by edges. These algorithms are fundamental in computer science.",
      concepts: [
        "Graph Representation (Adjacency List/Matrix)",
        "Breadth-First Search (BFS)",
        "Depth-First Search (DFS)",
        "Shortest Path Algorithms (Dijkstra, Floyd-Warshall)"
      ],
      examples: [
        {
          title: "BFS Traversal",
          code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u); // For undirected graph
    }
    
    void BFS(int start) {
        vector<bool> visited(vertices, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        cout << "BFS Traversal: ";
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            cout << current << " ";
            
            for (int neighbor : adjList[current]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl;
    }
};

int main() {
    Graph g(6);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    g.addEdge(2, 4);
    g.addEdge(3, 5);
    
    g.BFS(0);
    return 0;
}`,
          explanation: "BFS explores graph level by level, making it perfect for finding shortest paths in unweighted graphs."
        }
      ]
    },
    "greedy-algorithms": {
      title: "Greedy Algorithms",
      difficulty: "Medium",
      description: "Greedy algorithms make the locally optimal choice at each step, hoping to find a global optimum. They are simple and efficient but don't always guarantee the optimal solution.",
      concepts: [
        "Greedy Choice Property",
        "Optimal Substructure",
        "Activity Selection Problem",
        "Minimum Spanning Tree (Kruskal's, Prim's)"
      ],
      examples: [
        {
          title: "Activity Selection Problem",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity {
    int start, finish, index;
};

bool compareActivities(Activity a, Activity b) {
    return a.finish < b.finish;
}

class ActivitySelector {
public:
    vector<int> selectActivities(vector<Activity>& activities) {
        vector<int> selected;
        
        // Sort activities by finish time
        sort(activities.begin(), activities.end(), compareActivities);
        
        // First activity is always selected
        selected.push_back(activities[0].index);
        int lastSelected = 0;
        
        // Consider remaining activities
        for (int i = 1; i < activities.size(); i++) {
            if (activities[i].start >= activities[lastSelected].finish) {
                selected.push_back(activities[i].index);
                lastSelected = i;
            }
        }
        
        return selected;
    }
};

int main() {
    vector<Activity> activities = {
        {1, 4, 0}, {3, 5, 1}, {0, 6, 2},
        {5, 7, 3}, {3, 9, 4}, {5, 9, 5},
        {6, 10, 6}, {8, 11, 7}, {8, 12, 8},
        {2, 14, 9}, {12, 16, 10}
    };
    
    ActivitySelector selector;
    vector<int> selected = selector.selectActivities(activities);
    
    cout << "Selected activities: ";
    for (int idx : selected) {
        cout << idx << " ";
    }
    cout << endl;
    
    return 0;
}`,
          explanation: "The greedy approach selects activities that finish earliest, maximizing the number of non-overlapping activities."
        },
        {
          title: "Coin Change (Greedy)",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class CoinChanger {
public:
    vector<int> makeChange(vector<int>& coins, int amount) {
        vector<int> result;
        
        // Sort coins in descending order
        sort(coins.begin(), coins.end(), greater<int>());
        
        for (int coin : coins) {
            while (amount >= coin) {
                result.push_back(coin);
                amount -= coin;
            }
        }
        
        return result;
    }
    
    int minCoins(vector<int>& coins, int amount) {
        sort(coins.begin(), coins.end(), greater<int>());
        int count = 0;
        
        for (int coin : coins) {
            count += amount / coin;
            amount %= coin;
        }
        
        return amount == 0 ? count : -1;
    }
};

int main() {
    vector<int> coins = {25, 10, 5, 1}; // US coins
    int amount = 67;
    
    CoinChanger changer;
    vector<int> change = changer.makeChange(coins, amount);
    
    cout << "Change for " << amount << " cents: ";
    for (int coin : change) {
        cout << coin << " ";
    }
    cout << endl;
    
    cout << "Minimum coins needed: " << changer.minCoins(coins, amount) << endl;
    
    return 0;
}`,
          explanation: "Greedy coin change works optimally for canonical coin systems by always choosing the largest possible denomination."
        }
      ]
    },
    "binary-search": {
      title: "Binary Search",
      difficulty: "Easy",
      description: "Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing the search interval in half and eliminating half of the remaining elements.",
      concepts: [
        "Divide and Conquer Strategy",
        "Logarithmic Time Complexity O(log n)",
        "Iterative vs Recursive Implementation",
        "Binary Search on Answer Space"
      ],
      examples: [
        {
          title: "Classic Binary Search",
          code: `#include <iostream>
#include <vector>
using namespace std;

class BinarySearch {
public:
    // Iterative Binary Search
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Not found
    }
    
    // Recursive Binary Search
    int searchRecursive(vector<int>& nums, int target, int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            return searchRecursive(nums, target, mid + 1, right);
        } else {
            return searchRecursive(nums, target, left, mid - 1);
        }
    }
    
    // Find first occurrence
    int findFirst(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        int result = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                result = mid;
                right = mid - 1; // Continue searching left
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
};

int main() {
    vector<int> nums = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 7;
    
    BinarySearch bs;
    
    int index = bs.search(nums, target);
    cout << "Iterative search: " << target << " found at index " << index << endl;
    
    index = bs.searchRecursive(nums, target, 0, nums.size() - 1);
    cout << "Recursive search: " << target << " found at index " << index << endl;
    
    // Test with duplicates
    vector<int> duplicates = {1, 2, 2, 2, 3, 4, 5};
    int firstOccurrence = bs.findFirst(duplicates, 2);
    cout << "First occurrence of 2: index " << firstOccurrence << endl;
    
    return 0;
}`,
          explanation: "Binary search efficiently finds elements in sorted arrays by repeatedly halving the search space."
        },
        {
          title: "Binary Search on Answer",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class BinarySearchOnAnswer {
public:
    // Find minimum capacity of painter to paint all boards
    bool canPaint(vector<int>& boards, int painters, int maxTime) {
        int currentPainter = 1;
        int currentTime = 0;
        
        for (int board : boards) {
            if (board > maxTime) return false;
            
            if (currentTime + board <= maxTime) {
                currentTime += board;
            } else {
                currentPainter++;
                currentTime = board;
                if (currentPainter > painters) return false;
            }
        }
        
        return true;
    }
    
    int findMinTime(vector<int>& boards, int painters) {
        int left = *max_element(boards.begin(), boards.end());
        int right = 0;
        for (int board : boards) right += board;
        
        int result = right;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (canPaint(boards, painters, mid)) {
                result = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        return result;
    }
    
    // Square root using binary search
    int sqrt(int x) {
        if (x == 0) return 0;
        
        int left = 1, right = x;
        int result = 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (mid <= x / mid) { // Avoid overflow
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
};

int main() {
    BinarySearchOnAnswer bsoa;
    
    // Painter problem
    vector<int> boards = {10, 20, 30, 40};
    int painters = 2;
    cout << "Minimum time for " << painters << " painters: " 
         << bsoa.findMinTime(boards, painters) << endl;
    
    // Square root
    int number = 25;
    cout << "Square root of " << number << ": " << bsoa.sqrt(number) << endl;
    
    return 0;
}`,
          explanation: "Binary search on answer space finds optimal solutions by searching through possible answer values."
        }
      ]
    },
    "sorting-algorithms": {
      title: "Sorting Algorithms",
      difficulty: "Easy",
      description: "Sorting algorithms arrange elements in a specific order (ascending or descending). Different algorithms have different time and space complexities, making them suitable for different scenarios.",
      concepts: [
        "Comparison-based vs Non-comparison sorting",
        "Stable vs Unstable sorting",
        "In-place vs Out-of-place sorting",
        "Time Complexity Analysis: O(n²), O(n log n), O(n)"
      ],
      examples: [
        {
          title: "Quick Sort",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class QuickSort {
public:
    void quickSort(vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
private:
    int partition(vector<int>& arr, int low, int high) {
        int pivot = arr[high]; // Choose last element as pivot
        int i = low - 1; // Index of smaller element
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }
};

class MergeSort {
public:
    void mergeSort(vector<int>& arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
private:
    void merge(vector<int>& arr, int left, int mid, int right) {
        vector<int> temp(right - left + 1);
        int i = left, j = mid + 1, k = 0;
        
        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }
        
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        
        for (i = left, k = 0; i <= right; i++, k++) {
            arr[i] = temp[k];
        }
    }
};

void printArray(const vector<int>& arr) {
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

int main() {
    vector<int> arr1 = {64, 34, 25, 12, 22, 11, 90};
    vector<int> arr2 = arr1;
    
    cout << "Original array: ";
    printArray(arr1);
    
    QuickSort qs;
    qs.quickSort(arr1, 0, arr1.size() - 1);
    cout << "Quick sorted: ";
    printArray(arr1);
    
    MergeSort ms;
    ms.mergeSort(arr2, 0, arr2.size() - 1);
    cout << "Merge sorted: ";
    printArray(arr2);
    
    return 0;
}`,
          explanation: "Quick Sort and Merge Sort are efficient divide-and-conquer algorithms with O(n log n) average time complexity."
        },
        {
          title: "Heap Sort & Counting Sort",
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class HeapSort {
public:
    void heapSort(vector<int>& arr) {
        int n = arr.size();
        
        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        
        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            swap(arr[0], arr[i]);
            heapify(arr, i, 0);
        }
    }
    
private:
    void heapify(vector<int>& arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        
        if (largest != i) {
            swap(arr[i], arr[largest]);
            heapify(arr, n, largest);
        }
    }
};

class CountingSort {
public:
    void countingSort(vector<int>& arr) {
        if (arr.empty()) return;
        
        int maxVal = *max_element(arr.begin(), arr.end());
        int minVal = *min_element(arr.begin(), arr.end());
        int range = maxVal - minVal + 1;
        
        vector<int> count(range, 0);
        vector<int> output(arr.size());
        
        // Count occurrences
        for (int num : arr) {
            count[num - minVal]++;
        }
        
        // Cumulative count
        for (int i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array
        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[arr[i] - minVal] - 1] = arr[i];
            count[arr[i] - minVal]--;
        }
        
        // Copy output back to original array
        for (int i = 0; i < arr.size(); i++) {
            arr[i] = output[i];
        }
    }
};

void printArray(const vector<int>& arr) {
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;
}

int main() {
    vector<int> arr1 = {64, 34, 25, 12, 22, 11, 90};
    vector<int> arr2 = {4, 2, 2, 8, 3, 3, 1};
    
    cout << "Heap Sort:" << endl;
    cout << "Original: ";
    printArray(arr1);
    
    HeapSort hs;
    hs.heapSort(arr1);
    cout << "Sorted: ";
    printArray(arr1);
    
    cout << "\nCounting Sort:" << endl;
    cout << "Original: ";
    printArray(arr2);
    
    CountingSort cs;
    cs.countingSort(arr2);
    cout << "Sorted: ";
    printArray(arr2);
    
    return 0;
}`,
          explanation: "Heap Sort uses a binary heap structure, while Counting Sort is a non-comparison algorithm efficient for limited range integers."
        }
      ]
    },
    "backtracking": {
      title: "Backtracking",
      difficulty: "Hard",
      description: "Backtracking is a systematic method for solving problems by exploring all possible solutions and abandoning paths that cannot lead to a valid solution. It's like a depth-first search with pruning.",
      concepts: [
        "Recursive Problem Solving",
        "State Space Tree Exploration",
        "Pruning Invalid Branches",
        "Constraint Satisfaction Problems"
      ],
      examples: [
        {
          title: "N-Queens Problem",
          code: `#include <iostream>
#include <vector>
using namespace std;

class NQueens {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> solutions;
        vector<string> board(n, string(n, '.'));
        vector<bool> cols(n, false);
        vector<bool> diag1(2 * n - 1, false);
        vector<bool> diag2(2 * n - 1, false);
        
        backtrack(0, n, board, cols, diag1, diag2, solutions);
        return solutions;
    }
    
private:
    void backtrack(int row, int n, vector<string>& board,
                   vector<bool>& cols, vector<bool>& diag1, vector<bool>& diag2,
                   vector<vector<string>>& solutions) {
        if (row == n) {
            solutions.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1;
            int d2 = row + col;
            
            if (cols[col] || diag1[d1] || diag2[d2]) continue;
            
            // Place queen
            board[row][col] = 'Q';
            cols[col] = diag1[d1] = diag2[d2] = true;
            
            backtrack(row + 1, n, board, cols, diag1, diag2, solutions);
            
            // Remove queen (backtrack)
            board[row][col] = '.';
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }
};

void printSolution(const vector<string>& board) {
    for (const string& row : board) {
        cout << row << endl;
    }
    cout << endl;
}

int main() {
    NQueens nq;
    int n = 4;
    
    vector<vector<string>> solutions = nq.solveNQueens(n);
    
    cout << "Solutions for " << n << "-Queens problem:" << endl;
    for (int i = 0; i < solutions.size(); i++) {
        cout << "Solution " << i + 1 << ":" << endl;
        printSolution(solutions[i]);
    }
    
    cout << "Total solutions: " << solutions.size() << endl;
    
    return 0;
}`,
          explanation: "N-Queens demonstrates backtracking by placing queens one by one and backtracking when conflicts are detected."
        },
        {
          title: "Sudoku Solver",
          code: `#include <iostream>
#include <vector>
using namespace std;

class SudokuSolver {
public:
    bool solveSudoku(vector<vector<char>>& board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (solveSudoku(board)) {
                                return true;
                            }
                            
                            board[row][col] = '.'; // Backtrack
                        }
                    }
                    return false; // No valid number found
                }
            }
        }
        return true; // All cells filled
    }
    
private:
    bool isValid(vector<vector<char>>& board, int row, int col, char num) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) return false;
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) return false;
        }
        
        // Check 3x3 box
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;
        for (int i = startRow; i < startRow + 3; i++) {
            for (int j = startCol; j < startCol + 3; j++) {
                if (board[i][j] == num) return false;
            }
        }
        
        return true;
    }
};

void printBoard(const vector<vector<char>>& board) {
    for (int i = 0; i < 9; i++) {
        if (i % 3 == 0 && i != 0) {
            cout << "------+-------+------" << endl;
        }
        for (int j = 0; j < 9; j++) {
            if (j % 3 == 0 && j != 0) {
                cout << "| ";
            }
            cout << board[i][j] << " ";
        }
        cout << endl;
    }
}

int main() {
    vector<vector<char>> board = {
        {'5','3','.','.','7','.','.','.','.'},
        {'6','.','.','1','9','5','.','.','.'},
        {'.','9','8','.','.','.','.','6','.'},
        {'8','.','.','.','6','.','.','.','3'},
        {'4','.','.','8','.','3','.','.','1'},
        {'7','.','.','.','2','.','.','.','6'},
        {'.','6','.','.','.','.','2','8','.'},
        {'.','.','.','4','1','9','.','.','5'},
        {'.','.','.','.','8','.','.','7','9'}
    };
    
    cout << "Original Sudoku:" << endl;
    printBoard(board);
    cout << endl;
    
    SudokuSolver solver;
    if (solver.solveSudoku(board)) {
        cout << "Solved Sudoku:" << endl;
        printBoard(board);
    } else {
        cout << "No solution exists!" << endl;
    }
    
    return 0;
}`,
          explanation: "Sudoku solver uses backtracking to fill empty cells, trying numbers 1-9 and backtracking when constraints are violated."
        }
      ]
    }
  };

  const currentAlgorithm = algorithmData[topic as keyof typeof algorithmData];

  if (!currentAlgorithm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Algorithm Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested algorithm topic "{topic}" doesn't exist yet.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{currentAlgorithm.title}</h1>
          <Badge className={`cp-difficulty-${currentAlgorithm.difficulty.toLowerCase()}`}>
            {currentAlgorithm.difficulty}
          </Badge>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-4xl">
          {currentAlgorithm.description}
        </p>
      </div>

      {/* Key Concepts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-primary" />
          Key Concepts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {currentAlgorithm.concepts.map((concept, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-primary mr-2" />
                <span>{concept}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Code Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Code2 className="w-6 h-6 mr-2 text-primary" />
          Implementation Examples
        </h2>
        
        <div className="space-y-8">
          {currentAlgorithm.examples.map((example, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
              <p className="text-muted-foreground mb-4">{example.explanation}</p>
              <CodeEditor code={example.code} title={`Example ${index + 1}: ${example.title}`} />
              <AICodePanel code={example.code} context={`algorithm/${topic}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Practice Section */}
      <section className="mt-12">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-xl font-semibold mb-4">Ready to Practice?</h3>
          <p className="text-muted-foreground mb-4">
            Test your understanding with curated problems from LeetCode and Codeforces.
          </p>
          <div className="flex gap-4">
            <Link to="/practice">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Practice Problems
              </Button>
            </Link>
            <Link to="/visualizations">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Visualize Algorithm
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default AlgorithmPage;