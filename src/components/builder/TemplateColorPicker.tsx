import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Template Design</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="primaryColor"
                value={data.templateColors.primary}
                onChange={(e) => updateTemplateColor("primary", e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer border-2"
              />
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.primary}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="textColor"
                value={data.templateColors.text}
                onChange={(e) => updateTemplateColor("text", e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer border-2"
              />
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.text}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="accentColor"
                value={data.templateColors.accent}
                onChange={(e) => updateTemplateColor("accent", e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer border-2"
              />
              <span className="text-sm text-muted-foreground font-mono">{data.templateColors.accent}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          These colors will theme both your invitation and this builder interface
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};
