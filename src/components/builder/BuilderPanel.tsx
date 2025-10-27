import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BasicInfoForm } from "./BasicInfoForm";
import { LoveStoryForm } from "./LoveStoryForm";
import { EventsForm } from "./EventsForm";
import { ColorsForm } from "./ColorsForm";
import { TemplateColorPicker } from "./TemplateColorPicker";
import { InvitationData } from "@/pages/Builder";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BuilderPanelProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const BuilderPanel = ({ data, setData }: BuilderPanelProps) => {
  const handlePublish = () => {
    // Handle publish logic
    console.log("Publishing invitation:", data);
  };

  return (
    <div 
      className="w-full lg:w-[480px] border-r flex flex-col transition-all duration-500"
      style={{
        backgroundColor: `${data.templateColors.primary}08`,
        borderColor: `${data.templateColors.primary}20`,
      }}
    >
      <div 
        className="p-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm transition-all duration-500"
        style={{
          borderColor: `${data.templateColors.primary}20`,
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback 
              className="transition-all duration-500"
              style={{ 
                backgroundColor: data.templateColors.accent,
                color: '#fff'
              }}
            >
              {data.herName[0]}{data.hisName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">Your Invitation</span>
        </div>
        <Button 
          onClick={handlePublish}
          className="transition-all duration-500"
          style={{
            backgroundColor: data.templateColors.accent,
            color: '#fff',
          }}
        >
          Publish
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <BasicInfoForm data={data} setData={setData} />
          <LoveStoryForm data={data} setData={setData} />
          <EventsForm data={data} setData={setData} />
          <ColorsForm data={data} setData={setData} />
          <TemplateColorPicker data={data} setData={setData} />
        </div>
      </ScrollArea>
    </div>
  );
};
