import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface LoveStoryFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const LoveStoryForm = ({ data, setData }: LoveStoryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Love Story</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="loveStory">Your Story (Optional)</Label>
          <Textarea
            id="loveStory"
            value={data.loveStory}
            onChange={(e) => setData({ ...data, loveStory: e.target.value })}
            placeholder="Tell your love story..."
            rows={6}
            className="resize-none"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
