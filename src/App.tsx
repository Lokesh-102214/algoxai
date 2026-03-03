import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AlgorithmPage from "./pages/AlgorithmPage";
import PracticePage from "./pages/PracticePage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import VisualizationPage from "./pages/VisualizationPage";
import CalendarPage from "./pages/CalendarPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import LearningHubPage from "./pages/LearningHubPage";
import ProductivityPage from "./pages/ProductivityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NO_FOOTER_ROUTES = ['/ai'];

function AppShell() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 flex-1"> {/* Account for fixed header */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithm/:topic" element={<AlgorithmPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/visualizations" element={<VisualizationPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/ai" element={<AIDashboardPage />} />
          <Route path="/learning-hub" element={<LearningHubPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;