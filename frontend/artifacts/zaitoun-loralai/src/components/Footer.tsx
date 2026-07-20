import { useState } from "react";
import { Link } from "wouter";
import { BRAND } from "@/lib/constants";
import { useNewsletterSubscription } from "@/hooks/useNewsletter";
import logoUrl from "@assets/Official_Logo_1782757596768.webp";
import { Facebook, ArrowRight, Loader2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useNewsletterSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribe(email);
      setEmail("");
    }
  };

  return (
    <footer id="contact" className="bg-[#1C1C16] text-[#FAF7F2] py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="lg:col-span-1">
            <img src={logoUrl} alt={BRAND.name} className="h-12 w-auto mb-6" />
            <p className="text-[#FAF7F2]/60 text-sm leading-relaxed mb-6">
              {BRAND.tagline}. Purveyors of exceptionally crafted extra virgin olive oil from the mountains.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/zaitounloralai" target="_blank" rel="noopener noreferrer" className="p-2 text-[#FAF7F2]/60 hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.facebook.com/zaitounloralai" target="_blank" rel="noopener noreferrer" className="p-2 text-[#FAF7F2]/60 hover:text-accent transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="https://x.com/zaitoun_loralai" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" onClick={(e) => e.stopPropagation()} className="p-2 text-[#FAF7F2]/60 hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              {BRAND.navLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-[#FAF7F2]/60 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-[#FAF7F2]/60 text-sm">
              <li>Loralai, Balochistan</li>
              <li>Pakistan</li>
              <li><a href="mailto:info@Zaitoun.loralai@gmail.com" className="hover:text-white">info@Zaitoun.loralai@gmail.com</a></li>
              <li><a href="tel:03425583198" className="hover:text-white">03425583198</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Newsletter</h4>
            <p className="text-[#FAF7F2]/60 text-sm mb-4">Join our list for harvest updates and exclusive releases.</p>
            <form onSubmit={handleSubmit} className="flex border-b border-[#FAF7F2]/30 focus-within:border-accent transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                disabled={isPending}
                className="bg-transparent w-full py-3 outline-none text-sm text-white placeholder:text-[#FAF7F2]/40 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="p-3 text-[#FAF7F2]/60 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#FAF7F2]/40">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
