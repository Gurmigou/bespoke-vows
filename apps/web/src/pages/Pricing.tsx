import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen font-geologica bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-2 border-pink-200 shadow-elegant max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10 px-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-geologica mb-2">
                Be our loved pair plan ❤️
              </h2>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <p className="text-foreground font-geologica">
                  Ваше запрошення назавжди ваше
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <p className="text-foreground font-geologica">
                  Можливість редагування будь-коли
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <p className="text-foreground font-geologica">
                  Власна назва посилання на ваше запрошення
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="text-center space-y-2">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground font-geologica">$14.99</span>
                </div>
                <p className="text-sm text-muted-foreground font-geologica">
                  одноразова плата
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/builder" className="block">
                <Button className="w-full h-12 text-lg font-geologica bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700">
                  Обрати план
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;

