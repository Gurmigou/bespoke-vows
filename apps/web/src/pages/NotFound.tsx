import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass, Mail } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen font-geologica bg-[hsl(32,20%,96%)] flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 md:p-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
              <Compass className="w-7 h-7 text-stone-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">404</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 tracking-tight">
              Сторінку не знайдено
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
              Схоже, ця сторінка не існує або була переміщена. Перевірте адресу або поверніться на головну.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              На головну
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Зв'язатися з нами
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
