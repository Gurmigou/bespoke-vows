import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import type { InvitationData, Template } from "@bespoke-vows/shared";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { getTemplateDefinition } from "@/components/invitation/templates/registry";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Heart, Mail } from "lucide-react";
import { publicApi, ApiError } from "@/lib/api";
import { writeAnonDraft } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

const PreviewPage = () => {
  const { token } = useParams<{ token?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const localState = location.state as { data: InvitationData; templateId: string } | null;

  const [data, setData] = useState<InvitationData | null>(localState?.data ?? null);
  const [template, setTemplate] = useState<Template["definition"] | null>(
    localState?.templateId ? getTemplateDefinition(localState.templateId) : null
  );
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    publicApi
      .preview(token)
      .then((view) => {
        setData(view.invitation.config);
        setTemplate(view.template.definition);
        setInvitationId(view.invitation.id);
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.status === 401 ? "Посилання застаріло" : "Запрошення недоступне");
        } else {
          setError("Помилка завантаження");
        }
      });
  }, [token]);

  if (token && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(32,20%,96%)] px-4 font-geologica">
        <div className="text-center max-w-md space-y-7">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
              <Heart className="w-7 h-7 text-stone-400" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">Beloved</p>
            <h1 className="text-3xl font-semibold text-stone-800 leading-snug tracking-tight">
              {error === "Посилання застаріло" ? "Посилання застаріло" : "Запрошення недоступне"}
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
              {error === "Посилання застаріло"
                ? "Це посилання для перегляду більше не дійсне. Спробуйте отримати нове — або якщо вважаєте, що відбулась помилка, зверніться до нас."
                : "Це запрошення більше не активне або посилання некоректне. Якщо ви вважаєте, що це помилка — зв'яжіться з нами."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
            <Button
              asChild
              className="h-11 rounded-full px-6 text-sm font-medium bg-stone-800 hover:bg-stone-900 text-white shadow-none"
            >
              <Link to="/">На головну</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full px-6 text-sm gap-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-600"
            >
              <Link to="/contact">
                <Mail className="w-3.5 h-3.5" />
                Зв'язатися з нами
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Завантаження...</p>
      </div>
    );
  }

  const handlePublish = () => {
    if (token && invitationId) {
      navigate(`/account?publish=${invitationId}`);
      return;
    }
    if (localState) {
      writeAnonDraft({
        templateId: localState.templateId,
        config: localState.data,
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem("bv:postLoginIntent", "pay");
      navigate(user ? "/account?postLoginPay=1" : "/register");
    }
  };

  const showPublish = Boolean((token && invitationId) || localState);

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 h-11 pl-1.5 pr-4 rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/80 text-slate-700 shadow-sm hover:bg-white hover:shadow-md"
        >
          <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
          </span>
          <span className="text-sm font-medium leading-none">Назад</span>
        </button>
      </div>
      {showPublish && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            type="button"
            onClick={handlePublish}
            className="h-11 rounded-full px-5 gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            Опублікувати
          </Button>
        </div>
      )}
      <TemplateRenderer template={template} data={data} />
    </div>
  );
};

export default PreviewPage;
