import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "@/components/invitation/templates/registry";
import { TemplatePreviewStage } from "@/components/invitation/TemplatePreviewStage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Eye, Sliders } from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-geologica overflow-x-hidden">
      {/* ======================= HERO ======================= */}
      <section className="relative isolate overflow-hidden bg-[hsl(32,30%,97%)] pt-20 pb-20 md:pt-28 md:pb-24 px-4">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-rose-200/40 blur-3xl" />

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(24 20% 20% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(24 20% 20% / 1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight font-geologica text-foreground">
            Оберіть{" "}
            <span
              className="text-5xl md:text-[76px] text-pink-500 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700 }}
            >
              шаблон
            </span>
            <br />
            вашого запрошення
          </h1>

          <p className="text-lg md:text-xl text-foreground/65 max-w-2xl mx-auto leading-relaxed">
            Унікальні дизайни — оберіть стиль, який найкраще відображає вашу історію
            кохання. Всі деталі можна налаштувати у конструкторі.
          </p>
        </div>

        {/* Bottom soft fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[hsl(28,30%,93%)]" />
      </section>

      {/* ======================= GRID ======================= */}
      <section className="relative py-20 md:py-24 px-4 bg-[hsl(28,30%,93%)] overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-32 h-[24rem] w-[24rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-32 h-[24rem] w-[24rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }, (_, i) => TEMPLATES[i % TEMPLATES.length]).map((template, i) => (
              <button
                key={`${template.id}-${i}`}
                type="button"
                onClick={() => navigate(`/builder?template=${template.id}`)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl hover:-translate-y-1 transition-all duration-500 overflow-hidden text-left flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                style={{
                  boxShadow: `0 4px 24px 0 ${template.thumbnail.accent}30, 0 1px 4px 0 ${template.thumbnail.accent}15`,
                }}
              >
                {/* Hover preview hint */}
                <span className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur text-foreground/60 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Eye className="h-4 w-4" />
                </span>

                {/* Thumbnail */}
                <div className="relative">
                  <TemplatePreviewStage template={template} />
                  {/* Gradient overlay on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(180deg, transparent 60%, ${template.thumbnail.accent}20 100%)`,
                    }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6 md:p-7 gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold font-geologica leading-tight" style={{ color: "#3D3129" }}>
                      {template.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-justify" style={{ color: "#3D3129" }}>
                      Розкішний кінематографічний стиль із золотими акцентами
                    </p>
                  </div>

                  <div
                    className="inline-flex items-center gap-2 self-start rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: "#8C7B6B",
                      color: "#fff",
                    }}
                  >
                    <Sliders className="h-3 w-3" />
                    Кольори та деталі налаштовуються
                  </div>

                  <Button
                    className="group/btn w-full h-12 rounded-full text-sm font-semibold gap-2 shadow-sm transition-all"
                    style={{
                      backgroundColor: "#3D3129",
                      color: "#fff",
                    }}
                  >
                    Обрати цей шаблон
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom helper */}
          <div className="mt-14 text-center">
            <p className="text-sm text-foreground/55 inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Кожен шаблон повністю налаштовується — кольори, фото, історія, таймлайн
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates;
