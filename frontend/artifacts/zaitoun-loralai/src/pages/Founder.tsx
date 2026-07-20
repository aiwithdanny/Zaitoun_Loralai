import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { founderApi, FounderData } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

export default function Founder() {
  const [founder, setFounder] = useState<FounderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    founderApi
      .getActive()
      .then(setFounder)
      .catch((err) => setError(err.message || "Failed to load founder information"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>Meet Our Founder — Zaitoun Loralai</title>
        <meta name="description" content="Learn about the founder of Zaitoun Loralai and the story behind Pakistan's premium extra virgin olive oil." />
        <meta property="og:title" content="Meet Our Founder — Zaitoun Loralai" />
        <meta property="og:description" content="Learn about the founder of Zaitoun Loralai." />
        <meta property="og:url" content={`${SITE_URL}/founder`} />
      </Helmet>

      <Header />
      <main className="pt-20">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Founder Content */}
        {founder && !loading && (
          <section className="py-24">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-4xl mx-auto">
                {/* Heading */}
                {founder.heading && (
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-serif text-3xl md:text-4xl text-foreground text-center mb-16"
                  >
                    {founder.heading}
                  </motion.h1>
                )}

                <div className="flex flex-col md:flex-row items-center gap-12">
                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8 }}
                    className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-xl"
                  >
                    <img
                      src={founder.image_url || ""}
                      alt={founder.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[20%]"
                    />
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center md:text-left"
                  >
                    <h2 className="font-serif text-3xl text-foreground mb-1">
                      {founder.name}
                    </h2>
                    {founder.designation && (
                      <p className="text-accent uppercase tracking-widest text-xs font-semibold mb-6">
                        {founder.designation}
                      </p>
                    )}
                    <div className="w-12 h-px bg-border mb-6 mx-auto md:mx-0" />
                    {founder.description && (
                      <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                        {founder.description}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
