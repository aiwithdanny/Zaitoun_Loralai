import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { tastingNotesApi, type TastingNoteData } from "@/lib/api";
import { BRAND } from "@/lib/constants";

const FALLBACK_NOTES: TastingNoteData[] = [
  { id: 1, label: "Profile", value: BRAND.tasting.profile, sort_order: 0, is_active: true },
  { id: 2, label: "Aroma", value: BRAND.tasting.aroma, sort_order: 1, is_active: true },
  { id: 3, label: "Acidity", value: BRAND.tasting.acidity, sort_order: 2, is_active: true },
  { id: 4, label: "Perfect For", value: BRAND.tasting.pairings, sort_order: 3, is_active: true },
];

export function TastingNotes() {
  const [notes, setNotes] = useState<TastingNoteData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    tastingNotesApi
      .getActive()
      .then((data) => {
        if (data.length > 0) setNotes(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const activeNotes = notes.length > 0
    ? [...notes].sort((a, b) => a.sort_order - b.sort_order)
    : FALLBACK_NOTES;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-foreground">Tasting Profile</h2>
            <div className="h-px w-16 bg-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {activeNotes.map((note, index) => (
              <motion.div 
                key={note.id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-border pb-6"
              >
                <h4 className="text-accent uppercase tracking-widest text-xs mb-2">{note.label}</h4>
                <p className="font-serif text-xl text-foreground/80">{note.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
