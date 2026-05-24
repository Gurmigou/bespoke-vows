import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Info, RotateCcw, Save, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BasicInfoForm } from "./BasicInfoForm";
import { LoveStoryForm } from "./LoveStoryForm";
import { EventsForm } from "./EventsForm";
import { ColorsForm } from "./ColorsForm";
import { TemplateColorPicker } from "./TemplateColorPicker";
import { VenueForm } from "./VenueForm";
import { InvitationData } from "@/pages/Builder";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BuilderPanelProps {
  data: InvitationData;
  setData: React.Dispatch<React.SetStateAction<InvitationData>>;
  templateId: string;
  onPublish: () => void;
  onSave: () => void;
  onReset: () => void;
  isEditing?: boolean;
  isActiveInvitation?: boolean;
  saveSuccess?: boolean;
  embedded?: boolean;
}

export const BuilderPanel = ({
  data,
  setData,
  onPublish,
  onSave,
  onReset,
  isEditing,
  isActiveInvitation,
  saveSuccess,
  embedded,
}: BuilderPanelProps) => {
  const accent = data.templateColors.accent;
  const primary = data.templateColors.primary;
  const isUpdate = isEditing && isActiveInvitation;
  const { user } = useAuth();
  const showDraftNotice = !isUpdate && !user;

  const resetDialog = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Скинути всі зміни?</AlertDialogTitle>
        <AlertDialogDescription>
          Всі поля повернуться до початкових значень. Цю дію не можна скасувати.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Скасувати</AlertDialogCancel>
        <AlertDialogAction onClick={onReset}>Скинути</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  return (
    <div
      className={`w-full ${embedded ? "h-full" : "h-screen border-r"} flex flex-col transition-colors duration-500`}
      style={{
        borderColor: embedded ? undefined : `${primary}33`,
        backgroundImage: `linear-gradient(170deg, #ebecee 0%, #dee0e3 60%, #cfd2d6 100%)`,
      }}
    >
      <header
        className={`${embedded ? "px-4 py-3" : "px-6 py-4"} border-b sticky top-0 z-10 backdrop-blur-xl bg-white/70 transition-colors duration-500`}
        style={{ borderColor: `${primary}26` }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className={`flex items-center ${embedded ? "gap-2" : "gap-3"} min-w-0 flex-1`}>
            {!embedded && (
              <span
                className="flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 transition-colors duration-500 ring-1 ring-inset"
                style={{
                  backgroundColor: `${accent}14`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px ${accent}22`,
                }}
              >
                <Sparkles className="w-[18px] h-[18px]" />
              </span>
            )}
            <div className="flex flex-col min-w-0">
              <span className={`font-semibold ${embedded ? "text-[15px]" : "text-[15px]"} leading-tight truncate text-slate-900`}>
                {embedded ? "Редагування" : "Налаштування запрошення"}
              </span>
              {!embedded && (
                <span className="text-[11.5px] text-slate-500 leading-tight mt-0.5 flex items-center gap-1.5">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isUpdate ? "#10b981" : "#94a3b8" }}
                  />
                  {isUpdate ? "Активне" : "Чернетка"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center shrink-0">
            {isUpdate ? (
              <Button
                onClick={onSave}
                className={`${embedded ? "h-11 px-6 text-[14px]" : "h-10 px-5"} rounded-full font-semibold text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300 gap-2`}
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 8px 20px -8px ${accent}80`,
                }}
              >
                {saveSuccess ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saveSuccess ? "Збережено" : embedded ? "Зберегти" : "Зберегти зміни"}
              </Button>
            ) : !embedded ? (
              <Button
                onClick={onPublish}
                className="h-12 px-7 text-[15px] rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 gap-2 ring-1 ring-white/20"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent} 0%, ${accent} 60%, color-mix(in srgb, ${accent} 80%, #ffffff) 100%)`,
                  backgroundColor: accent,
                  boxShadow: `0 12px 28px -8px ${accent}cc, 0 2px 6px -2px ${accent}80`,
                }}
              >
                <Send className="w-[18px] h-[18px]" />
                Далі
              </Button>
            ) : null}
          </div>
        </div>

        {!embedded && (
          <div className="mt-3 flex items-center">
            <TooltipProvider delayDuration={200}>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        aria-label="Скинути до початкового"
                        className="group inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors"
                      >
                        <RotateCcw className="w-[13px] h-[13px] transition-transform duration-300 group-hover:-rotate-[60deg]" />
                        Скинути
                      </button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Скинути до початкового</TooltipContent>
                </Tooltip>
                {resetDialog}
              </AlertDialog>
            </TooltipProvider>
          </div>
        )}

        {isUpdate && !embedded && (
          <div
            className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] leading-snug text-slate-700"
            style={{
              backgroundColor: `${accent}12`,
              border: `1px solid ${accent}28`,
            }}
          >
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
            <span>
              Після збереження змін посилання для ваших гостей залишиться тим самим.
            </span>
          </div>
        )}

        {showDraftNotice && !embedded && (
          <div
            className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] leading-snug text-slate-700"
            style={{
              backgroundColor: `${accent}12`,
              border: `1px solid ${accent}28`,
            }}
          >
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
            <span>
              Дані шаблону збережені у Вашому браузері. Увійдіть в акаунт, щоб їх не втратити.
            </span>
          </div>
        )}
      </header>

      <ScrollArea className="flex-1">
        <div className="px-6 py-7 space-y-5 mx-auto max-w-[680px]">
          {isUpdate && embedded && (
            <div
              className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] leading-snug text-slate-700"
              style={{
                backgroundColor: `${accent}12`,
                border: `1px solid ${accent}28`,
              }}
            >
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
              <span>
                Після збереження змін посилання для ваших гостей залишиться тим самим.
              </span>
            </div>
          )}
          <TemplateColorPicker data={data} setData={setData} />
          <BasicInfoForm data={data} setData={setData} />
          <VenueForm data={data} setData={setData} />
          <LoveStoryForm data={data} setData={setData} />
          <EventsForm data={data} setData={setData} />
          <ColorsForm data={data} setData={setData} />

        </div>
      </ScrollArea>
    </div>
  );
};
