import { useNavigate } from "react-router-dom";
import type { TemplateDefinition } from "@bespoke-vows/shared";
import { TEMPLATES } from "@/components/invitation/templates/registry";
import { Button } from "@/components/ui/button";

const TemplateThumbnail = ({ template }: { template: TemplateDefinition }) => {
  const t = template.thumbnail;
  return (
    <>
      <style>{t.fontFaces}</style>
      <div
        className="aspect-[3/4] w-full rounded-lg border overflow-hidden flex flex-col items-center justify-between p-6 transition-transform group-hover:scale-[1.02]"
        style={{ backgroundColor: t.bg, borderColor: `${t.accent}40` }}
      >
        <div
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: t.accent }}
        >
          Save the date
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h3
            className={`${t.fontClass} text-3xl md:text-4xl leading-tight`}
            style={{ color: t.text }}
          >
            {t.headerText}
          </h3>
          <div className="h-px w-12" style={{ backgroundColor: t.accent, opacity: 0.5 }} />
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: t.text, opacity: 0.7 }}
          >
            15 червня 2026
          </p>
        </div>

        <div className="flex gap-2">
          <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: t.swatch1, borderColor: `${t.accent}30` }} />
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: t.swatch2 }} />
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: t.swatch3 }} />
        </div>
      </div>
    </>
  );
};

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 sm:mb-4">
            Оберіть шаблон вашого запрошення
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Три унікальні дизайни — оберіть стиль, який найкраще відображає вашу історію кохання.
            Всі деталі можна налаштувати у конструкторі.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-sm sm:max-w-none mx-auto">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => navigate(`/builder?template=${template.id}`)}
              className="group text-left flex flex-col items-center gap-3 sm:gap-4 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 rounded-lg"
            >
              <TemplateThumbnail template={template} />
              <div className="px-1 w-full flex-1 text-center flex flex-col">
                <h2 className="text-lg md:text-xl font-medium">{template.name}</h2>
                <p className="mt-2 sm:mt-3 text-sm text-muted-foreground flex-1 flex items-center justify-center">
                  {template.description}
                </p>
              </div>
              <Button
                className="mt-1 sm:mt-2 w-full"
                style={{
                  backgroundColor: template.thumbnail.accent,
                  color: "#fff",
                }}
              >
                Обрати цей шаблон
              </Button>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
