import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Palette, Pipette } from "lucide-react";
import { darkenColor } from "@/lib/utils";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface TemplateColorPickerProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

const FIELDS: { field: keyof InvitationData["templateColors"]; label: string; hint: string }[] = [
  { field: "primary", label: "Основний", hint: "Заголовки" },
  { field: "text", label: "Текст", hint: "Опис" },
  { field: "accent", label: "Акцент", hint: "Кнопки" },
];

export const TemplateColorPicker = ({ data, setData }: TemplateColorPickerProps) => {
  const updateTemplateColor = (field: keyof InvitationData["templateColors"], value: string) => {
    setData({
      ...data,
      templateColors: { ...data.templateColors, [field]: value },
    });
  };

  return (
    <BuilderSection
      title="Дизайн шаблону"
      description="Налаштуйте кольори вашого запрошення"
      icon={Palette}
      hue={SECTION_HUES.template}
    >
      <div className="grid grid-cols-3 gap-3">
        {FIELDS.map(({ field, label, hint }) => {
          const value = data.templateColors[field];
          return (
            <label
              key={field}
              htmlFor={`${field}Color`}
              className="group/color flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="relative">
                <span
                  className="block w-12 h-12 rounded-full transition-all duration-200 overflow-hidden ring-2 ring-offset-2 ring-offset-slate-50 group-hover/color:scale-105 group-hover/color:ring-offset-white"
                  style={{
                    backgroundColor: value,
                    ['--tw-ring-color' as string]: darkenColor(value, 20),
                  }}
                >
                  <input
                    type="color"
                    id={`${field}Color`}
                    value={value}
                    onChange={(e) => updateTemplateColor(field, e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 group-hover/color:text-slate-900 transition-colors">
                  <Pipette className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Label className="text-[12px] font-semibold text-slate-700 cursor-pointer">
                  {label}
                </Label>
                <span className="text-[10px] text-slate-400 leading-tight">{hint}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase">{value}</span>
            </label>
          );
        })}
      </div>
    </BuilderSection>
  );
};
