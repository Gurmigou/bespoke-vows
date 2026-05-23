import { Link } from "react-router-dom";
import { CheckCircle2, Heart } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen font-geologica bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">

        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-rose-50 flex items-center justify-center">
            <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Оплата успішна!
          </h1>
          <p className="text-sm text-foreground/50 leading-relaxed">
            Дякуємо за покупку. Ваше запрошення активне —
            <br />
            діліться ним з гостями вже зараз.
          </p>
        </div>

        <div className="h-px w-full bg-foreground/6" />

        <Link
          to="/invitations"
          className="w-full h-[52px] rounded-2xl font-semibold text-sm flex items-center justify-center transition-all duration-150 active:scale-[0.98] cursor-pointer"
          style={{ backgroundColor: "#000", color: "#fff" }}
        >
          Мої запрошення
        </Link>

        <p className="text-[11px] text-foreground/30 leading-relaxed">
          Квитанцію надіслано на вашу електронну пошту
        </p>

      </div>
    </div>
  );
}
