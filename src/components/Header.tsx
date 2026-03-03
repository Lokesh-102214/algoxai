import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Calendar, Play, Home, Code2, GraduationCap, Wrench } from "lucide-react";
import AlgoXLogo from "@/components/AlgoXLogo";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navItems = [{
    path: "/",
    label: "Home",
    icon: Home
  }, {
    path: "/learning-hub",
    label: "Learn",
    icon: GraduationCap
  }, {
    path: "/practice",
    label: "Practice",
    icon: Code2
  }, {
    path: "/visualizations",
    label: "Visualize",
    icon: Play
  }, {
    path: "/productivity",
    label: "Productivity",
    icon: Wrench
  }, {
    path: "/calendar",
    label: "Contests",
    icon: Calendar
  }, {
    path: "/profile",
    label: "Profile",
    icon: User
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50 animate-fade-in-up">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with glow effect */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-teal-500/30 bg-gradient-to-br from-teal-950/80 to-indigo-950/80 group-hover:border-teal-400/60 transition-all duration-200 group-hover:scale-110 shadow-[0_0_12px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <AlgoXLogo size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight group-hover:scale-105 transition-[var(--transition-smooth)]">
            <span className="text-teal-400">Algo</span><span className="text-indigo-400">X</span><span className="text-foreground/80">.ai</span>
          </span>
        </Link>

        {/* Navigation with enhanced styling */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map(({
          path,
          label,
          icon: Icon
        }) => <Link key={path} to={path} className="group">
              <Button variant={isActive(path) ? "default" : "ghost"} size="sm" className={`flex items-center space-x-2 transition-[var(--transition-bounce)] 
                          hover:scale-105 relative overflow-hidden btn-glow
                          ${isActive(path) ? 'bg-[var(--gradient-primary)] shadow-[var(--shadow-glow-primary)] text-primary-foreground' : 'hover:bg-muted/80 hover:text-foreground'}`}>
                <Icon className={`w-4 h-4 transition-[var(--transition-smooth)] 
                                ${isActive(path) ? 'animate-pulse-slow' : 'group-hover:animate-float'}`} />
                <span className="font-medium">{label}</span>
              </Button>
            </Link>)}
        </nav>

        {/* AI Voice Agent & Mobile Menu with enhanced effects */}
        <div className="flex items-center space-x-3">
          <Link to="/ai">
            <Button size="sm" className="bg-[var(--gradient-hero)] shadow-[var(--shadow-glow-primary)] hover:shadow-[var(--shadow-glow-secondary)] transition-[var(--transition-bounce)] hover:scale-110 relative overflow-hidden btn-glow animate-pulse-glow text-foreground">
              <AlgoXLogo size={16} className="mr-2 shrink-0" />
              <span className="hidden sm:inline font-medium">AI Assistant</span>
            </Button>
          </Link>
          
          {/* Mobile menu button with glow */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="hover:bg-muted/80 hover:shadow-[var(--shadow-glow-primary)] 
                         transition-[var(--transition-bounce)] hover:scale-110">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;