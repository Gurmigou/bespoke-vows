import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BuilderPanel } from "@/components/builder/BuilderPanel";
import { InvitationPreview } from "@/components/invitation/InvitationPreview";
import { TEMPLATES, getTemplate, type TemplateId } from "@/components/invitation/templates/registry";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface WeddingEvent {
  id: string;
  time: string;
  eventName: string;
  comment?: string;
}

export interface LoveStoryMoment {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition: { x: number; y: number };
}

export interface InvitationData {
  hisName: string;
  herName: string;
  weddingDate: string;
  weddingPlace: string;
  venue: {
    label: string;
    mapsUrl: string;
  };
  loveStory: {
    moments: LoveStoryMoment[];
  };
  events: WeddingEvent[];
  weddingColors: string[];
  templateColors: {
    primary: string;
    text: string;
    accent: string;
  };
}

// Normalize legacy loveStory shape ({ moment1, moment2, image1, image2, ... }) to moments[]
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
  // Legacy shape
  const moments: LoveStoryMoment[] = [];
  for (let i = 1; i <= 2; i++) {
    const text = (ls[`moment${i}`] as string) ?? "";
    const image = (ls[`image${i}`] as string) ?? "";
    const pos = (ls[`image${i}Position`] as { x: number; y: number }) ?? { x: 50, y: 50 };
    if (text || image) {
      moments.push({
        id: `legacy-${i}`,
        title: i === 1 ? "Як ми зустрілися" : "Пропозиція",
        description: text,
        image,
        imagePosition: pos,
      });
    }
  }
  return { moments };
};

const Builder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("id");
  const templateId: TemplateId = useMemo(
    () => getTemplate(searchParams.get("template")),
    [searchParams]
  );

  const templateMeta = useMemo(
    () => TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0],
    [templateId]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isActiveInvitation, setIsActiveInvitation] = useState(false);

  const [invitationData, setInvitationData] = useState<InvitationData>(() => ({
    hisName: "Михайло",
    herName: "Софія",
    weddingDate: "15 червня 2025",
    weddingPlace: "Ресторан Маяк, Київ, Україна",
    venue: {
      label: "Ресторан Маяк, вул. Набережна 1, Київ",
      mapsUrl: "",
    },
    loveStory: {
      moments: [
        {
          id: "m-1",
          title: "Як ми зустрілися",
          description:
            "Ми зустрілися ранньої осені 2020 року на студентській вечірці у Львові. Те, що розпочалося як випадкова розмова про улюблені книги, непомітно перетворилося на кілька годин сміху і відвертих одкровень — і ми обидва відчули, що щось особливе щойно народилося.",
          image: "",
          imagePosition: { x: 50, y: 50 },
        },
        {
          id: "m-2",
          title: "Пропозиція",
          description:
            "Через три роки, у тому ж затишному кафе на Ринковій площі, де ми провели наше перше побачення, Михайло опустився на коліно. Навколо зупинився час, і серед теплого осіннього світла Софія сказала «так».",
          image: "",
          imagePosition: { x: 50, y: 50 },
        },
      ],
    },
    events: [
      { id: "1", time: "16:00", eventName: "Церемонія" },
      { id: "2", time: "17:00", eventName: "Коктейль" },
      { id: "3", time: "18:30", eventName: "Прийом" },
      { id: "4", time: "19:00", eventName: "Вечеря" },
      { id: "5", time: "21:00", eventName: "Танці" },
    ],
    weddingColors: ["#F5E6D3", "#D4A574", "#8B7355"],
    templateColors: { ...templateMeta.defaultColors },
  }));

  // When template changes (via URL), reset template-driven defaults (only for new invitations)
  useEffect(() => {
    if (!invitationId) {
      setInvitationData((prev) => ({
        ...prev,
        templateColors: { ...templateMeta.defaultColors },
      }));
    }
  }, [templateMeta, invitationId]);

  // Load existing invitation when ?id= is present
  useEffect(() => {
    if (!invitationId) return;
    fetch(`${API_URL}/invitations/${invitationId}`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((inv) => {
        if (!inv) return;
        if (inv.config) {
          const cfg = inv.config as InvitationData;
          setInvitationData({
            ...cfg,
            loveStory: normalizeLoveStory(cfg.loveStory),
          });
        }
        setIsEditing(true);
        setIsActiveInvitation(inv.derivedStatus === "active_free" || inv.derivedStatus === "active_paid");
      })
      .catch(() => {});
  }, [invitationId]);

  // Dynamic accent color for resize divider
  useEffect(() => {
    const styleId = 'accent-color-divider-style';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .accent-divider {
        background-color: ${invitationData.templateColors.accent}20 !important;
      }
      .accent-divider:hover {
        background-color: ${invitationData.templateColors.accent} !important;
      }
    `;
  }, [invitationData.templateColors.accent]);

  return (
    <div className="min-h-screen">
      <div className="hidden portrait:flex md:portrait:hidden fixed inset-0 z-50 bg-background flex-col items-center justify-center gap-6 px-8 text-center">
        <svg
          viewBox="0 0 120 120"
          className="w-32 h-32"
          fill="none"
          stroke={invitationData.templateColors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="46"
            y="20"
            width="28"
            height="50"
            rx="4"
            transform="rotate(-35 60 45)"
          />
          <line x1="56" y1="26" x2="60" y2="29" transform="rotate(-35 60 45)" />
          <path d="M 25 80 A 35 35 0 0 1 95 80" />
          <polyline points="20,72 25,80 33,75" />
          <polyline points="100,72 95,80 87,75" />
        </svg>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Поверніть телефон
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Для зручного редагування запрошення оберніть телефон у горизонтальне положення.
          </p>
        </div>
      </div>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40} minSize={30} maxSize={60}>
          <BuilderPanel
            data={invitationData}
            setData={setInvitationData}
            templateId={templateId}
            isEditing={isEditing}
            isActiveInvitation={isActiveInvitation}
            onPublish={() => navigate("/preview", { state: { data: invitationData, templateId } })}
          />
        </Panel>

        <PanelResizeHandle className="w-1 transition-colors cursor-col-resize accent-divider" />

        <Panel>
          <InvitationPreview data={invitationData} templateId={templateId} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Builder;
