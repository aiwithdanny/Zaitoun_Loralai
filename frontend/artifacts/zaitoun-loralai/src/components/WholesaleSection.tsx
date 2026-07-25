import { useEffect, useState } from "react";
import { Droplet, ArrowRight, MessageCircle } from "lucide-react";
import { wholesaleApi, type WholesaleConfigData, type WholesaleSizeData } from "@/lib/api";
import tankImg from "@assets/tank.png.png";
import drumImg from "@assets/drum.png.png";

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
  { id: 2, size_liters: 500, sort_order: 1, is_active: true },
  { id: 3, size_liters: 1000, sort_order: 2, is_active: true },
];

function createWhatsAppUrl(whatsappNumber: string, whatsappMessage: string, quantity?: number) {
  const message = quantity
    ? `Hi, I'm interested in a bulk order of Zaitoun Loralai olive oil. I would like to inquire about ${quantity}L.`
    : whatsappMessage;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function WholesaleSection() {
  const [config, setConfig] = useState<WholesaleConfigData | null>(null);
  const [sizes, setSizes] = useState<WholesaleSizeData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    wholesaleApi
      .getActive()
      .then((data) => {
        if (data.config) setConfig(data.config);
        if (data.sizes.length > 0) setSizes(data.sizes);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const activeConfig = config ?? FALLBACK_CONFIG;
  const activeSizes = sizes.length > 0 ? sizes : FALLBACK_SIZES;
  const whatsappNumber = activeConfig.whatsapp_number || FALLBACK_CONFIG.whatsapp_number;
  const whatsappMessage = activeConfig.whatsapp_message || FALLBACK_CONFIG.whatsapp_message;

  return (
    <section id="wholesale">
      {/* Hero + Bulk Sizes */}
      <div className="py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-4">
            {activeConfig.heading || FALLBACK_CONFIG.heading}
          </h2>
          <div className="h-px w-16 bg-primary-foreground/30 mx-auto mb-6" />
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {activeConfig.description || FALLBACK_CONFIG.description}
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-primary-foreground text-center mb-4">
            Available Bulk Sizes
          </h3>
          <p className="text-primary-foreground/80 text-center mb-12 max-w-xl mx-auto">
            Select your preferred size and contact us for a custom quote. Pricing depends on volume and delivery location.
          </p>

          {/* Product Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <img
              src={tankImg}
              alt="Stainless steel tank — 500L and 1000L sizes"
              className="w-full h-64 object-contain rounded-xl bg-white/5 p-4"
            />
            <img
              src={drumImg}
              alt="Industrial drum — 100L size"
              className="w-full h-64 object-contain rounded-xl bg-white/5 p-4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {activeSizes.map((size) => (
              <a
                key={size.id}
                href={createWhatsAppUrl(whatsappNumber, whatsappMessage, size.size_liters)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border border-primary/20 bg-white hover:bg-white/90 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Droplet className="w-6 h-6 text-primary" />
                </div>
                <span className="font-serif text-2xl md:text-3xl font-semibold text-primary group-hover:text-primary transition-colors">
                  {size.size_liters}L
                </span>
                <span className="text-xs text-muted-foreground mt-1">Inquire via WhatsApp</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {activeConfig.cta_heading || FALLBACK_CONFIG.cta_heading}
          </h3>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {activeConfig.cta_description || FALLBACK_CONFIG.cta_description}
          </p>
          <a
            href={createWhatsAppUrl(whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Us for Bulk Pricing
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
