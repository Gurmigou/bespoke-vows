import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationData, WeddingEvent } from "@/pages/Builder";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface EventsFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

export const EventsForm = ({ data, setData }: EventsFormProps) => {
  const [isOpen, setIsOpen] = useState(true);

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
        <h3 className="text-lg font-semibold">Order of Events</h3>
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
                <Label className="text-xs">Time</Label>
                <Input
                  value={event.time}
                  onChange={(e) => updateEvent(event.id, "time", e.target.value)}
                  placeholder="4:00 PM"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Event Name</Label>
                <Input
                  value={event.eventName}
                  onChange={(e) => updateEvent(event.id, "eventName", e.target.value)}
                  placeholder="Ceremony"
                  className="h-9"
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addEvent} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};
