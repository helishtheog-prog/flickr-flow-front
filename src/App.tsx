import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { WatchLaterProvider } from "@/hooks/useWatchLater";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import Channel from "./pages/Channel";
import WatchLater from "./pages/WatchLater";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WatchLaterProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WatchLaterProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
