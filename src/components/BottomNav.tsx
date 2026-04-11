'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/#products', icon: Search },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlist.length },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/80 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.label} href={item.href} className="relative group">
              <div className="flex flex-col items-center gap-1">
                <div className={`relative p-2 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-gold/20 text-gold scale-110' 
                    : 'text-muted group-hover:text-gold'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="w-1 h-1 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
