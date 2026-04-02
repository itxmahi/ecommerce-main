import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components";
import Image from "next/image";
import { Camera, Mail, Phone, Video, MapPin } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AL-JAMAAL ART | Premium Calligraphy",
  description: "Experience premium shopping with our curated collection of islamic art and calligraphy items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            {children}
          </main>
          <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-none">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
              {/* Brand Section */}
              <div className="md:col-span-5 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                    <Image src="/logo.jpeg" alt="AL-JAMAAL Art Logo" fill className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-[0.2em] uppercase">AL-JAMAAL <span className="text-indigo-500">ART</span></h3>
                    <div className="h-0.5 w-12 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
                  The ultimate destination for premium Islamic calligraphy and canvas art. We blend centuries-old spirituality with modern luxury design.
                </p>
                <div className="flex items-center gap-6">
                  <a 
                    href="https://www.instagram.com/calligraphy_art_244/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all duration-500 hover:-translate-y-2 active:scale-95 shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Camera className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-125 group-hover:rotate-6 transition-all duration-500" strokeWidth={1.5} />
                    <div className="absolute -inset-1 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  
                  <a 
                    href="https://www.tiktok.com/@calligraphy_art_244" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-rose-500/50 hover:bg-rose-600/10 transition-all duration-500 hover:-translate-y-2 active:scale-95 shadow-[0_15px_35px_rgba(0,0,0,0.2)] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-rose-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Video className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500" strokeWidth={1.5} />
                    <div className="absolute -inset-1 bg-rose-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <div className="flex flex-col">
                    <span className="text-[8px] font-black tracking-[0.4em] text-gray-500 uppercase">OFFICIAL</span>
                    <span className="text-[9px] font-black text-indigo-500 tracking-[0.2em] uppercase">GALLERY LINKS</span>
                  </div>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="md:col-span-3 space-y-8">
                <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500">QUICK LINKS</h4>
                <ul className="text-sm space-y-4 text-gray-400 font-bold tracking-wider">
                  <li><a href="/" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> HOME</a></li>
                  <li><a href="/wishlist" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> WISHLIST</a></li>
                  <li><a href="/cart" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 transition-all"></div> SHOPPING CART</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="md:col-span-4 space-y-8">
                <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500">BOUTIQUE OFFICE</h4>
                <ul className="text-sm space-y-5 text-gray-400 font-medium">
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><MapPin className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">Islamabad, Pakistan</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Main Headquarters</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><Phone className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">+92 345 5096636</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">WhatsApp Available</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1"><Mail className="w-4 h-4 text-indigo-500" /></div>
                    <span className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">info@aljamaalart.com</span>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Support Email</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">
                © {new Date().getFullYear()} AL-JAMAAL ART COLLECTION. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </footer>

          {/* Floating WhatsApp Action */}
          <a 
            href="https://wa.me/923455096636?text=Hi%20AL-JAMAAL%20ART%2C%20I'm%20interested%20in%20your%20art%20collection.%20Could%20you%20please%20provide%20more%20details?"
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
