'use client';

import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Cinzel, Inter } from 'next/font/google';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination, Navigation } from 'swiper/modules';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const cinzel = Cinzel({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], weight: ['400', '700', '900'] });

interface HeroSlide {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface HeroSectionProps {
  initialSlides?: HeroSlide[];
  initialDelay?: number;
  initialVideoEnabled?: boolean;
}

export default function HeroSection({ 
  initialSlides = [], 
  initialDelay = 5000, 
  initialVideoEnabled = true 
}: HeroSectionProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isLoading, setIsLoading] = useState(initialSlides.length === 0);
  const [heroDelay, setHeroDelay] = useState(initialDelay);
  const [videoEnabled, setVideoEnabled] = useState(initialVideoEnabled);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fetch if not provided via props
    if (initialSlides.length === 0) {
      Promise.all([
        fetch('/api/settings?key=heroDelay').then(res => res.json()),
        fetch('/api/settings?key=heroVideoEnabled').then(res => res.json())
      ]).then(([delayData, videoData]) => {
        if (delayData?.value) setHeroDelay(parseInt(delayData.value));
        if (videoData?.value) setVideoEnabled(videoData.value === 'true');
      }).catch(err => console.error("Settings fetch failed", err));

      fetch('/api/hero-slides')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          } else {
            setSlides([{ id: 'default', url: '/images/box-1.jpeg', type: 'IMAGE' }]);
          }
        })
        .catch(err => {
          console.error(err);
          setSlides([{ id: 'default', url: '/images/box-1.jpeg', type: 'IMAGE' }]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [initialSlides]);

  const visibleSlides = videoEnabled ? slides : slides.filter(s => s.type !== 'VIDEO');

  if (isLoading) {
    return (
      <div className="relative mx-auto max-w-7xl aspect-square md:h-[80vh] rounded-[2.5rem] bg-secondary/10 flex items-center justify-center animate-pulse mt-8">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.section 
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-4 md:px-0 mt-6 md:mt-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "circOut" }}
    >
      {/* Luxury Ad Card Container */}
      <div className="relative aspect-square md:aspect-[21/9] md:h-[75vh] rounded-[3rem] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.3)] border border-border/50 bg-white dark:bg-black group">
        
        <Swiper
          key={`${heroDelay}-${videoEnabled}-${visibleSlides.length}`}
          modules={[Autoplay, EffectFade, Parallax, Pagination, Navigation]}
          effect="fade"
          parallax={true}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet apple-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active apple-bullet-active',
          }}
          autoplay={{ delay: heroDelay, disableOnInteraction: false }}
          loop={visibleSlides.length > 1}
          className="w-full h-full"
        >
          {visibleSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
                {/* High-Clear Image Rendering */}
                {slide.type === 'VIDEO' ? (
                  <video 
                    src={slide.url} 
                    autoPlay muted loop playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative overflow-hidden">
                    <Image 
                      src={slide.url} 
                      alt={`RUHQALAM Masterpiece ${index + 1}`} 
                      fill
                      priority={index === 0}
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[6s] ease-out-expo"
                      sizes="(max-width: 1200px) 100vw, 90vw"
                      quality={100}
                    />
                    {/* Soft Vignette for focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
                  </div>
                )}
              
              {/* Refined Premium Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="max-w-2xl space-y-6"
                >
                  <div className="hidden md:block space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 glass text-[10px] font-black tracking-[0.4em] uppercase text-white shadow-xl">
                      Exclusive Collection
                    </span>
                    <h2 className={`${cinzel.className} text-white text-4xl md:text-7xl font-light leading-[1.1] tracking-tighter drop-shadow-2xl`}>
                      Where Spirit <br/> Meets <span className="font-black italic text-gold">Mastery</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link href="#products">
                      <button className={`${cinzel.className} relative overflow-hidden px-10 md:px-14 py-4 md:py-5 rounded-full bg-white/10 backdrop-blur-xl border border-gold/40 text-white text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase transition-all duration-700 hover:bg-gold hover:text-white flex items-center gap-3 md:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}>
                        Shop Now <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-white/60">
                       <span className="w-8 h-[1px] bg-white/20" />
                       <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Explore The Gallery</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Minimal Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 px-6 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <button className="hero-prev w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all">
              <ChevronLeft className="w-6 h-6" />
           </button>
           <button className="hero-next w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all">
              <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-40">
         <span className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
         <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gold">Scroll</span>
      </div>
    </motion.section>
  );
}
