
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VolumeBot from "./pages/VolumeBots";
import SnipeBot from "./pages/SnipeBots";
import CopyTradeBot from "./pages/CopyTradeBots";
import CoinLaunch from "./pages/CoinLaunch";
import Wallets from "./pages/Wallets";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/volume-bot" element={<VolumeBot />} />
          <Route path="/snipe-bot" element={<SnipeBot />} />
          <Route path="/copy-trade-bot" element={<CopyTradeBot />} />
          <Route path="/coin-launch" element={<CoinLaunch />} />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payments" element={<Payments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
