import { Button } from "@/components/ui/button";
import { InvitationData } from "@/pages/Builder";
import { Plus, X, Palette } from "lucide-react";
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
    <BuilderSection
      title="Кольори весілля"
      description="Палітра, яку гості побачать у запрошенні"
      icon={Palette}
      hue={SECTION_HUES.colors}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap justify-center gap-5 px-3 py-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
          {data.weddingColors.map((color, index) => (
            <div key={index} className="relative group/swatch flex flex-col items-center gap-2">
              <label
                className="block w-14 h-14 rounded-full cursor-pointer transition-all duration-200 overflow-hidden ring-2 ring-offset-2 ring-offset-slate-50 hover:scale-110 hover:shadow-md"
                style={{
                  backgroundColor: color,
                  ['--tw-ring-color' as string]: darkenColor(color, 20),
                }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-[10px] text-slate-500 font-mono uppercase">{color}</span>
              <button
                type="button"
                aria-label="Видалити колір"
                className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/swatch:opacity-100 transition-opacity h-5 w-5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-destructive hover:border-destructive shadow-sm flex items-center justify-center"
                onClick={() => removeColor(index)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addColor}
          className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати колір
        </Button>
      </div>
    </BuilderSection>
  );
};
