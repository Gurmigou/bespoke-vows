import { Button } from "@/components/ui/button";
import {
  Palette,
  Clock,
  Smartphone,
  RefreshCw,
  Share2,
  ImagePlus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Palette, title: "Унікальні шаблони на будь-який стиль", desc: "Класика, модерн, флорал — стиль під твоє весілля" },
  { icon: Clock, title: "Активне 1 рік або назавжди із Pro планом", desc: "Гості переглядають запрошення весь підготовчий період" },
  { icon: Smartphone, title: "Ідеально на будь-якому екрані", desc: "Телефон, планшет, ноутбук — виглядає бездоганно" },
  { icon: RefreshCw, title: "Змінюй скільки завгодно", desc: "Час перенесли? Місце змінилось? Оновлюй безкоштовно. Посилання завжди залишиться тим самим." },
  { icon: Share2, title: "Одне посилання — всім гостям", desc: "Надішли в Telegram, Viber, Instagram, де зручно. А також використовуй QR-code, наприклад на паперовому запрошення" },
  { icon: ImagePlus, title: "Редагуй всю вашу історію кохання", desc: "Додай фото і текст, опиши пропозицію та вашу історію кохання, додай кольори і план — зроби запрошення особливим" },
];

const About = () => {
  return (
    <div className="min-h-screen font-geologica overflow-x-hidden">
      {/* ======================= ABOUT US ======================= */}
      <section className="relative isolate py-24 md:py-32 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(24 20% 20% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(24 20% 20% / 1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight mb-10">
            Про{" "}
            <span
              className="text-5xl md:text-[76px] italic bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              нас
            </span>
          </h2>

          <p className="text-foreground/70 leading-relaxed text-left md:text-center text-base md:text-lg mb-10">
            Beloved — Ukrainian-made продукт для пар, яким важлива кожна деталь свого
            весілля. За 10 хвилин ви самостійно створюєте красиве цифрове запрошення і
            ділитесь ним з гостями в один клік — без дизайнерів, без друку, без черг.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/templates">
              <Button className="group h-14 rounded-full text-base md:text-lg px-8 shadow-elegant hover:shadow-soft transition-all hover:-translate-y-0.5">
                Спробувати безкоштовно
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                variant="outline"
                className="h-14 rounded-full text-base md:text-lg px-8 border-foreground/15 bg-white/60 backdrop-blur hover:bg-white"
              >
                Подивитись шаблони
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= WHAT'S INCLUDED ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-[hsl(28,30%,93%)] overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
<h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight">
              Що входить у{" "}
              <span
                className="text-5xl md:text-[76px] italic bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                запрошення
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative bg-white/80 backdrop-blur-sm p-7 rounded-3xl border border-foreground/5 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/0 to-amber-50/0 group-hover:from-pink-50 group-hover:to-amber-50 transition-all duration-500" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-amber-500/10 text-pink-500 mb-5 group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white transition-all duration-500">
                  <Icon className="w-7 h-7" />
                </div>
                <p className="font-semibold text-lg md:text-xl font-geologica mb-2">{title}</p>
                <p className="text-foreground/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
