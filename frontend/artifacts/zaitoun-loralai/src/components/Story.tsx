import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/constants";
import { storyApi, type StoryData } from "@/lib/api";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import storyImg from "@/assets/story.png";

export function Story() {
  const [content, setContent] = useState<StoryData | null>(null);

  useEffect(() => {
    storyApi.getActive().then(setContent).catch(() => {});
  }, []);

  const sectionTag = content?.section_tag || "Our Heritage";
  const headline = content?.headline || BRAND.story.headline;
  const body = content?.body || BRAND.story.body;
  const pullQuote = content?.pull_quote || BRAND.story.pullQuote;

  const backgroundImage = content?.image_url
    ? (optimizeCloudinaryUrl(content.image_url, { width: 1200, quality: "auto", format: "auto" }) ?? storyImg)
    : storyImg;

  return (
    <section id="story" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:pr-12 relative z-10 order-2 lg:order-1"
          >
            <p className="text-accent uppercase tracking-widest text-xs mb-4">{sectionTag}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-tight">
              {headline}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {body}
            </p>
            
            <blockquote className="border-l-2 border-primary pl-6 py-2 my-8">
              <p className="font-serif text-xl md:text-2xl text-foreground italic leading-snug">
                "{pullQuote}"
              </p>
            </blockquote>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 relative order-1 lg:order-2"
          >
            <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm">
              <img 
                src={backgroundImage} 
                alt="Loralai mountains and olive grove" 
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary -z-10 rounded-sm hidden md:block"></div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
