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
        <h3 className="text-lg font-semibold">Пара та дата</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="herName">Її ім'я</Label>
          <Input
            id="herName"
            value={data.herName}
            onChange={(e) => setData({ ...data, herName: e.target.value })}
            placeholder="Софія"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hisName">Його ім'я</Label>
          <Input
            id="hisName"
            value={data.hisName}
            onChange={(e) => setData({ ...data, hisName: e.target.value })}
            placeholder="Михайло"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingDate">Дата весілля</Label>
          <Input
            id="weddingDate"
            value={data.weddingDate}
            onChange={(e) => setData({ ...data, weddingDate: e.target.value })}
            placeholder="15 червня 2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingPlace">Місце весілля</Label>
          <Input
            id="weddingPlace"
            value={data.weddingPlace}
            onChange={(e) => setData({ ...data, weddingPlace: e.target.value })}
            placeholder="Палац Розвуд"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
