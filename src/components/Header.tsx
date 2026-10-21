import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import {
  Bot,
  User,
  Calendar,
  Play,
  Home,
  Code2,
  GraduationCap,
  Wrench,
  Menu,
  LogIn,
  LogOut,
  Info,
  Sparkles,
} from "lucide-react";

const Header: React.FC = () => {
  const logoSrc = `${import.meta.env.BASE_URL}algoxai-logo.svg`;
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/product", label: "Product", icon: Sparkles },
    { path: "/learning-hub", label: "Learn", icon: GraduationCap },
    { path: "/practice", label: "Practice", icon: Code2 },
    { path: "/visualizations", label: "Visualize", icon: Play },
    { path: "/ai", label: "AI Tutor", icon: Bot },
    { path: "/productivity", label: "Productivity", icon: Wrench },
    { path: "/calendar", label: "Contests", icon: Calendar },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img
            src={logoSrc}
            alt="AlgoXAI"
            className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            AlgoXAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={isActive(path) ? "secondary" : "ghost"}
                size="sm"
                className={`text-xs font-medium px-3 h-8 gap-1.5 ${
                  isActive(path)
                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Auth / Action Area */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile">
                <Button
                  variant={isActive("/profile") ? "secondary" : "ghost"}
                  size="sm"
                  className="h-9 gap-1.5 text-xs"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline font-mono truncate max-w-[120px]">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="h-9 px-2 text-muted-foreground hover:text-destructive"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold px-4">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="w-5 h-5 text-foreground" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card border-border/60">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="flex items-center space-x-2 text-lg font-bold">
                    <img src={logoSrc} alt="" className="w-6 h-6 object-contain" />
                    <span>AlgoXAI Navigation</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-1">
                  {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(path)
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-border/40">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/30 mb-2"
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span>My Profile</span>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            signOut();
                            setMobileOpen(false);
                          }}
                          className="w-full justify-start text-xs text-destructive gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth" onClick={() => setMobileOpen(false)}>
                        <Button size="sm" className="w-full gap-2 text-xs">
                          <LogIn className="w-4 h-4" />
                          <span>Sign In / Register</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
