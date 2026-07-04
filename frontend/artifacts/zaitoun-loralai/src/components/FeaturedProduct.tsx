import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import bottleImg from "@assets/500_ml_Bottle_1782771142355.png";
import { ShoppingBag } from "lucide-react";

export function FeaturedProduct() {
  return (
    <section id="shop" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] bg-muted/30 rounded-sm overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-transparent"></div>
            <img 
              src={bottleImg} 
              alt={BRAND.product.name}
              className="w-[55%] h-[75%] object-contain drop-shadow-2xl z-10"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs mb-4">
              {BRAND.product.origin}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
              {BRAND.product.name}
            </h2>
            <div className="flex items-end gap-4 mb-8">
              <span className="text-2xl font-medium text-primary">{BRAND.product.price}</span>
              <span className="text-muted-foreground mb-1">Rs : 2899  / {BRAND.product.size}</span>
            </div>
            
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              {BRAND.product.description}
            </p>
            
            <div className="bg-card border border-border p-6 rounded-sm mb-8">
              <h3 className="font-serif text-lg mb-2 text-foreground">Tasting Notes</h3>
              <p className="text-muted-foreground italic text-sm">
                "{BRAND.product.tastingNotes}"
              </p>
            </div>
            
            <button className="flex items-center justify-center gap-3 w-full bg-foreground text-background py-4 px-8 hover:bg-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm font-medium">Add to Cart</span>
            </button>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
