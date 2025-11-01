import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Palette, Clock, DollarSign, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen font-geologica">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(340,65%,75%,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Створіть запрошення вашої мрії</span> 
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold text-foreground leading-tight font-geologica">
              Запрошення на весілля
              <br />
              <span className="text-primary md:text-8xl">Твій ідеальний дизайн</span>
            </h1>
            
            <p className="text-xl md:text-1xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Без складні програми та зайві витрати на розробку. Наш онлайн-конструктор дозволяє 
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

      {/* Value Proposition Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Створюйте унікальні запрошення, що розповідають вашу історію
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Для пар, які шукають елегантний процес створення без стресу.
            Надайте персоналізовану красу без клопоту чи високих витрат.
          </p>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Palette className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Ваш особистий стиль</h3>
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
                <h3 className="text-2xl font-bold">Неймовірно легко</h3>
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
                <h3 className="text-2xl font-bold">Економія часу та грошей</h3>
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
            <h2 className="text-4xl md:text-5xl font-bold">Все, що потрібно для створення магії</h2>
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
                <h3 className="text-xl font-semibold">{feature.title}</h3>
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
              
              <blockquote className="text-2xl md:text-3xl text-center font-serif italic text-foreground leading-relaxed">
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
            <h2 className="text-4xl md:text-5xl font-bold">У вас є питання, у нас є відповіді</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-primary">"Я не дизайнер..."</h3>
              <p className="text-muted-foreground leading-relaxed">
                Чудово! Наш конструктор створений спеціально для не-дизайнерів. З нашим інтуїтивним інтерфейсом та красивими шаблонами
                ви створите щось дивовижне за лічені хвилини.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-secondary">"Чи виглядатиме це дешево?"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Абсолютно ні. Ми зосереджуємося на преміум-дизайнах професійної якості, які суперничають з дорогими індивідуальними канцтоварами.
                Ваші гості будуть вражені.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-accent">"Чи варто воно зусиль?"</h3>
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
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
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
    </div>
  );
};

export default Landing;
