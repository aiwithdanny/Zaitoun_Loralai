import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import heroImg from "@/assets/home-page.png";

export function Hero() {
  const [displayedChars, setDisplayedChars] = useState(0);
  const headline = BRAND.hero.headline;

  useEffect(() => {
    if (displayedChars >= headline.length) return;
    const timer = setTimeout(() => setDisplayedChars((c) => c + 1), 50);
    return () => clearTimeout(timer);
  }, [displayedChars, headline.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="Olive grove at golden hour" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
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
          className="text-2xl md:text-5xl lg:text-5xl font-['Cinzel'] uppercase text-white mb-6 leading-tight"
        >
          {headline.slice(0, displayedChars)}
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
            href="#products" 
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
