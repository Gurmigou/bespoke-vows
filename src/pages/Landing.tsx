import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Palette, Clock, DollarSign, Heart, Star, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import AlternatingContentBlocks from "@/components/invitation/AlternatingContentBlocks";
import preview1 from "@/img/preview_1.png";

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
            Без складних програми та зайвих витрат на розробку. Наш онлайн-конструктор дозволяє 
            створити ідеальний дизайн всього за кілька хвилин. Просто оберіть стиль, додайте 
            деталі свого свята — і надішліть запрошення своїм гостям
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

      {/* Alternating Content Blocks Section */}
      <AlternatingContentBlocks
        blocks={[
          {
            title: "Перший блок",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing invitation design interface",
          },
          {
            title: "Другий блок",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing customization options",
          },
          {
            title: "Третій блок",
            description: "",
            imageUrl: preview1,
            imageAlt: "App screen showing final invitation preview",
          },
        ]}
      />

      {/* Core Benefits Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Palette className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-geologica">Ваш особистий стиль</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Налаштуйте кожну деталь, щоб відобразити вашу унікальну історію кохання. Виберіть кольори, шрифти та макети, які ідеально відображають ваш стиль.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold font-geologica">Неймовірно легко</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Інтуїтивно зрозумілий конструктор для вашого ідеального запрошення. Навички дизайну не потрібні — просто налаштовуйте з легкістю.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold font-geologica">Економія часу та грошей</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Отримайте професійні результати за частку вартості. Цифрові та готові до друку формати включені, тому у вас є варіанти.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-geologica">Все, що потрібно для створення магії</h2>
            <p className="text-xl text-muted-foreground">Потужні функції, які роблять дизайн приємним</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Конструктор перетягування", desc: "Інтуїтивний інтерфейс, яким може користуватися кожен" },
              { icon: Palette, title: "Широкий вибір шаблонів", desc: "Красиві дизайни готові до налаштування" },
              { icon: Heart, title: "Завантаження фото", desc: "Додайте свої фотографії з легкістю" },
              { icon: Check, title: "Відстеження RSVP", desc: "Вбудовані інструменти управління гостями" },
              { icon: Clock, title: "Попередній перегляд у реальному часі", desc: "Бачте зміни миттєво під час дизайну" },
              { icon: Star, title: "Кілька форматів", desc: "Експорт для цифрового поширення або друку" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-all hover:shadow-soft space-y-3"
              >
                <feature.icon className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold font-geologica">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 shadow-elegant">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-2xl md:text-3xl text-center font-geologica italic text-foreground leading-relaxed">
                "Цей конструктор заощадив мені стільки часу та грошей! Наші запрошення виглядали професійно розробленими,
                і всі запитували, де ми їх замовили. Не можу повірити, наскільки це було легко!"
              </blockquote>
              
              <div className="text-center">
                <p className="font-semibold text-lg">Еміля та Михайло</p>
                <p className="text-muted-foreground">Одружилися у червні 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ / Risk Reduction Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-geologica">У вас є питання, у нас є відповіді</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-primary font-geologica">"Я не дизайнер..."</h3>
              <p className="text-muted-foreground leading-relaxed">
                Чудово! Наш конструктор створений спеціально для не-дизайнерів. З нашим інтуїтивним інтерфейсом та красивими шаблонами
                ви створите щось дивовижне за лічені хвилини.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-secondary font-geologica">"Чи виглядатиме це дешево?"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Абсолютно ні. Ми зосереджуємося на преміум-дизайнах професійної якості, які суперничають з дорогими індивідуальними канцтоварами.
                Ваші гості будуть вражені.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-accent font-geologica">"Чи варто воно зусиль?"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Це на диво просто! Більшість пар завершують свій дизайн менш ніж за 30 хвилин.
                Ви заощадите сотні порівняно з традиційними дизайнерами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight font-geologica">
            Готові створити своє
            <br />
            <span className="text-primary">Ідеальне запрошення?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Планування весілля стало простішим, більш персональним та доступним. Почніть дизайн за кілька хвилин — кредитна картка не потрібна.
          </p>
          
          <Link to="/builder">
            <Button size="lg" className="text-xl px-12 py-7 shadow-elegant hover:shadow-soft transition-all">
              Створіть своє запрошення зараз
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground pt-4">
            Приєднуйтесь до тисяч щасливих пар, які створили запрошення своєї мрії
          </p>
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
