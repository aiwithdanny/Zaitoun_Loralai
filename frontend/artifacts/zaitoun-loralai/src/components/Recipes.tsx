import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import vegImg from "@/assets/recipe-roasted-veg.webp";
import breadImg from "@/assets/recipe-bread.webp";
import saladImg from "@/assets/recipe-salad.webp";

const images = [vegImg, breadImg, saladImg];

export function Recipes() {
  return (
    <section id="recipes" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-accent uppercase tracking-widest text-xs mb-4">Culinary Inspiration</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Serve with Elegance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {BRAND.recipes.map((recipe, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] md:aspect-square overflow-hidden rounded-sm mb-6 relative">
                <img 
                  src={images[i]} 
                  alt={recipe.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
