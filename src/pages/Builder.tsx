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
    hisName: "James",
    herName: "Sarah",
    weddingDate: "June 15th, 2025",
    weddingPlace: "The Rosewood Estate, Santa Barbara, California",
    loveStory: "",
    events: [
      { id: "1", time: "4:00 PM", eventName: "Ceremony" },
      { id: "2", time: "5:00 PM", eventName: "Cocktail Hour" },
      { id: "3", time: "6:30 PM", eventName: "Reception" },
      { id: "4", time: "7:00 PM", eventName: "Dinner" },
      { id: "5", time: "9:00 PM", eventName: "Dancing" },
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
