import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { Truck, Leaf, ShieldCheck } from "lucide-react";
import productImg from "@/assets/500_ml_Bottle_1782790552258.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left: Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center lg:justify-end order-1"
        >
          <div className="relative">
            {/* Subtle glow behind bottle */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl scale-150" />
            <img
              src={productImg}
              alt="Zaitoun Loralai Extra Virgin Olive Oil 500ml"
              className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Right: Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-accent uppercase tracking-[0.25em] text-sm md:text-base font-medium mb-4"
          >
            {BRAND.name}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-3 leading-tight"
          >
            {BRAND.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-2"
          >
            {BRAND.product.name}
          </motion.p>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded mb-4"
          >
            {BRAND.product.size}
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg text-muted-foreground/80 max-w-lg mb-8 leading-relaxed"
          >
            {BRAND.product.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10"
          >
            <a
              href="#products"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-none font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.primaryCta}
            </a>
            <a
              href="#story"
              className="px-8 py-4 bg-transparent text-primary border border-primary/30 rounded-none font-medium tracking-wide hover:bg-primary/5 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.secondaryCta}
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-accent" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Leaf className="w-4 h-4 text-accent" />
              <span>100% Pure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Sustainably Sourced</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
