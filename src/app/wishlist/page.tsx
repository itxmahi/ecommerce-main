'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setIsLoaded(true);
      });
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in">
      <div className="space-y-2 border-b pb-12">
        <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase mb-2">MY <span className="text-red-500">WISHLIST</span></h1>
        <p className="text-muted font-bold tracking-[0.2em] text-xs uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {isLoaded ? wishlistedProducts.length : '...'} PREMIUM ITEMS SAVED
        </p>
      </div>

      {!isLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 opacity-20">
          {[1,2,3,4].map(i => (
             <div key={i} className="aspect-square bg-secondary rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 space-y-10 animate-in zoom-in-95 duration-700">
          <div className="mx-auto w-32 h-32 bg-secondary rounded-full flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30">
            <Heart className="w-16 h-16 text-indigo-600 animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">YOUR <span className="text-red-500">WISHLIST</span> IS EMPTY</h2>
            <p className="text-muted text-lg max-w-sm mx-auto leading-relaxed">
              Save your favorite premium items here to keep an eye on them for later.
            </p>
          </div>
          <Link href="/" className="btn-primary inline-flex mt-4 items-center gap-3 px-10 py-5 text-lg shadow-red-500/20 bg-red-500 hover:bg-black group">
            EXPLORE COLLECTION <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
