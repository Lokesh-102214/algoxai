import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp } from "lucide-react";

interface TopicCardProps {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  problems: number;
  icon: React.ReactNode;
  slug: string;
  estimatedTime: string;
  popularity: number;
}

const TopicCard = ({ 
  title, 
  description, 
  difficulty, 
  problems, 
  icon, 
  slug, 
  estimatedTime, 
  popularity 
}: TopicCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "cp-difficulty-easy";
      case "Medium": return "cp-difficulty-medium";
      case "Hard": return "cp-difficulty-hard";
      default: return "cp-difficulty-easy";
    }
  };

  return (
    <Link to={`/algorithm/${slug}`}>
      <Card className="cp-card h-full cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
            {icon}
          </div>
          <Badge className={`${getDifficultyColor(difficulty)} text-xs px-2 py-1`}>
            {difficulty}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{estimatedTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{problems} problems</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{popularity}%</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TopicCard;