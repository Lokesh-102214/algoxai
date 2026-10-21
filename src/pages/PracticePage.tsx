import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, Play, CheckCircle2, Clock, Award, SlidersHorizontal } from "lucide-react";
import rawProblems from "@/data/problems.json";
import { toast } from "sonner";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cfRating: number;
  topic: string;
  platform: string;
  solved: boolean;
  description: string;
  link: string;
  acceptance: string;
  timeEstimate: string;
}

const PracticePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  
  // Solved state tracking (persisted in localStorage)
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem("algoxai_solved_problems");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSolved = (id: number) => {
    const next = { ...solvedMap, [id]: !solvedMap[id] };
    setSolvedMap(next);
    localStorage.setItem("algoxai_solved_problems", JSON.stringify(next));
    if (next[id]) {
      toast.success("Marked as solved! Progress updated.");
    }
  };

  const problems: Problem[] = rawProblems.map((p) => ({
    ...p,
    difficulty: p.difficulty as "Easy" | "Medium" | "Hard",
    solved: !!solvedMap[p.id],
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "cp-difficulty-easy";
      case "Medium": return "cp-difficulty-medium";
      case "Hard": return "cp-difficulty-hard";
      default: return "cp-difficulty-easy";
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === "all" || problem.topic === topicFilter;
    
    let matchesRating = true;
    if (ratingFilter === "sub1000") matchesRating = problem.cfRating < 1000;
    else if (ratingFilter === "1000to1400") matchesRating = problem.cfRating >= 1000 && problem.cfRating <= 1400;
    else if (ratingFilter === "1400to1800") matchesRating = problem.cfRating > 1400 && problem.cfRating <= 1800;
    else if (ratingFilter === "1800plus") matchesRating = problem.cfRating > 1800;

    return matchesSearch && matchesDifficulty && matchesTopic && matchesRating;
  });

  const topics = [...new Set(problems.map((p) => p.topic))];
  const totalSolvedCount = Object.values(solvedMap).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Library</h1>
        <p className="text-muted-foreground text-sm">
          Curated competitive programming and algorithmic problems with difficulty ratings, topic tags, and verified links.
        </p>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center border-border/60">
          <div className="text-2xl font-bold text-primary">{totalSolvedCount} / {problems.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Problems Solved</div>
        </Card>
        <Card className="p-4 text-center border-border/60">
          <div className="text-2xl font-bold text-emerald-500">
            {problems.filter((p) => p.difficulty === "Easy" && p.solved).length} / {problems.filter((p) => p.difficulty === "Easy").length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Easy Completed</div>
        </Card>
        <Card className="p-4 text-center border-border/60">
          <div className="text-2xl font-bold text-amber-500">
            {problems.filter((p) => p.difficulty === "Medium" && p.solved).length} / {problems.filter((p) => p.difficulty === "Medium").length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Medium Completed</div>
        </Card>
        <Card className="p-4 text-center border-border/60">
          <div className="text-2xl font-bold text-red-500">
            {problems.filter((p) => p.difficulty === "Hard" && p.solved).length} / {problems.filter((p) => p.difficulty === "Hard").length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Hard Completed</div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 mb-6 border-border/60 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Rating Bracket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All CF Ratings</SelectItem>
              <SelectItem value="sub1000">&lt; 1000 Rating</SelectItem>
              <SelectItem value="1000to1400">1000 - 1400 Rating</SelectItem>
              <SelectItem value="1400to1800">1400 - 1800 Rating</SelectItem>
              <SelectItem value="1800plus">1800+ Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="p-5 border-border/60 hover:border-primary/40 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <button
                    onClick={() => toggleSolved(problem.id)}
                    className="focus:outline-none"
                    title={problem.solved ? "Mark as unsolved" : "Mark as solved"}
                  >
                    {problem.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 hover:border-primary transition-colors" />
                    )}
                  </button>

                  <h3 className={`text-base font-semibold ${problem.solved ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {problem.title}
                  </h3>

                  <Badge className={`${getDifficultyColor(problem.difficulty)} text-[10px] px-2 py-0.5`}>
                    {problem.difficulty}
                  </Badge>

                  <Badge variant="outline" className="text-[10px] font-mono">
                    Rating {problem.cfRating}
                  </Badge>

                  <Badge variant="secondary" className="text-[10px]">
                    {problem.topic}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {problem.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{problem.timeEstimate}</span>
                  </div>
                  <span>Acceptance: {problem.acceptance}</span>
                  <span className="font-medium text-foreground/80">{problem.platform}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => toggleSolved(problem.id)}
                >
                  {problem.solved ? "Solved ✓" : "Mark Done"}
                </Button>

                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => window.open(problem.link, "_blank")}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Solve</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <Card className="p-12 text-center border-border/60">
          <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">No matching problems found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query, topic filter, or rating bracket.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PracticePage;