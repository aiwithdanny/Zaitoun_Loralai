import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";

export function TastingNotes() {
  const notes = [
    { label: "Profile", value: BRAND.tasting.profile },
    { label: "Aroma", value: BRAND.tasting.aroma },
    { label: "Acidity", value: BRAND.tasting.acidity },
    { label: "Perfect For", value: BRAND.tasting.pairings },
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Tasting Profile</h2>
            <div className="h-px w-16 bg-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {notes.map((note, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-primary-foreground/20 pb-6"
              >
                <h4 className="text-accent uppercase tracking-widest text-xs mb-2">{note.label}</h4>
                <p className="font-serif text-xl text-white/90">{note.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
