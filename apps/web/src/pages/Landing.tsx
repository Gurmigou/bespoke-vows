import { Button } from "@/components/ui/button";
import { Check, Sparkles, Palette, Clock, Heart, Star, Instagram, ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import preview1 from "@/img/preview_1.png";
import section1Mac from "@/img/section_1_mac.png";
import section1Iphone from "@/img/section_1_iphone.png";

// TikTok Icon SVG Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Landing = () => {
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

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="space-y-7 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-foreground leading-[1.05] tracking-tight font-geologica">
                Цифрове запрошення
                <br />
                на весілля
                <br />
                <span
                  className="text-5xl md:text-[76px] text-pink-500 italic"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700 }}
                >
                  Твій ідеальний дизайн
                </span>
              </h1>

              <p className="text-lg md:text-xl text-foreground/65 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Оберіть вишуканий весільний шаблон, налаштуйте його під себе — додайте всі деталі вашого весілля: кольори, фото та описи. Отримайте одне елегантне посилання та надішліть його вашим гостям.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 w-fit mx-auto lg:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-sm font-medium text-pink-600">
                  Запрошення, яке готове за 10 хв
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
                <Link to="/templates">
                  <Button className="group h-14 rounded-full text-base md:text-lg px-8 shadow-elegant hover:shadow-soft transition-all hover:-translate-y-0.5">
                    Створити зараз
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

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-4 text-sm text-foreground/55">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> Без очікування розробки
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> Без знань програмування
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> Одне посилання для гостей
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> Редагування після публікації
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> QR-code посилання
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-pink-500" /> Безкоштовний попередній перегляд · Без карти
                </span>
              </div>
            </div>

            {/* Right — phone showcase */}
            <div className="relative hidden lg:block">
              {/* Soft glow behind phone */}
              <div className="absolute inset-0 -z-10 mx-auto h-[600px] w-[400px] translate-y-8 rounded-[3rem] bg-gradient-to-br from-pink-300/40 via-rose-200/40 to-amber-200/40 blur-2xl" />

              {/* Decorative rotating ring */}
              <div className="absolute -top-6 -left-32 h-24 w-24 rounded-full border border-pink-300/40 bg-white/40 backdrop-blur-md flex items-center justify-center shadow-sm">
                <Heart className="h-8 w-8 text-pink-500" fill="currentColor" />
              </div>
              <div className="relative mx-auto w-full max-w-md transition-transform duration-700 hover:-translate-y-2 hover:rotate-0 -rotate-3">
                <img
                  src={section1Iphone}
                  alt="Wedding invitation preview on iPhone"
                  className="w-full h-auto object-contain drop-shadow-[0_25px_60px_rgba(237,76,156,0.25)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom soft fade transition */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[hsl(28,30%,93%)]" />
      </section>

      {/* ======================= 3 STEPS ======================= */}
      <section className="relative py-20 md:py-28 px-4 bg-[hsl(28,30%,93%)]">
        <div className="container mx-auto max-w-6xl">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
              Як це працює
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight">
              Всього{" "}
              <span
                className="text-5xl md:text-[76px] italic text-pink-500"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                3 кроки
              </span>{" "}
              до готового запрошення
            </h2>
          </div>

          {/* Steps grid */}
          <div className="relative">
            {/* Connecting dotted line on desktop */}
            <div className="hidden md:block absolute top-[140px] left-[16%] right-[16%] h-px border-t-2 border-dashed border-foreground/15" />

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-6">
              {[
                { num: "01", title: "Обери шаблон", alt: "Step 1 — choose template" },
                { num: "02", title: "Кастомізуй його повністю під себе", alt: "Step 2 — customize" },
                { num: "03", title: "Отримай ідеальне запрошення", alt: "Step 3 — get invitation" },
              ].map((step, idx, arr) => (
                <div key={idx} className="flex flex-col md:flex-row items-stretch gap-6 md:gap-2 md:flex-1">
                  <div className="group flex flex-col items-center gap-5 flex-1 relative">
                    {/* Image card */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-3xl bg-white/80 backdrop-blur shadow-sm group-hover:shadow-elegant transition-shadow duration-500 -z-10" />
                      <div className="p-4">
                        <img
                          src={preview1}
                          alt={step.alt}
                          className="w-[200px] md:w-[230px] h-auto object-contain transition-transform duration-500 group-hover:-translate-y-1"
                        />
                      </div>
                      {/* Step number badge */}
                      <span
                        className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold shadow-lg ring-4 ring-[hsl(28,30%,93%)]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground text-center font-geologica leading-snug px-2 md:min-h-[4rem] flex items-start justify-center max-w-[260px]">
                      {step.title}
                    </h3>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="flex items-center justify-center text-pink-400 flex-shrink-0 self-center md:self-start md:mt-[170px]">
                      <ArrowRight className="hidden md:block w-7 h-7" strokeWidth={2} />
                      <ArrowDown className="md:hidden w-7 h-7" strokeWidth={2} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CONVERSION ======================= */}
      <section className="relative py-20 md:py-28 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute top-1/2 -left-32 h-[24rem] w-[24rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[24rem] w-[24rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
              Чому Beloved
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground font-geologica leading-tight tracking-tight">
              Запрошення, яке ваші гості{" "}
              <span
                className="text-5xl md:text-[76px] italic text-pink-500"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                запам'ятають
              </span>
            </h2>
            <p className="mt-5 text-lg text-foreground/65 leading-relaxed">
              Живий редактор, готові шаблони та делікатна типографіка — щоб ваше
              запрошення виглядало так, як ви його уявляли.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-14">
            {[
              {
                icon: Palette,
                title: "Готові шаблони на ваш смак",
                desc: "Від класичних до сучасних — кожен шаблон продуманий до найменшої деталі та повністю кастомізується під вас.",
              },
              {
                icon: Sparkles,
                title: "Живий перегляд у редакторі",
                desc: "Бачте кожну зміну в реальному часі — кольори, шрифти, історію кохання та таймлайн дня.",
              },
              {
                icon: Heart,
                title: "Одне посилання для всіх гостей",
                desc: "Поділіться запрошенням у месенджері — гості відкриють його на будь-якому пристрої без застосунків.",
              },
            ].map((f, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 p-7 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
              >
                {/* gradient on hover */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-pink-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white mb-5 shadow-md shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-geologica">{f.title}</h3>
                <p className="text-foreground/65 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <Link to="/templates">
              <Button className="group h-14 rounded-full text-lg px-10 shadow-elegant hover:shadow-soft transition-all hover:-translate-y-0.5">
                Подивитись шаблони
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="flex items-center gap-2 text-sm text-foreground/55">
              <Check className="h-4 w-4 text-pink-500" /> Готово за лічені хвилини
            </span>
          </div>
        </div>
      </section>

      {/* ======================= RESPONSIVE DESIGN ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-gradient-to-b from-[hsl(28,30%,93%)] via-[hsl(28,30%,90%)] to-[hsl(28,30%,93%)] overflow-hidden">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[30rem] w-[30rem] rounded-full bg-pink-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-4">
              На будь-якому пристрої
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground font-geologica leading-tight tracking-tight">
              Адаптивний дизайн{" "}
              <span
                className="text-5xl md:text-[76px] italic text-pink-500"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
              >
                для всіх пристроїв
              </span>
            </h2>
          </div>

          {/* Devices showcase */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 -z-10 mx-auto max-w-3xl h-[80%] top-[10%] rounded-[3rem] bg-gradient-to-br from-pink-300/30 via-rose-200/30 to-amber-200/30 blur-3xl" />

            <div className="flex flex-row items-end justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
              {/* iPhone — overlaps Mac slightly */}
              <div className="w-[28%] md:w-[26%] relative z-10 -mr-4 md:-mr-8 mb-4 md:mb-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={section1Iphone}
                  alt="iPhone view of invitation"
                  className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(237,76,156,0.25)]"
                />
              </div>
              {/* Mac */}
              <div className="w-[68%] md:w-[70%] relative">
                <img
                  src={section1Mac}
                  alt="Mac view of invitation"
                  className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FEATURES GRID ======================= */}
      <section className="relative py-24 md:py-32 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative space-y-14">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500">
              Можливості
            </span>
            <h2 className="text-4xl md:text-6xl font-bold font-geologica leading-tight tracking-tight">
              Змінна палітра кольорів дизайну, основна інформація про весілля, місце проведення, історія кохання, програма подій, кольори дрескоду, посилання та QR-код запрошення.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              { icon: Sparkles, title: "Простий редактор", desc: "Інтуїтивний інтерфейс, яким може користуватися кожен" },
              { icon: Palette, title: "Широкий вибір шаблонів", desc: "Красиві дизайни готові до налаштування" },
              { icon: Heart, title: "Завантаження фото", desc: "Додайте свої фотографії з легкістю" },
              {
                icon: Check,
                title: "Можливість редагування скільки завгодно раз",
                desc: "Відредагуйте ваш запрошення будь-коли, скільки завгодно разів",
              },
              { icon: Clock, title: "Попередній перегляд у реальному часі", desc: "Бачте зміни миттєво під час дизайну" },
              { icon: Star, title: "Повна кастомізація", desc: "Налаштуйте кожну деталь за вашими побажаннями" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white/80 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-foreground/5 shadow-sm hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 min-h-[220px] flex flex-col overflow-hidden"
              >
                {/* gradient hover */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/0 to-amber-50/0 group-hover:from-pink-50 group-hover:to-amber-50 transition-all duration-500" />

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-amber-500/10 text-pink-500 mb-5 group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white transition-all duration-500">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold font-geologica mb-2">{feature.title}</h3>
                <p className="text-foreground/65 text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FINAL CTA ======================= */}
      <section className="relative py-28 md:py-36 px-4 overflow-hidden bg-gradient-to-br from-[hsl(28,30%,93%)] via-[hsl(32,30%,97%)] to-[hsl(28,30%,93%)]">
        {/* decorative glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-pink-300/20 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-10 h-3 w-3 rounded-full bg-pink-400 animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 left-16 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />

        {/* hearts decoration */}
        <Heart className="pointer-events-none absolute top-16 left-[12%] h-8 w-8 text-pink-300/60 -rotate-12" fill="currentColor" />
        <Heart className="pointer-events-none absolute bottom-24 right-[15%] h-6 w-6 text-amber-300/60 rotate-12" fill="currentColor" />
        <Sparkles className="pointer-events-none absolute top-24 right-[20%] h-7 w-7 text-pink-400/50" />

        <div className="container mx-auto max-w-4xl text-center space-y-10 md:space-y-12 relative">
          <h2 className="text-5xl md:text-7xl font-bold leading-[1.05] font-geologica tracking-tight">
            Ваше весілля заслуговує
            <br />
            <span
              className="text-5xl md:text-[76px] italic text-pink-500"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              на вишукане запрошення
            </span>
          </h2>

          <div className="flex flex-col items-center gap-5">
            <Link to="/templates" className="inline-block">
              <Button
                size="lg"
                className="group h-16 text-lg md:text-xl px-12 rounded-full shadow-elegant hover:shadow-soft transition-all hover:-translate-y-1"
              >
                Створити запрошення зараз
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="flex items-center gap-2 text-sm text-foreground/55">
              <Check className="h-4 w-4 text-pink-500" /> Безкоштовний попередній перегляд · Без карти
            </span>
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative bg-[#0f0f12] text-gray-300 py-16 px-4 overflow-hidden">
        {/* subtle top glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-full bg-pink-500/10 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h3
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700 }}
              >
                Beloved
              </h3>
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                Створюйте ідеальні запрошення на весілля з легкістю та стилем
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-geologica">Навігація</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    Про нас
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    Ціна
                  </Link>
                </li>
                <li>
                  <Link to="/builder" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    Конструктор
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-geologica">Інформація</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    Контакти
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    Умови використання
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase font-geologica">Соціальні мережі</h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Rights reserved © {new Date().getFullYear()}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              Зроблено для пар з <Heart className="h-3 w-3 text-pink-400" fill="currentColor" /> любов'ю
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
