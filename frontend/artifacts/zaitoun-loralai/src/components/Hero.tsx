import heroBg from "@/assets/landing-page-png.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-16 pt-20 overflow-hidden">
      {/* Full-bleed image — all text/content is baked into it */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Zaitoun Loralai — Pure Taste. Naturally Crafted."
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Interactive CTAs only — everything else is in the image */}
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
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
    </section>
  );
}
