import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import weddingPhoto from "@/img/story-photo-1.jpg";
import { auth } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Введіть коректний email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
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
      await auth.forgotPassword({ email: values.email });
      setSubmitted(true);
    } catch {
      setServerError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

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
            «Іноді щоб знайти шлях додому, потрібно лише згадати ключ.»
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
              Забули{" "}
              <span
                className="text-pink-500 italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                пароль?
              </span>
            </h1>
            <p className="text-foreground/60">
              Введіть email — надішлемо посилання для зміни паролю.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-pink-200/60 bg-pink-50/60 px-4 py-4 text-sm text-foreground/80">
                Якщо обліковий запис з цією поштою існує, ми надіслали лист з посиланням для зміни паролю. Перевірте вашу скриньку.
              </div>
              <Link
                to="/login"
                className="block text-center text-sm text-pink-500 hover:text-pink-600 font-medium underline-offset-4 hover:underline"
              >
                Повернутись до входу
              </Link>
            </div>
          ) : (
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
                {loading ? "Надсилаємо…" : "Надіслати посилання"}
              </Button>

              <p className="text-center text-sm text-foreground/60">
                Згадали пароль?{" "}
                <Link to="/login" className="text-pink-500 hover:text-pink-600 font-medium underline-offset-4 hover:underline">
                  Увійти
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
