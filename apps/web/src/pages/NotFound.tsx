import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-primary/5 px-4 font-geologica">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-primary font-medium tracking-widest uppercase text-sm">404</p>
          <h1 className="text-3xl font-semibold text-foreground">Сторінку не знайдено</h1>
          <p className="text-muted-foreground">
            Схоже, ця сторінка не існує або була переміщена.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Повернутися на головну
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
