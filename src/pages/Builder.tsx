import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BuilderPanel } from "@/components/builder/BuilderPanel";
import { InvitationPreview } from "@/components/invitation/InvitationPreview";

export interface WeddingEvent {
  id: string;
  time: string;
  eventName: string;
}

export interface InvitationData {
  hisName: string;
  herName: string;
  weddingDate: string;
  weddingPlace: string;
  loveStory: string;
  events: WeddingEvent[];
  weddingColors: string[];
  templateColors: {
    primary: string;
    text: string;
    accent: string;
  };
}

const Builder = () => {
  const [invitationData, setInvitationData] = useState<InvitationData>({
    hisName: "Михайло",
    herName: "Софія",
    weddingDate: "15 червня 2025",
    weddingPlace: "Палац Розвуд, Київ, Україна",
    loveStory: "",
    events: [
      { id: "1", time: "16:00", eventName: "Церемонія" },
      { id: "2", time: "17:00", eventName: "Коктейль" },
      { id: "3", time: "18:30", eventName: "Прийом" },
      { id: "4", time: "19:00", eventName: "Вечеря" },
      { id: "5", time: "21:00", eventName: "Танці" },
    ],
    weddingColors: ["#F5E6D3", "#D4A574", "#8B7355"],
    templateColors: {
      primary: "#2C2416",
      text: "#2C2416",
      accent: "#D4A574",
    },
  });

  // Create a style tag for dynamic accent color divider
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
      <PanelGroup direction="horizontal">
        {/* Left Panel - BuilderPanel with min 20% and max 70% */}
        <Panel defaultSize={40} minSize={30} maxSize={60}>
          <BuilderPanel data={invitationData} setData={setInvitationData} />
        </Panel>

        {/* Draggable Divider */}
        <PanelResizeHandle 
          className="w-1 transition-colors cursor-col-resize accent-divider" 
        />

        {/* Right Panel - InvitationPreview */}
        <Panel>
          <InvitationPreview data={invitationData} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Builder;
