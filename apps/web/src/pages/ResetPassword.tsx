import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import weddingPhoto from "@/img/story-photo-1.jpg";
import { ApiError, auth } from "@/lib/api";
import { toast } from "sonner";

const schema = z
  .object({
    password: z.string().min(8, "Мінімум 8 символів"),
    confirmPassword: z.string().min(1, "Повторіть пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
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
      await auth.resetPassword({ token, password: values.password });
      toast.success("Пароль змінено. Увійдіть з новим паролем.");
      navigate("/login", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === "invalid_or_expired_token") {
        setTokenInvalid(true);
      } else if (err instanceof ApiError && err.code === "password_too_short") {
        setServerError("Пароль занадто короткий (мінімум 8 символів)");
      } else {
        setServerError("Помилка з'єднання");
      }
    } finally {
      setLoading(false);
    }
  };

  const showInvalid = !token || tokenInvalid;

  return (
    <div className="flex min-h-screen font-geologica bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={weddingPhoto}
          alt="Wedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-foreground/70" />

        <Link
          to="/login"
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          До входу
        </Link>

        <div className="relative z-10 mt-auto p-12 text-white max-w-lg">
          <p
            className="text-4xl xl:text-5xl leading-tight italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            «Новий розділ починається з одного впевненого кроку.»
          </p>
          <p className="mt-5 text-sm text-white/70 tracking-[0.2em] uppercase">
            Beloved
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 py-12 lg:py-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative w-full max-w-md space-y-8">
          <Link
            to="/login"
            className="lg:hidden inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            До входу
          </Link>

          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight text-foreground hover:text-pink-500 transition-colors"
            >
              Beloved
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground">
              Новий{" "}
              <span
                className="text-pink-500 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                пароль
              </span>
            </h1>
            <p className="text-foreground/60">
              Створіть надійний пароль для вашого акаунту.
            </p>
          </div>

          {showInvalid ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive">
                Посилання недійсне або вже використане. Спробуйте запросити нове.
              </div>
              <Link
                to="/forgot-password"
                className="block text-center text-sm text-pink-500 hover:text-pink-600 font-medium underline-offset-4 hover:underline"
              >
                Запросити нове посилання
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                  Новий пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                  Повторіть пароль
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className="h-12 pr-11 rounded-xl border-foreground/15 bg-white/70 backdrop-blur focus-visible:ring-pink-300 focus-visible:border-pink-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive pt-0.5">{errors.confirmPassword.message}</p>
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
                {loading ? "Зберігаємо…" : "Змінити пароль"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
