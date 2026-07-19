import { Heart, Shield, Droplets, CheckCircle } from "lucide-react";
import heroBg from "@/assets/landing-page-png.png";
import productImg from "@/assets/500_ml_Bottle_1782790552258.png";

const trustBadges = [
  { icon: Heart, label: "Heart Healthy" },
  { icon: Shield, label: "Rich in Antioxidants" },
  { icon: Droplets, label: "100% Cold Pressed" },
  { icon: CheckCircle, label: "No Additives No Preservatives" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Tagline */}
          <p className="text-accent text-center tracking-[0.3em] text-xs md:text-sm uppercase mb-3 font-medium">
            — LORALAI —
          </p>

          {/* Brand name */}
          <h1 className="font-['Cinzel'] text-center text-4xl md:text-6xl lg:text-7xl text-white font-bold tracking-[0.15em] uppercase leading-none mb-5">
            ZAI TOUN
          </h1>

          {/* Gold divider */}
          <div className="h-px w-16 bg-accent mx-auto mb-5" />

          {/* Headline */}
          <p className="text-center font-['Cinzel'] text-white tracking-[0.12em] text-base md:text-lg lg:text-xl uppercase mb-14">
            Pure Taste. Naturally Crafted.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-16">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-sm"
              >
                <badge.icon className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="text-[11px] md:text-xs text-white/90 font-medium whitespace-nowrap">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Product showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Product details */}
            <div>
              <p className="text-accent tracking-[0.3em] text-xs uppercase mb-2 font-medium">
                ZAI TOUN
              </p>
              <h2 className="text-white text-xl md:text-2xl font-bold tracking-[0.08em] mb-3 uppercase">
                Extra Virgin Olive Oil
              </h2>
              <div className="flex items-center gap-3 mb-10">
                <span className="text-[10px] uppercase tracking-[0.2em] bg-accent/20 text-accent px-2.5 py-1 rounded-sm font-semibold">
                  First Cold Pressed
                </span>
                <span className="text-sm text-white/60 font-medium">
                  500ml
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#products"
                  className="px-8 py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center uppercase"
                >
                  Shop Collection
                </a>
                <a
                  href="#story"
                  className="px-8 py-3.5 bg-transparent text-white border border-white/30 text-sm font-medium tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto text-center uppercase"
                >
                  Explore Our Story
                </a>
              </div>
            </div>

            {/* Right: Product image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl" />
                <img
                  src={productImg}
                  alt="Zaitoun Loralai Extra Virgin Olive Oil 500ml"
                  className="relative z-10 h-72 md:h-96 w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Bottom labels */}
          <div className="mt-16 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/50">
                No Additives
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium">
                Proudly Pakistan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
