import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Heart, 
  MessageCircle, 
  Share, 
  Users, 
  TrendingUp,
  Trophy,
  Code2,
  Pin
} from "lucide-react";
import { toast } from "sonner";

const CommunityPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "CodeMaster99",
      avatar: "CM",
      time: "2 hours ago",
      content: "Just solved my first hard problem on LeetCode! The feeling is incredible 🎉",
      likes: 12,
      replies: 3,
      isPinned: false,
      tags: ["achievement", "leetcode"]
    },
    {
      id: 2,
      user: "AlgoQueen",
      avatar: "AQ",
      time: "4 hours ago", 
      content: "Can someone explain the time complexity of Dijkstra's algorithm? I'm getting confused with the priority queue implementation.",
      likes: 8,
      replies: 7,
      isPinned: true,
      tags: ["help", "algorithms", "graph"]
    },
    {
      id: 3,
      user: "CPNinja",
      avatar: "CN",
      time: "6 hours ago",
      content: "Pro tip: When practicing DP problems, always try to visualize the state transitions. It helps tremendously!",
      likes: 25,
      replies: 5,
      isPinned: false,
      tags: ["tips", "dp"]
    },
    {
      id: 4,
      user: "DataStructureFan",
      avatar: "DS", 
      time: "8 hours ago",
      content: "Which is better for interview prep - LeetCode or CodeSignal? I've been using LeetCode but wondering if I should switch.",
      likes: 6,
      replies: 12,
      isPinned: false,
      tags: ["interview", "platforms"]
    },
    {
      id: 5,
      user: "GraphGuru",
      avatar: "GG",
      time: "1 day ago",
      content: "Today's Codeforces contest was brutal! That graph problem in C took me 2 hours to debug 😅",
      likes: 15,
      replies: 8,
      isPinned: false,
      tags: ["contest", "codeforces"]
    }
  ]);

  const activeUsers = [
    { name: "CodeMaster99", status: "online", avatar: "CM" },
    { name: "AlgoQueen", status: "online", avatar: "AQ" },
    { name: "CPNinja", status: "away", avatar: "CN" },
    { name: "GraphGuru", status: "online", avatar: "GG" },
    { name: "DataStructureFan", status: "offline", avatar: "DS" }
  ];

  const trendingTopics = [
    { topic: "#dynamic-programming", posts: 234 },
    { topic: "#leetcode-daily", posts: 189 },
    { topic: "#contest-discussion", posts: 156 },
    { topic: "#interview-prep", posts: 134 },
    { topic: "#algorithm-help", posts: 112 }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      user: "You",
      avatar: "YO",
      time: "Just now",
      content: newMessage,
      likes: 0,
      replies: 0,
      isPinned: false,
      tags: []
    };

    setMessages([newMsg, ...messages]);
    setNewMessage("");
    toast.success("Message posted!");
  };

  const handleLike = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
    toast.success("Liked!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-primary" />
                  Community Discussion
                </h1>
                <p className="text-muted-foreground">
                  Connect with fellow competitive programmers and share knowledge
                </p>
              </div>
              <Badge variant="outline" className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {activeUsers.filter(u => u.status === "online").length} online
              </Badge>
            </div>

            {/* Post Input */}
            <div className="flex space-x-3 mb-6">
              <Avatar>
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Share your thoughts, ask questions, or celebrate achievements..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary-glow hover:to-secondary shadow-[var(--shadow-glow-primary)] transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={`p-4 ${message.isPinned ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarFallback>{message.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{message.user}</span>
                        <span className="text-sm text-muted-foreground">{message.time}</span>
                        {message.isPinned && (
                          <Pin className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      
                      <p className="mb-3">{message.content}</p>
                      
                      {message.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {message.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(message.id)}
                          className="flex items-center space-x-1 p-0 h-auto text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{message.likes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Reply feature coming soon!')}
                          className="flex items-center space-x-1 p-0 h-auto text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{message.replies}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            toast.success('Message copied to clipboard!');
                          }}
                          className="flex items-center space-x-1 p-0 h-auto text-muted-foreground hover:text-secondary transition-colors"
                        >
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </Button>
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
          {/* Active Users */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Active Users
            </h3>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.name} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Trending Topics
            </h3>
            <div className="space-y-2">
              {trendingTopics.map((item) => (
                <div key={item.topic} className="flex items-center justify-between">
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    {item.topic}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.posts}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toast.info('Study Groups feature coming soon!')}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Study Groups
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toast.info('Contest Teams feature coming soon!')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Contest Teams
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-muted hover:text-primary transition-colors"
                onClick={() => toast.info('Direct Messages feature coming soon!')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Direct Messages
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;