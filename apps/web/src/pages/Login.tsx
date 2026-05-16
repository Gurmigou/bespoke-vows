import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import weddingPhoto from "@/img/story-photo-1.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(1, "Введіть пароль"),
});

type FormValues = z.infer<typeof schema>;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as { from?: string } | null)?.from ?? null;
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const { claimedInvitationId } = await login(values.email, values.password);
      const intent = localStorage.getItem("bv:postLoginIntent");
      if (intent === "pay" && claimedInvitationId) {
        localStorage.removeItem("bv:postLoginIntent");
        navigate(`/account?pay=${claimedInvitationId}`);
        return;
      }
      if (claimedInvitationId) {
        navigate(`/builder?id=${claimedInvitationId}`);
        return;
      }
      const returnTo = sessionStorage.getItem("bv:loginReturnTo");
      if (returnTo && returnTo.startsWith("/preview")) {
        sessionStorage.removeItem("bv:loginReturnTo");
        navigate(returnTo, { replace: true });
        return;
      }
      if (fromState && fromState.startsWith("/preview")) {
        navigate(fromState, { replace: true });
        return;
      }
      sessionStorage.removeItem("bv:loginReturnTo");
      navigate("/templates");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setServerError("Неправильний email або пароль");
      } else {
        setServerError("Помилка з'єднання");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setServerError("Google-авторизація тимчасово недоступна");
  };

  return (
    <div className="flex min-h-screen font-geologica bg-background">
      {/* Left — wedding photo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={weddingPhoto}
          alt="Wedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/70" />

        <Link
          to="/"
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На головну
        </Link>

        <div className="relative z-10 mt-auto p-12 text-white max-w-lg">
          <p
            className="text-4xl xl:text-5xl leading-tight italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            «Кохання — це найкрасивіша історія, яку варто розповісти красиво.»
          </p>
          <p className="mt-5 text-sm text-white/70 tracking-[0.2em] uppercase">
            Beloved
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12 lg:py-16 overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative w-full max-w-md space-y-8">
          {/* Mobile back link */}
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На головну
          </Link>

          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight text-foreground hover:text-pink-500 transition-colors"
            >
              Beloved
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground">
              З поверненням,{" "}
              <span
                className="text-pink-500 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                закохані
              </span>
            </h1>
            <p className="text-foreground/60">
              Немає акаунту?{" "}
              <Link to="/register" className="text-pink-500 hover:text-pink-600 font-medium underline-offset-4 hover:underline">
                Зареєструватися
              </Link>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="w-full h-12 rounded-full border-foreground/15 bg-white/70 backdrop-blur hover:bg-white text-foreground font-medium gap-3 shadow-sm"
          >
            <GoogleIcon />
            Продовжити з Google
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-foreground/40">
              або email
            </span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className="h-12 rounded-xl border-foreground/15 bg-white/70 backdrop-blur focus-visible:ring-pink-300 focus-visible:border-pink-300"
              />
              {errors.email && (
                <p className="text-xs text-destructive pt-0.5">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                  Пароль
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-foreground/50 hover:text-pink-500 transition-colors"
                >
                  Забули?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="h-12 pr-11 rounded-xl border-foreground/15 bg-white/70 backdrop-blur focus-visible:ring-pink-300 focus-visible:border-pink-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive pt-0.5">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-sm disabled:opacity-70"
            >
              {loading ? "Вхід…" : "Увійти"}
            </Button>
          </form>

          <p className="text-center text-xs text-foreground/40 leading-relaxed">
            Продовжуючи, ви погоджуєтесь з{" "}
            <Link to="/terms" className="hover:text-foreground underline-offset-4 hover:underline">
              умовами використання
            </Link>{" "}
            та{" "}
            <Link to="/terms" className="hover:text-foreground underline-offset-4 hover:underline">
              політикою конфіденційності
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
