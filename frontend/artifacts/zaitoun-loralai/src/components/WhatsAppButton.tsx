import { useLocation } from "wouter";

const WHATSAPP_NUMBER = "923492882897";
const WHATSAPP_MESSAGE = "Hi, I'm interested in Zaitoun Loralai products.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function WhatsAppButton() {
  const [location] = useLocation();

  // Hide on admin routes
  if (location.startsWith("/admin")) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Chat on WhatsApp"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 0C7.164 0 0 7.164 0 16c0 2.84.74 5.512 2.032 7.816L.72 31.28l7.544-1.48A15.94 15.94 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm7.84 22.792c-.36 1.016-1.792 1.872-2.936 2.12-.784.168-1.808.3-5.256-1.128-4.404-1.828-7.244-6.312-7.468-6.6-.224-.288-1.772-2.36-1.772-4.5s1.12-3.196 1.532-3.636c.412-.44.896-.552 1.196-.552.3 0 .596.004.86.016.268.012.628-.1.984.748.352.848 1.196 2.924 1.3 3.136.104.212.172.464.036.748-.136.284-.204.412-.4.652-.196.24-.412.536-.592.72-.196.2-.4.416-.172.816.228.4 1.016 1.676 2.18 2.716 1.5 1.34 2.768 1.756 3.164 1.956.396.2.628.168.86-.1.232-.268.992-1.156 1.256-1.556.264-.4.528-.332.892-.2.364.132 2.304 1.088 2.7 1.284.396.196.66.292.76.456.1.164.076.948-.284 1.864z" />
      </svg>
    </a>
  );
}
