import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { MapPin, Link as LinkIcon, Info } from "lucide-react";
import { useEffect } from "react";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface VenueFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const VenueForm = ({ data, setData }: VenueFormProps) => {
  useEffect(() => {
    const styleId = "accent-color-venue-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      .accent-focus-ring-venue:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  const update = (field: keyof InvitationData["venue"], value: string) => {
    setData({ ...data, venue: { ...data.venue, [field]: value } });
  };

  return (
    <BuilderSection
      title="Місце проведення"
      description="Адреса та посилання на карту"
      icon={MapPin}
      hue={SECTION_HUES.venue}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="venueLabel"
            className="text-xs font-medium text-slate-600 flex items-center gap-1.5"
          >
            <MapPin className="w-3 h-3" strokeWidth={2.5} />
            Адреса
          </Label>
          <Input
            id="venueLabel"
            value={data.venue.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="Ресторан Маяк, вул. Набережна 1, Київ"
            className="h-11 accent-focus-ring-venue bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="venueMapsUrl"
            className="text-xs font-medium text-slate-600 flex items-center gap-1.5"
          >
            <LinkIcon className="w-3 h-3" strokeWidth={2.5} />
            Посилання на Google Maps
          </Label>
          <Input
            id="venueMapsUrl"
            value={data.venue.mapsUrl}
            onChange={(e) => update("mapsUrl", e.target.value)}
            placeholder="https://maps.google.com/..."
            className="h-11 accent-focus-ring-venue bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
            type="url"
          />
          {data.venue.mapsUrl && (
            <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <Info className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700 leading-relaxed">
                Гості зможуть натиснути на адресу і відкрити карту
              </p>
            </div>
          )}
        </div>
      </div>
    </BuilderSection>
  );
};
