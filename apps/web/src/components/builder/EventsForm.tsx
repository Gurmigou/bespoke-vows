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
import { Plus, Trash2, Clock, CalendarClock } from "lucide-react";
import { useEffect } from "react";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface EventsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const EventsForm = ({ data, setData }: EventsFormProps) => {
  // Create a style tag for dynamic accent color
  useEffect(() => {
    const styleId = 'accent-color-input-style-events';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
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
    if (!timeString || !timeString.includes(':')) {
      return { hour: '', minute: '' };
    }
    const [hour, minute] = timeString.split(':');
    return { hour: hour || '', minute: minute || '' };
  };

  // Format hours and minutes into HH:MM string
  const formatTime = (hour: string, minute: string) => {
    if (!hour || !minute) return '';
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 0, 5, 10, 15, ..., 55

  // TimePicker component
  const TimePicker = ({ eventId, timeValue }: { eventId: string; timeValue: string }) => {
    const { hour, minute } = parseTime(timeValue);

    const handleHourChange = (newHour: string) => {
      const newTime = formatTime(newHour, minute || '00');
      updateEvent(eventId, 'time', newTime);
    };

    const handleMinuteChange = (newMinute: string) => {
      const newTime = formatTime(hour || '00', newMinute);
      updateEvent(eventId, 'time', newTime);
    };

    return (
      <div className="flex gap-1.5 items-center">
        <Select value={hour} onValueChange={handleHourChange}>
          <SelectTrigger className="h-11 w-[70px] accent-focus-ring-events">
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
        <span className="text-muted-foreground font-semibold text-base">:</span>
        <Select value={minute} onValueChange={handleMinuteChange}>
          <SelectTrigger className="h-11 w-[70px] accent-focus-ring-events">
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
    <BuilderSection title="Програма подій" icon={CalendarClock} hue={SECTION_HUES.events}>
      <div className="space-y-4">
        {data.events.map((event) => (
          <div key={event.id} className="space-y-3 p-4 border rounded-lg relative group">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeEvent(event.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Час
                </Label>
                <div className="flex items-center">
                  <TimePicker eventId={event.id} timeValue={event.time} />
                </div>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm">Назва події</Label>
                <Input
                  value={event.eventName}
                  onChange={(e) => updateEvent(event.id, "eventName", e.target.value)}
                  placeholder="Церемонія"
                  className="h-11 accent-focus-ring-events"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Коментар (необов'язково)</Label>
              <Textarea
                value={event.comment ?? ""}
                onChange={(e) => updateEvent(event.id, "comment", e.target.value)}
                placeholder="Коротка нотатка до події…"
                className="resize-y text-sm accent-focus-ring-events"
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addEvent} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Додати подію
        </Button>
      </div>
    </BuilderSection>
  );
};
