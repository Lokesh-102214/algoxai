import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User, Trophy, Target, Calendar, TrendingUp, Award,
  Clock, Code2, Star, GitBranch, Flame, Zap, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

/* ── Data ── */
const USER = {
  username: "competitive_coder", fullName: "Alex Johnson",
  rating: 1847, maxRating: 1892, rank: "Expert",
  country: "🇺🇸 United States", org: "Stanford University",
  joinDate: "Jan 15, 2022", lastActive: "2 hours ago",
  avatar: "👨‍💻", contribution: 156,
};

const STATS = {
  problemsSolved: 487, contestsParticipated: 23, streak: 15,
  submissions: 1247, accepted: 892,
};

const TOPIC_PROGRESS = [
  { topic: "Arrays",              solved: 45, total: 60 },
  { topic: "Dynamic Programming", solved: 32, total: 50 },
  { topic: "Graphs",              solved: 28, total: 40 },
  { topic: "Greedy",              solved: 22, total: 30 },
  { topic: "Binary Search",       solved: 18, total: 25 },
];

const SUBMISSIONS = [
  { problem: "Two Sum",               platform: "LeetCode",   verdict: "Accepted",            time: "2 h ago",  lang: "C++" },
  { problem: "Maximum Subarray",      platform: "LeetCode",   verdict: "Accepted",            time: "5 h ago",  lang: "C++" },
  { problem: "Coin Change",           platform: "LeetCode",   verdict: "Wrong Answer",        time: "1 d ago",  lang: "Python" },
  { problem: "Graph Traversal",       platform: "Codeforces", verdict: "Accepted",            time: "2 d ago",  lang: "C++" },
  { problem: "Dynamic Programming",   platform: "Codeforces", verdict: "Time Limit Exceeded", time: "3 d ago",  lang: "C++" },
];

const ACHIEVEMENTS = [
  { title: "First AC",       desc: "Solved your first problem",       date: "Jan 15, 2022", icon: "🎉" },
  { title: "Speed Demon",    desc: "Solved 10 problems in one day",   date: "Mar 22, 2022", icon: "⚡" },
  { title: "Contest Warrior",desc: "Participated in 10 contests",     date: "Jun 10, 2022", icon: "🏆" },
  { title: "Streak Master",  desc: "15-day solving streak",           date: "Current",      icon: "🔥" },
];

const RANK_COLORS: Record<string, string> = {
  Newbie: "text-gray-400 border-gray-400/40 bg-gray-500/10",
  Pupil: "text-green-400 border-green-400/40 bg-green-500/10",
  Specialist: "text-cyan-400 border-cyan-400/40 bg-cyan-500/10",
  Expert: "text-blue-400 border-blue-400/40 bg-blue-500/10",
  "Candidate Master": "text-purple-400 border-purple-400/40 bg-purple-500/10",
  Master: "text-orange-400 border-orange-400/40 bg-orange-500/10",
  Grandmaster: "text-red-400 border-red-400/40 bg-red-500/10",
};

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === "Accepted")            return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  if (verdict.startsWith("Wrong"))       return <XCircle      className="w-3.5 h-3.5 text-red-400 shrink-0"     />;
  return                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0"  />;
}

function verdictColor(verdict: string) {
  if (verdict === "Accepted")      return "text-emerald-400";
  if (verdict.startsWith("Wrong")) return "text-red-400";
  return "text-amber-400";
}

