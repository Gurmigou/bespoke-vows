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

  return (
    <div className="min-h-screen">
      <div className="hidden portrait:flex md:portrait:hidden fixed inset-0 z-50 bg-background flex-col items-center justify-center gap-6 px-8 text-center">
        <svg
          viewBox="0 0 120 120"
          className="w-32 h-32"
          fill="none"
          stroke={data.templateColors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="46" y="20" width="28" height="50" rx="4" transform="rotate(-35 60 45)" />
          <line x1="56" y1="26" x2="60" y2="29" transform="rotate(-35 60 45)" />
          <path d="M 25 80 A 35 35 0 0 1 95 80" />
          <polyline points="20,72 25,80 33,75" />
          <polyline points="100,72 95,80 87,75" />
        </svg>
        <div>
          <h2 className="text-xl font-semibold mb-2">Поверніть телефон</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Для зручного редагування запрошення оберніть телефон у горизонтальне положення.
          </p>
        </div>
      </div>

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
