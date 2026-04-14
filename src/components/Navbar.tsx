'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Cinzel } from 'next/font/google';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const cinzel = Cinzel({ subsets: ["latin"] });

export default function Navbar() {
  const { cart, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true') {
      setIsAdmin(true);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled
      ? 'bg-white/95 dark:bg-black/90 backdrop-blur-3xl py-3 shadow-[0_8px_40px_rgba(0,0,0,0.12)]'
      : 'bg-transparent py-6 md:py-10'
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* Luxury Logo */}
        <Link href="/" className="flex items-center gap-3 md:gap-5 group shrink-0">
          <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden ring-1 ring-gold/20 group-hover:ring-gold transition-all duration-700 shadow-2xl bg-black">
            <Image
              src="/logo.png"
              alt="RUHQALAM Logo"
              fill
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
            />
          </div>
          <div className="flex flex-col mt-0.5 text-left">
            <span className={`${cinzel.className} text-sm md:text-2xl font-black tracking-[0.05em] text-foreground leading-none uppercase`}>RUHQALAM</span>
            <span className="hidden md:block text-[8px] tracking-[0.6em] text-gold/80 font-black uppercase mt-2 leading-none whitespace-nowrap">SPIRIT OF THE PEN</span>
          </div>
        </Link>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { label: 'HOME', href: '/' },
            { label: 'WISHLIST', href: '/wishlist' },
            { label: 'CUSTOM', href: '/#custom-order' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] font-black tracking-[0.4em] uppercase text-muted hover:text-gold transition-all duration-300 relative group/link"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-gold group-hover/link:w-full transition-all duration-300 shadow-[0_0_8px_#d4af37]"></span>
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin-secret" className="text-[10px] font-black tracking-[0.3em] uppercase text-white px-6 py-2.5 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-xl">
              DASHBOARD
            </Link>
          )}
        </div>

        {/* Minimal Icons */}
        <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 md:p-3 text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5 rounded-full"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <Link
            href="/#products"
            className="p-2 md:p-3 text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5 rounded-full hidden sm:block"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link href="/wishlist" className="relative p-2 md:p-3 text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5 rounded-full hidden md:flex">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
          </Link>

          <Link href="/cart" className="relative p-2 md:p-3 text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5 rounded-full hidden md:flex">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
