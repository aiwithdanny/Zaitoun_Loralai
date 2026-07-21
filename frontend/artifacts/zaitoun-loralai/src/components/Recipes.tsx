import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/constants";
import { recipesApi, type RecipeContentData, type RecipeData } from "@/lib/api";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import vegImg from "@/assets/recipe-roasted-veg.webp";
import breadImg from "@/assets/recipe-bread.webp";
import saladImg from "@/assets/recipe-salad.webp";

const fallbackImages = [vegImg, breadImg, saladImg];

export function Recipes() {
  const [content, setContent] = useState<RecipeContentData | null>(null);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);

  useEffect(() => {
    recipesApi.getActive().then((data) => {
      setContent(data.content);
      setRecipes(data.recipes);
    }).catch(() => {});
  }, []);

  const sectionTag = content?.section_tag || "Culinary Inspiration";
  const headline = content?.headline || "Serve with Elegance";
  const hasApiRecipes = recipes.length > 0;

  return (
    <section id="recipes" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-accent uppercase tracking-widest text-xs mb-4">{sectionTag}</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{headline}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(hasApiRecipes ? recipes : BRAND.recipes).map((recipe: any, i: number) => {
            const recipeImage = hasApiRecipes && recipe.image_url
              ? (optimizeCloudinaryUrl(recipe.image_url, { width: 600, quality: "auto", format: "auto" }) ?? fallbackImages[i])
              : fallbackImages[i];

            return (
              <motion.div 
                key={hasApiRecipes ? recipe.id : i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] md:aspect-square overflow-hidden rounded-sm mb-6 relative">
                  <img 
                    src={recipeImage} 
                    alt={recipe.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
