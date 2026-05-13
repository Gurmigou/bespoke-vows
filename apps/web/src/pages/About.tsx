import { Button } from "@/components/ui/button";
import {
  Palette,
  Clock,
  Smartphone,
  RefreshCw,
  Share2,
  ImagePlus,
  ArrowRight,
  Check,
  X,
  Heart,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "10 хв", label: "до готового запрошення" },
  { value: "$9.99", label: "одна ціна на рік" },
  { value: "∞", label: "редагувань без доплат" },
  { value: "0", label: "паперу та принтерів" },
];

const features = [
  { icon: Palette, title: "Унікальні шаблони на будь-який стиль", desc: "Класика, модерн, флорал — стиль під твоє весілля" },
  { icon: Clock, title: "Активне 1 рік", desc: "Гості переглядають запрошення весь підготовчий період" },
  { icon: Smartphone, title: "Ідеально на будь-якому екрані", desc: "Телефон, планшет, ноутбук — виглядає бездоганно" },
  { icon: RefreshCw, title: "Змінюй скільки завгодно", desc: "Час перенесли? Місце змінилось? Оновлюй безкоштовно" },
  { icon: Share2, title: "Одне посилання — всім гостям", desc: "Надішли в Telegram, Viber, Instagram, де зручно" },
  { icon: ImagePlus, title: "Ваша любовна історія", desc: "Додай фото і текст — зроби запрошення особистим" },
];

const comparison: Array<[string, string, string]> = [
  ["Вартість на 100 гостей", "₴5 000–15 000", "₴400 (~$9.99)"],
  ["Час до готовності", "2–4 тижні", "10 хвилин"],
  ["Зміна деталей", "Передрук = нові витрати", "Безкоштовно, миттєво"],
  ["Доставка гостям", "Пошта або особисто", "Одне посилання в чат"],
  ["Загублене запрошення", "Гість не прийде", "Посилання завжди в телефоні"],
  ["Враження", "Стандартно", "Wow-ефект гарантовано"],
];

const About = () => {
  return (
    <div className="min-h-screen font-geologica overflow-x-hidden">
      {/* ======================= HERO ======================= */}
      <section className="relative isolate overflow-hidden bg-[hsl(32,30%,97%)] pt-20 pb-24 md:pt-28 md:pb-32 px-4">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-rose-200/40 blur-3xl" />

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(24 20% 20% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(24 20% 20% / 1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-medium text-foreground/70 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
            </span>
            Beloved · про нас
          </div>

          <h1 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight font-geologica text-foreground">
            Цифрові запрошення,
            <br />
            <span
              className="text-5xl md:text-[76px] bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              які гості запам'ятають
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/65 max-w-2xl mx-auto leading-relaxed">
            Ми зробили конструктор, де за 10 хвилин можна створити красиве весільне
            запрошення — без дизайнера, без друку, без черг
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
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

        {/* Bottom soft fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[hsl(28,30%,93%)]" />
      </section>

      {/* ======================= STATS ======================= */}
      <section className="relative py-20 md:py-24 px-4 bg-[hsl(28,30%,93%)] overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[20rem] w-[20rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[20rem] w-[20rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 p-6 md:p-8 text-center shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
              >
                <p
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-pink-500 to-amber-500 bg-clip-text text-transparent mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                >
                  {value}
                </p>
                <p className="text-xs md:text-sm text-foreground/60 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= COMPARISON ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute top-1/3 -left-32 h-[24rem] w-[24rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-32 h-[24rem] w-[24rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
              Папір vs цифра
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight">
              Порівняйте{" "}
              <span
                className="text-5xl md:text-[76px] italic bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                самі
              </span>
            </h2>
          </div>

          {/* Desktop: card-styled table */}
          <div className="hidden md:block">
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 shadow-sm overflow-hidden">
              <div className="grid grid-cols-[1.4fr_1fr_1fr] text-sm">
                {/* header row */}
                <div className="px-7 py-5 text-xs font-semibold tracking-[0.15em] uppercase text-foreground/50 border-b border-foreground/5">
                  Критерій
                </div>
                <div className="px-7 py-5 text-center text-xs font-semibold tracking-[0.15em] uppercase text-foreground/50 border-b border-foreground/5 flex items-center justify-center gap-2">
                  <X className="h-3.5 w-3.5" /> Паперове
                </div>
                <div className="px-7 py-5 text-center text-xs font-semibold tracking-[0.15em] uppercase border-b border-foreground/5 bg-gradient-to-br from-pink-500/10 to-amber-500/10 text-pink-600 flex items-center justify-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Наше цифрове
                </div>

                {/* body rows */}
                {comparison.map(([crit, paper, digital], i) => (
                  <div className="contents" key={crit}>
                    <div
                      className={`px-7 py-5 font-medium text-foreground ${
                        i < comparison.length - 1 ? "border-b border-foreground/5" : ""
                      }`}
                    >
                      {crit}
                    </div>
                    <div
                      className={`px-7 py-5 text-center text-foreground/60 ${
                        i < comparison.length - 1 ? "border-b border-foreground/5" : ""
                      }`}
                    >
                      {paper}
                    </div>
                    <div
                      className={`px-7 py-5 text-center font-semibold text-foreground bg-gradient-to-br from-pink-500/[0.04] to-amber-500/[0.04] ${
                        i < comparison.length - 1 ? "border-b border-foreground/5" : ""
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 justify-center">
                        <Check className="h-4 w-4 text-pink-500 flex-shrink-0" />
                        {digital}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-4">
            {comparison.map(([crit, paper, digital]) => (
              <div
                key={crit}
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-foreground/5 shadow-sm p-5"
              >
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground/50 mb-3">{crit}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-foreground/[0.03] p-3">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-foreground/40 mb-1 flex items-center gap-1">
                      <X className="h-3 w-3" /> Паперове
                    </p>
                    <p className="text-sm text-foreground/60">{paper}</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-amber-500/10 p-3">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-pink-600 mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Цифрове
                    </p>
                    <p className="text-sm font-semibold text-foreground">{digital}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= WHAT'S INCLUDED ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-[hsl(28,30%,93%)] overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
              Все включено
            </span>
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

      {/* ======================= ABOUT US ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-pink-200/20 blur-3xl" />
        <Heart
          className="pointer-events-none absolute top-16 left-[10%] h-7 w-7 text-pink-300/60 -rotate-12"
          fill="currentColor"
        />
        <Heart
          className="pointer-events-none absolute bottom-20 right-[12%] h-6 w-6 text-amber-300/60 rotate-12"
          fill="currentColor"
        />
        <Sparkles className="pointer-events-none absolute top-24 right-[18%] h-7 w-7 text-pink-400/50" />

        <div className="container mx-auto max-w-3xl relative text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
            Наша історія
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight mb-10">
            Про{" "}
            <span
              className="text-5xl md:text-[76px] italic bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              нас
            </span>
          </h2>

          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 shadow-sm p-8 md:p-12 space-y-5 text-foreground/70 leading-relaxed text-left md:text-center text-base md:text-lg">
            <p>
              Beloved — Ukrainian-made продукт для пар, яким важлива кожна деталь свого
              весілля.
            </p>
            <p>
              Ми прибрали все зайве: жодних дизайнерів, жодного друку, жодних черг.
              Тільки конструктор, де ви самостійно створюєте запрошення та ділитесь ним
              зі своїми гостями в один клік.
            </p>
          </div>

          <div className="pt-12">
            <Link to="/templates">
              <Button className="group h-14 rounded-full text-lg px-10 shadow-elegant hover:shadow-soft transition-all hover:-translate-y-0.5">
                Створити своє запрошення
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
