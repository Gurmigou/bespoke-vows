import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Landing from "./pages/Landing";
import Builder from "./pages/Builder";
import About from "./pages/About";
import Invites from "./pages/Invites";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/uk" element={<Landing />} />
          <Route path="/en" element={<Landing />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/about" element={<About />} />
          <Route path="/uk/about" element={<About />} />
          <Route path="/en/about" element={<About />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/uk/invites" element={<Invites />} />
          <Route path="/en/invites" element={<Invites />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/uk/pricing" element={<Pricing />} />
          <Route path="/en/pricing" element={<Pricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
