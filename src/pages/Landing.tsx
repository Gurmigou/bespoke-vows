import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Palette, Clock, DollarSign, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(340,65%,75%,0.1),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Design Your Dream Invitation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Beautiful Wedding Invitations,
              <br />
              <span className="text-primary">Made Simple</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create stunning, personalized wedding invitations without the stress, complex software, or high costs. 
              Your perfect design is just minutes away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/builder">
                <Button size="lg" className="text-lg px-8 py-6 shadow-elegant hover:shadow-soft transition-all">
                  Start Designing Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Examples
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary" />
                <span>No design skills needed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary" />
                <span>Digital & print ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-secondary" />
                <span>Free to start</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Design Unique Invitations That Tell Your Story
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            For couples seeking an elegant, stress-free creation process. 
            Deliver personalized beauty without the hassle or high cost.
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
                <h3 className="text-2xl font-bold">Your Personal Touch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Customize every detail to reflect your unique love story. Choose colors, fonts, and layouts that perfectly capture your style.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">Effortlessly Easy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  An intuitive builder for your perfect invitation. No design skills needed—just drag, drop, and customize with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Save Time & Money</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get professional results at a fraction of the cost. Digital and print-ready formats included, so you have options.
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
            <h2 className="text-4xl md:text-5xl font-bold">Everything You Need to Create Magic</h2>
            <p className="text-xl text-muted-foreground">Powerful features that make designing delightful</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Drag-and-Drop Builder", desc: "Intuitive interface that anyone can use" },
              { icon: Palette, title: "Extensive Templates", desc: "Beautiful designs ready to customize" },
              { icon: Heart, title: "Photo Uploads", desc: "Add your engagement photos with ease" },
              { icon: Check, title: "RSVP Tracking", desc: "Built-in guest management tools" },
              { icon: Clock, title: "Real-Time Preview", desc: "See changes instantly as you design" },
              { icon: Star, title: "Multiple Formats", desc: "Export for digital sharing or printing" },
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
                "This builder saved me so much time and money! Our invitations looked professionally designed, 
                and everyone asked where we got them made. I can't believe how easy it was!"
              </blockquote>
              
              <div className="text-center">
                <p className="font-semibold text-lg">Emily & Michael</p>
                <p className="text-muted-foreground">Married June 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ / Risk Reduction Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">You Have Questions, We Have Answers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-primary">"I'm not a designer..."</h3>
              <p className="text-muted-foreground leading-relaxed">
                Perfect! Our builder is designed specifically for non-designers. With our intuitive interface and beautiful templates, 
                you'll create something amazing in minutes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-secondary">"Will it look cheap?"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Absolutely not. We focus on premium, professional-quality designs that rival expensive custom stationery. 
                Your guests will be impressed.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-accent">"Is it worth the effort?"</h3>
              <p className="text-muted-foreground leading-relaxed">
                It's surprisingly simple! Most couples finish their design in under 30 minutes. 
                You'll save hundreds compared to traditional designers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Ready to Create Your
            <br />
            <span className="text-primary">Perfect Invitation?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Wedding planning made easier, more personal, and affordable. Start designing in minutes—no credit card required.
          </p>
          
          <Link to="/builder">
            <Button size="lg" className="text-xl px-12 py-7 shadow-elegant hover:shadow-soft transition-all">
              Create Your Invitation Now
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground pt-4">
            Join thousands of happy couples who designed their dream invitations
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
