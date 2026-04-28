import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Palette } from "lucide-react";
import { darkenColor } from "@/lib/utils";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface TemplateColorPickerProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

const FIELDS: { field: keyof InvitationData["templateColors"]; label: string }[] = [
  { field: "primary", label: "Основний" },
  { field: "text", label: "Текст" },
  { field: "accent", label: "Акцент" },
];

export const TemplateColorPicker = ({ data, setData }: TemplateColorPickerProps) => {
  const updateTemplateColor = (field: keyof InvitationData["templateColors"], value: string) => {
    setData({
      ...data,
      templateColors: { ...data.templateColors, [field]: value },
    });
  };

  return (
    <BuilderSection title="Дизайн шаблону" icon={Palette} hue={SECTION_HUES.template}>
      <div className="grid grid-cols-3 gap-3">
        {FIELDS.map(({ field, label }) => {
          const value = data.templateColors[field];
          return (
            <div key={field} className="flex flex-col items-center gap-2">
              <Label htmlFor={`${field}Color`} className="text-xs font-medium text-muted-foreground">
                {label}
              </Label>
              <label
                htmlFor={`${field}Color`}
                className="block w-10 h-10 rounded-full cursor-pointer border-2 transition-colors overflow-hidden"
                style={{ backgroundColor: value, borderColor: darkenColor(value, 35) }}
              >
                <input
                  type="color"
                  id={`${field}Color`}
                  value={value}
                  onChange={(e) => updateTemplateColor(field, e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">{value}</span>
            </div>
          );
        })}
      </div>
    </BuilderSection>
  );
};
