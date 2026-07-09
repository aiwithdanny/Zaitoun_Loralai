import { motion } from "framer-motion";
import { Droplet, Leaf, MapPin, Award } from "lucide-react";
import { BRAND } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  "droplet": <Droplet className="w-8 h-8 stroke-1" />,
  "leaf": <Leaf className="w-8 h-8 stroke-1" />,
  "map-pin": <MapPin className="w-8 h-8 stroke-1" />,
  "award": <Award className="w-8 h-8 stroke-1" />
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function QualityFeatures() {
  return (
    <section id="quality" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Uncompromising Quality</h2>
          <div className="h-px w-16 bg-accent mx-auto"></div>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {BRAND.quality.map((feature, i) => (
            <motion.div key={i} variants={item} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                {iconMap[feature.icon]}
              </div>
              <h3 className="font-serif text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
