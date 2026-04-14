import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar, Footer, BottomNav } from "@/components";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ruhqalam.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "RUHQALAM | Premium Islamic Art & Calligraphy",
    template: "%s | RUHQALAM"
  },
  description: "Experience the divine beauty of RUHQALAM's premium Islamic art. Hand-painted calligraphy and spiritual decor crafted with museum-quality materials to transform your living space.",
  keywords: ["Islamic Art", "Premium Calligraphy", "Islamic Home Decor", "RUHQALAM"],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: baseUrl,
    siteName: "RUHQALAM",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden relative`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-32 md:pb-12">
            {children}
          </main>
          <BottomNav />
          <Footer />

          {/* Floating WhatsApp Action */}
          <a 
            href="https://wa.me/923455096636?text=Hi%20RUHQALAM%2C%20I'm%20interested%20in%20your%20art%20collection.%20Could%20you%20please%20provide%20more%20details?"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-32 md:bottom-8 right-6 md:right-8 z-[90] group"
            aria-label="Contact on WhatsApp"
            suppressHydrationWarning
          >
            <div className="relative group/btn" suppressHydrationWarning>
              <div className="absolute inset-0 rounded-full bg-[#25D366] blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity" />
              <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full shadow-2xl transform hover:-translate-y-2 transition-all duration-500" suppressHydrationWarning>
                 <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.046L0 24l6.103-1.601a11.83 11.83 0 005.943 1.603h.005c6.634 0 12.04-5.405 12.044-12.041a11.818 11.818 0 00-3.51-8.523z"/></svg>
              </div>

              {/* Glassmorphism Tooltip */}
              <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-black/60 backdrop-blur-3xl text-foreground px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap shadow-2xl opacity-0 translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500 pointer-events-none border border-white/20" suppressHydrationWarning>
                INQUIRE ON WHATSAPP
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white/60 dark:bg-black/60 rotate-45 border-r border-t border-white/20" suppressHydrationWarning></div>
              </div>
            </div>
          </a>
        </CartProvider>
      </body>
    </html>
  );
}
