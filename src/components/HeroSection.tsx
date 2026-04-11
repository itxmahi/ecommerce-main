'use client';

import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Cinzel, Inter } from 'next/font/google';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const cinzel = Cinzel({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], weight: ['400', '700', '900'] });

interface HeroSlide {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroDelay, setHeroDelay] = useState(5000);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
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
  }, []);

  const visibleSlides = videoEnabled ? slides : slides.filter(s => s.type !== 'VIDEO');

  if (isLoading) {
    return (
      <div className="relative mx-auto max-w-[1400px] h-[500px] md:h-[750px] rounded-[3.5rem] bg-zinc-950 flex items-center justify-center animate-pulse mt-8">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative mx-auto mt-8 max-w-[1400px] h-[500px] md:h-[750px] rounded-[3.5rem] overflow-hidden group shadow-[0_80px_160px_-40px_rgba(0,0,0,0.4)] bg-black border border-white/5"
    >
      <Swiper
        key={`${heroDelay}-${videoEnabled}`}
        modules={[Autoplay, EffectFade, Parallax, Pagination]}
        effect="fade"
        parallax={true}
        pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet apple-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active apple-bullet-active',
        }}
        autoplay={{ delay: heroDelay, disableOnInteraction: false }}
        loop={visibleSlides.length > 1}
        className="w-full h-full"
      >
        {visibleSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-20" />
              
              {slide.type === 'VIDEO' ? (
                <video 
                  src={slide.url} 
                  autoPlay muted loop playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative" data-swiper-parallax="20%">
                  <Image 
                    src={slide.url} 
                    alt="Premium Artwork" 
                    fill
                    priority={visibleSlides.indexOf(slide) === 0}
                    className="object-cover scale-105 transition-transform duration-[4s]"
                  />
                </div>
              )}
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, ease: "easeOut" }}
               className="absolute inset-0 z-30 flex flex-col items-start justify-center px-10 md:px-24 space-y-8"
            >
               <div className="space-y-4">
                  <span className={`${inter.className} text-[11px] font-bold tracking-[0.4em] uppercase text-white/50 animate-pulse`}>
                     PREMIUM SELECTION • COLLECTION 2024
                  </span>
                  {/* <h1 className={`${inter.className} text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-[-0.05em] uppercase`}>
                     AESTHETICS <br />
                     <span className="italic font-serif font-light lowercase tracking-normal text-white animate-fade-in">of the</span> <br />
                     DIVINE. */}
                  </h1>
               </div>

               <div className="flex items-center gap-10 mt-12 pointer-events-auto">
                  <button 
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-12 py-5 rounded-full text-[12px] font-bold tracking-[0.2em] transition-all duration-500 hover:bg-zinc-200 active:scale-95 flex items-center gap-3 group"
                  >
                    SHOP NOW <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className={`${cinzel.className} text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase leading-relaxed max-w-[150px]`}>
                     HANDCRAFTED <br /> IN ISLAMABAD
                  </p>
               </div>
            </motion.div>
          </SwiperSlide>
        ))}

        {/* Apple Style Pagination Dots (Styles added to global CSS if needed, or via inline styles) */}
        <style jsx global>{`
          .swiper-pagination-bullet.apple-bullet {
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.4);
            opacity: 1;
            transition: all 0.5s ease;
            margin: 0 6px !important;
            border-radius: 50%;
          }
          .swiper-pagination-bullet-active.apple-bullet-active {
            width: 24px;
            border-radius: 4px;
            background: #fff;
            box-shadow: 0 0 20px rgba(255,255,255,0.5);
          }
          .swiper-pagination {
            bottom: 40px !important;
          }
        `}</style>
      </Swiper>
      
      {/* Glassmorphism Border */}
      <div className="absolute inset-0 border border-white/5 rounded-[3.5rem] pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
    </motion.section>
  );
}
