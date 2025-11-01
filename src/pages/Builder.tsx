import { useState } from "react";
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <BuilderPanel data={invitationData} setData={setInvitationData} />
      <InvitationPreview data={invitationData} />
    </div>
  );
};

export default Builder;
