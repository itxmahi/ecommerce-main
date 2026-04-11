'use client';

import Image from "next/image";
import { Cinzel } from "next/font/google";
import { Camera, Mail, Phone, Video, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const cinzel = Cinzel({ subsets: ["latin"] });

export default function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        {/* Brand Section */}
        <div className="md:col-span-5 space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <Image src="/logo.png" alt="RUHQALAM Logo" fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <h3 className={`${cinzel.className} text-2xl font-bold tracking-[0.1em] uppercase`}>RUH<span className="text-gold">QALAM</span></h3>
              <p className="text-[10px] font-black tracking-[0.4em] text-gold uppercase leading-none text-gold/80">SPIRIT OF THE PEN</p>
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
              suppressHydrationWarning
            >
              <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" suppressHydrationWarning />
              <Camera className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:scale-125 group-hover:rotate-6 transition-all duration-500" strokeWidth={1.5} />
              <div className="absolute -inset-1 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" suppressHydrationWarning />
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
          <h4 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500">HOME STUDIO</h4>
          <ul className="text-sm space-y-5 text-gray-400 font-medium">
            <li className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/5 mt-1"><MapPin className="w-4 h-4 text-indigo-500" /></div>
              <span className="flex flex-col">
                <span className="text-white font-bold tracking-wide">Islamabad, Pakistan</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Handmade Designs at Home</span>
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
              <div className="p-2.5 rounded-xl bg-gold/10 mt-1 shadow-[0_0_20px_rgba(212,175,55,0.1)]"><Mail className="w-4 h-4 text-gold" /></div>
              <span className="flex flex-col">
                <span className="text-white font-bold tracking-wide">info@ruhqalam.com</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Official Inquiry</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500" suppressHydrationWarning>
          © {year} RUHQALAM COLLECTION. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
