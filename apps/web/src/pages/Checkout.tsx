import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Infinity as InfinityIcon } from "lucide-react";
import type { Invitation } from "@bespoke-vows/shared";
import { PRICE_INVITATION_1Y_UAH, PRICE_LIFETIME_UAH } from "@bespoke-vows/shared";
import { invitations as invApi, payments as paymentsApi, ApiError } from "@/lib/api";
import { getTemplateDefinition } from "@/components/invitation/templates/registry";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutProps {
  mode?: "invitation" | "lifetime";
}

function coupleName(inv: Invitation) {
  const d = inv.config;
  if (d?.hisName && d?.herName) return `${d.hisName} & ${d.herName}`;
  return "Без назви";
}

function MiniPreview({ inv }: { inv: Invitation }) {
  const template = getTemplateDefinition(inv.templateSlug);
  const t = template.thumbnail;
  const names =
    inv.config?.hisName && inv.config?.herName
      ? `${inv.config.hisName} & ${inv.config.herName}`
      : t.headerText;

  return (
    <>
      <style>{t.fontFaces}</style>
      <div
        className="rounded-2xl overflow-hidden flex-shrink-0"
        style={{
          width: 120,
          height: 160,
          backgroundColor: t.bg,
          boxShadow: `0 8px 24px -6px ${t.accent}40`,
        }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
          <div className="h-px w-6" style={{ backgroundColor: t.accent, opacity: 0.5 }} />
          <p
            className={`${t.fontClass} text-center leading-tight`}
            style={{ color: t.text, fontSize: 13 }}
          >
            {names}
          </p>
          <div className="h-px w-6" style={{ backgroundColor: t.accent, opacity: 0.5 }} />
          {inv.config?.weddingDate && (
            <p
              className="text-center"
              style={{ color: t.text, opacity: 0.5, fontSize: 8, letterSpacing: "0.1em" }}
            >
              {inv.config.weddingDate}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const PERKS_INVITATION = [
  "1 обраний шаблон",
  "Активне посилання 1 рік",
  "Необмежені перегляди гостями",
  "Редагування контенту будь-коли",
];

const PERKS_LIFETIME = [
  "Усі шаблони, а також нові безкоштовно",
  "Безлімітна кількість запрошень",
  "Без терміну дії — назавжди",
  "Зміна шаблону в будь-який момент",
  "Пріоритетна підтримка",
];

export default function Checkout({ mode = "invitation" }: CheckoutProps) {
  const isLifetime = mode === "lifetime";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(!isLifetime);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (isLifetime) {
      if (user.subscriptionStatus === "pro") { navigate("/invitations"); return; }
      return;
    }
    if (!id) { navigate("/invitations"); return; }
    invApi.get(id)
      .then(setInv)
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'invitation_deleted') {
          navigate("/invitation-deleted");
        } else {
          navigate("/invitations");
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate, user, authLoading, isLifetime]);

  const handlePay = async () => {
    setPaying(true);
    setError(null);
    try {
      if (isLifetime) {
        await paymentsApi.payLifetime();
        navigate("/payment-success");
        return;
      }
      if (!id) return;
      await invApi.pay(id);
      navigate("/payment-success");
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
        return;
      }
      if (err instanceof ApiError && err.code === 'already_lifetime') {
        navigate("/invitations");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Помилка оплати. Спробуйте ще раз.");
      setPaying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-geologica bg-white">
        <p className="text-foreground/30 text-sm">Завантаження…</p>
      </div>
    );
  }

  if (!isLifetime && !inv) return null;

  if (!isLifetime && inv && inv.paymentStatus === "paid") {
    return (
      <div className="min-h-screen font-geologica bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Замовлення вже оплачено</p>
              <p className="text-sm text-foreground/45 mt-1">
                Це запрошення вже активне — повторна оплата не потрібна.
              </p>
            </div>
            <Link
              to="/invitations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-foreground/12 text-sm font-medium text-foreground/60 hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              Мої запрошення
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const template = inv ? getTemplateDefinition(inv.templateSlug) : null;
  const priceUah = isLifetime ? PRICE_LIFETIME_UAH : PRICE_INVITATION_1Y_UAH;
  const priceLabel = isLifetime ? "одноразово · назавжди" : "одноразово · 1 рік";
  const perks = isLifetime ? PERKS_LIFETIME : PERKS_INVITATION;

  return (
    <div className="min-h-screen font-geologica bg-white flex flex-col">

      <div className="border-b border-foreground/6 px-6 py-4">
        <Link
          to={isLifetime ? "/pricing" : "/invitations"}
          className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Назад
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col gap-6">

          {isLifetime ? (
            <div className="flex items-center gap-4">
              <div
                className="rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-100 via-rose-100 to-pink-100"
                style={{ width: 120, height: 160 }}
              >
                <InfinityIcon className="h-10 w-10 text-rose-500" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-base leading-tight">
                  Усі шаблони назавжди
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  Безлімітні запрошення · без терміну дії
                </p>
              </div>
            </div>
          ) : inv && template && (
            <div className="flex items-center gap-4">
              <MiniPreview inv={inv} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-base leading-tight truncate">
                  {coupleName(inv)}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">{template.name}</p>
              </div>
            </div>
          )}

          <div className="h-px bg-foreground/6" />

          <div className="flex flex-col gap-2.5">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2.5">
                <Check className="h-3.5 w-3.5 text-foreground/30 flex-shrink-0" />
                <span className="text-sm text-foreground/60">{perk}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-foreground/6" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-foreground/50">Разом</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground">{priceUah} ₴</span>
              <p className="text-[11px] text-foreground/30">{priceLabel}</p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/5 rounded-xl px-3.5 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full h-13 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ height: 52, backgroundColor: "#000", color: "#fff" }}
          >
            {paying ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                Обробка…
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-[6px] px-2 py-0.5 font-bold text-black bg-white text-[12px] leading-none">
                    plata
                  </span>
                  <span className="font-bold text-white text-[14px]">by mono</span>
              </span>
            )}
          </button>

          <p className="text-center text-[11px] text-foreground/30 leading-relaxed">
            Оплата обробляється monobank.{" "}
            Ми не зберігаємо дані картки.
          </p>

        </div>
      </div>
    </div>
  );
}
