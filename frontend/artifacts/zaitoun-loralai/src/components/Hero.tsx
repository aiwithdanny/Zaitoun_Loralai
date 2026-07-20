import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import heroImg from "@/assets/zl-home-page.png.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-start pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="Zaitoun Loralai olive oil" 
          className="w-full h-full object-cover scale-[0.85]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:ml-[8%] max-w-md lg:max-w-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-accent uppercase tracking-[0.25em] text-sm md:text-base mb-4"
          >
            {BRAND.name}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl lg:text-4xl font-serif text-foreground mb-4 leading-tight"
          >
            {BRAND.hero.headline}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed"
          >
            {BRAND.hero.subheadline}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
          >
            <a 
              href="#products" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-none font-medium tracking-wide hover:bg-primary/90 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.primaryCta}
            </a>
            <a 
              href="#story" 
              className="px-6 py-3 bg-transparent text-primary border border-primary/30 rounded-none font-medium tracking-wide hover:bg-primary/5 transition-colors w-full sm:w-auto text-center"
            >
              {BRAND.hero.secondaryCta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
