import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import heroImg from "@/assets/hero-bg.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="Olive grove at golden hour" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl mt-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-accent uppercase tracking-[0.2em] text-sm md:text-base mb-6"
        >
          {BRAND.tagline}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"
        >
          {BRAND.hero.headline}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light"
        >
          {BRAND.hero.subheadline}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#shop" 
            className="px-8 py-4 bg-primary text-primary-foreground rounded-none font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
          >
            {BRAND.hero.primaryCta}
          </a>
          <a 
            href="#story" 
            className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-none font-medium tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
          >
            {BRAND.hero.secondaryCta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
