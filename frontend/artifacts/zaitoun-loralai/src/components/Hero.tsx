import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/constants";
import { homepageApi, type HomepageData } from "@/lib/api";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import heroImg from "@/assets/zl-home-page.png.png";

export function Hero() {
  const [content, setContent] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homepageApi
      .getActive()
      .then(setContent)
      .catch(() => {
        // Fall back to constants on error
      })
      .finally(() => setLoading(false));
  }, []);

  const brandName = content?.hero_brand_name || BRAND.name;
  const headline = content?.hero_headline || BRAND.hero.headline;
  const description = content?.hero_description || BRAND.hero.subheadline;
  const primaryCta = content?.hero_primary_cta_text || BRAND.hero.primaryCta;
  const secondaryCta = content?.hero_secondary_cta_text || BRAND.hero.secondaryCta;

  const backgroundImage = content?.hero_image_url
    ? (optimizeCloudinaryUrl(content.hero_image_url, { width: 1920, quality: "auto", format: "auto" }) ?? heroImg)
    : heroImg;

  if (loading) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-start pt-20">
        <div className="absolute inset-0 z-0 bg-muted animate-pulse" />
        <div className="container relative z-10 mx-auto px-4 lg:ml-[8%] max-w-md lg:max-w-lg">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 w-full">
            <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse mb-4" />
            <div className="h-8 w-64 bg-muted-foreground/20 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-muted-foreground/20 rounded animate-pulse mb-6" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-muted-foreground/20 rounded animate-pulse" />
              <div className="h-12 w-32 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-start pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Zaitoun Loralai olive oil" 
          className="w-full h-full object-cover"
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
            {brandName}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl lg:text-4xl font-serif text-foreground mb-4 leading-tight"
          >
            {headline}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed"
          >
            {description}
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
              {primaryCta}
            </a>
            <a 
              href="#story" 
              className="px-6 py-3 bg-transparent text-primary border border-primary/30 rounded-none font-medium tracking-wide hover:bg-primary/5 transition-colors w-full sm:w-auto text-center"
            >
              {secondaryCta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
