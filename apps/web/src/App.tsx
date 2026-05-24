import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import MyInvitations from "./pages/MyInvitations";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import InvitationInactive from "./pages/InvitationInactive";
import InvitationDeleted from "./pages/InvitationDeleted";
import PublicInvitation from "./pages/PublicInvitation";
import PaymentSuccess from "./pages/PaymentSuccess";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const LANDING_PATHS = new Set(["/", "/uk", "/en"]);

function isSafeReturnTo(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path === "/login" || path === "/register") return false;
  return (
    path.startsWith("/preview") ||
    path.startsWith("/builder") ||
    path.startsWith("/invitations") ||
    path.startsWith("/account") ||
    path.startsWith("/checkout")
  );
}

const PostOAuthRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading || !user) return;
    if (!LANDING_PATHS.has(location.pathname)) return;
    const returnTo = sessionStorage.getItem("bv:postOAuthReturn");
    if (!returnTo) return;
    sessionStorage.removeItem("bv:postOAuthReturn");
    sessionStorage.removeItem("bv:loginReturnTo");
    if (!isSafeReturnTo(returnTo)) return;
    navigate(returnTo, { replace: true });
  }, [user, loading, location.pathname, navigate]);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  const hideHeader =
    location.pathname.startsWith("/preview") ||
    location.pathname.startsWith("/i/") ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/invitation-inactive" ||
    location.pathname === "/invitation-deleted" ||
    location.pathname.startsWith("/checkout") ||
    location.pathname === "/payment-success";
  return (
    <>
      <PostOAuthRedirect />
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
          <Route path="/preview/:token" element={<PreviewPage />} />
          <Route path="/i/:id" element={<PublicInvitation />} />
          <Route path="/about" element={<About />} />
          <Route path="/uk/about" element={<About />} />
          <Route path="/en/about" element={<About />} />
          <Route path="/invitations" element={<MyInvitations />} />
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
          <Route path="/checkout/lifetime" element={<Checkout mode="lifetime" />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/invitation-inactive" element={<InvitationInactive />} />
          <Route path="/invitation-deleted" element={<InvitationDeleted />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
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
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
