import { useLocation } from "wouter";
import { Heart, Shield, Droplets, CheckCircle } from "lucide-react";
import productImg from "@/assets/500_ml_Bottle_1782790552258.png";

const trustBadges = [
  { icon: Heart, label: "Heart Healthy" },
  { icon: Shield, label: "Rich in Antioxidants" },
  { icon: Droplets, label: "100% Cold Pressed" },
  { icon: CheckCircle, label: "No Additives No Preservatives" },
];

export function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Brand header */}
        <div className="text-center mb-10">
          <p className="text-accent tracking-[0.3em] text-xs md:text-sm uppercase mb-3 font-medium">
            — LORALAI —
          </p>
          <h1 className="font-['Cinzel'] text-4xl md:text-6xl lg:text-7xl text-foreground font-bold tracking-[0.15em] uppercase leading-none">
            ZAI TOUN
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto my-5" />
          <p className="text-foreground font-['Cinzel'] tracking-[0.12em] text-base md:text-lg lg:text-xl uppercase">
            Pure Taste. Naturally Crafted.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-14">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-card border border-border/60 rounded-sm"
            >
              <badge.icon className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[11px] md:text-xs text-foreground/80 font-medium whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Product showcase */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Product details */}
            <div>
              <p className="text-accent tracking-[0.3em] text-xs uppercase mb-2 font-medium">
                ZAI TOUN
              </p>
              <h2 className="text-foreground text-xl md:text-2xl font-bold tracking-[0.08em] mb-3 uppercase">
                Extra Virgin Olive Oil
              </h2>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] uppercase tracking-[0.2em] bg-accent/10 text-accent px-2.5 py-1 rounded-sm font-semibold">
                  First Cold Pressed
                </span>
                <span className="text-sm text-foreground/50 font-medium">
                  500ml
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/product/extra-virgin-olive-oil")}
                  className="px-8 py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center uppercase"
                >
                  Shop Collection
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("story");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3.5 bg-transparent text-foreground border border-border text-sm font-medium tracking-wide hover:bg-muted/50 transition-colors w-full sm:w-auto text-center uppercase"
                >
                  Explore Our Story
                </button>
              </div>
            </div>

            {/* Right: Product image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/5 rounded-full blur-3xl" />
                <img
                  src={productImg}
                  alt="Zaitoun Loralai Extra Virgin Olive Oil 500ml"
                  className="relative z-10 h-72 md:h-96 w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom labels */}
        <div className="max-w-5xl mx-auto mt-14 pt-6 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              No Additives
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium">
              Proudly Pakistan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
