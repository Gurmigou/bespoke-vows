import { Button } from "@/components/ui/button";
import { Palette, Clock, Smartphone, RefreshCw, Share2, ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "10 хв", label: "до готового запрошення" },
  { value: "$15.99", label: "одна ціна на рік" },
  { value: "∞", label: "редагувань без доплат" },
  { value: "0", label: "папір, принтерів і черг" },
];

const features = [
  { icon: Palette, title: "3+ унікальних шаблони", desc: "Класика, модерн, флорал — стиль під твоє весілля" },
  { icon: Clock, title: "Активне 1 рік", desc: "Гості зможуть переглядати запрошення весь підготовчий період" },
  { icon: Smartphone, title: "Ідеально на будь-якому екрані", desc: "Телефон, планшет, ноутбук — виглядає бездоганно" },
  { icon: RefreshCw, title: "Змінюй скільки завгодно", desc: "Час перенесли? Місце змінилось? Оновлюй безкоштовно" },
  { icon: Share2, title: "Одне посилання — всім гостям", desc: "Надішли в Telegram, Viber, Instagram, де зручно" },
  { icon: ImagePlus, title: "Ваша любовна історія", desc: "Додай фото і текст — зроби запрошення особистим" },
];

const Invites = () => {
  return (
    <div className="min-h-screen font-geologica">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Цифрове запрошення</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight font-geologica text-foreground">
            Не картка — враження
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Гості відкривають посилання й потрапляють у ваш особливий день ще до того, як він настав
          </p>
          <Link to="/templates">
            <Button size="lg" className="text-xl px-10 py-6 shadow-elegant mt-4">
              Спробувати безкоштовно
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label} className="space-y-1">
                <p className="text-4xl font-bold text-white font-geologica">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center font-geologica mb-12">Порівняй сам</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold text-muted-foreground w-1/2">Критерій</th>
                  <th className="py-3 font-semibold text-muted-foreground text-center">Паперове</th>
                  <th className="py-3 font-bold text-primary text-center">Наше цифрове</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Вартість на 100 гостей", "₴5 000–15 000", "₴400 (~$15.99)"],
                  ["Час до готовності", "2–4 тижні", "10 хвилин"],
                  ["Зміна деталей", "Передрук = нові витрати", "Безкоштовно, миттєво"],
                  ["Доставка гостям", "Пошта або руки", "Одне посилання в чат"],
                  ["Загублене запрошення", "Прощавай, гостю", "Посилання завжди в телефоні"],
                  ["Враження", "Стандартно", "Wow-ефект гарантовано"],
                ].map(([crit, paper, digital]) => (
                  <tr key={crit} className="border-b last:border-0">
                    <td className="py-4 font-medium">{crit}</td>
                    <td className="py-4 text-center text-muted-foreground">{paper}</td>
                    <td className="py-4 text-center font-semibold text-foreground">{digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl space-y-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center font-geologica">Що входить у запрошення</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card p-6 rounded-xl border space-y-3">
                <Icon className="w-8 h-8 text-primary" />
                <p className="font-semibold text-lg font-geologica">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anchor pricing nudge */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto max-w-2xl space-y-4">
          <p className="text-muted-foreground text-lg">Кава на двох коштує більше.</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight font-geologica text-foreground">
            Ваше запрошення — лише $15.99
          </h2>
          <p className="text-muted-foreground">Одна оплата. Активне цілий рік. Без підписок.</p>
          <Link to="/templates">
            <Button size="lg" className="text-xl px-10 py-6 shadow-elegant mt-4">
              Почати безкоштовно
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground pt-2">Платиш лише коли будеш готовий поділитись</p>
        </div>
      </section>
    </div>
  );
};

export default Invites;
