'use client';

import { useState } from 'react';
import { Star, MessageSquare, User, MapPin, CheckCircle2, Send, Quote } from 'lucide-react';
import { Review } from '@/lib/data';
import { Cinzel } from 'next/font/google';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cinzel = Cinzel({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

export function ReviewSection({ productId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1) 
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === star).length / totalReviews) * 100 : 0
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, userCity, rating, comment }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setSuccess(true);
        setUserName('');
        setUserCity('');
        setComment('');
        setRating(0);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 md:space-y-32 py-16 md:py-32 border-t border-gold/10">
      <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 px-4">
        <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="space-y-2 md:space-y-4">
           <h2 className={cn(cinzel.className, "text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase text-foreground leading-tight")}>
             Verified <span className="text-gold italic font-serif lowercase tracking-normal">reviews</span>
           </h2>
           <p className="text-muted/60 font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] uppercase">Voices from the Global Gallery</p>
        </div>
      </div>

      {/* Rating Breakdown / Luxury Dashboard */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#080808] p-6 sm:p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-gold/15 shadow-xl overflow-hidden relative group mx-4">
         <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold/5 blur-[80px] md:blur-[120px] -mr-32 md:-mr-48 -mt-32 md:-mt-48 rounded-full" />
         
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-4 md:space-y-6 md:border-r border-gold/10 pr-0 md:pr-16">
               <div className="relative">
                  <div className="text-6xl sm:text-8xl md:text-9xl font-black text-foreground tracking-tighter leading-none italic">{averageRating}</div>
                  <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 text-gold font-black text-[8px] md:text-xs tracking-widest uppercase bg-gold/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-gold/20 shadow-glow animate-pulse">SUPREME</div>
               </div>
               <div className="flex gap-1.5 md:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4 md:w-6 md:h-6",
                        Number(averageRating) >= star ? 'fill-gold text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'text-gray-100 dark:text-white/5'
                      )}
                    />
                  ))}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-black text-foreground uppercase tracking-[0.2em] md:tracking-[0.4em]">Based on {totalReviews} Reviews</p>
                  <p className="text-[8px] md:text-[9px] font-bold text-gold/60 uppercase tracking-[0.2em]">100% Verified Collectors</p>
               </div>
            </div>

            <div className="md:col-span-7 space-y-4 md:space-y-6">
               {ratingCounts.map(({ star, count, percentage }) => (
                 <div key={star} className="flex items-center gap-4 md:gap-6 group/row">
                    <div className="flex items-center gap-1.5 w-10 md:w-14 shrink-0">
                       <span className={cn(cinzel.className, "text-xs md:text-sm font-black text-foreground/40 group-hover/row:text-gold transition-colors")}>{star}</span>
                       <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current text-gold/20 group-hover/row:text-gold transition-colors" />
                    </div>
                    <div className="flex-1 h-2 md:h-3 bg-secondary/5 rounded-full overflow-hidden relative border border-gold/5">
                       <div 
                         className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-amber-500 transition-all duration-[1.5s] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                         style={{ width: `${percentage}%` }}
                       />
                    </div>
                    <div className="w-8 md:w-12 text-right">
                       <span className="text-[9px] md:text-[11px] font-black text-foreground/40 font-mono tracking-tighter">{percentage.toFixed(0)}%</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 px-4">
        {/* Review Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 md:top-32 group">
            <div className="absolute -inset-1 bg-gradient-to-b from-gold/20 to-transparent rounded-[2rem] md:rounded-[3.5rem] blur-xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-gold/15 shadow-2xl space-y-8 md:space-y-12 backdrop-blur-3xl">
              <div className="space-y-2 md:space-y-3">
                <h3 className={cn(cinzel.className, "text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-foreground")}>Share Experience</h3>
                <div className="w-10 h-1 bg-gold/50 rounded-full" />
              </div>
              
              {success ? (
                <div className="bg-gold/5 border border-gold/20 text-gold p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center gap-4 md:gap-6 text-center animate-in zoom-in-95 duration-700">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gold rounded-full flex items-center justify-center shadow-2xl shadow-gold/30 ring-4 md:ring-8 ring-gold/10">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <p className={cn(cinzel.className, "font-black uppercase tracking-widest text-xs md:text-sm")}>Archived Successfully</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted/50 ml-1">Rating</label>
                      <div className="flex items-center gap-2 md:gap-3 bg-secondary/5 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-gold/5 overflow-x-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-all active:scale-90"
                          >
                            <Star
                              className={cn(
                                "w-6 h-6 md:w-7 md:h-7 transition-all duration-300",
                                (hoverRating || rating) >= star ? 'fill-gold text-gold drop-shadow-sm' : 'text-gray-100 dark:text-white/5'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-2 md:space-y-3">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted/50 ml-1">Collector Identity</label>
                          <div className="relative group/input">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/30 group-focus-within/input:text-gold transition-colors" />
                             <input
                               type="text"
                               value={userName}
                               onChange={(e) => setUserName(e.target.value)}
                               required
                               placeholder="Ex: Omar Al-Farooq"
                               className="w-full pl-12 pr-6 py-4 bg-secondary/5 border border-gold/10 rounded-2xl focus:ring-1 focus:ring-gold/30 focus:border-gold outline-none transition-all font-black text-[10px] uppercase tracking-widest placeholder:text-muted/20"
                             />
                          </div>
                       </div>
                       <div className="space-y-2 md:space-y-3">
                          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted/50 ml-1">City Axis</label>
                          <div className="relative group/input">
                             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/30 group-focus-within/input:text-gold transition-colors" />
                             <input
                               type="text"
                               value={userCity}
                               onChange={(e) => setUserCity(e.target.value)}
                               required
                               placeholder="Ex: Islamabad"
                               className="w-full pl-12 pr-6 py-4 bg-secondary/5 border border-gold/10 rounded-2xl focus:ring-1 focus:ring-gold/30 focus:border-gold outline-none transition-all font-black text-[10px] uppercase tracking-widest placeholder:text-muted/20"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted/50 ml-1">Manifesto of Thoughts</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Tell the world about the aura of this piece..."
                        rows={4}
                        className="w-full px-6 py-4 bg-secondary/5 border border-gold/10 rounded-2xl focus:ring-1 focus:ring-gold/30 focus:border-gold outline-none transition-all text-sm leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="w-full relative overflow-hidden group/btn bg-foreground text-background py-5 rounded-2xl font-black tracking-[0.4em] uppercase text-[11px] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl transition-all duration-700"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4 group-hover/btn:scale-110 transition-transform duration-500">
                      {submitting ? 'RECORDING...' : (
                        <>
                          PUBLISH REVIEW <Send className="w-5 h-5" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-8 md:space-y-12">
          {reviews.length === 0 ? (
            <div className="py-20 bg-secondary/5 rounded-[2.5rem] md:rounded-[4.5rem] border-2 border-dashed border-gold/15 text-center px-6">
              <p className={cn(cinzel.className, "text-xl font-black text-muted/40 uppercase")}>Be the Curator</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:gap-12">
              {reviews.map((review, idx) => (
                <div 
                  key={review.id} 
                  className="group relative bg-[#fdfdfd] dark:bg-[#0a0a0a] p-8 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border border-gold/10 shadow-sm overflow-hidden"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <Quote className="absolute -bottom-4 -right-4 w-32 md:w-48 h-32 md:h-48 text-gold/[0.03] rotate-12" />
                  
                  <div className="relative z-10 space-y-6 md:space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                      <div className="flex flex-wrap items-center gap-3 md:gap-5">
                        <div className="flex gap-1.5 p-2 bg-gold/5 rounded-full border border-gold/10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={cn("w-4 h-4 transition-all duration-500", (review.rating || 0) >= star ? 'fill-gold text-gold drop-shadow-sm' : 'text-gray-100 dark:text-white/5')} />
                          ))}
                        </div>
                        <span className="text-[9px] font-black bg-green-500/10 text-green-700 px-4 py-2 rounded-full uppercase tracking-widest border border-green-500/20">
                          Verified ✅
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-muted/30 uppercase tracking-tighter">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xl md:text-2xl text-foreground font-serif leading-[1.6] italic selection:bg-gold/20 first-letter:text-4xl first-letter:font-black first-letter:text-gold">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-4 md:gap-6 pt-6 border-t border-gold/5">
                      <div className="w-16 h-16 bg-gold/10 rounded-[1.8rem] flex items-center justify-center border border-gold/20 shadow-inner group-hover:rotate-6 transition-transform duration-700">
                        <User className="w-8 h-8 text-gold" strokeWidth={1} />
                      </div>
                      <div>
                        <h4 className={cn(cinzel.className, "font-black text-lg tracking-widest uppercase text-foreground leading-none mb-1.5")}>
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                           <MapPin className="w-3 h-3 text-gold/40" />
                           <p className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.3em]">{review.userCity || 'Islamabad'} • Member</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
