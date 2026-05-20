import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, CircleUser } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { featureFlags } from "@/lib/featureFlags";
import { useAuth } from "@/contexts/AuthContext";

type Locale = "uk" | "en";

const navItems = [
  { label: { uk: "Головна", en: "Home" }, path: "/" },
  { label: { uk: "Про нас", en: "About" }, path: "/about" },
  { label: { uk: "Ціна", en: "Pricing" }, path: "/pricing" },
  { label: { uk: "Блог", en: "Blog" }, path: "/blog" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  // Determine locale from URL
  const getLocaleFromPath = (path: string): Locale => {
    if (path.startsWith("/en/") || path === "/en") return "en";
    if (path.startsWith("/uk/") || path === "/uk") return "uk";
    return "uk"; // Default
  };

  const [locale, setLocale] = useState<Locale>(() => getLocaleFromPath(location.pathname));
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sync locale with URL changes and update HTML lang attribute
  useEffect(() => {
    const newLocale = getLocaleFromPath(location.pathname);
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
  }, [location.pathname]);

  // Get current path without locale prefix
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path.startsWith("/uk/")) return path.slice(4); // Remove /uk/
    if (path.startsWith("/en/")) return path.slice(4); // Remove /en/
    if (path === "/uk" || path === "/en") return "/";
    return path === "/" ? "/" : path;
  };

  // Handle language toggle
  const handleLanguageToggle = () => {
    const newLocale: Locale = locale === "uk" ? "en" : "uk";
    const currentPath = getCurrentPath();
    
    // Navigate with new locale prefix
    if (currentPath === "/") {
      navigate(newLocale === "uk" ? "/" : "/en");
    } else {
      navigate(`/${newLocale}${currentPath}`);
    }
  };

  // Check if a nav item is active
  const isActive = (path: string) => {
    const currentPath = getCurrentPath();
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath === path) return true;
    return false;
  };

  // Get localized path
  const getLocalizedPath = (path: string) => {
    if (path === "/") {
      return locale === "uk" ? "/" : "/en";
    }
    return `/${locale}${path}`;
  };

  return (
    <header className="relative z-50 w-full border-b bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Brand */}
        <div className="flex flex-1 items-center">
          <Link
            to={locale === "uk" ? "/" : "/en"}
            className="text-xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
          >
            <h1>Beloved</h1>
          </Link>
        </div>

        {/* Center: Primary Navigation (Desktop only) */}
        {!isMobile && (
          <div className="flex items-center justify-center flex-1">
            <ul className="flex items-center gap-4 md:gap-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={getLocalizedPath(item.path)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1",
                      isActive(item.path)
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    )}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Right: Auth actions + Mobile menu + Language Switcher */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          {isMobile && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open menu"
                  aria-expanded={isSheetOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                id="mobile-menu"
                className="w-80"
              >
                <nav className="mt-8">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={getLocalizedPath(item.path)}
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            "block text-lg font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-2",
                            isActive(item.path)
                              ? "text-primary font-semibold"
                              : "text-foreground"
                          )}
                          aria-current={isActive(item.path) ? "page" : undefined}
                        >
                          {item.label[locale]}
                        </Link>
                      </li>
                    ))}
                    {user && (
                      <li>
                        <Link
                          to="/invitations"
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            "block text-lg font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-2",
                            location.pathname === "/invitations"
                              ? "text-primary font-semibold"
                              : "text-foreground"
                          )}
                          aria-current={location.pathname === "/invitations" ? "page" : undefined}
                        >
                          {locale === "en" ? "My Invitations" : "Мої запрошення"}
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {user && !isMobile && (
            <Link
              to="/invitations"
              aria-label="Мої запрошення"
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                location.pathname === "/invitations"
                  ? "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25"
                  : "bg-foreground/[0.05] text-foreground hover:bg-gradient-to-r hover:from-pink-500 hover:via-rose-500 hover:to-amber-500 hover:text-white hover:shadow-md hover:shadow-rose-500/20"
              )}
            >
              {locale === "en" ? "My Invitations" : "Мої запрошення"}
            </Link>
          )}

          <Link
            to="/account"
            aria-label="Акаунт"
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              user
                ? "h-8 w-8 bg-gradient-to-br from-pink-500 to-rose-400 shadow-sm shadow-pink-500/20 hover:shadow-md hover:shadow-pink-500/30 hover:-translate-y-px"
                : "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]",
              location.pathname === "/account" && "ring-2 ring-pink-400 ring-offset-1"
            )}
          >
            {user ? (
              <span className="text-xs font-bold text-white leading-none">
                {user.email[0].toUpperCase()}
              </span>
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
          </Link>

          {featureFlags.languageSwitcher && (
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1"
              aria-label="Switch language"
            >
              <span
                className={cn(
                  "transition-colors",
                  locale === "uk"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
                aria-current={locale === "uk" ? "true" : undefined}
              >
                Укр
              </span>
              <span className="text-muted-foreground">|</span>
              <span
                className={cn(
                  "transition-colors",
                  locale === "en"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
                aria-current={locale === "en" ? "true" : undefined}
              >
                Eng
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

