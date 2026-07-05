import { useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BRAND } from "@/lib/constants";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Accordion type="single" collapsible defaultValue="contact">

            {/* Acceptance of Terms */}
            <AccordionItem value="acceptance">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                1. Acceptance of Terms
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  By accessing and using the Zaitoun Loralai website and platform, you agree to comply with these Terms of Service. If you do not agree, please do not use our services.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Account Registration */}
            <AccordionItem value="account">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                2. Account Registration
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You agree to provide accurate and complete information during registration</li>
                  <li>You are responsible for all activities that occur under your account</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Product Information */}
            <AccordionItem value="product">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                3. Product Information
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Product descriptions, images, and prices are provided for informational purposes only</li>
                  <li>We make no warranty that product descriptions are accurate, complete, or error-free</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to limit quantities or cancel orders</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Ordering and Payment */}
            <AccordionItem value="ordering">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                4. Ordering and Payment
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>By placing an order, you offer to purchase products at the stated price</li>
                  <li>We reserve the right to accept or reject any order</li>
                  <li>Payment methods accepted: Cash on Delivery (COD), Bank Transfer, JazzCash, EasyPaisa</li>
                  <li>You are responsible for providing correct payment information</li>
                  <li>Orders are confirmed only after payment is received or verified</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Delivery */}
            <AccordionItem value="delivery">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                5. Delivery
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Standard delivery timeframe is 3 days from order confirmation</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>You are responsible for ensuring someone is available to receive the delivery</li>
                  <li>Delivery is made to the address you provide during checkout</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Refund and Return Policy */}
            <AccordionItem value="refund">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                6. Refund and Return Policy
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Returns are accepted within 5 days of delivery</li>
                  <li>Returns are valid only for defective products and genuine issues (e.g., wrong size, damaged item on arrival)</li>
                  <li>Returns are NOT accepted for change of mind or personal preference</li>
                  <li>To initiate a return, contact customer support with proof of purchase</li>
                  <li>Refunds will be processed after inspection of returned items</li>
                  <li>Return shipping costs may apply</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Limitation of Liability */}
            <AccordionItem value="liability">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                7. Limitation of Liability
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">Zaitoun Loralai is not liable for:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of data or business interruption</li>
                  <li>Delivery delays due to circumstances beyond our control</li>
                  <li>Damages resulting from misuse of products</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Intellectual Property */}
            <AccordionItem value="intellectual">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                8. Intellectual Property
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  All content on our website and platform, including images, text, and logos, is the property of Zaitoun Loralai or its licensors and is protected by copyright and trademark laws.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* User Conduct */}
            <AccordionItem value="conduct">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                9. User Conduct
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Harass, threaten, or abuse our staff</li>
                  <li>Attempt to access unauthorized areas of our website</li>
                  <li>Engage in any fraudulent or deceptive practices</li>
                  <li>Use our services for illegal purposes</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Dispute Resolution */}
            <AccordionItem value="disputes">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                10. Dispute Resolution
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  Any disputes arising from these Terms shall be governed by the laws of Pakistan and resolved in the courts of Loralai, Balochistan, Pakistan.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Modification of Terms */}
            <AccordionItem value="modification">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                11. Modification of Terms
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of modified Terms.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Us - expanded by default */}
            <AccordionItem value="contact">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                12. Contact Us
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">For questions about these Terms, please contact:</p>
                <ul className="space-y-2 text-foreground">
                  <li><strong>Email:</strong> Zaitoun.loralai@gmail.com</li>
                  <li><strong>Phone:</strong> 03492882897</li>
                  <li><strong>Address:</strong> Loralai, Balochistan, Pakistan</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </div>
  );
}
