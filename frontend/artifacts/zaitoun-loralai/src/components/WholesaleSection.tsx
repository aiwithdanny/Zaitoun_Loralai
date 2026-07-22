import { Droplet, ArrowRight, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923492882897";

const bulkSizes = [100, 200, 300, 500, 1000, 1500];

function createWhatsAppUrl(quantity?: number) {
  const message = quantity
    ? `Hi, I'm interested in a bulk order of Zaitoun Loralai olive oil. I would like to inquire about ${quantity}L.`
    : "Hi, I'm interested in bulk pricing for Zaitoun Loralai olive oil.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WholesaleSection() {
  return (
    <section id="wholesale">
      {/* Hero */}
      <div className="py-24 bg-gradient-to-b from-[#F5F0E8] to-background">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Wholesale & Bulk Orders
          </h2>
          <div className="h-px w-16 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Premium extra virgin olive oil in large quantities for businesses, restaurants,
            large households, and special events. Every litre cold-pressed from olives grown
            in the mountains of Loralai, Balochistan.
          </p>
        </div>
      </div>

      {/* Bulk Size Options */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
            Available Bulk Sizes
          </h3>
          <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
            Select your preferred size and contact us for a custom quote. Pricing depends on volume and delivery location.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {bulkSizes.map((size) => (
              <a
                key={size}
                href={createWhatsAppUrl(size)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Droplet className="w-6 h-6 text-accent" />
                </div>
                <span className="font-serif text-2xl md:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {size}L
                </span>
                <span className="text-xs text-muted-foreground mt-1">Inquire via WhatsApp</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-[#1C1C16]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-4">
            Ready to Place a Bulk Order?
          </h3>
          <p className="text-[#FAF7F2]/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Tell us your requirements and we'll get back to you with a tailored quote.
            No minimum order commitment — we work with you to find the right volume and price.
          </p>
          <a
            href={createWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
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
