import { useEffect } from "react";
import { BRAND } from "@/lib/constants";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1C1C16] to-[#2a2a20] text-[#FAF7F2] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Refund and Return Policy
          </h1>
          <p className="text-[#FAF7F2]/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        <div className="prose prose-sm md:prose-base max-w-none text-[#1C1C16] leading-relaxed">

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Our Commitment</h2>
            <p>
              Zaitoun Loralai strives to ensure customer satisfaction. This policy outlines the terms under
              which we accept returns and process refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Return Window</h2>
            <p>
              Returns must be initiated within 5 days of delivery. Items returned after this period cannot
              be accepted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Eligible Returns</h2>
            <p>We accept returns only for the following reasons:</p>
            <ol className="list-decimal list-inside space-y-2 my-4">
              <li>Defective Products: Items with manufacturing defects or damage</li>
              <li>Damaged on Arrival: Items that arrived damaged despite proper packaging</li>
              <li>Wrong Item or Size: Items that do not match your order</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Not Eligible for Return</h2>
            <p>The following are NOT accepted for return:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Items returned due to change of mind or personal preference</li>
              <li>Items used, consumed, or altered after delivery</li>
              <li>Items without proof of purchase</li>
              <li>Items returned after the 5-day window</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Return Process</h2>
            <ol className="list-decimal list-inside space-y-3 my-4">
              <li>
                <strong>Contact Us:</strong> Email Zaitoun.loralai@gmail.com or call 03492882897 with:
                <ul className="list-circle list-inside ml-4 mt-2 space-y-1">
                  <li>Order number</li>
                  <li>Reason for return</li>
                  <li>Photos of the defect or issue (if applicable)</li>
                </ul>
              </li>
              <li><strong>Approval:</strong> We will review your request within 2 business days</li>
              <li><strong>Ship Return:</strong> If approved, we will provide return instructions</li>
              <li><strong>Inspection:</strong> Upon receipt, we will inspect the returned item</li>
              <li><strong>Refund:</strong> Approved refunds will be processed within 7 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Refund Methods</h2>
            <p>Refunds will be issued using the same payment method used for purchase:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Cash on Delivery orders: Cash refund or bank transfer</li>
              <li>Bank Transfer: Refund to original bank account</li>
              <li>JazzCash: Refund to JazzCash wallet</li>
              <li>EasyPaisa: Refund to EasyPaisa account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Shipping Costs</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We cover return shipping for defective or damaged items</li>
              <li>
                Customers may be responsible for return shipping if the return is due to personal preference
                (though we do not accept such returns)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Refund Status</h2>
            <p>To check the status of your return or refund, contact:</p>
            <ul className="space-y-1 my-4 text-[#1C1C16]/80">
              <li>Email: Zaitoun.loralai@gmail.com</li>
              <li>Phone: 03492882897</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Returned Items</h2>
            <p>
              Once a return is approved and refunded, the returned item becomes the property of Zaitoun Loralai.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Special Circumstances</h2>
            <p>
              If you believe your return does not fit into the standard categories above, please contact us
              directly to discuss your situation:
            </p>
            <ul className="space-y-1 my-4 text-[#1C1C16]/80">
              <li>Email: Zaitoun.loralai@gmail.com</li>
              <li>Phone: 03492882897</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Exceptions</h2>
            <p>Zaitoun Loralai reserves the right to deny returns or refunds if:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>The item has been misused or damaged by the customer</li>
              <li>Return is attempted after the 5-day window</li>
              <li>The customer cannot provide proof of purchase</li>
              <li>The item does not meet the criteria for return</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Contact Us</h2>
            <p>For questions about this Refund Policy, please contact:</p>
            <ul className="space-y-1 my-4 text-[#1C1C16]/80">
              <li>Email: Zaitoun.loralai@gmail.com</li>
              <li>Phone: 03492882897</li>
              <li>Address: Loralai, Balochistan, Pakistan</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Governing Law</h2>
            <p>
              This Refund Policy is governed by the laws of Pakistan and shall be interpreted in accordance
              with the laws of Balochistan.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
