import { Button } from "@/components/ui/button";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ColorsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const ColorsForm = ({ data, setData }: ColorsFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const addColor = () => {
    setData({ ...data, weddingColors: [...data.weddingColors, "#F5E6D3"] });
  };

  const removeColor = (index: number) => {
    setData({
      ...data,
      weddingColors: data.weddingColors.filter((_, i) => i !== index),
    });
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...data.weddingColors];
    newColors[index] = value;
    setData({ ...data, weddingColors: newColors });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Wedding Colors</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          {data.weddingColors.map((color, index) => (
            <div key={index} className="relative group">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-full h-20 rounded-lg cursor-pointer border-2"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => removeColor(index)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addColor} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Color
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};
