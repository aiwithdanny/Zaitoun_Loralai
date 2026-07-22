import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User, ChevronDown, Package, LogOut } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCart } from "@/store/cart";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import logoUrl from "@assets/Official_Logo_1782757596768.webp";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [_, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const cartTotal = useCart((state: any) => state.getTotalItems());
  const { isLoggedIn, customer, logout } = useCustomerAuth();

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-border py-3">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
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
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {BRAND.navLinks.slice(0, 1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-wide font-semibold text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#wholesale"
            className="text-sm tracking-wide font-semibold text-foreground hover:text-primary transition-colors"
          >
            Wholesale
          </a>
          {BRAND.navLinks.slice(1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-wide font-semibold text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Customer Auth - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{customer?.name?.split(" ")[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2"
                    >
                      <button
                        onClick={() => { navigate("/account/orders"); setAccountOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                      >
                        <Package className="w-4 h-4" />
                        Orders
                      </button>
                      <button
                        onClick={() => { logout(); setAccountOpen(false); navigate("/"); }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-muted transition-colors text-left text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <a href="/login" className="px-4 py-1.5 bg-accent text-accent-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition">Login</a>
                <a href="/register" className="px-4 py-1.5 bg-accent text-accent-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition">Register</a>
              </>
            )}
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="p-3 bg-accent/10 rounded-full hover:bg-accent/20 transition-colors relative"
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
            className="md:hidden p-3 hover:bg-muted rounded-full transition-colors"
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
                className="p-3 hover:bg-muted rounded-full"
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
              <a
                href="#wholesale"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif text-accent hover:text-accent/80 transition-colors"
              >
                Wholesale
              </a>
              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
              >
                Cart {cartTotal > 0 && `(${cartTotal})`}
              </button>

              {/* Customer auth in mobile menu */}
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground">{customer?.name}</span>
                  <button
                    onClick={() => { navigate("/account/orders"); setMobileMenuOpen(false); }}
                    className="text-lg font-serif text-foreground hover:text-primary transition-colors"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate("/"); }}
                    className="text-lg font-serif text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                    className="text-lg font-serif text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setMobileMenuOpen(false); }}
                    className="text-lg font-serif text-foreground hover:text-primary transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
