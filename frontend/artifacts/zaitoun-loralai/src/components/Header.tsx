import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCart } from "@/store/cart";
import logoUrl from "@assets/Official_Logo_1782757596768.png";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [_, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartTotal = useCart((state: any) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-[hsl(var(--accent))] ring-offset-2 ring-offset-background shadow-lg"
            style={{ background: "white" }}
          >
            <motion.div
              animate={{ boxShadow: ["0 0 0px 0px hsl(var(--accent)/0.4)", "0 0 12px 4px hsl(var(--accent)/0.35)", "0 0 0px 0px hsl(var(--accent)/0.4)"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full pointer-events-none"
            />
            <img src={logoUrl} alt={BRAND.name} className="h-full w-full object-cover" />
          </motion.div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {BRAND.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-muted rounded-full transition-colors relative"
            title="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotal > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center"
              >
                {cartTotal}
              </motion.span>
            )}
          </button>

          <button
            className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-background flex flex-col px-4 py-6"
          >
            <div className="flex justify-between items-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-[hsl(var(--accent))] ring-offset-2 ring-offset-background shadow-lg"
                style={{ background: "white" }}
              >
                <img src={logoUrl} alt={BRAND.name} className="h-full w-full object-cover" />
              </motion.div>
              <button
                className="p-2 hover:bg-muted rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-center">
              {BRAND.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
              >
                Cart {cartTotal > 0 && `(${cartTotal})`}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
