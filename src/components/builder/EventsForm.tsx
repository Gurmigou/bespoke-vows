import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData, WeddingEvent } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface EventsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const EventsForm = ({ data, setData }: EventsFormProps) => {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <h3 className="text-lg font-semibold">Порядок подій</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {data.events.map((event) => (
          <div key={event.id} className="space-y-2 p-3 border rounded-lg relative group">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeEvent(event.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Час</Label>
                <Input
                  value={event.time}
                  onChange={(e) => updateEvent(event.id, "time", e.target.value)}
                  placeholder="16:00"
                  className="h-9 accent-focus-ring-events"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Назва події</Label>
                <Input
                  value={event.eventName}
                  onChange={(e) => updateEvent(event.id, "eventName", e.target.value)}
                  placeholder="Церемонія"
                  className="h-9 accent-focus-ring-events"
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addEvent} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Додати подію
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};
