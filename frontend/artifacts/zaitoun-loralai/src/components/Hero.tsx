import { useLocation } from "wouter";
import { Leaf, Shield, Droplets, CheckCircle } from "lucide-react";
import productImg from "@/assets/500_ml_Bottle_1782790552258.png";

const trustBadges = [
  { icon: Leaf, label: "Heart Healthy" },
  { icon: Shield, label: "Rich in Antioxidants" },
  { icon: Droplets, label: "100% Cold Pressed" },
  { icon: CheckCircle, label: "No Additives No Preservatives" },
];

export function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative bg-background pt-28 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Brand header */}
        <div className="text-center mb-12">
          <p className="text-accent tracking-[0.3em] text-xs md:text-sm uppercase mb-2 font-medium">
            — LORALAI —
          </p>
          <h1 className="font-['Cinzel'] text-4xl md:text-6xl lg:text-7xl text-foreground font-bold tracking-[0.15em] uppercase">
            ZAITOUN
          </h1>
          <div className="h-px w-16 bg-accent mx-auto my-6" />
          <p className="text-foreground/80 text-base md:text-lg lg:text-xl font-serif max-w-2xl mx-auto leading-relaxed">
            Pure Taste. Naturally Crafted.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-sm"
            >
              <badge.icon className="w-4 h-4 text-accent shrink-0" />
              <span className="text-xs md:text-sm text-foreground/80 font-medium whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Product showcase */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Product details */}
            <div className="order-2 md:order-1">
              <p className="text-accent tracking-[0.3em] text-xs uppercase mb-3 font-medium">
                ZAITOUN
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 leading-tight">
                Extra Virgin Olive Oil
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] bg-accent/10 text-accent px-3 py-1 rounded-sm font-medium">
                  First Cold Pressed
                </span>
                <span className="text-sm text-foreground/60 font-medium">
                  500ml
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Hand-harvested in the mountains of Loralai, our extra virgin
                olive oil brings the purity of ancestral groves to your table.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

              {/* Bottom labels */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  No Additives
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium">
                  Proudly Pakistan
                </span>
              </div>
            </div>

            {/* Right: Product image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
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
      </div>
    </section>
  );
}
