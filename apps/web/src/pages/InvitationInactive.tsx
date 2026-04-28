import { Link } from "react-router-dom";
import { HeartCrack, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const InvitationInactive = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-primary/5 px-4 font-geologica">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <HeartCrack className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-primary font-medium tracking-widest uppercase text-sm">Запрошення</p>
          <h1 className="text-3xl font-semibold text-foreground">Запрошення неактивне</h1>
          <p className="text-muted-foreground leading-relaxed">
            Це запрошення більше не активне або посилання некоректне.
            Якщо ви вважаєте, що це помилка — зв'яжіться з нами.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              На головну
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/contact">
              <Mail className="w-4 h-4" />
              Зв'язатися з нами
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationInactive;
