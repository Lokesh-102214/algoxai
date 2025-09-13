import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Code2,
  Star,
  GitBranch
} from "lucide-react";

const ProfilePage = () => {
  // Mock user data - Codeforces style
  const userData = {
    username: "competitive_coder",
    fullName: "Alex Johnson",
    rating: 1847,
    maxRating: 1892,
    rank: "Expert",
    country: "United States",
    organization: "Stanford University",
    joinDate: "Jan 15, 2022",
    lastActive: "2 hours ago",
    avatar: "👨‍💻",
    contribution: 156
  };

  const stats = {
    problemsSolved: 487,
    contestsParticipated: 23,
    streak: 15,
    submissions: 1247,
    acceptedSubmissions: 892,
    accuracy: Math.round((892 / 1247) * 100)
  };

  const recentSubmissions = [
    { problem: "Two Sum", platform: "LeetCode", verdict: "Accepted", time: "2 hours ago", language: "C++" },
    { problem: "Maximum Subarray", platform: "LeetCode", verdict: "Accepted", time: "5 hours ago", language: "C++" },
    { problem: "Coin Change", platform: "LeetCode", verdict: "Wrong Answer", time: "1 day ago", language: "Python" },
    { problem: "Graph Traversal", platform: "Codeforces", verdict: "Accepted", time: "2 days ago", language: "C++" },
    { problem: "Dynamic Programming", platform: "Codeforces", verdict: "Time Limit Exceeded", time: "3 days ago", language: "C++" }
  ];

  const achievements = [
    { title: "First AC", description: "Solved your first problem", date: "Jan 15, 2022", icon: "🎉" },
    { title: "Speed Demon", description: "Solved 10 problems in one day", date: "Mar 22, 2022", icon: "⚡" },
    { title: "Contest Warrior", description: "Participated in 10 contests", date: "Jun 10, 2022", icon: "🏆" },
    { title: "Streak Master", description: "15-day solving streak", date: "Current", icon: "🔥" }
  ];

  const topicProgress = [
    { topic: "Arrays", solved: 45, total: 60, percentage: 75 },
    { topic: "Dynamic Programming", solved: 32, total: 50, percentage: 64 },
    { topic: "Graphs", solved: 28, total: 40, percentage: 70 },
    { topic: "Greedy", solved: 22, total: 30, percentage: 73 },
    { topic: "Binary Search", solved: 18, total: 25, percentage: 72 }
  ];

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Newbie": return "text-gray-500";
      case "Pupil": return "text-green-500";
      case "Specialist": return "text-cyan-500";
      case "Expert": return "text-blue-500";
      case "Candidate Master": return "text-purple-500";
      case "Master": return "text-orange-500";
      default: return "text-blue-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="text-6xl">{userData.avatar}</div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{userData.fullName}</h1>
              <Badge className={getRankColor(userData.rank)} variant="outline">
                {userData.rank}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">@{userData.username}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Rating: </span>
                <span className="font-semibold text-primary">{userData.rating}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Rating: </span>
                <span className="font-semibold">{userData.maxRating}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Country: </span>
                <span>{userData.country}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Joined: </span>
                <span>{userData.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary mb-1">{stats.problemsSolved}</div>
            <div className="text-sm text-muted-foreground">Problems Solved</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.problemsSolved}</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.contestsParticipated}</div>
                <div className="text-sm text-muted-foreground">Contests</div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Code2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.submissions}</div>
                <div className="text-sm text-muted-foreground">Submissions</div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Award className="w-6 h-6 text-cp-easy mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.acceptedSubmissions}</div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="w-6 h-6 text-cp-medium mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </Card>

          {/* Topic Progress */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GitBranch className="w-5 h-5 mr-2 text-primary" />
              Topic Progress
            </h2>
            
            <div className="space-y-4">
              {topicProgress.map((topic) => (
                <div key={topic.topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{topic.topic}</span>
                    <span className="text-sm text-muted-foreground">
                      {topic.solved}/{topic.total} ({topic.percentage}%)
                    </span>
                  </div>
                  <Progress value={topic.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Submissions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Recent Submissions
            </h2>
            
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => {
                const verdictColor = submission.verdict === "Accepted" 
                  ? "text-cp-easy" 
                  : submission.verdict.includes("Wrong") 
                    ? "text-cp-hard" 
                    : "text-cp-medium";
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{submission.problem}</div>
                      <div className="text-sm text-muted-foreground">
                        {submission.platform} • {submission.language}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${verdictColor}`}>
                        {submission.verdict}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {submission.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-primary" />
              Achievements
            </h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Solve Random Problem
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Join Next Contest
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;