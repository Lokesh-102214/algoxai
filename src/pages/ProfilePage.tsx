import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  User,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Code2,
  GitBranch,
  LogIn,
  ExternalLink,
  CheckCircle2,
  Flame,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import rawProblems from "@/data/problems.json";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [cfHandle, setCfHandle] = useState(() => localStorage.getItem("algoxai_cf_handle") || "");
  const [handleInput, setHandleInput] = useState(cfHandle);
  const [cfData, setCfData] = useState<{ rating?: number; rank?: string; maxRating?: number } | null>(null);
  const [cfLoading, setCfLoading] = useState(false);

  // Solved problems count
  const [solvedCount, setSolvedCount] = useState(0);
  // Quiz scores
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem("algoxai_solved_problems");
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        setSolvedCount(Object.values(parsed).filter(Boolean).length);
      }
      const savedScores = localStorage.getItem("algoxai_quiz_scores");
      if (savedScores) {
        setQuizScores(JSON.parse(savedScores));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch Codeforces public profile if handle is present
  useEffect(() => {
    if (!cfHandle) return;
    setCfLoading(true);
    fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cfHandle)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK" && data.result?.[0]) {
          const u = data.result[0];
          setCfData({
            rating: u.rating,
            rank: u.rank,
            maxRating: u.maxRating,
          });
        }
      })
      .catch(() => {
        // CF API may be offline or rate-limited
      })
      .finally(() => setCfLoading(false));
  }, [cfHandle]);

  const handleSaveHandle = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim();
    setCfHandle(clean);
    localStorage.setItem("algoxai_cf_handle", clean);
    toast.success("Codeforces handle saved!");
  };

  const topicMastery = [
    { name: "Binary Search", score: quizScores["binary-search"] || 50 },
    { name: "Sorting Algorithms", score: quizScores["sorting-algorithms"] || 50 },
    { name: "Graph Algorithms", score: quizScores["graph-algorithms"] || 50 },
    { name: "Dynamic Programming", score: quizScores["dynamic-programming"] || 50 },
    { name: "Greedy Algorithms", score: quizScores["greedy-algorithms"] || 50 },
    { name: "Backtracking", score: quizScores["backtracking"] || 50 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="p-6 md:p-8 mb-8 border-border/60 bg-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 text-2xl font-bold font-mono">
              {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {user ? user.email?.split("@")[0] : "Guest Learner"}
                </h1>
                {cfData?.rank && (
                  <Badge variant="outline" className="capitalize text-primary font-mono text-xs">
                    {cfData.rank}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {user ? user.email : "Not signed in • Local browser storage"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Account: {user ? "Cloud Synced (Supabase)" : "Guest Mode (Local)"}
              </p>
            </div>
          </div>

          {!user && (
            <Link to="/auth">
              <Button size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In to Sync
              </Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Mastery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <Card className="p-6 border-border/60 bg-card">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Verified Learning Metrics
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                <Target className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <div className="text-xl font-bold text-foreground">{solvedCount} / {rawProblems.length}</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>

              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                <BookOpen className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-foreground">
                  {Object.keys(quizScores).length > 0 ? "Completed" : "Pending"}
                </div>
                <div className="text-xs text-muted-foreground">Diagnostic Quiz</div>
              </div>

              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 text-center">
                <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                <div className="text-xl font-bold text-foreground">{solvedCount > 0 ? "Active" : "Ready"}</div>
                <div className="text-xs text-muted-foreground">Practice Status</div>
              </div>
            </div>
          </Card>

          {/* Assessed Topic Mastery */}
          <Card className="p-6 border-border/60 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2 text-foreground">
                <GitBranch className="w-4 h-4 text-primary" />
                Topic Mastery Distribution
              </h2>
              <Link to="/learning-hub">
                <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2">
                  Retake Quiz
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {topicMastery.map((topic) => (
                <div key={topic.name}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-foreground">{topic.name}</span>
                    <span className="text-muted-foreground font-mono">{topic.score}%</span>
                  </div>
                  <Progress value={topic.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Codeforces Link & Shortcuts */}
        <div className="space-y-6">
          {/* Codeforces Connect Card */}
          <Card className="p-6 border-border/60 bg-card">
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Codeforces Sync
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter your public handle to pull verified rating data for adaptive practice.
            </p>

            <form onSubmit={handleSaveHandle} className="space-y-3">
              <Input
                placeholder="CF handle (e.g. tourist)"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                className="h-8 text-xs font-mono"
              />
              <Button type="submit" size="sm" className="w-full h-8 text-xs">
                Save & Sync
              </Button>
            </form>

            {cfData?.rating && (
              <div className="mt-4 pt-4 border-t border-border/40 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Rating:</span>
                  <span className="font-bold text-primary font-mono">{cfData.rating}</span>
                </div>
                {cfData.maxRating && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peak Rating:</span>
                    <span className="font-medium font-mono">{cfData.maxRating}</span>
                  </div>
                )}
                <div className="pt-2">
                  <a
                    href={`https://codeforces.com/profile/${cfHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    View Official Profile
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Learning Shortcuts */}
          <Card className="p-6 border-border/60 bg-card">
            <h3 className="text-base font-semibold mb-3">Jump In</h3>
            <div className="space-y-2">
              <Link to="/learning-hub">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Target className="w-3.5 h-3.5 mr-2 text-primary" />
                  Personalized Roadmap
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Code2 className="w-3.5 h-3.5 mr-2 text-primary" />
                  Solve Recommended Problems
                </Button>
              </Link>
              <Link to="/ai">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Award className="w-3.5 h-3.5 mr-2 text-primary" />
                  AI Code Reviewer
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;