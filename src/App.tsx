import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Threats from "./pages/Sales";
import Projects from "./pages/Projects";
import Firewall from "./pages/Firewall";
import Endpoints from "./pages/Endpoints";
import Assets from "./pages/Assets";
import CMDB from "./pages/CMDB";
import Lifecycle from "./pages/Lifecycle";
import AssetHealth from "./pages/AssetHealth";
import SOC from "./pages/SOC";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/firewall" element={<Firewall />} />
          <Route path="/endpoints" element={<Endpoints />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/cmdb" element={<CMDB />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/asset-health" element={<AssetHealth />} />
          <Route path="/soc" element={<SOC />} />
          <Route path="/projects" element={<Projects />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
