import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InvitationData, LoveStoryMoment } from "@/pages/Builder";
import { Heart, Plus, Upload, X, MoveHorizontal, MoveVertical, Trash2, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ image: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="group/card rounded-xl border border-slate-200 p-4 space-y-4 relative bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
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
          Розділ
        </span>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            onClick={onRemove}
            type="button"
            aria-label="Видалити розділ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor={`moment-title-${moment.id}`}
          className="text-xs font-medium text-slate-600"
        >
          Заголовок
        </Label>
        <Input
          id={`moment-title-${moment.id}`}
          value={moment.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Як ми зустрілися"
          className="h-10 accent-focus-ring-textarea bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" strokeWidth={2.5} />
          Фото
        </Label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
          id={`image-upload-${moment.id}`}
        />
        {moment.image ? (
          <div className="space-y-3">
            <div
              className="relative group/img flex justify-center bg-slate-50 rounded-xl border border-slate-200 p-2 overflow-hidden"
            >
              <img
                src={moment.image}
                alt={moment.title || `Момент ${index + 1}`}
                className="max-w-full max-h-52 w-auto h-auto object-cover rounded-lg shadow-sm"
                style={{ objectPosition: `${moment.imagePosition.x}% ${moment.imagePosition.y}%` }}
              />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 shadow-md"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Замінити
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0 shadow-md"
                  onClick={() => {
                    onChange({ image: "" });
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Видалити фото"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div
              className="space-y-2.5 px-3 py-3 rounded-lg bg-slate-50/80 border border-slate-200/80"
            >
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Центрування фото
              </p>
              <div className="flex items-center gap-2.5">
                <MoveHorizontal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
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
                <span className="text-xs text-slate-500 w-10 text-right tabular-nums">
                  {moment.imagePosition.x}%
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MoveVertical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
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
                <span className="text-xs text-slate-500 w-10 text-right tabular-nums">
                  {moment.imagePosition.y}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <label htmlFor={`image-upload-${moment.id}`}>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group/upload"
              style={{
                borderColor: isDragOver ? hue : `${hue}40`,
                backgroundColor: isDragOver ? `${hue}10` : `${hue}05`,
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-transform duration-200 group-hover/upload:scale-110"
                style={{ backgroundColor: `${hue}1a`, color: hue }}
              >
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {isDragOver ? "Відпустіть фото" : "Завантажити фото"}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                або перетягніть сюди
              </span>
            </div>
          </label>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor={`moment-desc-${moment.id}`}
          className="text-xs font-medium text-slate-600"
        >
          Опис
        </Label>
        <Textarea
          id={`moment-desc-${moment.id}`}
          value={moment.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Розкажіть про цей момент…"
          rows={5}
          className="resize-y accent-focus-ring-textarea bg-white border-slate-200/80 focus:border-slate-300 transition-colors"
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
    <BuilderSection
      title="Історія кохання"
      description="Розкажіть про ваші особливі моменти"
      icon={Heart}
      hue={hue}
    >
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
        <Button
          variant="outline"
          onClick={addMoment}
          className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати момент
        </Button>
      </div>
    </BuilderSection>
  );
};
