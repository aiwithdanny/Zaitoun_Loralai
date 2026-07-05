import { useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BRAND } from "@/lib/constants";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Privacy Policy
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

            {/* Introduction */}
            <AccordionItem value="intro">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Introduction
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  Zaitoun Loralai ("we," "us," "our," or "Company") operates the Zaitoun Loralai website and mobile platform. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Information We Collect */}
            <AccordionItem value="collect">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Information We Collect
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">We collect the following personal information to process and deliver your orders:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Delivery Address</li>
                </ul>
                <p className="mt-4">
                  This information is collected when you create an account, place an order, or contact us for support.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Why We Collect This Information */}
            <AccordionItem value="why">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Why We Collect This Information
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Order Processing: To confirm and prepare your order</li>
                  <li>Delivery: To ensure accurate and timely delivery of your products</li>
                  <li>Customer Support: To respond to inquiries and assist with order issues</li>
                  <li>Communication: To send WhatsApp order updates, delivery notifications, and customer support messages</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* How We Use Your Information */}
            <AccordionItem value="use">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                How We Use Your Information
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">Your information is used solely for:</p>
                <ol className="list-decimal list-inside space-y-2 text-foreground ml-2">
                  <li>Processing and fulfilling your orders</li>
                  <li>Delivering products to your address</li>
                  <li>Providing customer service and support</li>
                  <li>Sending WhatsApp notifications about order status and delivery</li>
                  <li>Responding to your inquiries</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Data Protection */}
            <AccordionItem value="protection">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Data Protection
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  We take reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security of your data.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Third-Party Sharing */}
            <AccordionItem value="sharing">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Third-Party Sharing
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  We do not sell, trade, or share your personal information with third parties, except as necessary for order fulfillment (e.g., with delivery services). Your data will never be shared for marketing or commercial purposes without your explicit consent.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Your Rights */}
            <AccordionItem value="rights">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Your Rights
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Request access to your personal data</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of WhatsApp communications by contacting us</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Governing Law */}
            <AccordionItem value="law">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Governing Law
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  This Privacy Policy is governed by the laws of Pakistan. Any disputes shall be resolved in accordance with Pakistani law and the jurisdiction of Loralai, Balochistan.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Us - expanded by default */}
            <AccordionItem value="contact">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Contact Us
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">If you have questions about this Privacy Policy, please contact:</p>
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
