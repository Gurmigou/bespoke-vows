import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { MapPin } from "lucide-react";
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
    <BuilderSection title="Місце проведення" icon={MapPin} hue={SECTION_HUES.venue}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="venueLabel" className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Адреса
          </Label>
          <Input
            id="venueLabel"
            value={data.venue.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="Ресторан Маяк, вул. Набережна 1, Київ"
            className="h-11 accent-focus-ring-venue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venueMapsUrl">Посилання на Google Maps</Label>
          <Input
            id="venueMapsUrl"
            value={data.venue.mapsUrl}
            onChange={(e) => update("mapsUrl", e.target.value)}
            placeholder="https://maps.google.com/..."
            className="h-11 accent-focus-ring-venue"
            type="url"
          />
          {data.venue.mapsUrl && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Гості зможуть натиснути на адресу і відкрити карту
            </p>
          )}
        </div>
      </div>
    </BuilderSection>
  );
};