export default function ProfilePage() {
  const accuracy = Math.round((STATS.accepted / STATS.submissions) * 100);
  const rankCls  = RANK_COLORS[USER.rank] ?? "text-blue-400 border-blue-400/40 bg-blue-500/10";

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 animate-fade-in-up">
      <div className="container mx-auto max-w-5xl space-y-6">

        {/* ── Hero Card ── */}
        <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          {/* Gradient header strip */}
          <div className="h-28 bg-gradient-to-r from-teal-950/80 via-indigo-950/70 to-teal-950/80"
            style={{ backgroundImage: 'radial-gradient(ellipse at 60% 50%, rgba(45,212,191,0.15) 0%, transparent 70%), radial-gradient(ellipse at 30% 50%, rgba(129,140,248,0.15) 0%, transparent 70%)' }} />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-card bg-gradient-to-br from-teal-900 to-indigo-900 flex items-center justify-center text-4xl shadow-lg">
                {USER.avatar}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${rankCls}`}>
                  {USER.rank}
                </span>
                <Button size="sm" variant="outline" className="border-border/50 text-muted-foreground hover:text-foreground hover:border-border h-8 px-3 text-xs">
                  <User className="w-3 h-3 mr-1" /> Edit Profile
                </Button>
              </div>
            </div>

            {/* Name + meta */}
            <h1 className="text-2xl font-bold tracking-tight">{USER.fullName}</h1>
            <p className="text-sm text-muted-foreground mb-3">@{USER.username} · {USER.country} · {USER.org}</p>

            {/* Stats highlight row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { icon: TrendingUp, label: "Rating",    value: USER.rating,               color: "text-teal-400"   },
                { icon: Target,     label: "Solved",    value: STATS.problemsSolved,       color: "text-indigo-400" },
                { icon: Flame,      label: "Streak",    value: `${STATS.streak}d`,         color: "text-orange-400" },
                { icon: Trophy,     label: "Contests",  value: STATS.contestsParticipated, color: "text-amber-400"  },
                { icon: Zap,        label: "Accuracy",  value: `${accuracy}%`,             color: "text-emerald-400"},
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-border/60 transition-colors">
                  <Icon className={`w-4 h-4 mb-1 ${color}`} />
                  <span className={`text-lg font-bold ${color}`}>{value}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: 2-col */}
          <div className="lg:col-span-2 space-y-6">

            {/* Topic Progress */}
            <section className="rounded-xl bg-card/50 border border-border/40 p-5 backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4 flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Topic Progress
              </h2>
              <div className="space-y-4">
                {TOPIC_PROGRESS.map(t => {
                  const pct = Math.round((t.solved / t.total) * 100);
                  return (
                    <div key={t.topic}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium">{t.topic}</span>
                        <span className="text-xs text-muted-foreground">{t.solved}/{t.total} · <span className="text-teal-400 font-semibold">{pct}%</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Submissions */}
            <section className="rounded-xl bg-card/50 border border-border/40 p-5 backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent Submissions
              </h2>
              <div className="space-y-2">
                {SUBMISSIONS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/60 hover:bg-muted/30 transition-all">
                    <VerdictIcon verdict={s.verdict} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.problem}</p>
                      <p className="text-xs text-muted-foreground">{s.platform} · {s.lang}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-semibold ${verdictColor(s.verdict)}`}>{s.verdict}</p>
                      <p className="text-[11px] text-muted-foreground">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">

            {/* Submission breakdown */}
            <section className="rounded-xl bg-card/50 border border-border/40 p-5 backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Submissions
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Total",    value: STATS.submissions,        color: "bg-muted" },
                  { label: "Accepted", value: STATS.accepted,            color: "bg-emerald-500" },
                  { label: "Rejected", value: STATS.submissions - STATS.accepted, color: "bg-red-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
                <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${accuracy}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground text-right">{accuracy}% acceptance rate</p>
              </div>
            </section>

            {/* Achievements */}
            <section className="rounded-xl bg-card/50 border border-border/40 p-5 backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" /> Achievements
              </h2>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/20 transition-colors">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-xl bg-card/50 border border-border/40 p-5 backdrop-blur-sm space-y-2.5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Quick Actions</h2>
              <Link to="/practice">
                <Button className="w-full bg-gradient-to-r from-teal-600/80 to-indigo-600/80 hover:from-teal-500/80 hover:to-indigo-500/80 text-white border-0 h-9 text-sm">
                  <Target className="w-4 h-4 mr-2" /> Solve Random Problem
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" className="w-full border-border/50 hover:border-border h-9 text-sm">
                  <Calendar className="w-4 h-4 mr-2" /> Join Next Contest
                </Button>
              </Link>
              <Link to="/ai">
                <Button variant="outline" className="w-full border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50 h-9 text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" /> AI Practice Plan
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

