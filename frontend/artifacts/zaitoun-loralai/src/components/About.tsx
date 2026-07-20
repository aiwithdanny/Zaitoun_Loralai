import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { founderApi, FounderData } from "@/lib/api";
import fallbackImg from "@assets/naqeeb_professional_1782757630343.webp";

export function About() {
  const [founder, setFounder] = useState<FounderData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    founderApi
      .getActive()
      .then(setFounder)
      .catch(() => {
        /* fall back to static constants */
      })
      .finally(() => setLoaded(true));
  }, []);

  const name = founder?.name || BRAND.about.name;
  const designation = founder?.designation || BRAND.about.role;
  const description = founder?.description || BRAND.about.description;
  const imageUrl = founder?.image_url || fallbackImg;

  // Don't render anything until we've checked the API
  if (!loaded) return null;

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">

          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl"
          >
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h3 className="font-serif text-3xl text-foreground mb-1">{name}</h3>
            <p className="text-accent uppercase tracking-widest text-xs font-semibold mb-6">{designation}</p>
            <div className="w-12 h-px bg-border mb-6 mx-auto md:mx-0"></div>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
