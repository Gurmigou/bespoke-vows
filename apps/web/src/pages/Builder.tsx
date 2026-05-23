import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type {
  InvitationData,
  LoveStoryMoment,
  WeddingEvent,
} from "@bespoke-vows/shared";
import { buildDefaultInvitationData as buildDefaultData } from "@bespoke-vows/shared";
import { BuilderPanel } from "@/components/builder/BuilderPanel";
import { InvitationPreview } from "@/components/invitation/InvitationPreview";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pencil } from "lucide-react";
import { getTemplateDefinition, getTemplateId } from "@/components/invitation/templates/registry";
import { PRESETS } from "@/components/builder/TemplateColorPicker";
import { invitations as invApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useInvitationDraft } from "@/hooks/useInvitationDraft";
import { writeAnonDraft, readAnonDraft } from "@/contexts/AuthContext";

export type { InvitationData, LoveStoryMoment, WeddingEvent };

const normalizeLoveStory = (raw: unknown): { moments: LoveStoryMoment[] } => {
  if (!raw || typeof raw !== "object") return { moments: [] };
  const ls = raw as Record<string, unknown>;
  if (Array.isArray(ls.moments)) {
    return {
      moments: (ls.moments as LoveStoryMoment[]).map((m, i) => ({
        id: m.id ?? `m-${i}-${Date.now()}`,
        title: m.title ?? "",
        description: m.description ?? "",
        image: m.image ?? "",
        imagePosition: m.imagePosition ?? { x: 50, y: 50 },
      })),
    };
  }
  return { moments: [] };
};

function buildDefaultInvitationData(): InvitationData {
  return buildDefaultData(PRESETS[0]);
}

