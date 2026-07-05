import { useEffect } from "react";
import { BRAND } from "@/lib/constants";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1C1C16] to-[#2a2a20] text-[#FAF7F2] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
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
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Zaitoun Loralai website and platform, you agree to comply with these
              Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">2. Account Registration</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to provide accurate and complete information during registration</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">3. Product Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Product descriptions, images, and prices are provided for informational purposes only</li>
              <li>We make no warranty that product descriptions are accurate, complete, or error-free</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities or cancel orders</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">4. Ordering and Payment</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>By placing an order, you offer to purchase products at the stated price</li>
              <li>We reserve the right to accept or reject any order</li>
              <li>Payment methods accepted: Cash on Delivery (COD), Bank Transfer, JazzCash, EasyPaisa</li>
              <li>You are responsible for providing correct payment information</li>
              <li>Orders are confirmed only after payment is received or verified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">5. Delivery</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Standard delivery timeframe is 3 days from order confirmation</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>You are responsible for ensuring someone is available to receive the delivery</li>
              <li>Delivery is made to the address you provide during checkout</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">6. Refund and Return Policy</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Returns are accepted within 5 days of delivery</li>
              <li>Returns are valid only for:
                <ul className="list-circle list-inside ml-4 mt-2 space-y-1">
                  <li>Defective products</li>
                  <li>Genuine issues (e.g., wrong size, damaged item on arrival)</li>
                </ul>
              </li>
              <li>Returns are NOT accepted for change of mind or personal preference</li>
              <li>To initiate a return, contact customer support with proof of purchase</li>
              <li>Refunds will be processed after inspection of returned items</li>
              <li>Return shipping costs may apply</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">7. Limitation of Liability</h2>
            <p>Zaitoun Loralai is not liable for:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of data or business interruption</li>
              <li>Delivery delays due to circumstances beyond our control</li>
              <li>Damages resulting from misuse of products</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">8. Intellectual Property</h2>
            <p>
              All content on our website and platform, including images, text, and logos, is the property of
              Zaitoun Loralai or its licensors and is protected by copyright and trademark laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">9. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, threaten, or abuse our staff</li>
              <li>Attempt to access unauthorized areas of our website</li>
              <li>Engage in any fraudulent or deceptive practices</li>
              <li>Use our services for illegal purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">10. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms shall be governed by the laws of Pakistan and resolved
              in the courts of Loralai, Balochistan, Pakistan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">11. Modification of Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately
              upon posting to our website. Your continued use of our services constitutes acceptance of
              modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">12. Contact Us</h2>
            <p>For questions about these Terms, please contact:</p>
            <ul className="space-y-1 my-4 text-[#1C1C16]/80">
              <li>Email: Zaitoun.loralai@gmail.com</li>
              <li>Phone: 03492882897</li>
              <li>Address: Loralai, Balochistan, Pakistan</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
