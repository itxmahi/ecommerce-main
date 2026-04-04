import { Star, Quote, User, MapPin } from 'lucide-react';
import { getLatestReviews } from '@/lib/data';

export default async function Testimonials() {
  const reviews = await getLatestReviews(3);

  if (reviews.length === 0) {
    return null; // Hide if no real reviews exist
  }

  return (
    <section className="py-24 space-y-16 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-amber-500 mb-4">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">VERIFIED <span className="text-indigo-600 italic font-serif lowercase tracking-normal">reviews</span></h2>
        <p className="text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase">Original Reviews from Verified Customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((t) => (
          <div key={t.id} className="group relative bg-white border border-gray-100 p-10 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-all duration-700 overflow-hidden">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-indigo-100 group-hover:text-amber-500/20 transition-colors" />
            
            <div className="relative space-y-8 z-10">
              <div className="flex gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              
              <p className="text-lg text-gray-700 font-medium leading-relaxed italic">"{t.comment}"</p>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm tracking-wide text-gray-900 uppercase">{t.userName}</h4>
                    <span className="text-[9px] font-black text-green-600 bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">✅</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Verified Purchase</p>
                     <span className="w-1 h-1 bg-gray-200 rounded-full" />
                     <p className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {t.userCity || 'Islamabad'}
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