const Builder = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [editorOpen, setEditorOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlInvitationId = searchParams.get("id");
  const requestedTemplate = searchParams.get("template");

  const [invitationId, setInvitationId] = useState<string | null>(urlInvitationId);
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | null>(null);
  const [serverConfig, setServerConfig] = useState<InvitationData | null>(null);
  const [isActiveInvitation, setIsActiveInvitation] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const templateId = useMemo(
    () => getTemplateId(requestedTemplate),
    [requestedTemplate]
  );
  const template = useMemo(() => getTemplateDefinition(templateId), [templateId]);

  const initial = useMemo<InvitationData>(() => {
    if (serverConfig) {
      return { ...serverConfig, loveStory: normalizeLoveStory(serverConfig.loveStory) };
    }
    return buildDefaultInvitationData();
  }, [serverConfig]);

  const { data, setData, flush, clearDraft } = useInvitationDraft({
    invitationId,
    templateId,
    initial,
    serverUpdatedAt,
  });

  // Load invitation when ?id= is present and user is authenticated
  const loadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!urlInvitationId) return;
    if (loadedRef.current === urlInvitationId) return;
    loadedRef.current = urlInvitationId;
    invApi
      .get(urlInvitationId)
      .then((inv) => {
        setInvitationId(inv.id);
        setServerUpdatedAt(inv.updatedAt);
        setServerConfig(inv.config);
        setIsActiveInvitation(inv.derivedStatus === "active");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login");
        } else if (err instanceof ApiError && err.code === 'invitation_deleted') {
          navigate("/invitation-deleted");
        } else {
          setLoadError("Не вдалося завантажити запрошення");
        }
      });
  }, [urlInvitationId, navigate]);

  // Mirror anon draft into localStorage with templateId so login can claim it
  useEffect(() => {
    if (invitationId) return;
    if (authLoading) return;
    if (user) return;
    writeAnonDraft({
      templateId,
      config: data,
      updatedAt: new Date().toISOString(),
    });
  }, [data, templateId, invitationId, user, authLoading]);

  // When template changes (via URL), reset to first preset for new invitations
  useEffect(() => {
    if (invitationId) return;
    setData((prev) => ({
      ...prev,
      templateColors: { ...PRESETS[0] },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id, invitationId]);

  // Dynamic accent color for resize divider
  useEffect(() => {
    const styleId = "accent-color-divider-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      .accent-divider {
        background-color: ${data.templateColors.accent}20 !important;
      }
      .accent-divider:hover {
        background-color: ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  const handleResetToDefault = async () => {
    if (invitationId) {
      try {
        const inv = await invApi.reset(invitationId);
        setServerUpdatedAt(inv.updatedAt);
        setServerConfig(inv.config);
        setData({ ...inv.config, loveStory: normalizeLoveStory(inv.config.loveStory) });
        clearDraft();
      } catch (err) {
        if (err instanceof ApiError && err.code === 'invitation_deleted') {
          navigate("/invitation-deleted");
        } else {
          setLoadError("Не вдалося скинути");
        }
      }
    } else {
      setData(buildDefaultInvitationData());
      clearDraft();
    }
  };

  const handlePreview = async () => {
    setActionBusy(true);
    try {
      await flush();
      let id = invitationId;
      if (!id) {
        if (!user) {
          // Anonymous preview: render directly from local state, no token / no auth.
          const existing = readAnonDraft();
          if (!existing) {
            writeAnonDraft({
              templateId,
              config: data,
              updatedAt: new Date().toISOString(),
            });
          }
          navigate("/preview", { state: { data, templateId } });
          return;
        }
        const created = await invApi.create({ templateId, config: data });
        id = created.id;
        setInvitationId(id);
        setServerUpdatedAt(created.updatedAt);
        setServerConfig(created.config);
        const next = new URLSearchParams(searchParams);
        next.set("id", id);
        setSearchParams(next, { replace: true });
      }
      const { token } = await invApi.previewToken(id);
      navigate(`/preview/${token}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
      } else if (err instanceof ApiError && err.code === 'invitation_deleted') {
        navigate("/invitation-deleted");
      } else {
        setLoadError("Не вдалося відкрити перегляд");
      }
    } finally {
      setActionBusy(false);
    }
  };

  const handleSave = async () => {
    setActionBusy(true);
    try {
      await flush();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setLoadError("Не вдалося зберегти зміни");
    } finally {
      setActionBusy(false);
    }
  };

  const builderPanel = (embedded: boolean) => (
    <BuilderPanel
      data={data}
      setData={setData as React.Dispatch<React.SetStateAction<InvitationData>>}
      templateId={templateId}
      isEditing={Boolean(invitationId)}
      isActiveInvitation={isActiveInvitation}
      onPublish={async () => {
        if (embedded) setEditorOpen(false);
        await handlePreview();
      }}
      onSave={async () => {
        await handleSave();
        if (embedded) setEditorOpen(false);
      }}
      onReset={handleResetToDefault}
      saveSuccess={saveSuccess}
      embedded={embedded}
    />
  );

  if (isMobile) {
    const isUpdate = Boolean(invitationId) && isActiveInvitation;
    const accent = data.templateColors.accent;
    const showAnonHint = !authLoading && !user;
    return (
      <div className="min-h-screen relative">
        {loadError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-destructive/20 bg-white shadow-lg px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        <div className="sticky top-0 z-30 flex flex-col gap-1.5 px-3 pt-2 pb-2 bg-white/85 backdrop-blur-md border-b" style={{ borderColor: `${accent}22` }}>
          <div className="flex items-center justify-center gap-2 text-[12px] text-slate-600">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: isUpdate ? "#10b981" : "#94a3b8" }}
            />
            <span className="font-medium">
              {isUpdate ? "Активне запрошення" : "Чернетка"}
            </span>
          </div>
          {showAnonHint && (
            <div
              className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11.5px] leading-snug"
              style={{ backgroundColor: `${accent}14`, color: "#475569" }}
            >
              <span className="shrink-0">💾</span>
              <span>
                Дані збережено лише у браузері.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold underline underline-offset-2"
                  style={{ color: accent }}
                >
                  Увійдіть
                </button>
                , щоб не втратити їх.
              </span>
            </div>
          )}
        </div>

        <div className="min-h-screen">
          <InvitationPreview data={data} templateId={templateId} />
        </div>

        <Drawer open={editorOpen} onOpenChange={setEditorOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              aria-label="Редагувати запрошення"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg active:scale-95 transition-transform"
              style={{
                backgroundColor: data.templateColors.accent,
                boxShadow: `0 10px 30px -8px ${data.templateColors.accent}99`,
              }}
            >
              <Pencil className="w-4 h-4" />
              Редагувати
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[92vh] p-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              {builderPanel(true)}
            </div>
          </DrawerContent>
        </Drawer>

        {actionBusy && (
          <div className="fixed bottom-24 right-4 z-50 rounded-full bg-foreground text-background text-xs px-3 py-2 shadow-lg">
            Зберігаємо…
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {loadError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-destructive/20 bg-white shadow-lg px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}

      <PanelGroup direction="horizontal">
        <Panel defaultSize={40} minSize={30} maxSize={60}>
          <BuilderPanel
            data={data}
            setData={setData as React.Dispatch<React.SetStateAction<InvitationData>>}
            templateId={templateId}
            isEditing={Boolean(invitationId)}
            isActiveInvitation={isActiveInvitation}
            onPublish={handlePreview}
            onSave={handleSave}
            onReset={handleResetToDefault}
            saveSuccess={saveSuccess}
          />
        </Panel>

        <PanelResizeHandle className="w-1 transition-colors cursor-col-resize accent-divider" />

        <Panel>
          <InvitationPreview data={data} templateId={templateId} />
        </Panel>
      </PanelGroup>

      {actionBusy && (
        <div className="fixed bottom-4 right-4 z-50 rounded-full bg-foreground text-background text-xs px-3 py-2 shadow-lg">
          Зберігаємо…
        </div>
      )}
    </div>
  );
};

export default Builder;
