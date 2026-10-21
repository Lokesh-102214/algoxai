import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";

// Public Marketing & Core Pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";

// Learning & Interactive Tool Pages
import AlgorithmPage from "./pages/AlgorithmPage";
import VisualizationPage from "./pages/VisualizationPage";
import LearningHubPage from "./pages/LearningHubPage";
import PracticePage from "./pages/PracticePage";
import AIDashboardPage from "./pages/AIDashboardPage";
import ProductivityPage from "./pages/ProductivityPage";
import CalendarPage from "./pages/CalendarPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
            <Header />
            <main className="pt-16 flex-1">
              <ErrorBoundary>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product" element={<ProductPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Core Platform Modules */}
                  <Route path="/algorithm/:topic" element={<AlgorithmPage />} />
                  <Route path="/visualizations" element={<VisualizationPage />} />
                  <Route path="/learning-hub" element={<LearningHubPage />} />
                  <Route path="/practice" element={<PracticePage />} />
                  <Route path="/ai" element={<AIDashboardPage />} />
                  <Route path="/productivity" element={<ProductivityPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-8 bg-card/40 mt-16 text-xs text-muted-foreground">
              <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} AlgoXAI. AI-native algorithm education.</p>
                <div className="flex items-center space-x-6">
                  <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                  <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
                  <a href="/about" className="hover:text-foreground transition-colors">About Us</a>
                  <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
