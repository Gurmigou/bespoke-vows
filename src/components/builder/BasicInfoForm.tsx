import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { uk } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BasicInfoFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const BasicInfoForm = ({ data, setData }: BasicInfoFormProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Create a style tag for dynamic accent color
  useEffect(() => {
    const styleId = 'accent-color-input-style';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
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

  // Parse the date string or use undefined
  const selectedDate = data.weddingDate 
    ? (() => {
        try {
          // Try to parse Ukrainian date format: "15 червня 2025"
          const parsed = parse(data.weddingDate, "d MMMM yyyy", new Date(), { locale: uk });
          return isNaN(parsed.getTime()) ? undefined : parsed;
        } catch {
          // Fallback to standard Date parsing
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
      // Format date in Ukrainian: "15 червня 2025"
      const formattedDate = format(date, "d MMMM yyyy", { locale: uk });
      setData({ ...data, weddingDate: formattedDate });
      setDatePickerOpen(false);
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 transition-all duration-500"
      style={{
        borderColor: `${data.templateColors.primary}20`,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-lg font-semibold">Пара та дата</h3>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="herName">Імʼя нареченої</Label>
          <Input
            id="herName"
            value={data.herName}
            onChange={(e) => setData({ ...data, herName: e.target.value })}
            placeholder="Софія"
            className="accent-focus-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hisName">Імʼя нареченого</Label>
          <Input
            id="hisName"
            value={data.hisName}
            onChange={(e) => setData({ ...data, hisName: e.target.value })}
            placeholder="Михайло"
            className="accent-focus-ring"
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
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "d MMMM yyyy", { locale: uk })
                ) : (
                  <span>Оберіть дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={uk}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingPlace">Місце весілля</Label>
          <Input
            id="weddingPlace"
            value={data.weddingPlace}
            onChange={(e) => setData({ ...data, weddingPlace: e.target.value })}
            placeholder="Палац Розвуд"
            className="accent-focus-ring"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
    </div>
  );
};
