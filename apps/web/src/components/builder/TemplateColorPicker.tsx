import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Check, Palette, Pipette } from "lucide-react";
import { darkenColor } from "@/lib/utils";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface TemplateColorPickerProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

interface ColorPreset {
  name: string;
  primary: string;
  text: string;
  accent: string;
}

const PRESETS: ColorPreset[] = [
  { name: "Класик",    primary: "#FBF7EE", text: "#2C2416", accent: "#D4A574" },
  { name: "Ботанічний", primary: "#F4EFE6", text: "#1A1A1A", accent: "#8C7355" },
  { name: "Мʼята",     primary: "#EFF5F0", text: "#1F3A2E", accent: "#4F7B5F" },
  { name: "Пудра",     primary: "#FBF0F3", text: "#3A1A2A", accent: "#C47A8A" },
  { name: "Лаванда",   primary: "#F5F0FB", text: "#2C1A4A", accent: "#7B5EA7" },
  { name: "Теракота",  primary: "#FAF0EB", text: "#2C1A14", accent: "#8C4A2F" },
  { name: "Смарагд",   primary: "#EAF2EE", text: "#1A2C24", accent: "#2A7A5A" },
  { name: "Нічний",    primary: "#1E2035", text: "#E8E0F0", accent: "#C9A84C" },
];

const FIELDS: { field: keyof InvitationData["templateColors"]; label: string; hint: string }[] = [
  { field: "primary", label: "Основний колір", hint: "Фон" },
  { field: "text",    label: "Текст",          hint: "Написи" },
  { field: "accent",  label: "Акцент",         hint: "Деталі" },
];

export const TemplateColorPicker = ({ data, setData }: TemplateColorPickerProps) => {
  const updateTemplateColor = (field: keyof InvitationData["templateColors"], value: string) => {
    setData({ ...data, templateColors: { ...data.templateColors, [field]: value } });
  };

  const applyPreset = (preset: ColorPreset) => {
    setData({
      ...data,
      templateColors: { primary: preset.primary, text: preset.text, accent: preset.accent },
    });
  };

  const isActivePreset = (preset: ColorPreset) =>
    data.templateColors.primary === preset.primary &&
    data.templateColors.text === preset.text &&
    data.templateColors.accent === preset.accent;

  return (
    <BuilderSection
      title="Дизайн шаблону"
      description="Налаштуйте кольори вашого запрошення"
      icon={Palette}
      hue={SECTION_HUES.template}
    >
      {/* Manual pickers */}
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
                    ["--tw-ring-color" as string]: darkenColor(value, 20),
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

      {/* Divider */}
      <div className="flex items-center gap-3 mt-5 mb-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
          або оберіть готову палітру
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Presets grid */}
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => {
          const active = isActivePreset(preset);
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left"
              style={{
                borderColor: active ? preset.accent : "#e2e8f0",
                backgroundColor: active ? `${preset.accent}14` : "white",
                boxShadow: active ? `0 0 0 1px ${preset.accent}` : undefined,
              }}
            >
              {/* Three swatches */}
              <div className="flex items-center shrink-0">
                <span
                  className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: preset.primary }}
                />
                <span
                  className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm -ml-2"
                  style={{ backgroundColor: preset.text }}
                />
                <span
                  className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm -ml-2"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>

              {/* Name */}
              <span
                className="text-[12.5px] font-medium flex-1 leading-tight"
                style={{ color: active ? preset.primary : "#374151" }}
              >
                {preset.name}
              </span>

              {/* Active check */}
              {active && (
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: preset.accent }}
                >
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </BuilderSection>
  );
};
