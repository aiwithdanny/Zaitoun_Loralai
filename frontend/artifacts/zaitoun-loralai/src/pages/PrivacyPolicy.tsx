import { useEffect } from "react";
import { BRAND } from "@/lib/constants";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1C1C16] to-[#2a2a20] text-[#FAF7F2] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
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
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Introduction</h2>
            <p>
              Zaitoun Loralai ("we," "us," "our," or "Company") operates the Zaitoun Loralai website and mobile platform.
              This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Information We Collect</h2>
            <p>We collect the following personal information to process and deliver your orders:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Delivery Address</li>
            </ul>
            <p>
              This information is collected when you create an account, place an order, or contact us for support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Why We Collect This Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Order Processing: To confirm and prepare your order</li>
              <li>Delivery: To ensure accurate and timely delivery of your products</li>
              <li>Customer Support: To respond to inquiries and assist with order issues</li>
              <li>Communication: To send WhatsApp order updates, delivery notifications, and customer support messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">How We Use Your Information</h2>
            <p>Your information is used solely for:</p>
            <ol className="list-decimal list-inside space-y-2 my-4">
              <li>Processing and fulfilling your orders</li>
              <li>Delivering products to your address</li>
              <li>Providing customer service and support</li>
              <li>Sending WhatsApp notifications about order status and delivery</li>
              <li>Responding to your inquiries</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Data Protection</h2>
            <p>
              We take reasonable security measures to protect your personal information. However, no method of
              transmission over the Internet or electronic storage is completely secure. We cannot guarantee
              absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Third-Party Sharing</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties, except as necessary
              for order fulfillment (e.g., with delivery services). Your data will never be shared for marketing
              or commercial purposes without your explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of WhatsApp communications by contacting us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact:
            </p>
            <ul className="space-y-1 my-4 text-[#1C1C16]/80">
              <li>Email: Zaitoun.loralai@gmail.com</li>
              <li>Phone: 03492882897</li>
              <li>Address: Loralai, Balochistan, Pakistan</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4 mt-8">Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of Pakistan. Any disputes shall be resolved in
              accordance with Pakistani law and the jurisdiction of Loralai, Balochistan.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
