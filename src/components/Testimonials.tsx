import { Star, Quote, User, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Ahmed Khan",
    location: "Islamabad",
    rating: 5,
    text: "Al-Jamaal Art brings a whole new level of elegance to Islamic calligraphy. I bought the Surah Al-Fatiha canvas for my living room, and it's a masterpiece that everyone admires. Highly recommended!",
    image: "/images/testimonial-1.jpg", // We can use placeholders or specific images
    verified: true
  },
  {
    id: 2,
    name: "Sarah Sheikh",
    location: "Lahore",
    rating: 5,
    text: "The quality of the canvas and the precision of the calligraphy is unparalleled. It truly feels like a piece of art that carries spiritual weight. I'm already looking at my next purchase!",
    image: "/images/testimonial-2.jpg",
    verified: true
  },
  {
    id: 3,
    name: "Umar Farooq",
    location: "Karachi",
    rating: 5,
    text: "Professional service, fast delivery, and most importantly, stunning art. The 'Scarcity' alerts really helped me grab the last piece of a limited collection. 10/10!",
    image: "/images/testimonial-3.jpg",
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 space-y-16 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-indigo-500 mb-4">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">VOICES OF THE <span className="text-indigo-600 italic font-serif lowercase tracking-normal">faithful</span></h2>
        <p className="text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase">Join Hundreds of Satisfied Collectors Worldwide</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="group relative bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 p-10 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all duration-700 overflow-hidden">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-indigo-100 dark:text-white/5 group-hover:text-indigo-500/20 transition-colors" />
            
            <div className="relative space-y-8 z-10">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{t.text}"</p>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                  <User className="w-6 h-6 text-indigo-600 dark:text-indigo-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm tracking-wide text-gray-900 dark:text-white uppercase">{t.name}</h4>
                    {t.verified && <BadgeCheck className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{t.location}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
