import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InvitationData, WeddingEvent } from "@/pages/Builder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Clock, CalendarClock, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface EventsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const EventsForm = ({ data, setData }: EventsFormProps) => {
  // Create a style tag for dynamic accent color
  useEffect(() => {
    const styleId = "accent-color-input-style-events";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .accent-focus-ring-events:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
      .accent-focus-ring-events[data-state="open"] {
        border-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent}20 !important;
      }
    `;
  }, [data.templateColors.accent]);

  const addEvent = () => {
    const newEvent: WeddingEvent = {
      id: Date.now().toString(),
      time: "",
      eventName: "",
    };
    setData({ ...data, events: [...data.events, newEvent] });
  };

  const removeEvent = (id: string) => {
    setData({ ...data, events: data.events.filter((e) => e.id !== id) });
  };

  const updateEvent = (id: string, field: keyof WeddingEvent, value: string) => {
    setData({
      ...data,
      events: data.events.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  // Parse time string (HH:MM) into hours and minutes
  const parseTime = (timeString: string) => {
    if (!timeString || !timeString.includes(":")) {
      return { hour: "", minute: "" };
    }
    const [hour, minute] = timeString.split(":");
    return { hour: hour || "", minute: minute || "" };
  };

  // Format hours and minutes into HH:MM string
  const formatTime = (hour: string, minute: string) => {
    if (!hour || !minute) return "";
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

  const hue = SECTION_HUES.events;

  // TimePicker component
  const TimePicker = ({ eventId, timeValue }: { eventId: string; timeValue: string }) => {
    const { hour, minute } = parseTime(timeValue);

    const handleHourChange = (newHour: string) => {
      const newTime = formatTime(newHour, minute || "00");
      updateEvent(eventId, "time", newTime);
    };

    const handleMinuteChange = (newMinute: string) => {
      const newTime = formatTime(hour || "00", newMinute);
      updateEvent(eventId, "time", newTime);
    };

    return (
      <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-1.5 py-1 transition-colors focus-within:border-slate-300">
        <Select value={hour} onValueChange={handleHourChange}>
          <SelectTrigger className="h-9 w-[58px] border-0 bg-transparent shadow-none font-semibold text-sm tabular-nums focus:ring-0 focus:ring-offset-0 accent-focus-ring-events">
            <SelectValue placeholder="00" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-slate-400 font-bold text-sm">:</span>
        <Select value={minute} onValueChange={handleMinuteChange}>
          <SelectTrigger className="h-9 w-[58px] border-0 bg-transparent shadow-none font-semibold text-sm tabular-nums focus:ring-0 focus:ring-offset-0 accent-focus-ring-events">
            <SelectValue placeholder="00" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <BuilderSection
      title="Програма подій"
      description="Графік святкування для гостей"
      icon={CalendarClock}
      hue={SECTION_HUES.events}
    >
      <div className="space-y-3">
        {data.events.map((event, index) => (
          <div
            key={event.id}
            className="group/event rounded-xl border border-slate-200 bg-white p-4 space-y-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm relative"
          >
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${hue}14`, color: hue }}
              >
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: hue, color: "#fff" }}
                >
                  {index + 1}
                </span>
                Подія
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                onClick={() => removeEvent(event.id)}
                aria-label="Видалити подію"
                type="button"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={2.5} />
                  Час
                </Label>
                <TimePicker eventId={event.id} timeValue={event.time} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  Назва події
                </Label>
                <Input
                  value={event.eventName}
                  onChange={(e) => updateEvent(event.id, "eventName", e.target.value)}
                  placeholder="Церемонія"
                  className="h-11 accent-focus-ring-events bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">
                Коментар <span className="text-slate-400 font-normal">(необов'язково)</span>
              </Label>
              <Textarea
                value={event.comment ?? ""}
                onChange={(e) => updateEvent(event.id, "comment", e.target.value)}
                placeholder="Коротка нотатка до події…"
                className="resize-y text-sm accent-focus-ring-events bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addEvent}
          className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати подію
        </Button>
      </div>
    </BuilderSection>
  );
};
