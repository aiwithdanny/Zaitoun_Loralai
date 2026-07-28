import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Droplet, ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { wholesaleApi, type WholesaleConfigData, type WholesaleSizeData } from "@/lib/api";

const FALLBACK_CONFIG: WholesaleConfigData = {
  id: 0,
  heading: "Wholesale & Bulk Orders",
  description: "Premium extra virgin olive oil in large quantities for businesses, restaurants, large households, and special events. Every litre cold-pressed from olives grown in the mountains of Loralai, Balochistan.",
  cta_heading: "Ready to Place a Bulk Order?",
  cta_description: "Tell us your requirements and we'll get back to you with a tailored quote. No minimum order commitment — we work with you to find the right volume and price.",
  whatsapp_number: "923492882897",
  whatsapp_message: "Hi, I'm interested in bulk pricing for Zaitoun Loralai olive oil.",
  is_active: true,
  updated_at: "",
};

const FALLBACK_SIZES: WholesaleSizeData[] = [
  { id: 1, size_liters: 100, sort_order: 0, is_active: true },
  { id: 2, size_liters: 200, sort_order: 1, is_active: true },
  { id: 3, size_liters: 300, sort_order: 2, is_active: true },
  { id: 4, size_liters: 500, sort_order: 3, is_active: true },
  { id: 5, size_liters: 1000, sort_order: 4, is_active: true },
  { id: 6, size_liters: 1500, sort_order: 5, is_active: true },
];

function createWhatsAppUrl(whatsappNumber: string, whatsappMessage: string, quantity?: number) {
  const message = quantity
    ? `Hi, I'm interested in a bulk order of Zaitoun Loralai olive oil. I would like to inquire about ${quantity}L.`
    : whatsappMessage;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function Wholesale() {
  const [data, setData] = useState<{ config: WholesaleConfigData | null; sizes: WholesaleSizeData[] } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    wholesaleApi.getActive().then(setData).catch(() => {});
  }, []);

  const config = data?.config || FALLBACK_CONFIG;
  const sizes = data?.sizes && data.sizes.length > 0 ? data.sizes : FALLBACK_SIZES;
  const whatsappNumber = config.whatsapp_number || FALLBACK_CONFIG.whatsapp_number || "";
  const whatsappMessage = config.whatsapp_message || FALLBACK_CONFIG.whatsapp_message || "";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{config.heading || "Wholesale & Bulk Orders"} — Zaitoun Loralai</title>
        <meta
          name="description"
          content={config.description || "Buy premium extra virgin olive oil in bulk from Zaitoun Loralai. Ideal for businesses, restaurants, large households, and events. Inquire today for competitive bulk pricing."}
        />
        <meta property="og:title" content={`${config.heading || "Wholesale & Bulk Orders"} — Zaitoun Loralai`} />
        <meta
          property="og:description"
          content={config.description || "Premium extra virgin olive oil available in bulk quantities up to 1500L. Contact us for custom pricing."}
        />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="pb-16 md:pb-20 bg-gradient-to-b from-[#F5F0E8] to-background">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            {config.heading || "Wholesale & Bulk Orders"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {config.description || "Premium extra virgin olive oil in large quantities for businesses, restaurants, large households, and special events. Every litre cold-pressed from olives grown in the mountains of Loralai, Balochistan."}
          </p>
        </div>
      </section>

      {/* Bulk Size Options */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-4">
            Available Bulk Sizes
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Select your preferred size and contact us for a custom quote. Pricing depends on volume and delivery location.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {sizes.map((size) => (
              <a
                key={size.id}
                href={createWhatsAppUrl(whatsappNumber, whatsappMessage, size.size_liters)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Droplet className="w-6 h-6 text-accent" />
                </div>
                <span className="font-serif text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {size.size_liters}L
                </span>
                <span className="text-xs text-muted-foreground mt-1">Inquire via WhatsApp</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1C1C16]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
            {config.cta_heading || "Ready to Place a Bulk Order?"}
          </h2>
          <p className="text-[#FAF7F2]/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {config.cta_description || "Tell us your requirements and we'll get back to you with a tailored quote. No minimum order commitment — we work with you to find the right volume and price."}
          </p>
          <a
            href={createWhatsAppUrl(whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Us for Bulk Pricing
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
