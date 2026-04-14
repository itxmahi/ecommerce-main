'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, Sparkles, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  if (!mounted) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/#products', icon: Search },
    { label: 'Custom', href: '/#custom-order', icon: Sparkles },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlist?.length || 0 },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
  ];

  const displayItems = isAdmin 
    ? [...navItems, { label: 'Admin', href: '/admin-secret', icon: Shield }]
    : navItems;

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100] flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto relative w-full max-w-lg"
      >
        {/* Intense Glassmorphism Layer */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-[32px] rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-gold/10 via-transparent to-indigo-500/10 opacity-50 animate-pulse pointer-events-none" />
        </div>

        <div className="relative px-4 py-2 flex items-center justify-around w-full">
            {displayItems.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('/#') && (pathname === '/' || pathname === ''));
              const Icon = item.icon;
              
              return (
                <Link key={item.label} href={item.href} className="relative py-2 px-1 flex-1">
                  <div className="flex flex-col items-center gap-1.5 relative">
                    <motion.div 
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ y: -2 }}
                      className={`relative p-2.5 rounded-2xl transition-all duration-700 ${
                      isActive 
                        ? 'bg-gold/20 text-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                        : 'text-muted/60 hover:text-gold/80'
                    }`}>
                      <Icon className={`w-5.5 h-5.5 transition-all duration-500 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.5px]'}`} />
                      
                      <AnimatePresence>
                        {item.badge !== undefined && item.badge > 0 && (
                          <motion.span 
                            initial={{ scale: 0, scaleY: 0 }}
                            animate={{ scale: 1, scaleY: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-gradient-to-br from-gold to-yellow-600 text-white text-[8px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-black shadow-lg border border-white/20"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    <span className={`text-[8px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'text-gold opacity-100 translate-y-0' : 'text-muted/40 opacity-50 translate-y-0.5'}`}>
                      {item.label}
                    </span>

                    {/* Premium Active Indicator */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </motion.nav>
    </div>
  );
}
