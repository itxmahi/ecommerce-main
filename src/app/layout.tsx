import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar, Footer } from "@/components";
import Image from "next/image";
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
  keywords: [
    "Islamic Art", "Premium Calligraphy", "Islamic Home Decor", 
    "Handmade Islamic Art", "RUHQALAM Calligraphy", "Spiritual Wall Art", 
    "Modern Islamic Calligraphy", "Islamic Gifts", "Quranic Art", 
    "Arabic Calligraphy Pakistan"
  ],
  authors: [{ name: "RUHQALAM" }],
  creator: "RUHQALAM",
  publisher: "RUHQALAM",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: baseUrl,
    siteName: "RUHQALAM",
    title: "RUHQALAM | Premium Islamic Art & Calligraphy",
    description: "Premium hand-painted Islamic calligraphy and spiritual art collection.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "RUHQALAM Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RUHQALAM | Premium Islamic Art",
    description: "Museum-quality Islamic calligraphy and spiritual art that transforms your spaces.",
    images: ["/logo.png"],
    creator: "@ruhqalam",
  },
  verification: {
    google: "google-site-verification-id",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,

    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RUHQALAM",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-345-5096636",
    "contactType": "customer service",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://facebook.com/ruhqalam",
    "https://instagram.com/calligraphy_art_244",
    "https://tiktok.com/@calligraphy_art_244"
  ]
};

const searchBoxJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchBoxJsonLd) }}
        />


        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-28LXMSCWL1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-28LXMSCWL1');
          `}
        </Script>

        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            {children}
          </main>
          <Footer />

          {/* Floating WhatsApp Action */}
          <a 
            href="https://wa.me/923455096636?text=Hi%20RUHQALAM%2C%20I'm%20interested%20in%20your%20art%20collection.%20Could%20you%20please%20provide%20more%20details?"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] group"
            aria-label="Contact on WhatsApp"
          >
            <div className="relative">
              {/* Pulsating Rings */}
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-40"></div>
              
              {/* Main Button */}
              <div className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:shadow-[0_25px_60px_rgba(37,211,102,0.6)] transform hover:-translate-y-2 transition-all duration-500">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.046L0 24l6.103-1.601a11.83 11.83 0 005.943 1.603h.005c6.634 0 12.04-5.405 12.044-12.041a11.818 11.818 0 00-3.51-8.523z"/>
                </svg>
              </div>

              {/* Tooltip */}
              <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-black px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap shadow-2xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pointer-events-none border border-black/5">
                INQUIRE ON WHATSAPP
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-black/5"></div>
              </div>
            </div>
          </a>
        </CartProvider>
      </body>
    </html>
  );
}
