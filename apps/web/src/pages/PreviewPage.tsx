import { useLocation, useNavigate } from "react-router-dom";
import type { InvitationData } from "@bespoke-vows/shared";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { getTemplateDefinition } from "@/components/invitation/templates/registry";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { data: InvitationData; templateId: string } | null;

  if (!state?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Запрошення не знайдено.</p>
        <Button variant="outline" onClick={() => navigate("/builder")}>
          Повернутися до редактора
        </Button>
      </div>
    );
  }

  const template = getTemplateDefinition(state.templateId);

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 h-11 pl-1.5 pr-4 rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/80 text-slate-700 shadow-sm transition-[background-color,box-shadow,color,border-color] duration-200 hover:bg-white hover:shadow-md hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white shrink-0">
            <ArrowLeft className="w-4 h-4 block" strokeWidth={2.25} />
          </span>
          <span className="text-sm font-medium leading-none">Назад до редактора</span>
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={() => navigate("/pricing")}
          className="group relative inline-flex items-center gap-2.5 h-11 pl-4 pr-1.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 shadow-[0_8px_24px_-8px_rgba(244,63,94,0.55)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_12px_32px_-10px_rgba(244,63,94,0.7)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 overflow-hidden"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
          />
          <Sparkles className="w-4 h-4 block shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" strokeWidth={2.25} />
          <span className="leading-none">Зробити видимим для гостей</span>
          <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-white/20 transition-colors group-hover:bg-white/30 shrink-0">
            <Share2 className="w-4 h-4 block" strokeWidth={2.25} />
          </span>
        </button>
      </div>

      <TemplateRenderer template={template} data={state.data} />
    </div>
  );
};

export default PreviewPage;
