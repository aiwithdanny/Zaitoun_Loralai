import { useState } from "react";
import { Link } from "wouter";
import { BRAND } from "@/lib/constants";
import { useNewsletterSubscription } from "@/hooks/useNewsletter";
import logoUrl from "@assets/Official_Logo_1782757596768.png";
import { Instagram, Facebook, Twitter, ArrowRight, Loader2 } from "lucide-react";

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
            <img src={logoUrl} alt={BRAND.name} className="h-12 w-auto mb-6 brightness-0 invert" />
            <p className="text-[#FAF7F2]/60 text-sm leading-relaxed mb-6">
              {BRAND.tagline}. Purveyors of exceptionally crafted extra virgin olive oil from the mountains.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#FAF7F2]/60 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-[#FAF7F2]/60 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-[#FAF7F2]/60 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
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
                className="bg-transparent w-full py-2 outline-none text-sm text-white placeholder:text-[#FAF7F2]/40 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="p-2 text-[#FAF7F2]/60 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="pt-8 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#FAF7F2]/40">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
