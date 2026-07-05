import { useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BRAND } from "@/lib/constants";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Refund and Return Policy
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

            {/* Our Commitment */}
            <AccordionItem value="commitment">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Our Commitment
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  Zaitoun Loralai strives to ensure customer satisfaction. This policy outlines the terms under which we accept returns and process refunds.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Return Window */}
            <AccordionItem value="window">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Return Window
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  Returns must be initiated within 5 days of delivery. Items returned after this period cannot be accepted.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Eligible Returns */}
            <AccordionItem value="eligible">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Eligible Returns
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">We accept returns only for the following reasons:</p>
                <ol className="list-decimal list-inside space-y-2 text-foreground ml-2">
                  <li>Defective Products: Items with manufacturing defects or damage</li>
                  <li>Damaged on Arrival: Items that arrived damaged despite proper packaging</li>
                  <li>Wrong Item or Size: Items that do not match your order</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Not Eligible for Return */}
            <AccordionItem value="ineligible">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Not Eligible for Return
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">The following are NOT accepted for return:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Items returned due to change of mind or personal preference</li>
                  <li>Items used, consumed, or altered after delivery</li>
                  <li>Items without proof of purchase</li>
                  <li>Items returned after the 5-day window</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Return Process */}
            <AccordionItem value="process">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Return Process
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ol className="list-decimal list-inside space-y-3 text-foreground ml-2">
                  <li>
                    <strong>Contact Us:</strong> Email Zaitoun.loralai@gmail.com or call 03492882897 with order number, reason for return, and photos of any defects
                  </li>
                  <li><strong>Approval:</strong> We will review your request within 2 business days</li>
                  <li><strong>Ship Return:</strong> If approved, we will provide return instructions</li>
                  <li><strong>Inspection:</strong> Upon receipt, we will inspect the returned item</li>
                  <li><strong>Refund:</strong> Approved refunds will be processed within 7 business days</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Refund Methods */}
            <AccordionItem value="methods">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Refund Methods
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">Refunds will be issued using the same payment method used for purchase:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>Cash on Delivery orders: Cash refund or bank transfer</li>
                  <li>Bank Transfer: Refund to original bank account</li>
                  <li>JazzCash: Refund to JazzCash wallet</li>
                  <li>EasyPaisa: Refund to EasyPaisa account</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping Costs */}
            <AccordionItem value="shipping">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Shipping Costs
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>We cover return shipping for defective or damaged items</li>
                  <li>Customers may be responsible for return shipping if the return is due to personal preference (though we do not accept such returns)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Refund Status */}
            <AccordionItem value="status">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Refund Status
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">To check the status of your return or refund, contact:</p>
                <ul className="space-y-2 text-foreground">
                  <li><strong>Email:</strong> Zaitoun.loralai@gmail.com</li>
                  <li><strong>Phone:</strong> 03492882897</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Returned Items */}
            <AccordionItem value="items">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Returned Items
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p>
                  Once a return is approved and refunded, the returned item becomes the property of Zaitoun Loralai.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Special Circumstances */}
            <AccordionItem value="special">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Special Circumstances
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">
                  If you believe your return does not fit into the standard categories above, please contact us directly to discuss your situation:
                </p>
                <ul className="space-y-2 text-foreground">
                  <li><strong>Email:</strong> Zaitoun.loralai@gmail.com</li>
                  <li><strong>Phone:</strong> 03492882897</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Exceptions */}
            <AccordionItem value="exceptions">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Exceptions
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">Zaitoun Loralai reserves the right to deny returns or refunds if:</p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-2">
                  <li>The item has been misused or damaged by the customer</li>
                  <li>Return is attempted after the 5-day window</li>
                  <li>The customer cannot provide proof of purchase</li>
                  <li>The item does not meet the criteria for return</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Us - expanded by default */}
            <AccordionItem value="contact">
              <AccordionTrigger className="font-serif text-lg font-semibold text-foreground hover:text-accent">
                Contact Us
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">For questions about this Refund Policy, please contact:</p>
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
