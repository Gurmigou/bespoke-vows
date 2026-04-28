import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown, Trash2, Eye, EyeOff, Edit2, RotateCcw, Sparkles,
  AlertTriangle, Calendar, Mail, Star, User as UserIcon, CreditCard, LayoutGrid,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Invitation, User, DerivedStatus } from "@bespoke-vows/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const IS_DEV = import.meta.env.DEV;

// ── mock data (shown when API is unreachable in development) ─────────────────

const MOCK_USER: User = {
  id: "mock-user-1",
  email: "sofia@example.com",
  name: "",
  avatarUrl: null,
  createdAt: "2025-01-15T10:00:00.000Z",
};

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "mock-inv-1",
    userId: "mock-user-1",
    templateId: "classic",
    derivedStatus: "active_paid",
    publishedAt: "2025-03-01T10:00:00.000Z",
    lastPublishedAt: "2025-03-01T10:00:00.000Z",
    freeActiveDaysUsed: 1,
    paidUntil: "2026-03-01T10:00:00.000Z",
    config: { hisName: "Михайло", herName: "Софія" } as never,
    hidden: false,
    deletedAt: null,
    createdAt: "2025-02-20T09:00:00.000Z",
    updatedAt: "2025-03-01T10:00:00.000Z",
  },
  {
    id: "mock-inv-2",
    userId: "mock-user-1",
    templateId: "floral",
    derivedStatus: "active_free",
    publishedAt: "2026-04-25T08:00:00.000Z",
    lastPublishedAt: "2026-04-25T08:00:00.000Z",
    freeActiveDaysUsed: 2,
    paidUntil: null,
    config: { hisName: "Олексій", herName: "Анна" } as never,
    hidden: false,
    deletedAt: null,
    createdAt: "2026-04-20T11:00:00.000Z",
    updatedAt: "2026-04-25T08:00:00.000Z",
  },
  {
    id: "mock-inv-3",
    userId: "mock-user-1",
    templateId: "modern",
    derivedStatus: "expired",
    publishedAt: "2025-12-01T10:00:00.000Z",
    lastPublishedAt: "2025-12-01T10:00:00.000Z",
    freeActiveDaysUsed: 5,
    paidUntil: null,
    config: { hisName: "Тарас", herName: "Оксана" } as never,
    hidden: false,
    deletedAt: null,
    createdAt: "2025-11-15T14:00:00.000Z",
    updatedAt: "2025-12-02T10:00:00.000Z",
  },
  {
    id: "mock-inv-4",
    userId: "mock-user-1",
    templateId: "classic",
    derivedStatus: "draft",
    publishedAt: null,
    lastPublishedAt: null,
    freeActiveDaysUsed: 0,
    paidUntil: null,
    config: {} as never,
    hidden: false,
    deletedAt: null,
    createdAt: "2026-04-10T16:00:00.000Z",
    updatedAt: "2026-04-10T16:00:00.000Z",
  },
];

const MOCK_TRASH: Invitation[] = [
  {
    id: "mock-trash-1",
    userId: "mock-user-1",
    templateId: "modern",
    derivedStatus: "expired",
    publishedAt: "2025-06-01T10:00:00.000Z",
    lastPublishedAt: "2025-06-01T10:00:00.000Z",
    freeActiveDaysUsed: 3,
    paidUntil: "2026-06-01T10:00:00.000Z",
    config: { hisName: "Іван", herName: "Марія" } as never,
    hidden: false,
    deletedAt: "2026-01-10T12:00:00.000Z",
    createdAt: "2025-05-20T09:00:00.000Z",
    updatedAt: "2026-01-10T12:00:00.000Z",
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

function coupleName(inv: Invitation) {
  const d = inv.config as { hisName?: string; herName?: string };
  if (d?.hisName && d?.herName) return `${d.hisName} & ${d.herName}`;
  return "Без назви";
}

const TEMPLATE_LABELS: Record<string, string> = {
  classic: "Класик",
  modern: "Модерн",
  floral: "Флорал",
};

type StatusMeta = { label: string; className: string };
function statusMeta(inv: Invitation): StatusMeta {
  if (inv.hidden) return { label: "Прихований", className: "bg-gray-100 text-gray-600" };
  switch (inv.derivedStatus as DerivedStatus) {
    case "active_paid": return { label: "Активне · Paid", className: "bg-emerald-50 text-emerald-700" };
    case "active_free": return { label: "Активне · Free", className: "bg-green-50 text-green-700" };
    case "expired":     return { label: "Минуло",         className: "bg-amber-50 text-amber-700" };
    case "locked":      return { label: "Заблоковано",    className: "bg-red-50 text-red-600" };
    default:            return { label: "Чернетка",       className: "bg-gray-100 text-gray-500" };
  }
}

function isActive(inv: Invitation) {
  return inv.derivedStatus === "active_free" || inv.derivedStatus === "active_paid";
}

// ── confirm-delete dialog (free invitations) ─────────────────────────────────

function SimpleConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <p className="font-semibold text-foreground">Видалити запрошення?</p>
        <p className="text-sm text-muted-foreground">Цю дію неможливо скасувати.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Скасувати</Button>
          <Button variant="destructive" onClick={onConfirm}>Видалити</Button>
        </div>
      </div>
    </div>
  );
}

