import { useLocation, useNavigate } from "react-router-dom";
import type { InvitationData } from "@bespoke-vows/shared";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { getTemplateDefinition } from "@/components/invitation/templates/registry";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="shadow-md gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад до редактора
        </Button>
      </div>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <Button
          size="sm"
          onClick={() => navigate("/pricing")}
          className="shadow-md gap-2 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white border-0"
        >
          <Share2 className="w-4 h-4" />
          Зробити видимим для гостей
        </Button>
      </div>
      <TemplateRenderer template={template} data={state.data} />
    </div>
  );
};

export default PreviewPage;
