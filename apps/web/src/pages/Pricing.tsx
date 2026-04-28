import { Button } from "@/components/ui/button";
import { Check, Sparkles, Heart, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen font-geologica bg-gradient-to-b from-pink-50 to-white">
      {/* Hero */}
      <div className="pt-20 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          Прозора ціна — без підписок
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight font-geologica mb-4">
          Зробіть ваше весілля незабутнім
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Спробуйте безкоштовно, а потім оберіть план, який підходить саме вам.
        </p>
      </div>

      {/* Cards */}
      <div className="px-4 pb-24 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl items-stretch">

          {/* Free */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-7 py-7 border-b border-gray-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Безкоштовно</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-foreground leading-none">$0</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">1 день публікації</p>
            </div>
            <div className="px-7 py-6 flex flex-col gap-3 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Побудуйте та переглядайте запрошення</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Усі 3 шаблони доступні</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Публікація на 24 години — щоб переконатись, що це те, що треба</span>
              </div>
            </div>
            <div className="px-7 pb-7">
              <Link to="/builder" className="block">
                <Button variant="outline" className="w-full h-11 rounded-xl border-gray-200 text-foreground text-sm font-medium hover:bg-gray-50">
                  Спробувати безкоштовно
                </Button>
              </Link>
            </div>
          </div>

          {/* Standard — Most Popular */}
          <div className="relative flex flex-col h-full">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-3xl blur-xl opacity-30 pointer-events-none" />

            <div className="relative bg-white border border-pink-100 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
              {/* Badge */}
              <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-semibold uppercase tracking-widest text-center py-2">
                ✦ Найпопулярніший
              </div>

              <div className="px-7 py-7 border-b border-pink-50">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-pink-500">Стандарт</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl text-gray-300 font-medium line-through leading-none">$14.99</span>
                  <span className="text-5xl font-bold text-foreground leading-none">$9.99</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">одноразова оплата · 1 запрошення</p>
              </div>

              <div className="px-7 py-6 flex flex-col gap-3 flex-1">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-foreground">Активне протягом 1 року</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-foreground">Необмежена кількість переглядів гостями</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-foreground">Редагування у будь-який час</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-foreground">Власне посилання для гостей</span>
                </div>
              </div>

              <div className="px-7 pb-7">
                <Link to="/builder" className="block">
                  <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 shadow-md hover:shadow-lg transition-all">
                    Створити запрошення
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Premium */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-7 py-7 border-b border-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Преміум</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-foreground leading-none">$24.99</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">на рік · необмежена кількість запрошень</p>
            </div>
            <div className="px-7 py-6 flex flex-col gap-3 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Необмежена кількість запрошень протягом року</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Індивідуальний дизайн для 1 запрошення</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Пріоритетна підтримка</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground">Усе з тарифу Стандарт</span>
              </div>
            </div>
            <div className="px-7 pb-7">
              <Link to="/builder" className="block">
                <Button variant="outline" className="w-full h-11 rounded-xl border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-50">
                  Обрати Преміум
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Social proof */}
      <div className="pb-20 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          Вже <span className="font-semibold text-foreground">сотні пар</span> поділилися своїм запрошенням через Bespoke Vows
        </p>
      </div>
    </div>
  );
};

export default Pricing;
