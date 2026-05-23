import { Link } from "react-router-dom";
import { Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const InvitationDeleted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(32,20%,96%)] px-4 font-geologica">
      <div className="text-center max-w-md space-y-7">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-stone-400" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">
            Beloved
          </p>
          <h1 className="text-3xl font-semibold text-stone-800 leading-snug tracking-tight">
            Сторінку видалено
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
            Це запрошення було видалено і більше недоступне. Якщо ви вважаєте, що це помилка — зв'яжіться з нами.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
          <Button
            asChild
            className="h-11 rounded-full px-6 text-sm font-medium shadow-elegant hover:shadow-soft transition-all hover:-translate-y-0.5"
          >
            <Link to="/invitations">Мої запрошення</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full px-6 text-sm gap-2"
          >
            <Link to="/contact">
              <Mail className="w-3.5 h-3.5" />
              Зв'язатися з нами
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationDeleted;
