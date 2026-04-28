import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InvitationData, LoveStoryMoment } from "@/pages/Builder";
import { Heart, Plus, Upload, X, MoveHorizontal, MoveVertical, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { BuilderSection, SECTION_HUES } from "./BuilderSection";

interface LoveStoryFormProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
}

const newMoment = (): LoveStoryMoment => ({
  id: `m-${Date.now()}`,
  title: "",
  description: "",
  image: "",
  imagePosition: { x: 50, y: 50 },
});

interface MomentCardProps {
  moment: LoveStoryMoment;
  index: number;
  hue: string;
  canRemove: boolean;
  onChange: (patch: Partial<LoveStoryMoment>) => void;
  onRemove: () => void;
}

const MomentCard = ({ moment, index, hue, canRemove, onChange, onRemove }: MomentCardProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ image: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="rounded-lg border p-4 space-y-3 relative bg-white"
      style={{ borderColor: `${hue}33` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ backgroundColor: `${hue}1a`, color: hue }}
        >
          Розділ {index + 1}
        </span>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={onRemove}
            type="button"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`moment-title-${moment.id}`}>Заголовок</Label>
        <Input
          id={`moment-title-${moment.id}`}
          value={moment.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Як ми зустрілися"
          className="h-10 accent-focus-ring-textarea"
        />
      </div>

      <div className="space-y-2">
        <Label>Фото</Label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
          id={`image-upload-${moment.id}`}
        />
        {moment.image ? (
          <div className="space-y-2">
            <div
              className="relative group flex justify-center bg-muted/30 rounded-lg border-2 p-2 overflow-hidden"
              style={{ borderColor: `${hue}40` }}
            >
              <img
                src={moment.image}
                alt={moment.title || `Момент ${index + 1}`}
                className="max-w-full max-h-48 w-auto h-auto object-cover rounded-lg"
                style={{ objectPosition: `${moment.imagePosition.x}% ${moment.imagePosition.y}%` }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  onChange({ image: "" });
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 px-1">
              <p className="text-xs text-muted-foreground font-medium">Центрування фото</p>
              <div className="flex items-center gap-2">
                <MoveHorizontal className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={moment.imagePosition.x}
                  onChange={(e) =>
                    onChange({ imagePosition: { ...moment.imagePosition, x: Number(e.target.value) } })
                  }
                  className="w-full h-1.5 cursor-pointer"
                  style={{ accentColor: hue }}
                />
                <span className="text-xs text-muted-foreground w-8 text-right">{moment.imagePosition.x}%</span>
              </div>
              <div className="flex items-center gap-2">
                <MoveVertical className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={moment.imagePosition.y}
                  onChange={(e) =>
                    onChange({ imagePosition: { ...moment.imagePosition, y: Number(e.target.value) } })
                  }
                  className="w-full h-1.5 cursor-pointer"
                  style={{ accentColor: hue }}
                />
                <span className="text-xs text-muted-foreground w-8 text-right">{moment.imagePosition.y}%</span>
              </div>
            </div>
          </div>
        ) : (
          <label htmlFor={`image-upload-${moment.id}`}>
            <div
              className="w-full h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-accent/5"
              style={{ borderColor: `${hue}55` }}
            >
              <Upload className="w-5 h-5 mb-1.5" style={{ color: hue }} />
              <span className="text-sm text-muted-foreground">Завантажити фото</span>
            </div>
          </label>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`moment-desc-${moment.id}`}>Опис</Label>
        <Textarea
          id={`moment-desc-${moment.id}`}
          value={moment.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Розкажіть про цей момент…"
          rows={5}
          className="resize-y accent-focus-ring-textarea"
        />
      </div>
    </div>
  );
};

export const LoveStoryForm = ({ data, setData }: LoveStoryFormProps) => {
  const hue = SECTION_HUES.loveStory;

  // Dynamic accent color for textarea focus rings (uses template accent — preserved from prior behavior)
  useEffect(() => {
    const styleId = "accent-color-textarea-style";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      .accent-focus-ring-textarea:focus-visible {
        --tw-ring-color: ${data.templateColors.accent} !important;
        box-shadow: 0 0 0 2px ${data.templateColors.accent} !important;
      }
    `;
  }, [data.templateColors.accent]);

  const moments = data.loveStory.moments;

  const updateMoment = (id: string, patch: Partial<LoveStoryMoment>) => {
    setData({
      ...data,
      loveStory: {
        moments: moments.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    });
  };

  const addMoment = () => {
    setData({
      ...data,
      loveStory: { moments: [...moments, newMoment()] },
    });
  };

  const removeMoment = (id: string) => {
    setData({
      ...data,
      loveStory: { moments: moments.filter((m) => m.id !== id) },
    });
  };

  return (
    <BuilderSection title="Історія кохання" icon={Heart} hue={hue}>
      <div className="space-y-4">
        {moments.map((moment, index) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            index={index}
            hue={hue}
            canRemove={moments.length > 1}
            onChange={(patch) => updateMoment(moment.id, patch)}
            onRemove={() => removeMoment(moment.id)}
          />
        ))}
        <Button variant="outline" onClick={addMoment} className="w-full" type="button">
          <Plus className="w-4 h-4 mr-2" />
          Додати момент
        </Button>
      </div>
    </BuilderSection>
  );
};
