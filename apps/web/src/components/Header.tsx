import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Locale = "uk" | "en";

const navItems = [
  { label: { uk: "Про нас", en: "About Us" }, path: "/about" },
  { label: { uk: "Про запрошення", en: "About Invitations" }, path: "/invites" },
  { label: { uk: "Ціна", en: "Pricing" }, path: "/pricing" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
        <div className="flex items-center">
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

        {/* Right: Menu Button (mobile) + Language Switcher (always on the right) */}
        <div className="flex items-center gap-2 md:gap-4">
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
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Language Switcher - Always on the right */}
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
        </div>
      </nav>
    </header>
  );
};

export default Header;

