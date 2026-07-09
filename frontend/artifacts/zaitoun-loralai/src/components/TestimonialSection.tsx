import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

/**
 * PLACEHOLDER TESTIMONIALS — Replace with real customer reviews.
 * Source: Actual Zaitoun Loralai customers (sample data).
 */
const testimonials = [
  {
    id: 1,
    name: "Fatima Ansari",
    location: "Karachi",
    quote:
      "The 500ml bottle was my first order, and I'm already halfway through. The peppery finish is unlike anything I've tasted — it reminds me of the olive oil my grandmother used to bring from her village. Truly special.",
    rating: 5,
  },
  {
    id: 2,
    name: "Omar Tariq",
    location: "Lahore",
    quote:
      "Ordered the 3L bulk for our family kitchen and it arrived in perfect condition, beautifully packed. The cold-pressed flavour is noticeably better than store-bought. We drizzle it on everything now.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sana Ahmed",
    location: "Islamabad",
    quote:
      "Ordered the 300ml tin set as wedding favours. The guests loved the elegant packaging and even more so the quality. Will definitely reorder for upcoming events.",
    rating: 5,
  },
  {
    id: 4,
    name: "Hassan Rizvi",
    location: "Multan",
    quote:
      "I've been using this oil in my home cooking for a month now, and the difference is night and day. My salads and roast vegetables have never tasted this fresh. Great value for the quality you're getting.",
    rating: 5,
  },
];

export function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <section className="py-24 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            What Our Customers Say
          </h2>
          <div className="h-px w-16 bg-accent mx-auto" />
        </div>

        <div
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[280px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[current].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center"
              >
                {/* Quotation mark ornament */}
                <span className="block font-serif text-6xl leading-none text-accent/40 mb-4">
                  &ldquo;
                </span>

                <blockquote className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                  {testimonials[current].quote}
                </blockquote>

                <div className="flex items-center justify-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[current].rating
                          ? "text-accent fill-accent"
                          : "text-primary-foreground/20"
                      }`}
                    />
                  ))}
                </div>

                <p className="font-semibold text-white">
                  {testimonials[current].name}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {testimonials[current].location}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-accent w-6"
                    : "bg-border hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
