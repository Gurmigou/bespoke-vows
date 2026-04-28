import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserCircle2 } from "lucide-react";
import { format, parse } from "date-fns";
import { uk } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface BasicInfoFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const BasicInfoForm = ({ data, setData }: BasicInfoFormProps) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const styleId = "accent-color-input-style";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .accent-focus-ring:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  const selectedDate = data.weddingDate
    ? (() => {
        try {
          const parsed = parse(data.weddingDate, "d MMMM yyyy", new Date(), { locale: uk });
          return isNaN(parsed.getTime()) ? undefined : parsed;
        } catch {
          try {
            const parsed = new Date(data.weddingDate);
            return isNaN(parsed.getTime()) ? undefined : parsed;
          } catch {
            return undefined;
          }
        }
      })()
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "d MMMM yyyy", { locale: uk });
      setData({ ...data, weddingDate: formattedDate });
      setDatePickerOpen(false);
    }
  };

  return (
    <BuilderSection title="Основна інформація" icon={UserCircle2} hue={SECTION_HUES.basic}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="herName">Імʼя нареченої</Label>
          <Input
            id="herName"
            value={data.herName}
            onChange={(e) => setData({ ...data, herName: e.target.value })}
            placeholder="Софія"
            className="h-11 accent-focus-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hisName">Імʼя нареченого</Label>
          <Input
            id="hisName"
            value={data.hisName}
            onChange={(e) => setData({ ...data, hisName: e.target.value })}
            placeholder="Михайло"
            className="h-11 accent-focus-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingDate">Дата весілля</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                id="weddingDate"
                variant={"outline"}
                className={cn(
                  "h-11 w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: uk }) : <span>Оберіть дату</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} locale={uk} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingPlace">Місце весілля</Label>
          <Input
            id="weddingPlace"
            value={data.weddingPlace}
            onChange={(e) => setData({ ...data, weddingPlace: e.target.value })}
            placeholder="Ресторан Маяк"
            className="h-11 accent-focus-ring"
          />
        </div>
      </div>
    </BuilderSection>
  );
};
