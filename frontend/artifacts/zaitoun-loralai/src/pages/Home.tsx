import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

import { ProductGrid } from "@/components/ProductGrid";
// Below-the-fold sections: lazy-loaded so they don't bloat the initial
// bundle. They load in the background while the user sees Hero + products.
const Story = lazy(() => import("@/components/Story").then((m) => ({ default: m.Story })));
const QualityFeatures = lazy(() => import("@/components/QualityFeatures").then((m) => ({ default: m.QualityFeatures })));
const TastingNotes = lazy(() => import("@/components/TastingNotes").then((m) => ({ default: m.TastingNotes })));
const WholesaleSection = lazy(() => import("@/components/WholesaleSection").then((m) => ({ default: m.WholesaleSection })));
const TestimonialSection = lazy(() => import("@/components/TestimonialSection").then((m) => ({ default: m.TestimonialSection })));
const About = lazy(() => import("@/components/About").then((m) => ({ default: m.About })));
const Recipes = lazy(() => import("@/components/Recipes").then((m) => ({ default: m.Recipes })));
import { Footer } from "@/components/Footer";
import { SITE_URL, OG_IMAGE } from "@/lib/constants";

function Home() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Helmet>
        <title>Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan</title>
        <meta name="description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan. 100% pure, no additives, medium-robust flavor." />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content="Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan" />
        <meta property="og:description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Zaitoun Loralai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zaitoun Loralai — Premium Extra Virgin Olive Oil from Pakistan" />
        <meta name="twitter:description" content="Shop Zaitoun Loralai's cold-pressed extra virgin olive oil, sourced from the rich soils of Loralai, Pakistan." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Zaitoun Loralai",
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.png`,
            description: "Cold-pressed extra virgin olive oil from Loralai, Pakistan. 100% pure, no additives.",
            sameAs: [],
          })}
        </script>
      </Helmet>
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <Suspense fallback={null}>
          <Story />
          <QualityFeatures />
          <TastingNotes />
          <WholesaleSection />
          <TestimonialSection />
          <About />
          <Recipes />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
