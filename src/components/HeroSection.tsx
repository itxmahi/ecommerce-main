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
      <div className="relative w-full aspect-square md:h-[90vh] bg-secondary/10 flex items-center justify-center animate-pulse">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.section 
      ref={containerRef}
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Dynamic Hero Style Mapper */}
      <div className="relative w-full px-4 md:px-0 mt-4 md:mt-0 aspect-square md:aspect-auto md:h-[90vh]">
        <div className="w-full h-full relative rounded-[2.5rem] md:rounded-none overflow-hidden shadow-2xl md:shadow-none bg-black">
          
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
                        alt={`RUHQALAM Gallery ${index + 1}`} 
                        fill
                        priority={index === 0}
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-[8s] ease-out"
                        sizes="100vw"
                        quality={100}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    </div>
                  )}
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center p-8 md:px-24 pb-20 md:pb-0">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="max-w-3xl space-y-4 md:space-y-8"
                  >
                    <div className="space-y-2 md:space-y-4">
                      <motion.span 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }}
                        className="inline-block text-[9px] md:text-[11px] font-black tracking-[0.5em] uppercase text-gold"
                      >
                        Exquisite Artistry
                      </motion.span>
                      <h2 className={`${cinzel.className} text-white text-4xl md:text-8xl font-light leading-none tracking-tighter`}>
                        Where Spirit <br/> Meets <span className="text-gold italic font-black">Mastery</span>
                      </h2>
                      <p className="hidden md:block text-white/60 text-sm max-w-lg leading-relaxed tracking-wider font-medium">
                        Discover the harmony of traditional calligraphy and modern luxury aesthetics. Each piece is a testament to the divine spirit of the pen.
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <Link href="/#products">
                        <button className={`${cinzel.className} relative overflow-hidden px-10 md:px-16 py-4 md:py-6 rounded-full bg-white/10 backdrop-blur-xl border border-gold/40 text-white text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase transition-all duration-700 hover:bg-gold hover:text-white flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}>
                          Shop Now <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Manual Nav - Hidden on Mobile */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 px-10 hidden md:flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button className="hero-prev w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-gold hover:text-white transition-all shadow-2xl">
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="hero-next w-16 h-16 rounded-full glass border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-gold hover:text-white transition-all shadow-2xl">
                <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
