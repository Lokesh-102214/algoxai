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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CPMaster
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* AI Voice Agent & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="hero">
            <Mic className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">AI Assistant</span>
          </Button>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;