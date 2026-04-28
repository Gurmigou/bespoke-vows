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
import { RotateCcw, Send, Sparkles } from "lucide-react";
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
  onReset: () => void;
  isEditing?: boolean;
  isActiveInvitation?: boolean;
}

export const BuilderPanel = ({
  data,
  setData,
  onPublish,
  onReset,
  isEditing,
  isActiveInvitation,
}: BuilderPanelProps) => {
  const accent = data.templateColors.accent;
  const primary = data.templateColors.primary;
  const isUpdate = isEditing && isActiveInvitation;

  return (
    <div
      className="w-full h-screen border-r flex flex-col transition-all duration-500 bg-slate-50/60"
      style={{ borderColor: `${primary}20` }}
    >
      <div
        className="px-5 py-4 border-b sticky top-0 z-10 backdrop-blur-md bg-white/80 transition-all duration-500"
        style={{ borderColor: `${primary}20` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors duration-500"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm leading-tight truncate">
                Налаштування запрошення
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {isUpdate ? "Редагування активного запрошення" : "Чернетка"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <TooltipProvider delayDuration={200}>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                        aria-label="Скинути до початкового"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Скинути до початкового</TooltipContent>
                </Tooltip>
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
              </AlertDialog>
            </TooltipProvider>

            <Button
              onClick={onPublish}
              className="h-9 rounded-full px-4 font-semibold text-white shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-300 gap-1.5"
              style={{ backgroundColor: accent }}
            >
              <Send className="w-3.5 h-3.5" />
              {isUpdate ? "Оновити" : "Опублікувати"}
            </Button>
          </div>
        </div>

        {isUpdate && (
          <p className="mt-2 text-[11px] text-muted-foreground text-right">
            посилання залишиться тим самим
          </p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 mx-auto" style={{ maxWidth: "95%" }}>
          <TemplateColorPicker data={data} setData={setData} />
          <BasicInfoForm data={data} setData={setData} />
          <LoveStoryForm data={data} setData={setData} />
          <ColorsForm data={data} setData={setData} />
          <EventsForm data={data} setData={setData} />
          <VenueForm data={data} setData={setData} />
        </div>
      </ScrollArea>
    </div>
  );
};
