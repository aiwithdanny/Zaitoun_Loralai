import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQs — Zaitoun Loralai</title>
        <meta name="description" content="Frequently asked questions about Zaitoun Loralai's premium olive oil." />
      </Helmet>
      {/* Hero Section */}
      <div className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">

          {/* Category 1: Ordering & Checkout */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Ordering & Checkout
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="how-to-order">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How do I place an order?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">You can place an order in two ways:</p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground ml-2">
                    <li><strong>Through our website:</strong> Browse our products, add items to your cart, and complete the checkout process</li>
                    <li><strong>Via WhatsApp:</strong> Contact us directly on WhatsApp to place your order with our team</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-methods">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">We accept the following payment methods:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                    <li>Cash on Delivery (COD)</li>
                    <li>Bank Transfer</li>
                    <li>Online Payment Gateway</li>
                  </ul>
                  <p className="mt-4">Choose the option that works best for you during checkout.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="minimum-order">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Is there a minimum order amount?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Our minimum order is 1 bottle. Whether you're trying our olive oil for the first time or stocking up, we're happy to serve you.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bulk-wholesale">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Can I order in bulk or for wholesale?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Yes, we offer both bulk and wholesale ordering. Prices decrease for larger quantities. Contact us via WhatsApp to discuss pricing and availability for bulk or wholesale orders.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="modify-cancel">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Can I modify or cancel my order after placing it?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>If you need to modify or cancel your order, please contact us immediately via WhatsApp or email. We'll do our best to accommodate your request if the order hasn't been processed or shipped yet.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Category 2: Delivery & Shipping */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Delivery & Shipping
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="delivery-areas">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Which areas do you deliver to?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">We deliver to all regions across Pakistan. We also ship internationally to:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                    <li>Gulf countries</li>
                    <li>United Kingdom</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery-time">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How long does delivery take?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Standard delivery takes <strong>3-5 business days</strong> within Pakistan. International delivery times vary depending on the destination country and customs processing.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery-charges">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What are the delivery charges?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>We charge a flat delivery rate that varies by location. The exact delivery charge will be calculated and displayed during checkout based on your delivery address.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="international-shipping">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Do you offer international shipping?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Yes, we ship to Gulf countries and the United Kingdom. International shipping rates and delivery times are calculated based on your location during checkout.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="track-order">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How do I track my order?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Once your order is dispatched, you'll receive a tracking ID. You can use this tracking ID to monitor your order's progress and estimated delivery time.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="not-home">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What happens if I'm not home during delivery?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Our delivery partner will attempt to contact you. If you're unavailable, they may leave a notice or attempt delivery again. For specific delivery arrangements, please contact us with your tracking ID.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Category 3: Product Information */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Product Information
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="extra-virgin">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What makes your olive oil "extra virgin"?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Our extra virgin olive oil is cold-pressed within hours of harvest, extracted without heat or chemicals. This preserves the oil's natural flavor, nutrients, and antioxidants. It meets strict quality standards with acidity levels below 0.2%.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="storage">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How should I store my olive oil?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Store your olive oil in a <strong>cool, dark place</strong> away from direct sunlight and heat sources. Refrigeration is not required, but it can help extend freshness once opened. Keep the bottle tightly sealed when not in use.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shelf-life">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What is the shelf life of your products?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                    <li><strong>Unopened bottles:</strong> 18-24 months when stored properly in a cool, dark place</li>
                    <li><strong>Once opened:</strong> Best used within 3-6 months for optimal flavor and quality</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="certifications">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Are your products certified?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Yes, our olive oil is <strong>Halal certified</strong>, ensuring it meets Islamic dietary standards.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price-variation">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Why does the price vary between bottle sizes?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Larger bottle sizes offer better value per milliliter. Packaging, production, and handling costs per unit decrease with larger formats, which is reflected in the pricing.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="farm-visit">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Can I visit your farm in Loralai?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Yes! We welcome visitors to our farm and production facility in Loralai, Balochistan. Contact us via WhatsApp or email to arrange a visit and experience our olive groves and production process firsthand.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Category 4: Returns & Refunds */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Returns & Refunds
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="return-policy">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  What is your return policy?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">We accept returns within <strong>5 days of delivery</strong> for:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                    <li>Defective or damaged products</li>
                    <li>Wrong product or size delivered</li>
                    <li>Genuine quality issues</li>
                  </ul>
                  <p className="mt-4"><strong>Please note:</strong> We do not accept returns for change of mind or personal preference. For full details, please refer to our Refund Policy.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="return-damaged">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How do I return a damaged or defective product?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">If you receive a damaged or defective product:</p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground ml-2">
                    <li>Contact us within 5 days of delivery via WhatsApp or email</li>
                    <li>Provide photos of the damaged product and packaging</li>
                    <li>Include your order number</li>
                  </ol>
                  <p className="mt-4">We'll guide you through the return process and arrange a replacement or refund.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund-timing">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How long do refunds take to process?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Once we receive and inspect the returned product, refunds are processed within 7-10 business days. The time it takes for the refund to appear in your account depends on your bank or payment method.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="return-shipping">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Who covers return shipping costs?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>For defective, damaged, or incorrect products, we cover the return shipping costs. For other approved returns, the customer is responsible for return shipping.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Category 5: Your Account & Support */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Your Account & Support
            </h2>
            <Accordion type="single" collapsible defaultValue="contact-support">
              <AccordionItem value="need-account">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Do I need to create an account to order?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">Currently, all orders are placed as a guest — no account creation required. Simply provide your details at checkout on our website, or contact us directly via WhatsApp to place your order.</p>
                  <p>We're developing a full account system that will allow you to track orders, save delivery addresses, and access your order history. This feature is coming soon.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="update-address">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How do I update my delivery address?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Since we don't have an account system yet, please contact us via WhatsApp or email if you need to update your delivery address for an existing order before it ships. When placing a new order, simply provide your current address at checkout or when ordering via WhatsApp.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact-support">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  How do I contact customer support?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">You can reach us through:</p>
                  <ul className="space-y-2 text-foreground">
                    <li><strong>Email:</strong> Zaitoun.loralai@gmail.com</li>
                    <li><strong>Phone/WhatsApp:</strong> 03492882897</li>
                    <li><strong>Address:</strong> Loralai, Balochistan, Pakistan</li>
                  </ul>
                  <p className="mt-4">We typically respond within 24 hours during business days.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="gift-packaging">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Do you offer gift packaging?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p>Yes, we offer gift packaging for your orders. This is perfect for special occasions or sending Zaitoun Loralai olive oil as a gift. Select the gift packaging option during checkout or mention it when ordering via WhatsApp.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="loyalty-subscription">
                <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                  Is there a subscription or loyalty program?
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  <p className="mb-4">Yes! We offer both:</p>
                  <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                    <li><strong>Subscription service:</strong> Receive regular deliveries of your favorite olive oil at a discounted rate</li>
                    <li><strong>Loyalty program:</strong> Earn rewards with each purchase</li>
                  </ul>
                  <p className="mt-4">Contact us via WhatsApp or email to learn more about enrollment and benefits.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  );
}
