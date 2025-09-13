import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CodeEditor from "../components/CodeEditor";
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