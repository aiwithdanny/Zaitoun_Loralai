import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

import { ProductGrid } from "@/components/ProductGrid";
import { QualityFeatures } from "@/components/QualityFeatures";
import { Story } from "@/components/Story";
import { About } from "@/components/About";
import { TastingNotes } from "@/components/TastingNotes";
import { Recipes } from "@/components/Recipes";
import { Footer } from "@/components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <QualityFeatures />
        <Story />
        <About />
        <TastingNotes />
        <Recipes />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
