import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, Play, CheckCircle, Clock } from "lucide-react";

const PracticePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  // Sample problems data
  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      topic: "Arrays",
      platform: "LeetCode",
      solved: true,
      description: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
      link: "https://leetcode.com/problems/two-sum/",
      acceptance: "49.7%",
      timeEstimate: "15 min"
    },
    {
      id: 2,
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      topic: "Dynamic Programming",
      platform: "LeetCode", 
      solved: false,
      description: "Find the length of the longest common subsequence between two strings.",
      link: "https://leetcode.com/problems/longest-common-subsequence/",
      acceptance: "58.3%",
      timeEstimate: "30 min"
    },
    {
      id: 3,
      title: "Maximum Flow",
      difficulty: "Hard",
      topic: "Graph Algorithms",
      platform: "Codeforces",
      solved: false,
      description: "Find the maximum flow in a flow network from source to sink.",
      link: "https://codeforces.com/problemset/problem/1473/E",
      acceptance: "23.1%",
      timeEstimate: "60 min"
    },
    {
      id: 4,
      title: "Binary Search",
      difficulty: "Easy",
      topic: "Searching",
      platform: "LeetCode",
      solved: true,
      description: "Implement binary search algorithm to find target in sorted array.",
      link: "https://leetcode.com/problems/binary-search/",
      acceptance: "54.8%",
      timeEstimate: "10 min"
    },
    {
      id: 5,
      title: "Coin Change",
      difficulty: "Medium",
      topic: "Dynamic Programming",
      platform: "LeetCode",
      solved: false,
      description: "Find the minimum number of coins needed to make up a given amount.",
      link: "https://leetcode.com/problems/coin-change/",
      acceptance: "40.1%",
      timeEstimate: "25 min"
    },
    {
      id: 6,
      title: "N-Queens",
      difficulty: "Hard",
      topic: "Backtracking",
      platform: "LeetCode",
      solved: false,
      description: "Place N queens on an N×N chessboard so that no two queens attack each other.",
      link: "https://leetcode.com/problems/n-queens/",
      acceptance: "63.4%",
      timeEstimate: "45 min"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "cp-difficulty-easy";
      case "Medium": return "cp-difficulty-medium";
      case "Hard": return "cp-difficulty-hard";
      default: return "cp-difficulty-easy";
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === "all" || problem.topic === topicFilter;
    
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const topics = [...new Set(problems.map(p => p.topic))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Practice Problems</h1>
        <p className="text-muted-foreground">
          Solve curated problems from LeetCode and Codeforces to improve your competitive programming skills.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">142</div>
          <div className="text-sm text-muted-foreground">Total Solved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-cp-easy">85</div>
          <div className="text-sm text-muted-foreground">Easy Problems</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-cp-medium">45</div>
          <div className="text-sm text-muted-foreground">Medium Problems</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-cp-hard">12</div>
          <div className="text-sm text-muted-foreground">Hard Problems</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {problem.solved ? (
                    <CheckCircle className="w-5 h-5 text-cp-solved" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <h3 className="text-lg font-semibold">{problem.title}</h3>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  <Badge variant="outline">{problem.topic}</Badge>
                </div>
                
                <p className="text-muted-foreground mb-3">{problem.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{problem.timeEstimate}</span>
                  </div>
                  <span>Acceptance: {problem.acceptance}</span>
                  <span className="text-primary font-medium">{problem.platform}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Play className="w-4 h-4 mr-2" />
                  Solve
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={problem.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <Card className="p-8 text-center">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No problems found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PracticePage;