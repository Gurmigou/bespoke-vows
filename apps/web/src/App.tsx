import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Landing from "./pages/Landing";
import Builder from "./pages/Builder";
import PreviewPage from "./pages/PreviewPage";
import Templates from "./pages/Templates";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import InvitationInactive from "./pages/InvitationInactive";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/preview" ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/invitation-inactive";
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/uk" element={<Landing />} />
          <Route path="/en" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/uk/templates" element={<Templates />} />
          <Route path="/en/templates" element={<Templates />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/uk/about" element={<About />} />
          <Route path="/en/about" element={<About />} />
          <Route path="/invites" element={<About />} />
          <Route path="/uk/invites" element={<About />} />
          <Route path="/en/invites" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/uk/pricing" element={<Pricing />} />
          <Route path="/en/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/uk/blog" element={<Blog />} />
          <Route path="/en/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/uk/blog/:slug" element={<BlogPost />} />
          <Route path="/en/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invitation-inactive" element={<InvitationInactive />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