// ── permanent-delete dialog (from trash) ─────────────────────────────────────

function PermanentDeleteDialog({
  inv,
  onConfirm,
  onCancel,
}: {
  inv: Invitation;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [typed, setTyped] = useState("");
  const required = "ВИДАЛИТИ";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Остаточне видалення</p>
            <p className="text-sm text-muted-foreground mt-1">
              Запрошення <strong>{coupleName(inv)}</strong> буде видалено назавжди.
              {inv.paidUntil && " Оплачена сума не повертається."}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Введіть <strong>{required}</strong>, щоб підтвердити:
          </p>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={required}
            className="font-mono"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Скасувати</Button>
          <Button
            variant="destructive"
            disabled={typed !== required}
            onClick={onConfirm}
          >
            Видалити назавжди
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── invitation card ───────────────────────────────────────────────────────────

function InvitationCard({
  inv,
  onEdit,
  onHide,
  onDelete,
  onPublish,
}: {
  inv: Invitation;
  onEdit: () => void;
  onHide: () => void;
  onDelete: () => void;
  onPublish: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = statusMeta(inv);
  const canPublish = ["draft", "expired"].includes(inv.derivedStatus) && !inv.hidden;
  const canHide = isActive(inv) || inv.hidden;
  const freeDaysLeft = 7 - inv.freeActiveDaysUsed;

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

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 bg-primary/60" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* title + badge + three-dots */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-tight text-base">{coupleName(inv)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {TEMPLATE_LABELS[inv.templateId] ?? inv.templateId}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${meta.className}`}>
              {meta.label}
            </span>
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-border w-44 py-1.5 z-20">
                  <button
                    onClick={() => { onEdit(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 opacity-60" />
                    Редагувати
                  </button>
                  {canHide && (
                    <button
                      onClick={() => { onHide(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
                    >
                      {inv.hidden
                        ? <Eye className="h-3.5 w-3.5 opacity-60" />
                        : <EyeOff className="h-3.5 w-3.5 opacity-60" />}
                      {inv.hidden ? "Показати" : "Приховати"}
                    </button>
                  )}
                  <div className="border-t border-border my-1" />
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

        {/* dates */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Створено: {formatDate(inv.createdAt)}</p>
          {inv.paidUntil && <p>Оплачено до: {formatDate(inv.paidUntil)}</p>}
          {!inv.paidUntil && freeDaysLeft > 0 && (
            <p>Безкоштовних днів залишилось: {freeDaysLeft}</p>
          )}
        </div>

        {/* renew / publish button */}
        {canPublish && (
          <div className="mt-auto pt-3 border-t border-border">
            <Button
              size="sm"
              className="w-full gap-1.5"
              onClick={onPublish}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {inv.derivedStatus === "expired" ? "Оновити" : "Опублікувати"}
            </Button>
          </div>
        )}

        {inv.derivedStatus === "locked" && !inv.hidden && (
          <div className="mt-auto pt-3 border-t border-border">
            <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => {}}>
              <Crown className="h-3.5 w-3.5" />
              Перейти на Paid
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── trash card ────────────────────────────────────────────────────────────────

function TrashCard({
  inv,
  onRestore,
  onPermanentDelete,
}: {
  inv: Invitation;
  onRestore: () => void;
  onPermanentDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white rounded-2xl border border-dashed border-destructive/30 flex flex-col">
      <div className="p-5 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{coupleName(inv)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {TEMPLATE_LABELS[inv.templateId] ?? inv.templateId} · Видалено {inv.deletedAt ? formatDate(inv.deletedAt) : ""}
          </p>
          {inv.paidUntil && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <Crown className="h-3 w-3" /> Оплачене запрошення
            </p>
          )}
        </div>
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-border w-48 py-1.5 z-20">
              <button
                onClick={() => { onRestore(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 opacity-60" />
                Відновити
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => { onPermanentDelete(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/8 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Видалити назавжди
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── delete account dialog ─────────────────────────────────────────────────────

function DeleteAccountDialog({ email, onConfirm, onCancel }: { email: string; onConfirm: () => void; onCancel: () => void }) {
  const [typed, setTyped] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Видалити акаунт?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Всі ваші дані та запрошення будуть видалені назавжди. Оплачені кошти не повертаються.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Введіть ваш email <strong>{email}</strong>, щоб підтвердити:
          </p>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={email} />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Скасувати</Button>
          <Button variant="destructive" disabled={typed !== email} onClick={onConfirm}>
            Видалити акаунт
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

type NavSection = "account" | "payments" | "invitations" | "trash";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [trash, setTrash] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>("account");

  // dialogs
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [permanentDeleteInv, setPermanentDeleteInv] = useState<Invitation | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, invRes, trashRes] = await Promise.all([
        fetch(`${API_URL}/auth/me`, { credentials: "include" }),
        fetch(`${API_URL}/invitations`, { credentials: "include" }),
        fetch(`${API_URL}/invitations/trash`, { credentials: "include" }),
      ]);
      if (meRes.ok) setUser(await meRes.json());
      if (invRes.ok) setInvitations(await invRes.json());
      if (trashRes.ok) setTrash(await trashRes.json());
    } catch {
      if (IS_DEV) {
        setUser(MOCK_USER);
        setInvitations(MOCK_INVITATIONS);
        setTrash(MOCK_TRASH);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── actions ──────────────────────────────────────────────────────────────

  const handleEdit = (inv: Invitation) => {
    navigate(`/builder?template=${inv.templateId}&id=${inv.id}`);
  };

  const handleHide = async (inv: Invitation) => {
    const res = await fetch(`${API_URL}/invitations/${inv.id}/hide`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) fetchData();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`${API_URL}/invitations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setConfirmDeleteId(null);
      fetchData();
    }
  };

  const handlePublish = async (inv: Invitation) => {
    const res = await fetch(`${API_URL}/invitations/${inv.id}/publish`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) fetchData();
  };

  const handleDeleteAccount = async () => {
    const res = await fetch(`${API_URL}/auth/account`, { method: "DELETE", credentials: "include" });
    if (res.ok) navigate("/");
  };

  const handleRestore = async (inv: Invitation) => {
    const res = await fetch(`${API_URL}/invitations/${inv.id}/restore`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) fetchData();
  };

  const handlePermanentDelete = async (inv: Invitation) => {
    const res = await fetch(`${API_URL}/invitations/${inv.id}/permanent`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setPermanentDeleteInv(null);
      fetchData();
    }
  };

  const requestDelete = (inv: Invitation) => {
    const isPaid = inv.paidUntil !== null;
    if (isPaid) {
      handleDelete(inv.id);
    } else {
      setConfirmDeleteId(inv.id);
    }
  };

  // ── derived ──────────────────────────────────────────────────────────────
  const paidInvitations = [...invitations, ...trash].filter((i) => i.paidUntil !== null);
  const hasPaidPlan = invitations.some((i) => i.paidUntil && new Date(i.paidUntil) > new Date());

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "account",     label: "Акаунт",    icon: <UserIcon className="h-4 w-4" /> },
    { id: "payments",    label: "Платежі",   icon: <CreditCard className="h-4 w-4" />, badge: paidInvitations.length || undefined },
    { id: "invitations", label: "Запрошення", icon: <LayoutGrid className="h-4 w-4" />, badge: invitations.length || undefined },
    { id: "trash",       label: "Кошик",     icon: <Trash2 className="h-4 w-4" />, badge: trash.length || undefined },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-geologica">
        <p className="text-muted-foreground text-base">Завантаження…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-geologica">
      <div className="container mx-auto max-w-4xl px-4 py-6 md:py-10">

        {/* ── Mobile nav ─────────────────────────────────────────────────── */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-base font-bold text-primary">
                {user?.email?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {user?.email ?? "—"}
            </p>
          </div>
          <nav className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  activeSection === item.id
                    ? "bg-foreground/8 text-foreground"
                    : "text-muted-foreground bg-muted/40 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-xs bg-white/80 rounded-full px-1.5 py-0.5 leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar nav ───────────────────────────────────────────────── */}
          <aside className="hidden md:flex flex-col w-52 flex-shrink-0 sticky top-6">
            {/* avatar + email */}
            <div className="flex flex-col items-center gap-2 mb-6 px-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {user?.email?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground text-center truncate w-full">
                {user?.email ?? "—"}
              </p>
            </div>

            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeSection === item.id
                      ? "bg-foreground/8 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-muted rounded-full px-1.5 py-0.5 leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {activeSection === "account" && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Акаунт</h2>
                <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-base font-medium text-foreground break-all mt-0.5">{user?.email ?? "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Дата реєстрації</p>
                      <p className="text-base font-medium text-foreground mt-0.5">
                        {user?.createdAt ? formatDate(user.createdAt) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Поточний план</p>
                      <p className="text-base font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                        {hasPaidPlan
                          ? <><Crown className="h-4 w-4 text-amber-500" /> Premium</>
                          : "Free"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Запрошень</p>
                      <p className="text-base font-medium text-foreground mt-0.5">{invitations.length}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <button
                      onClick={() => setDeleteAccountOpen(true)}
                      className="text-sm text-destructive/70 hover:text-destructive transition-colors"
                    >
                      Видалити акаунт
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "payments" && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Історія платежів</h2>
                {paidInvitations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="text-base text-muted-foreground">Платежів ще немає.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm min-w-[480px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Запрошення</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Шаблон</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Сума</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Активне до</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paidInvitations.map((inv) => (
                          <tr key={inv.id} className="border-b border-border last:border-0">
                            <td className="px-5 py-3 font-medium">{coupleName(inv)}</td>
                            <td className="px-5 py-3 text-muted-foreground">{TEMPLATE_LABELS[inv.templateId] ?? inv.templateId}</td>
                            <td className="px-5 py-3 text-emerald-600 font-semibold">$9.99</td>
                            <td className="px-5 py-3 text-muted-foreground">{inv.paidUntil ? formatDate(inv.paidUntil) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeSection === "invitations" && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Запрошення</h2>
                  <Button size="sm" onClick={() => navigate("/templates")}>+ Нове</Button>
                </div>

                {invitations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
                    <p className="text-base text-muted-foreground">У вас ще немає запрошень.</p>
                    <Button className="mt-4" onClick={() => navigate("/templates")}>Створити перше</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {invitations.map((inv) => (
                      <InvitationCard
                        key={inv.id}
                        inv={inv}
                        onEdit={() => handleEdit(inv)}
                        onHide={() => handleHide(inv)}
                        onDelete={() => requestDelete(inv)}
                        onPublish={() => handlePublish(inv)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeSection === "trash" && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground">
                  Кошик {trash.length > 0 && <span className="text-muted-foreground font-normal">({trash.length})</span>}
                </h2>

                {trash.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="text-base text-muted-foreground">Кошик порожній.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Платні запрошення зберігаються тут. Відновіть або видаліть назавжди.
                    </p>
                    {trash.map((inv) => (
                      <TrashCard
                        key={inv.id}
                        inv={inv}
                        onRestore={() => handleRestore(inv)}
                        onPermanentDelete={() => setPermanentDeleteInv(inv)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────────────────── */}
      {confirmDeleteId && (
        <SimpleConfirm
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {permanentDeleteInv && (
        <PermanentDeleteDialog
          inv={permanentDeleteInv}
          onConfirm={() => handlePermanentDelete(permanentDeleteInv)}
          onCancel={() => setPermanentDeleteInv(null)}
        />
      )}
      {deleteAccountOpen && user && (
        <DeleteAccountDialog
          email={user.email}
          onConfirm={handleDeleteAccount}
          onCancel={() => setDeleteAccountOpen(false)}
        />
      )}
    </div>
  );
}
