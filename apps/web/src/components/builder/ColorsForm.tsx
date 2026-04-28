import { Button } from "@/components/ui/button";
import { InvitationData } from "@/pages/Builder";
import { Plus, Trash2, Palette } from "lucide-react";
import { darkenColor } from "@/lib/utils";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface ColorsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const ColorsForm = ({ data, setData }: ColorsFormProps) => {
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
    <BuilderSection title="Кольори весілля" icon={Palette} hue={SECTION_HUES.colors}>
      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-6">
          {data.weddingColors.map((color, index) => (
            <div key={index} className="relative group flex flex-col items-center gap-2">
              <label
                className="block w-14 h-14 rounded-full cursor-pointer border-2 transition-colors overflow-hidden"
                style={{ backgroundColor: color, borderColor: darkenColor(color, 35) }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">{color}</span>
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 rounded-full"
                onClick={() => removeColor(index)}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addColor} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Додати колір
        </Button>
      </div>
    </BuilderSection>
  );
};
