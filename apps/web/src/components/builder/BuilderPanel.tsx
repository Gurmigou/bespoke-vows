import { Button } from "@/components/ui/button";
import { BasicInfoForm } from "./BasicInfoForm";
import { LoveStoryForm } from "./LoveStoryForm";
import { EventsForm } from "./EventsForm";
import { ColorsForm } from "./ColorsForm";
import { TemplateColorPicker } from "./TemplateColorPicker";
import { VenueForm } from "./VenueForm";
import { InvitationData } from "@/pages/Builder";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TemplateId } from "@/components/invitation/templates/registry";

interface BuilderPanelProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
  templateId: TemplateId;
  onPublish: () => void;
  isEditing?: boolean;
  isActiveInvitation?: boolean;
}

export const BuilderPanel = ({ data, setData, onPublish, isEditing, isActiveInvitation }: BuilderPanelProps) => {
  return (
    <div
      className="w-full h-screen border-r flex flex-col transition-all duration-500 bg-slate-50/60"
      style={{
        borderColor: `${data.templateColors.primary}20`,
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-white/70 transition-all duration-500"
        style={{
          borderColor: `${data.templateColors.primary}20`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm">Налаштування запрошення</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <Button
            onClick={onPublish}
            className="transition-all duration-500 font-bold"
            style={{
              backgroundColor: data.templateColors.accent,
              color: '#fff',
            }}
          >
            {isEditing && isActiveInvitation ? "Оновити" : "Опублікувати"}
          </Button>
          {isEditing && isActiveInvitation && (
            <span className="text-[10px] text-muted-foreground">
              посилання залишиться тим самим
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <TemplateColorPicker data={data} setData={setData} />
          <BasicInfoForm data={data} setData={setData} />
          <LoveStoryForm data={data} setData={setData} />
          <ColorsForm data={data} setData={setData} />
          <EventsForm data={data} setData={setData} />
          <VenueForm data={data} setData={setData} />
        </div>
      </ScrollArea>
    </div>
  );
};
