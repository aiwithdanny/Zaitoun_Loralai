import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { Truck, Leaf, ShieldCheck } from "lucide-react";
import productImg from "@/assets/500_ml_Bottle_1782790552258.png";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left Column - Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <img
            src={productImg}
            alt="Zaitoun Loralai Extra Virgin Olive Oil 500ml"
            className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Right Column - Content */}
        <div className="flex flex-col justify-center space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-accent uppercase tracking-[0.25em] text-sm md:text-base font-medium"
          >
            {BRAND.name}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight"
          >
            {BRAND.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            {BRAND.product.name}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="inline-flex"
          >
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {BRAND.product.size}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground max-w-lg leading-relaxed"
          >
            {BRAND.product.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start gap-4 pt-2"
          >
            <a
              href="#products"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.primaryCta}
            </a>
            <a
              href="#story"
              className="px-8 py-3 border border-primary text-primary rounded-full font-medium tracking-wide hover:bg-primary/5 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.secondaryCta}
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 pt-2"
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
