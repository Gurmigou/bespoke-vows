import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Crown, Trash2, Eye, EyeOff, Edit2, Sparkles,
  LayoutGrid, MoreVertical, Plus, ExternalLink, Link2, Check, Info, QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Invitation } from "@bespoke-vows/shared";
import { invitations as invApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import QRCodeStyling from "qr-code-styling";

function buildHeartLogo(primary: string, accent: string) {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}"/>
            <stop offset="100%" stop-color="${accent}"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="22" fill="white"/>
        <path d="M50 80 C 18 60, 12 38, 26 26 C 38 16, 50 24, 50 36 C 50 24, 62 16, 74 26 C 88 38, 82 60, 50 80 Z" fill="url(#h)"/>
      </svg>`
    )
  );
}

async function downloadInvitationQr(
  url: string,
  fileName: string,
  colors: { primary: string; accent: string; text: string },
) {
  const qrSize = 1024;
  const qr = new QRCodeStyling({
    width: qrSize,
    height: qrSize,
    type: "canvas",
    data: url,
    margin: 16,
    qrOptions: { errorCorrectionLevel: "H" },
    image: buildHeartLogo(colors.primary, colors.accent),
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: 0.22,
      hideBackgroundDots: true,
    },
    backgroundOptions: { color: "#ffffff" },
    dotsOptions: {
      type: "rounded",
      gradient: {
        type: "linear",
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: colors.primary },
          { offset: 1, color: colors.accent },
        ],
      },
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: colors.primary,
    },
    cornersDotOptions: {
      type: "dot",
      color: colors.accent,
    },
  });

  const blob = await qr.getRawData("png");
  if (!blob) return;
  const qrBlob = blob instanceof Blob ? blob : new Blob([blob as BlobPart], { type: "image/png" });
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(qrBlob);
  });

  const padding = 64;
  const borderWidth = 10;
  const radius = 80;
  const canvasSize = qrSize + padding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const inset = borderWidth / 2;
  drawRoundedRect(inset, inset, canvasSize - inset * 2, canvasSize - inset * 2, radius);
  const grad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  grad.addColorStop(0, colors.primary);
  grad.addColorStop(1, colors.accent);
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = grad;
  ctx.stroke();

  ctx.drawImage(qrImg, padding, padding, qrSize, qrSize);
  URL.revokeObjectURL(qrImg.src);

  const outBlob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(outBlob);
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const TEMPLATE_LABELS: Record<string, string> = {
  classic: "Класик",
  modern: "Модерн",
  floral: "Флорал",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

function coupleName(inv: Invitation) {
  const d = inv.config;
  if (d?.hisName && d?.herName) return `${d.hisName} & ${d.herName}`;
  return "Без назви";
}

type StatusMeta = { label: string; className: string };
function statusMeta(inv: Invitation): StatusMeta {
  if (inv.derivedStatus === "active" && !inv.visible) {
    return { label: "Прихований", className: "bg-foreground/[0.06] text-foreground/60 ring-1 ring-foreground/10" };
  }
  if (inv.derivedStatus === "active" && inv.paymentStatus === "paid") {
    return { label: "Активне · Paid", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60" };
  }
  if (inv.derivedStatus === "active" && inv.paymentStatus === "free") {
    return { label: "Активне · Free", className: "bg-green-50 text-green-700 ring-1 ring-green-200/60" };
  }
  if (inv.derivedStatus === "expired") {
    return { label: "Минуло", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60" };
  }
  return { label: "Чернетка", className: "bg-foreground/[0.06] text-foreground/60 ring-1 ring-foreground/10" };
}

function SimpleConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <p className="font-semibold text-foreground">Видалити запрошення?</p>
        <p className="text-sm text-foreground/60">Цю дію неможливо скасувати.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" className="rounded-full" onClick={onCancel}>Скасувати</Button>
          <Button variant="destructive" className="rounded-full" onClick={onConfirm}>Видалити</Button>
        </div>
      </div>
    </div>
  );
}

function InvitationCard({
  inv, onOpen, onEdit, onPreview, onHide, onDelete, onPublish, onPay,
}: {
  inv: Invitation;
  onOpen: () => void;
  onEdit: () => void;
  onPreview: () => void;
  onHide: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onPay: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrSaving, setQrSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = statusMeta(inv);
  const isActive = inv.derivedStatus === "active";
  const isDraft = inv.derivedStatus === "draft";
  const isExpired = inv.derivedStatus === "expired";
  const canFreeTrial = inv.freeTrialUsedAt === null;
  const canHide = isActive;
  const canCopyLink = isActive && inv.visible;

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/i/${inv.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleSaveQr = async () => {
    if (qrSaving) return;
    setQrSaving(true);
    try {
      const url = `${window.location.origin}/i/${inv.id}`;
      const slug = coupleName(inv).toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-а-яіїєґ]+/giu, "");
      const tc = inv.config?.templateColors;
      const colors = {
        primary: tc?.primary || "#1f1b1a",
        accent: tc?.accent || tc?.primary || "#1f1b1a",
        text: tc?.text || tc?.primary || "#1f1b1a",
      };
      await downloadInvitationQr(url, `beloved-${slug || inv.id}-qr`, colors);
    } finally {
      setQrSaving(false);
    }
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  useEffect(() => {
    if (!menuOpen) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuOpen]);

  const accentColor =
    isActive && inv.paymentStatus === "paid" ? "from-emerald-200/40 to-emerald-100/0"
    : isActive && inv.paymentStatus === "free" ? "from-green-200/40 to-green-100/0"
    : isExpired ? "from-amber-200/40 to-amber-100/0"
    : "from-foreground/[0.04] to-transparent";

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      className="group relative bg-white rounded-2xl border border-foreground/5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
    >
      <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accentColor} pointer-events-none`} />

      <div className="relative p-6 flex flex-col gap-5 flex-1">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-tight text-lg md:text-xl truncate">{coupleName(inv)}</p>
            <p className="text-sm text-foreground/55 mt-1.5">
              {TEMPLATE_LABELS[inv.templateSlug] ?? inv.templateSlug}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={stop}>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${meta.className}`}>
              {meta.label}
            </span>
            <div ref={menuRef} className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                className="h-8 w-8 flex items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/[0.06] transition-colors"
                aria-label="Меню"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-foreground/5 w-52 py-1.5 z-20">
                  <button
                    onClick={() => { onEdit(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-foreground/[0.04] transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 opacity-60" />
                    Редагувати
                  </button>
                  {isDraft && (
                    <button
                      onClick={() => { onPreview(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-foreground/[0.04] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                      Попередній перегляд
                    </button>
                  )}
                  {canHide && (
                    <button
                      onClick={() => { onHide(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-foreground/[0.04] transition-colors"
                    >
                      {!inv.visible
                        ? <Eye className="h-3.5 w-3.5 opacity-60" />
                        : <EyeOff className="h-3.5 w-3.5 opacity-60" />}
                      {!inv.visible ? "Показати" : "Приховати"}
                    </button>
                  )}
                  <div className="border-t border-foreground/5 my-1" />
                  <button
                    onClick={() => { onDelete(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Видалити
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-foreground/60 space-y-1.5 leading-relaxed">
          <p><span className="text-foreground/45">Створено:</span> {formatDate(inv.createdAt)}</p>
          {isActive && inv.activeUntil && (
            <p><span className="text-foreground/45">Активне до:</span> {formatDate(inv.activeUntil)}</p>
          )}
          {isDraft && canFreeTrial && (
            <p><span className="text-foreground/45">Безкоштовний пробний:</span> 3 дні</p>
          )}
          {isExpired && !canFreeTrial && (
            <p className="text-amber-700">Безкоштовний пробний використано — потрібна оплата.</p>
          )}
        </div>

        {isActive && !inv.visible && (
          <div className="flex gap-2.5 rounded-xl border border-sky-200/70 bg-sky-50/70 px-3.5 py-3">
            <Info className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-sky-700 leading-relaxed">
              Поки запрошення приховане, ваші гості не зможуть його переглянути. Після повернення показу посилання залишиться тим самим.
            </p>
          </div>
        )}

        {canCopyLink && (
          <div className="mt-auto pt-4 border-t border-foreground/5 space-y-2" onClick={stop}>
            <Button
              variant="outline"
              className="w-full gap-2 rounded-full h-11 text-sm font-semibold"
              onClick={(e) => { e.stopPropagation(); void handleCopyLink(); }}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Скопійовано" : "Копіювати посилання"}
            </Button>
            <Button
              variant="outline"
              disabled={qrSaving}
              className="w-full gap-2 rounded-full h-11 text-sm font-semibold"
              onClick={(e) => { e.stopPropagation(); void handleSaveQr(); }}
            >
              <QrCode className="h-4 w-4" />
              {qrSaving ? "Зберігаємо…" : "Зберегти QR-код запрошення"}
            </Button>
          </div>
        )}

        {(isDraft || isExpired) && (
          <div className="mt-auto pt-4 border-t border-foreground/5 space-y-2" onClick={stop}>
            {canFreeTrial && (
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full h-11 text-sm font-semibold"
                onClick={(e) => { e.stopPropagation(); onPublish(); }}
              >
                <Sparkles className="h-4 w-4" />
                {isExpired ? "Оновити (безкоштовно 3 дні)" : "Опублікувати (3 дні безкоштовно)"}
              </Button>
            )}
            <Button
              className="w-full gap-2 rounded-full h-11 text-sm font-semibold text-white border-0 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/20 hover:shadow-rose-500/30"
              onClick={(e) => { e.stopPropagation(); onPay(); }}
            >
              <Crown className="h-4 w-4" />
              Оплатити $9.99 (1 рік)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyInvitations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const inv = await invApi.list();
      setItems(inv);
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

  const intentHandledRef = useRef(false);
  useEffect(() => {
    if (intentHandledRef.current) return;
    if (loading || !items.length) return;
    const payId = searchParams.get("pay");
    const publishId = searchParams.get("publish");
    if (!payId && !publishId) return;
    intentHandledRef.current = true;
    const target = items.find((i) => i.id === (payId ?? publishId));
    if (target) {
      if (payId) {
        navigate(`/checkout/${target.id}`);
      } else if (publishId) {
        void handlePublishById(target);
      }
    }
    const next = new URLSearchParams(searchParams);
    next.delete("pay");
    next.delete("publish");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, items, searchParams]);

  const handlePublishById = async (inv: Invitation) => {
    try {
      await invApi.publish(inv.id);
      await fetchData();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else if (err instanceof ApiError && err.status === 402) {
        navigate(`/checkout/${inv.id}`);
      } else if (err instanceof ApiError && err.status === 409) {
        // already active — no-op
      } else {
        setActionError("Не вдалося опублікувати");
      }
    }
  };

  const handleEdit = (inv: Invitation) => navigate(`/builder?id=${inv.id}`);

  const handleOpen = async (inv: Invitation) => {
    if (inv.derivedStatus === "draft") {
      navigate(`/builder?id=${inv.id}`);
      return;
    }
    if (inv.derivedStatus === "active" && inv.visible) {
      navigate(`/i/${inv.id}`);
      return;
    }
    try {
      const { token } = await invApi.previewToken(inv.id);
      navigate(`/preview/${token}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else {
        setActionError("Не вдалося відкрити перегляд");
      }
    }
  };

  const handlePreview = async (inv: Invitation) => {
    try {
      const { token } = await invApi.previewToken(inv.id);
      navigate(`/preview/${token}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else {
        setActionError("Не вдалося відкрити перегляд");
      }
    }
  };

  const handleHide = async (inv: Invitation) => {
    try {
      await invApi.hide(inv.id, { visible: !inv.visible });
      await fetchData();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else {
        setActionError("Не вдалося оновити видимість");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await invApi.delete(id);
      setConfirmDeleteId(null);
      await fetchData();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        setConfirmDeleteId(null);
        await fetchData();
      } else {
        setActionError("Не вдалося видалити");
      }
    }
  };

  const handlePublish = async (inv: Invitation) => {
    try {
      await invApi.publish(inv.id);
      await fetchData();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else if (err instanceof ApiError && err.status === 402) {
        navigate(`/checkout/${inv.id}`);
      } else {
        setActionError("Не вдалося опублікувати");
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-geologica bg-[hsl(32,30%,97%)]">
        <p className="text-foreground/55 text-base">Завантаження…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-geologica bg-[hsl(32,30%,97%)]">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-500 mb-1.5">
              Колекція
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-geologica">
              Мої запрошення
            </h1>
          </div>
          <Button
            size="sm"
            className="rounded-full gap-1.5 px-5 shadow-sm"
            onClick={() => navigate("/templates")}
          >
            <Plus className="h-4 w-4" /> Нове
          </Button>
        </div>

        {actionError && (
          <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="text-xs underline">Закрити</button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-foreground/10 p-12 text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-foreground/[0.04] flex items-center justify-center mb-3">
              <LayoutGrid className="h-5 w-5 text-foreground/40" />
            </div>
            <p className="text-base text-foreground/60">У вас ще немає запрошень.</p>
            <Button className="mt-5 rounded-full" onClick={() => navigate("/templates")}>Створити перше</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((inv) => (
              <InvitationCard
                key={inv.id}
                inv={inv}
                onOpen={() => void handleOpen(inv)}
                onEdit={() => handleEdit(inv)}
                onPreview={() => void handlePreview(inv)}
                onHide={() => void handleHide(inv)}
                onDelete={() => setConfirmDeleteId(inv.id)}
                onPublish={() => void handlePublish(inv)}
                onPay={() => navigate(`/checkout/${inv.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <SimpleConfirm
          onConfirm={() => void handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
