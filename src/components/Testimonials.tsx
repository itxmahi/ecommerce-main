import { Star, User, CheckCircle2 } from 'lucide-react';
import { getLatestReviews } from '@/lib/data';
import { Cinzel } from 'next/font/google';
import LikeButton from './LikeButton';

const cinzel = Cinzel({ subsets: ["latin"] });

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export default async function Testimonials() {
  const reviews = await getLatestReviews(10); 

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
           <h2 className={`${cinzel.className} text-2xl md:text-4xl font-black tracking-tight uppercase`}>
            Verified <span className="text-gold italic font-serif lowercase tracking-normal">feedbacks</span>
           </h2>
           <p className="text-muted/60 font-black tracking-[0.2em] text-[10px] uppercase">Voices of our Global Collectors</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/5 rounded-full border border-gold/10 w-fit">
           <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-gold/10 flex items-center justify-center">
                   <User className="w-3 h-3 text-gold" />
                </div>
              ))}
           </div>
           <span className="text-[10px] font-black text-gold uppercase tracking-tighter capitalize">10,000+ happy clients</span>
        </div>
      </div>

      {/* Daraz-Style Horizontal Review Feed with Real Backend Integration */}
      <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar -mx-6 px-6 snap-x">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="min-w-[280px] md:min-w-[340px] max-w-[340px] bg-secondary/5 border border-border/40 rounded-[2rem] p-6 snap-start flex flex-col justify-between group hover:border-gold/30 transition-all duration-500"
          >
            <div>
              {/* Header: User & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center border border-gold/10 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-foreground leading-tight">{review.userName}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">Verified Purchase</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3 h-3 ${s <= review.rating ? 'fill-gold text-gold' : 'text-border'} fill-current`} 
                    />
                  ))}
                </div>
              </div>

              {/* Body: Streamlined Text */}
              <p className="text-[13px] text-foreground/70 leading-relaxed font-medium line-clamp-4 mb-6 italic">
                 "{review.comment}"
              </p>
            </div>

            {/* Footer: REAL DATE & REAL LIKES */}
            <div className="flex items-center justify-between pt-4 border-t border-border/20">
              <span className="text-[9px] font-bold text-muted/40 uppercase tracking-tight">
                {formatDate(new Date(review.createdAt))}
              </span>
              <div className="flex items-center gap-1">
                <LikeButton reviewId={review.id} initialLikes={review.likes || 0} />
              </div>
            </div>
          </div>
        ))}

        {/* Explore More Card */}
        <div className="min-w-[200px] flex flex-col items-center justify-center p-6 bg-gold/5 rounded-[2rem] border border-dashed border-gold/30 snap-start group cursor-pointer hover:bg-gold hover:text-white transition-all duration-700">
           <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-700">
              <Star className="w-5 h-5 fill-current" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-center">View All Reviews</p>
        </div>
      </div>
    </section>
  );
}
