import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, User, Calendar, Trophy, MessageCircle, Play, Home, Code2 } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/practice", label: "Practice", icon: Code2 },
    { path: "/visualizations", label: "Visualize", icon: Play },
    { path: "/community", label: "Community", icon: MessageCircle },
    { path: "/calendar", label: "Contests", icon: Calendar },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50 animate-fade-in-up">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with glow effect */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-[var(--gradient-primary)] rounded-xl flex items-center justify-center 
                          shadow-[var(--shadow-glow-primary)] group-hover:animate-pulse-glow 
                          transition-[var(--transition-bounce)] group-hover:scale-110">
            <Trophy className="w-6 h-6 text-primary-foreground animate-float" />
          </div>
          <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-[var(--transition-smooth)]">
            CPMaster
          </span>
        </Link>

        {/* Navigation with enhanced styling */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className="group">
              <Button
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 transition-[var(--transition-bounce)] 
                          hover:scale-105 relative overflow-hidden btn-glow
                          ${isActive(path) 
                            ? 'bg-[var(--gradient-primary)] shadow-[var(--shadow-glow-primary)] text-primary-foreground' 
                            : 'hover:bg-muted/80 hover:text-primary'
                          }`}
              >
                <Icon className={`w-4 h-4 transition-[var(--transition-smooth)] 
                                ${isActive(path) ? 'animate-pulse-slow' : 'group-hover:animate-float'}`} />
                <span className="font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* AI Voice Agent & Mobile Menu with enhanced effects */}
        <div className="flex items-center space-x-3">
          <Button 
            size="sm" 
            className="bg-[var(--gradient-hero)] text-primary-foreground 
                       shadow-[var(--shadow-glow-primary)] hover:shadow-[var(--shadow-glow-secondary)]
                       transition-[var(--transition-bounce)] hover:scale-110 
                       relative overflow-hidden btn-glow animate-pulse-glow"
          >
            <Mic className="w-4 h-4 mr-2 animate-pulse" />
            <span className="hidden sm:inline font-medium">AI Assistant</span>
          </Button>
          
          {/* Mobile menu button with glow */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-muted/80 hover:shadow-[var(--shadow-glow-primary)] 
                         transition-[var(--transition-bounce)] hover:scale-110"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;