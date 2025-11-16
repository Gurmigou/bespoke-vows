import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface LoveStoryFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const LoveStoryForm = ({ data, setData }: LoveStoryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Create a style tag for dynamic accent color
  useEffect(() => {
    const styleId = 'accent-color-textarea-style';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      .accent-focus-ring-textarea:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Історія кохання</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="loveStory">Опишіть вашу історію кохання</Label>
          <Textarea
            id="loveStory"
            value={data.loveStory}
            onChange={(e) => setData({ ...data, loveStory: e.target.value })}
            placeholder="Розкажіть свою історію кохання..."
            rows={6}
            className="resize-none accent-focus-ring-textarea"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
