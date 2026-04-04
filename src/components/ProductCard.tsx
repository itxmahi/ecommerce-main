'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, CartItem } from '@/context/CartContext';
import { Heart, ShoppingBag, Maximize2, X, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  reviews?: Review[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  // Prevent scroll when preview is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isPreviewOpen]);

  return (
    <div
      className={cn(
        "group relative luxury-card overflow-hidden",
        isOutOfStock && "opacity-75 grayscale-[0.8]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      suppressHydrationWarning
    >
      {/* Out of Stock Ribbon */}
      {isOutOfStock && (
        <div className="absolute top-6 -left-12 -rotate-45 bg-red-600 text-white px-12 py-1.5 text-[8px] font-black tracking-[0.2em] uppercase z-[45] shadow-2xl border-y border-red-500/20 shadow-red-600/30">
           OUT OF STOCK
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5" suppressHydrationWarning>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-transform duration-1000 ease-out",
            isHovered && !isOutOfStock ? "scale-110" : "scale-100"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Transparent Click Overlay - Goes to Product Detail */}
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.title} details`} />

        {/* Action Controls - Standard Layer */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-30" suppressHydrationWarning>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:scale-110 shadow-xl",
              isWishlisted ? "bg-red-500 border-red-500" : "bg-black/20"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-white")} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsPreviewOpen(true);
            }}
            className="p-2.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/20 shadow-xl"
            title="Preview Masterpiece"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Global Boutique Tag */}
        <div className="absolute bottom-4 left-4 z-20" suppressHydrationWarning>
          <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-[8px] font-black tracking-[0.3em] uppercase border border-white/10">
            {product.category}
          </span>
        </div>

        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-20 transition-all duration-500",
          !isOutOfStock ? "translate-y-0 md:translate-y-full md:group-hover:translate-y-0" : "hidden"
        )} suppressHydrationWarning>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full bg-white text-black py-2.5 md:py-4 rounded-full text-[9px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.3em] uppercase transition-all duration-500 hover:bg-gold hover:text-white shadow-2xl active:scale-95"
          >
            ADD TO COLLECTION
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 py-6 space-y-3" suppressHydrationWarning>
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-black tracking-[0.5em] text-gold uppercase">Authentic Script</span>
            {isOutOfStock ? (
              <span className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> ARCHIVED</span>
            ) : product.stock > 0 && product.stock < 5 ? (
              <span className="text-[10px] font-black text-red-600 animate-pulse uppercase tracking-widest flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/10">
                LIMITED EDITION
              </span>
            ) : (
              <div className="flex items-center gap-2">
                 <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const avg = product.reviews && product.reviews.length > 0 
                        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
                        : 0;
                      return (
                        <Star 
                          key={star} 
                          className={cn(
                            "w-3 h-3",
                            avg >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          )} 
                        />
                      );
                    })}
                 </div>
                 {product.reviews && product.reviews.length > 0 ? (
                   <span className="text-[9px] font-black text-muted tracking-tight">({product.reviews.length})</span>
                 ) : (
                   <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">New</span>
                 )}
              </div>
            )}
        </div>
        <h3 className={`${cinzel.className} text-2xl font-bold text-foreground tracking-tight line-clamp-1`}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between" suppressHydrationWarning>
          <p className="text-2xl font-black text-foreground/30 font-serif italic">
            Rs. {product.price.toLocaleString()}
          </p>
          <div className="w-12 h-[1px] bg-gold/30" suppressHydrationWarning />
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

          <button
            className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white z-50 active:scale-90"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center space-y-10 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl aspect-[4/5] md:h-[80vh] rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain md:object-cover"
                priority
              />
            </div>

            <div className="text-center space-y-2 max-w-2xl px-6">
              <span className="text-[10px] font-black tracking-[0.5em] text-indigo-500 uppercase">{product.category}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{product.title}</h2>
              <p className="text-xl font-serif italic text-white/40">Exquisite Islamic Art Collection</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
