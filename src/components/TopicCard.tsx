import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Layers } from "lucide-react";

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

  return (
    <Link to={`/algorithm/${slug}`} className="group block h-full">
      <div className="h-full rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:bg-muted/10 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg border border-primary/20">
              {icon}
            </div>
            <Badge className={`${getDifficultyColor(difficulty)} text-xs px-2.5 py-0.5 font-medium`}>
              {difficulty}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{estimatedTime}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{problems} problems</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;