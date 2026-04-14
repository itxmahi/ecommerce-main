'use client';

import { useState } from 'react';
import { Star, User, CheckCircle2 } from 'lucide-react';
import { Review } from '@/lib/data';
import { Cinzel } from 'next/font/google';
import { motion } from 'framer-motion';
import LikeButton from './LikeButton';

const cinzel = Cinzel({ subsets: ["latin"] });

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

export function ReviewSection({ productId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1) 
    : "0.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating, comment }),
      });
      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setSuccess(true);
        setUserName('');
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
    <div className="py-12 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section - Modern E-commerce Look */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
              Customer Reviews
              <span className="text-sm font-bold bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20">
                {averageRating} ★
              </span>
            </h2>
            <p className="text-xs text-muted/60 mt-1 font-medium tracking-wider">{totalReviews} Verified Customers shared their thoughts</p>
          </div>
          
          <button 
            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden sm:flex text-[10px] font-black tracking-widest uppercase py-3 px-6 border border-gold/30 hover:bg-gold hover:text-white transition-all rounded-full"
          >
            Write A Review
          </button>
        </div>

        {/* Horizontal Reviews Scroll - Daraz Style with Real Interaction */}
        <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar -mx-6 px-6 snap-x">
          {reviews.length === 0 ? (
            <div className="min-w-[300px] h-[180px] rounded-3xl border-2 border-dashed border-border flex items-center justify-center">
              <p className="text-xs font-bold text-muted/40 uppercase tracking-widest">Be the first to review</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-secondary/5 border border-border/40 rounded-3xl p-5 snap-start flex flex-col justify-between group transition-all hover:border-gold/30"
              >
                <div>
                  {/* Header: User & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/5">
                        <User className="w-4 h-4 text-gold" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-foreground leading-tight">{review.userName}</h4>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                          <span className="text-[8px] font-black text-green-600 uppercase tracking-wider">Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-muted/40 uppercase">
                      {formatDate(new Date(review.createdAt))}
                    </span>
                  </div>

                  {/* Stars - Small & Sharp */}
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3 h-3 ${s <= (review.rating || 0) ? 'fill-gold text-gold' : 'text-border'} fill-current`} 
                      />
                    ))}
                  </div>

                  {/* Body - Standard Text */}
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium line-clamp-3 mb-4 italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Footer: REAL LIKES */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <LikeButton reviewId={review.id} initialLikes={review.likes || 0} />
                  <button className="text-[9px] font-black text-muted/40 hover:text-gold transition-colors">REPORT</button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Review Form - Streamlined */}
        <div id="review-form" className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-black p-8 md:p-10 rounded-[2.5rem] border border-gold/20 shadow-xl">
            <div className="text-center mb-10">
              <h3 className={`${cinzel.className} text-xl font-black tracking-widest uppercase mb-2`}>Share Experience</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star className={`w-8 h-8 ${s <= rating ? 'fill-gold text-gold' : 'text-border'} transition-colors fill-current`} />
                  </button>
                ))}
              </div>
            </div>

            {success ? (
              <div className="text-center py-6 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-foreground">Review Submitted Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted/60 uppercase ml-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-secondary/5 border border-border focus:ring-1 focus:ring-gold outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted/60 uppercase ml-1">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Quality, delivery, or aesthetic appeal..."
                    rows={3}
                    className="w-full px-6 py-4 rounded-2xl bg-secondary/5 border border-border focus:ring-1 focus:ring-gold outline-none transition-all text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="w-full bg-foreground text-background py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-[11px] hover:bg-gold hover:text-white transition-all disabled:opacity-50 shadow-lg"
                >
                  {submitting ? 'RECORDING...' : 'PUBLISH REVIEW'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
