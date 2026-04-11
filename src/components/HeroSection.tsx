'use client';

import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Cinzel, Inter } from 'next/font/google';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';


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

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

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
      <div className="relative mx-auto max-w-[1400px] h-[500px] md:h-[750px] rounded-[3.5rem] bg-zinc-950 flex items-center justify-center animate-pulse mt-8">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity }}
      className="relative w-full h-[600px] md:h-[90vh] overflow-hidden group bg-zinc-950"
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
              {/* Subtle gradients removed/reduced to show BG image clearly as requested */}
              {/* Subtle radial gradient to keep center image clear while ensuring button readability */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] z-20" />
              <div className="absolute inset-0 bg-black/5 z-20" />
              
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
                    className="object-cover scale-100 transition-transform duration-[4s]"
                  />
                </div>
              )}
            
            {/* Content Overlay - Professional Ad Style */}
            <div className="absolute inset-0 z-30 flex items-center px-10 md:px-24">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="max-w-xl flex flex-col items-start gap-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <span className="h-[1px] w-12 bg-gold/50" />
                    <span className={`${inter.className} text-gold text-[10px] uppercase font-black tracking-[0.6em]`}>
                      Premier Experience
                    </span>
                  </motion.div>

                  <h2 className={`${cinzel.className} text-white text-5xl md:text-7xl font-light leading-tight tracking-tight`}>
                    Defining The <br />
                    <span className="font-black italic">Next Level</span>
                  </h2>
                  
                  <p className={`${inter.className} text-white/50 text-xs md:text-sm max-w-md leading-relaxed tracking-wider font-medium`}>
                    Explore a collection where master craftsmanship meets modern luxury. Every piece is a statement of perfection.
                  </p>
                </div>

                <Link href="#products" className="pointer-events-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group cursor-pointer"
                  >
                    <div className="absolute -inset-1 bg-gold/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <button className={`${cinzel.className} relative px-10 py-5 rounded-full bg-white text-black text-[11px] font-black tracking-[0.4em] uppercase transition-all duration-700 group-hover:bg-gold group-hover:text-white flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}>
                      <span className="relative z-10">Shop Experience</span>
                      <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-700 group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {/* Professional Minimalist Pagination handled in globals.css */}
      </Swiper>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none z-50" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />
    </motion.section>
  );
}
