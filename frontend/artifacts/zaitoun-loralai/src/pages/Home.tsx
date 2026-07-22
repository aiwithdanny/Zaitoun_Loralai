import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

import { ProductGrid } from "@/components/ProductGrid";
import { WholesaleSection } from "@/components/WholesaleSection";
import { QualityFeatures } from "@/components/QualityFeatures";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Story } from "@/components/Story";
import { About } from "@/components/About";
import { TastingNotes } from "@/components/TastingNotes";
import { Recipes } from "@/components/Recipes";
import { Footer } from "@/components/Footer";
import { SITE_URL, OG_IMAGE } from "@/lib/constants";

function Home() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan</title>
        <meta name="description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan. 100% pure, no additives, medium-robust flavor." />
        <meta property="og:title" content="Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan" />
        <meta property="og:description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Zaitoun Loralai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan" />
        <meta name="twitter:description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan." />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <WholesaleSection />
        <QualityFeatures />
        <TestimonialSection />
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
