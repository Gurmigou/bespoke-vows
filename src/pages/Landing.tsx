import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Palette, Clock, DollarSign, Heart, Star, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import AlternatingContentBlocks from "@/components/invitation/AlternatingContentBlocks";
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
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(340,65%,75%,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            <h1 className="text-5xl md:text-8xl font-bold text-foreground leading-tight font-geologica">
              Запрошення на весілля
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-pink-450 to-pink-500 bg-clip-text text-transparent md:text-8xl">Твій ідеальний дизайн</span>
            </h1>
            
            <p className="text-xl md:text-1xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Без складних програми та зайвих витрат на розробку. Оберіть стиль, додайте 
            деталі — і надішліть запрошення своїм гостям
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/builder">
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
            Всього 3 кроки до мрії
          </h2>
        </div>
      </section>

      {/* Alternating Content Blocks Section */}
      <AlternatingContentBlocks
        blocks={[
          {
            title: "👉 Обери шаблон",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing invitation design interface",
          },
          {
            title: "👉 Кастомізуй його повністю під себе",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing customization options",
          },
          {
            title: "👉 Отримай ідеальне запрошення",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing final invitation preview",
          },
        ]}
      />

      {/* Responsive Design Section */} 
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center font-geologica mb-6 md:mb-8">
              Адаптивний дизайн для всіх пристроїв
            </h2>
            <div className="flex flex-row items-center justify-center gap-8">
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
              { icon: Sparkles, title: "Конструктор перетягування", desc: "Інтуїтивний інтерфейс, яким може користуватися кожен" },
              { icon: Palette, title: "Широкий вибір шаблонів", desc: "Красиві дизайни готові до налаштування" },
              { icon: Heart, title: "Завантаження фото", desc: "Додайте свої фотографії з легкістю" },
              { icon: Check, title: "Можливість редагування скільки загодно раз", desc: "Відредагуйте ваш запрошення будь-коли, скільки завгодно разів" },
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
            Готові вразити гостей
            <br />
            <span className="text-primary">Ідеальним запрошенням?</span>
          </h2>
          
          <p className="text-sm text-muted-foreground">
            Приєднуйтесь до сотень щасливих пар, які створили запрошення своєї мрії
          </p>
          
          <Link to="/builder" className="inline-block mt-8 md:mt-12">
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
                  <a href="#" className="text-sm hover:text-pink-400 transition-colors">
                    Довідка
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-pink-400 transition-colors">
                    Контакти
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-pink-400 transition-colors">
                    Політика конфіденційності
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-pink-400 transition-colors">
                    Умови використання
                  </a>
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
