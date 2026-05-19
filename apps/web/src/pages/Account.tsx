import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, Calendar, Mail, User as UserIcon, CreditCard, Sparkles, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Payment } from "@bespoke-vows/shared";
import { payments as paymentsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const TEMPLATE_LABELS: Record<string, string> = {
  classic: "Класик",
  modern: "Модерн",
  floral: "Флорал",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

function DeleteAccountDialog({ email, onConfirm, onCancel }: { email: string; onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Видалити акаунт?</p>
            <p className="text-sm text-foreground/60 mt-1">
              Всі ваші дані та запрошення будуть видалені назавжди. Оплачені кошти не повертаються.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-foreground/60">
            Введіть ваш email <strong>{email}</strong>, щоб підтвердити:
          </p>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={email} />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" className="rounded-full" onClick={onCancel}>Скасувати</Button>
          <Button variant="destructive" className="rounded-full" disabled={typed !== email} onClick={onConfirm}>
            Видалити акаунт
          </Button>
        </div>
      </div>
    </div>
  );
}

type NavSection = "account" | "payments";

const SECTION_TITLES: Record<NavSection, { eyebrow: string; title: string }> = {
  account:  { eyebrow: "Профіль", title: "Акаунт" },
  payments: { eyebrow: "Біллінг", title: "Історія платежів" },
};

export default function Account() {
  const navigate = useNavigate();
  const { user, loading: authLoading, deleteAccount, logout } = useAuth();
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>("account");
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const pays = await paymentsApi.list();
      setPaymentsList(pays);
    } catch {
      // unauthenticated — redirect handled below
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    void fetchData();
  }, [authLoading, user, fetchData, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      setActionError("Не вдалося вийти з акаунту");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/");
    } catch {
      setActionError("Не вдалося видалити акаунт");
    }
  };

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "account",  label: "Акаунт",  icon: <UserIcon className="h-4 w-4" /> },
    { id: "payments", label: "Платежі", icon: <CreditCard className="h-4 w-4" />, badge: paymentsList.length || undefined },
  ];

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-geologica bg-[hsl(32,30%,97%)]">
        <p className="text-foreground/55 text-base">Завантаження…</p>
      </div>
    );
  }

  const sectionTitle = SECTION_TITLES[activeSection];

  return (
    <div className="min-h-screen font-geologica bg-[hsl(32,30%,97%)]">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">

        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center flex-shrink-0 shadow-sm shadow-pink-500/20">
              <span className="text-base font-bold text-white">
                {user?.email?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/40">Вітаємо</p>
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  activeSection === item.id
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/65 bg-white border border-foreground/5 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 leading-none ${
                    activeSection === item.id ? "bg-white/20 text-background" : "bg-foreground/[0.06] text-foreground/60"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex gap-10 items-start">

          <aside className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl border border-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-5 mb-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-pink-300/50 via-rose-200/40 to-amber-200/50 rounded-full blur-md" />
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-sm shadow-pink-500/20">
                    <span className="text-xl font-bold text-white">
                      {user?.email?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                </div>
                <div className="text-center min-w-0 w-full">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1">Вітаємо</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-2 space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeSection === item.id
                      ? "bg-foreground text-background shadow-sm"
                      : "text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] rounded-full px-1.5 py-0.5 leading-none ${
                      activeSection === item.id ? "bg-white/20 text-background" : "bg-foreground/[0.06] text-foreground/60"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">

            <div className="mb-6">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-500 mb-1.5">
                {sectionTitle.eyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-geologica">
                {sectionTitle.title}
              </h2>
            </div>

            {actionError && (
              <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between">
                <span>{actionError}</span>
                <button onClick={() => setActionError(null)} className="text-xs underline">Закрити</button>
              </div>
            )}

            {activeSection === "account" && (
              <section className="space-y-4">
                <div className="bg-white rounded-2xl border border-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] divide-y divide-foreground/5 overflow-hidden">

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-10 w-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-foreground/55" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/55">Email</p>
                      <p className="text-base font-medium text-foreground break-all mt-0.5">{user?.email ?? "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-10 w-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-foreground/55" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-foreground/55">Дата реєстрації</p>
                      <p className="text-base font-medium text-foreground mt-0.5">
                        {user?.createdAt ? formatDate(user.createdAt) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-10 w-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-foreground/55" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-foreground/55">Мої запрошення</p>
                      <button
                        onClick={() => navigate("/invitations")}
                        className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors mt-0.5"
                      >
                        Переглянути запрошення →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Вийти з акаунту</p>
                      <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
                        Завершити сесію на цьому пристрої. Ви зможете увійти знову в будь-який час.
                      </p>
                    </div>
                    <button
                      onClick={() => void handleLogout()}
                      className="flex-shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground border border-foreground/15 rounded-full px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-200"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Вийти
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-destructive">Небезпечна зона</p>
                      <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
                        Видалення акаунту незворотне — всі запрошення та дані будуть втрачені назавжди.
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteAccountOpen(true)}
                      className="flex-shrink-0 text-xs font-semibold text-destructive border border-destructive/30 rounded-full px-4 py-2 hover:bg-destructive hover:text-white transition-all duration-200"
                    >
                      Видалити акаунт
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "payments" && (
              <section>
                {paymentsList.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-foreground/10 p-12 text-center">
                    <div className="h-12 w-12 mx-auto rounded-full bg-foreground/[0.04] flex items-center justify-center mb-3">
                      <CreditCard className="h-5 w-5 text-foreground/40" />
                    </div>
                    <p className="text-base text-foreground/60">Платежів ще немає.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead>
                        <tr className="border-b border-foreground/5">
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/45">Запрошення</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/45">Шаблон</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/45">Сума</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/45">Дата</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/45">Активне до</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsList.map((p) => (
                          <tr key={p.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                            <td className="px-5 py-4 font-medium">{p.couple || "—"}</td>
                            <td className="px-5 py-4 text-foreground/55">{TEMPLATE_LABELS[p.templateSlug] ?? p.templateSlug}</td>
                            <td className="px-5 py-4 text-emerald-600 font-semibold">
                              {(p.amount / 100).toFixed(2)} {p.currency}
                            </td>
                            <td className="px-5 py-4 text-foreground/55">{formatDate(p.createdAt)}</td>
                            <td className="px-5 py-4 text-foreground/55">{p.activeUntil ? formatDate(p.activeUntil) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </div>

      {deleteAccountOpen && user && (
        <DeleteAccountDialog
          email={user.email}
          onConfirm={() => void handleDeleteAccount()}
          onCancel={() => setDeleteAccountOpen(false)}
        />
      )}
    </div>
  );
}
