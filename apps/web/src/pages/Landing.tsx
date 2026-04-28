import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Palette, Clock, DollarSign, Heart, Star, Instagram, ArrowRight, ArrowDown } from "lucide-react";
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
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Landing = () => {
  return (
    <div className="min-h-screen font-geologica">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 h-[800px] flex items-center py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(237,76,156,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            <h1 className="text-5xl md:text-8xl font-bold text-foreground leading-tight font-geologica">
              Цифрове запрошення на весілля
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-pink-450 to-pink-500 bg-clip-text text-transparent md:text-8xl">Твій ідеальний дизайн</span>
            </h1>
            
            <p className="text-xl md:text-1xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Без складних програми та зайвих витрат на розробку. Оберіть стиль, додайте 
            деталі — і надішліть запрошення своїм гостям
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/templates">
                <Button className="h-14 rounded-md text-2xl px-10 py-6 shadow-elegant hover:shadow-soft transition-all">
                  Створити зараз
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-geologica">
            Всього 3 кроки до готового запрошення
          </h2>
        </div>
      </section>

      {/* Three Steps Blocks */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4">
            {[
              { title: "1. Обери шаблон", alt: "Step 1 — choose template" },
              { title: "2. Кастомізуй його повністю під себе", alt: "Step 2 — customize" },
              { title: "3. Отримай ідеальне запрошення", alt: "Step 3 — get invitation" },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex flex-col md:flex-row items-stretch gap-6 md:gap-4 md:flex-1">
                <div className="flex flex-col items-center gap-6 flex-1">
                  <img
                    src={preview1}
                    alt={step.alt}
                    className="w-[200px] md:w-[230px] h-auto object-contain"
                  />
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground text-center font-geologica leading-snug px-2 md:min-h-[4rem] flex items-start justify-center">
                    {step.title}
                  </h3>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex items-center justify-center text-foreground/40 flex-shrink-0 self-center md:self-start md:mt-[170px]">
                    <ArrowRight className="hidden md:block w-8 h-8" strokeWidth={1.5} />
                    <ArrowDown className="md:hidden w-7 h-7" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion / Try Section */}
      <section className="relative py-20 px-4 bg-[hsl(28,30%,93%)] border-y border-foreground/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-semibold text-foreground font-geologica leading-tight">
              Запрошення, яке ваші гості запам'ятають
            </h2>
            <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
              Живий редактор, готові шаблони та делікатна типографіка — щоб
              ваше запрошення виглядало так, як ви його уявляли.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="rounded-2xl bg-background p-7 shadow-sm hover:shadow-elegant transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Готові шаблони на ваш смак
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Від класичних до сучасних — кожен шаблон продуманий до
                найменшої деталі та повністю кастомізується під вас.
              </p>
            </div>
            <div className="rounded-2xl bg-background p-7 shadow-sm hover:shadow-elegant transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Живий перегляд у редакторі
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Бачте кожну зміну в реальному часі — кольори, шрифти, історію
                кохання та таймлайн дня.
              </p>
            </div>
            <div className="rounded-2xl bg-background p-7 shadow-sm hover:shadow-elegant transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Одне посилання для всіх гостей
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Поділіться запрошенням у месенджері — гості відкриють його на
                будь-якому пристрої без застосунків.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link to="/templates">
              <Button className="h-14 rounded-md text-lg px-10 shadow-elegant hover:shadow-soft transition-all">
                Подивитись шаблони
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" /> Готово за лічені хвилини
            </span>
          </div>
        </div>
      </section>

      {/* Responsive Design Heading */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-geologica">
            Адаптивний дизайн для всіх пристроїв
          </h2>
        </div>
      </section>

      {/* Responsive Design Images */}
      <section className="py-16 px-4 bg-[hsl(28,30%,93%)] border-y border-foreground/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {/* iPhone Image - 30% */}
            <div className="w-[30%]">
              <img
                src={section1Iphone}
                alt="iPhone view of invitation"
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Mac Image - 70% */}
            <div className="w-[70%]">
              <img
                src={section1Mac}
                alt="Mac view of invitation"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-geologica">Все, що потрібно для створення магії</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Простий редактор", desc: "Інтуїтивний інтерфейс, яким може користуватися кожен" },
              { icon: Palette, title: "Широкий вибір шаблонів", desc: "Красиві дизайни готові до налаштування" },
              { icon: Heart, title: "Завантаження фото", desc: "Додайте свої фотографії з легкістю" },
              { icon: Check, title: "Можливість редагування скільки завгодно раз", desc: "Відредагуйте ваш запрошення будь-коли, скільки завгодно разів" },
              { icon: Clock, title: "Попередній перегляд у реальному часі", desc: "Бачте зміни миттєво під час дизайну" },
              { icon: Star, title: "Повна кастомізація", desc: "Налаштуйте кожну деталь за вашими побажаннями" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card p-8 md:p-10 rounded-xl border shadow-lg space-y-4 min-h-[200px] md:min-h-[220px] flex flex-col"
              >
                <feature.icon className="w-12 h-12 text-primary" />
                <h3 className="text-xl md:text-2xl font-semibold font-geologica">{feature.title}</h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-12 md:space-y-16">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight font-geologica">
            Ваше весілля заслуговує
            <br />
            <span className="text-primary">на красиве запрошення</span>
          </h2>
          
          <p className="text-sm text-muted-foreground">
            Сотні пар вже створили своє запрошення та поділились ним з гостями
          </p>
          
          <Link to="/templates" className="inline-block mt-8 md:mt-12">
            <Button size="lg" className="text-xl px-12 py-7 shadow-elegant hover:shadow-soft transition-all">
              Створити запрошення зараз
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-geologica">Beloved</h3>
              <p className="text-sm leading-relaxed">
                Створюйте ідеальні запрошення на весілля з легкістю та стилем
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white font-geologica">Навігація</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm hover:text-pink-400 transition-colors">
                    Про нас
                  </Link>
                </li>
                <li>
                  <Link to="/invites" className="text-sm hover:text-pink-400 transition-colors">
                    Про запрошення
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm hover:text-pink-400 transition-colors">
                    Ціна
                  </Link>
                </li>
                <li>
                  <Link to="/builder" className="text-sm hover:text-pink-400 transition-colors">
                    Конструктор
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white font-geologica">Інформація</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-sm hover:text-pink-400 transition-colors">
                    Контакти
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm hover:text-pink-400 transition-colors">
                    Умови використання
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white font-geologica">Соціальні мережі</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-sm text-gray-400">
              Rights reserved © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
