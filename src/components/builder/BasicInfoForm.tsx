import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface BasicInfoFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const BasicInfoForm = ({ data, setData }: BasicInfoFormProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Couple & Date</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="herName">Her Name</Label>
          <Input
            id="herName"
            value={data.herName}
            onChange={(e) => setData({ ...data, herName: e.target.value })}
            placeholder="Sarah"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hisName">His Name</Label>
          <Input
            id="hisName"
            value={data.hisName}
            onChange={(e) => setData({ ...data, hisName: e.target.value })}
            placeholder="James"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingDate">Wedding Date</Label>
          <Input
            id="weddingDate"
            value={data.weddingDate}
            onChange={(e) => setData({ ...data, weddingDate: e.target.value })}
            placeholder="June 15th, 2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingPlace">Wedding Place</Label>
          <Input
            id="weddingPlace"
            value={data.weddingPlace}
            onChange={(e) => setData({ ...data, weddingPlace: e.target.value })}
            placeholder="The Rosewood Estate"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
