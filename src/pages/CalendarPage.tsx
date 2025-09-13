import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trophy, ExternalLink, Bell } from "lucide-react";

const CalendarPage = () => {
  // Sample contest data
  const upcomingContests = [
    {
      id: 1,
      title: "Codeforces Round #912 (Div. 2)",
      platform: "Codeforces",
      date: "2024-01-20",
      time: "17:35 UTC",
      duration: "2 hours",
      participants: "15000+",
      difficulty: "Div. 2",
      status: "upcoming",
      link: "https://codeforces.com/contests"
    },
    {
      id: 2,
      title: "LeetCode Weekly Contest 379",
      platform: "LeetCode", 
      date: "2024-01-21",
      time: "02:30 UTC",
      duration: "1.5 hours",
      participants: "25000+",
      difficulty: "All levels",
      status: "upcoming",
      link: "https://leetcode.com/contest/"
    },
    {
      id: 3,
      title: "AtCoder Beginner Contest 335",
      platform: "AtCoder",
      date: "2024-01-21",
      time: "12:00 UTC", 
      duration: "100 minutes",
      participants: "8000+",
      difficulty: "Beginner",
      status: "upcoming",
      link: "https://atcoder.jp/contests/"
    },
    {
      id: 4,
      title: "CodeChef Starters 115",
      platform: "CodeChef",
      date: "2024-01-24",
      time: "14:30 UTC",
      duration: "3 hours",
      participants: "12000+",
      difficulty: "Div. 1-4",
      status: "upcoming",
      link: "https://www.codechef.com/contests"
    }
  ];

  const recentContests = [
    {
      id: 5,
      title: "Codeforces Round #911 (Div. 2)",
      platform: "Codeforces",
      date: "2024-01-15",
      time: "17:35 UTC",
      duration: "2 hours",
      participants: "18243",
      myRank: "1247",
      ratingChange: "+42",
      status: "completed"
    },
    {
      id: 6,
      title: "LeetCode Weekly Contest 378", 
      platform: "LeetCode",
      date: "2024-01-14",
      time: "02:30 UTC",
      duration: "1.5 hours",
      participants: "24891",
      myRank: "892",
      ratingChange: "+18",
      status: "completed"
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Codeforces": return "bg-red-500";
      case "LeetCode": return "bg-orange-500";
      case "AtCoder": return "bg-blue-500";
      case "CodeChef": return "bg-amber-600";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.includes("Beginner") || difficulty.includes("Div. 2")) {
      return "cp-difficulty-easy";
    }
    if (difficulty.includes("Div. 1") || difficulty.includes("All levels")) {
      return "cp-difficulty-medium";
    }
    return "cp-difficulty-hard";
  };

  const formatTimeUntil = (dateStr: string, timeStr: string) => {
    const contestDate = new Date(`${dateStr}T${timeStr.replace('UTC', '')}`);
    const now = new Date();
    const diff = contestDate.getTime() - now.getTime();
    
    if (diff < 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <Calendar className="w-8 h-8 mr-3 text-primary" />
          Contest Calendar
        </h1>
        <p className="text-muted-foreground">
          Stay updated with upcoming competitive programming contests from major platforms
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm text-muted-foreground">Contests Joined</div>
        </Card>
        <Card className="p-4 text-center">
          <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold">1,247</div>
          <div className="text-sm text-muted-foreground">Best Rank</div>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">4</div>
          <div className="text-sm text-muted-foreground">This Week</div>
        </Card>
        <Card className="p-4 text-center">
          <Bell className="w-6 h-6 text-cp-medium mx-auto mb-2" />
          <div className="text-2xl font-bold">7</div>
          <div className="text-sm text-muted-foreground">Reminders Set</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Contests */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Upcoming Contests
            </h2>
            
            <div className="space-y-4">
              {upcomingContests.map((contest) => (
                <Card key={contest.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getPlatformColor(contest.platform)}`} />
                        <h3 className="font-semibold">{contest.title}</h3>
                        <Badge className={getDifficultyColor(contest.difficulty)}>
                          {contest.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{contest.date} at {contest.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{contest.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{contest.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{contest.platform}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Starts in: </span>
                          <span className="font-semibold text-primary">
                            {formatTimeUntil(contest.date, contest.time)}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Bell className="w-4 h-4 mr-1" />
                            Remind
                          </Button>
                          <Button size="sm" asChild>
                            <a href={contest.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Join
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Results */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-primary" />
              Recent Results
            </h3>
            
            <div className="space-y-3">
              {recentContests.map((contest) => (
                <div key={contest.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getPlatformColor(contest.platform)}`} />
                    <span className="text-sm font-medium">{contest.platform}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {contest.date}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rank: {contest.myRank}</span>
                    <Badge variant={contest.ratingChange.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                      {contest.ratingChange}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Links */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Contest Platforms</h3>
            <div className="space-y-2">
              {[
                { name: "Codeforces", url: "https://codeforces.com/contests", color: "bg-red-500" },
                { name: "LeetCode", url: "https://leetcode.com/contest/", color: "bg-orange-500" },
                { name: "AtCoder", url: "https://atcoder.jp/contests/", color: "bg-blue-500" },
                { name: "CodeChef", url: "https://www.codechef.com/contests", color: "bg-amber-600" }
              ].map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    <div className={`w-3 h-3 rounded-full ${platform.color} mr-2`} />
                    {platform.name}
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Set Reminders
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Export Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Trophy className="w-4 h-4 mr-2" />
                View Statistics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;