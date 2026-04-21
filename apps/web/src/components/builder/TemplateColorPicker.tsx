import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { darkenColor } from "@/lib/utils";

interface TemplateColorPickerProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const TemplateColorPicker = ({ data, setData }: TemplateColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateTemplateColor = (field: keyof InvitationData["templateColors"], value: string) => {
    setData({
      ...data,
      templateColors: {
        ...data.templateColors,
        [field]: value,
      },
    });
  };

  return (
    <div 
      className="border rounded-lg p-4 transition-all duration-500"
      style={{
        borderColor: `${data.templateColors.primary}20`,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-lg font-semibold">Дизайн шаблону</h3>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Основний колір</Label>
            <div className="flex justify-between items-center">
              <label className="block w-3/4 h-12 rounded-xl cursor-pointer border-2 transition-colors overflow-hidden" style={{ backgroundColor: data.templateColors.primary, borderColor: darkenColor(data.templateColors.primary, 35) }}>
                <input
                  type="color"
                  id="primaryColor"
                  value={data.templateColors.primary}
                  onChange={(e) => updateTemplateColor("primary", e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.primary}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Колір тексту</Label>
            <div className="flex justify-between items-center">
              <label className="block w-3/4 h-12 rounded-xl cursor-pointer border-2 transition-colors overflow-hidden" style={{ backgroundColor: data.templateColors.text, borderColor: darkenColor(data.templateColors.text, 35) }}>
                <input
                  type="color"
                  id="textColor"
                  value={data.templateColors.text}
                  onChange={(e) => updateTemplateColor("text", e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.text}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Акцентний колір</Label>
            <div className="flex justify-between items-center">
              <label className="block w-3/4 h-12 rounded-xl cursor-pointer border-2 transition-colors overflow-hidden" style={{ backgroundColor: data.templateColors.accent, borderColor: darkenColor(data.templateColors.accent, 35) }}>
                <input
                  type="color"
                  id="accentColor"
                  value={data.templateColors.accent}
                  onChange={(e) => updateTemplateColor("accent", e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.accent}</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
    </div>
  );
};
