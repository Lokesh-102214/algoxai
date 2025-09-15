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
      case "Easy":
        return "cp-difficulty-easy";
      case "Medium":
        return "cp-difficulty-medium";
      case "Hard":
        return "cp-difficulty-hard";
      default:
        return "cp-difficulty-easy";
    }
  };
  return <Link to={`/algorithm/${slug}`} className="group block">
      <div className="cp-card-interactive h-full animate-fade-in-up">
        <div className="flex items-start justify-between mb-4">
          <div className="p-4 bg-[var(--gradient-primary)] rounded-xl shadow-[var(--shadow-glow-primary)]
                          transition-[var(--transition-bounce)] group-hover:scale-110 group-hover:animate-float">
            <div className="text-primary-foreground">
              {icon}
            </div>
          </div>
          <Badge className={`${getDifficultyColor(difficulty)} text-xs px-3 py-1 font-semibold
                            transition-[var(--transition-bounce)] group-hover:scale-110`}>
            {difficulty}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-[var(--transition-smooth)] leading-tight">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed
                      group-hover:text-foreground transition-[var(--transition-smooth)]">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] 
                          group-hover:text-foreground group-hover:scale-105">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{estimatedTime}</span>
          </div>
          
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] 
                          group-hover:text-foreground group-hover:scale-105">
            <Users className="w-4 h-4" />
            <span className="font-medium">{problems}</span>
          </div>
          
          <div className="flex items-center space-x-2 transition-[var(--transition-smooth)] 
                          group-hover:text-foreground group-hover:scale-105">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{popularity}%</span>
          </div>
        </div>
        
        {/* Animated progress bar */}
        <div className="mt-4 w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-[var(--gradient-primary)] transition-all duration-1000 
                       group-hover:animate-shimmer" style={{
          width: `${popularity}%`
        }} />
        </div>
        
        {/* Hover shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 
                        rounded-2xl pointer-events-none" />
      </div>
    </Link>;
};
export default TopicCard;