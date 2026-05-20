import { Button } from "@/components/ui/button";
import { Check, Sparkles, Heart, Infinity as InfinityIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRICE_INVITATION_1Y_USD, PRICE_LIFETIME_USD } from "@bespoke-vows/shared";

const FREE_PERKS = [
  "Створення та редагування без обмежень",
  "Усі 3 шаблони доступні для прев'ю",
  "Активне посилання 3 дні після публікації",
  "Без вводу карти",
];

const INVITATION_PERKS = [
  "1 обраний шаблон",
  "Активне посилання 1 рік від дати оплати",
  "Необмежені перегляди гостями",
  "Редагування контенту будь-коли",
  "Унікальне посилання · мобільна адаптація",
  "Підтримка email",
];

const LIFETIME_PERKS = [
  "Доступ до всіх шаблонів (зараз 3, нові — безкоштовно)",
  "Безлімітна кількість запрошень",
  "Без терміну дії — назавжди",
  "Зміна шаблону в будь-який момент",
  "Пріоритетна підтримка",
  "Ідеально для річниць та родинних подій",
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col font-geologica overflow-x-hidden bg-[hsl(32,30%,97%)]">
      <section className="relative isolate overflow-hidden bg-[hsl(32,30%,97%)] pt-20 pb-20 md:pt-28 md:pb-24 px-4">
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

        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-medium text-foreground/70 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Прозора ціна — без підписок
          </div>

          <h1 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight font-geologica text-foreground">
            Зробіть ваше весілля{" "}
            <span
              className="text-5xl md:text-[76px] bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700 }}
            >
              незабутнім
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/65 max-w-xl mx-auto leading-relaxed">
            Спробуйте безкоштовно, а потім оберіть план, який підходить саме вам.
          </p>
        </div>
      </section>

      <section className="relative flex-1 flex flex-col justify-center py-20 md:py-24 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-32 h-[24rem] w-[24rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-32 h-[24rem] w-[24rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-5xl relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* Free trial */}
            <div className="group relative bg-white/80 backdrop-blur-sm border border-foreground/5 rounded-3xl shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="px-7 pt-8 pb-6 border-b border-foreground/5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-4">
                  Безкоштовний trial
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-6xl font-bold text-foreground leading-none">$0</span>
                </div>
                <p className="text-sm text-foreground/55 mt-3">3 дні після публікації</p>
              </div>
              <div className="px-7 py-6 flex flex-col gap-3.5 flex-1">
                {FREE_PERKS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 mt-0.5 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
                      <Check className="w-3 h-3 text-foreground/50" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-7 pb-7">
                <Link to="/builder" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full border-foreground/15 bg-white/60 text-foreground text-sm font-medium hover:bg-white"
                  >
                    Спробувати безкоштовно
                  </Button>
                </Link>
              </div>
            </div>

            {/* Одне запрошення */}
            <div className="group relative bg-white/80 backdrop-blur-sm border border-foreground/5 rounded-3xl shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="px-7 pt-8 pb-6 border-b border-foreground/5">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-3.5 h-3.5 text-pink-500" fill="currentColor" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-500">Одне запрошення</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-6xl font-bold text-foreground leading-none">
                    ${PRICE_INVITATION_1Y_USD.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-foreground/55 mt-3">одноразова оплата · 1 шаблон · 1 рік</p>
              </div>
              <div className="px-7 py-6 flex flex-col gap-3.5 flex-1">
                {INVITATION_PERKS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 mt-0.5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 shadow-sm shadow-pink-500/20">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-7 pb-7">
                <Link to="/builder" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full border-pink-300/60 bg-pink-50/40 text-pink-700 text-sm font-medium hover:bg-pink-50"
                  >
                    Створити запрошення
                  </Button>
                </Link>
              </div>
            </div>

            {/* Усі шаблони назавжди — Рекомендовано */}
            <div className="relative flex flex-col h-full md:-my-3">
              <div className="absolute -inset-2 bg-gradient-to-br from-pink-400/40 via-rose-300/30 to-amber-300/30 rounded-[2rem] blur-2xl opacity-70 pointer-events-none" />

              <div className="relative bg-gradient-to-br from-white via-white to-pink-50/60 backdrop-blur-sm border border-pink-200/50 rounded-3xl shadow-elegant overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-500">
                <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 text-white text-[11px] font-semibold uppercase tracking-[0.2em] text-center py-2.5 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Рекомендовано
                </div>

                <div className="px-7 pt-8 pb-6 border-b border-pink-100/60">
                  <div className="flex items-center gap-2 mb-4">
                    <InfinityIcon className="w-3.5 h-3.5 text-rose-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">Усі шаблони назавжди</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-bold text-foreground leading-none">
                      ${PRICE_LIFETIME_USD.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/55 mt-3">одноразово · усі шаблони · без терміну</p>
                </div>

                <div className="px-7 py-6 flex flex-col gap-3.5 flex-1">
                  {LIFETIME_PERKS.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 mt-0.5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 shadow-sm shadow-pink-500/20">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-foreground/85 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="px-7 pb-7">
                  <Link to="/checkout/lifetime" className="block">
                    <Button className="group w-full h-12 text-sm font-semibold rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md shadow-pink-500/20 hover:shadow-lg transition-all">
                      Отримати назавжди
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 text-center">
            <p className="text-foreground/55 text-sm flex items-center justify-center gap-2">
              <Heart className="h-3.5 w-3.5 text-pink-500" fill="currentColor" />
              Вже <span className="font-semibold text-foreground">сотні пар</span> поділилися своїм запрошенням через Beloved
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
