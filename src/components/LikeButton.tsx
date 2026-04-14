'use client';

import { ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LikeButtonProps {
  reviewId: string;
  initialLikes: number;
}

export default function LikeButton({ reviewId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
    if (likedReviews.includes(reviewId)) {
      setIsLiked(true);
    }
  }, [reviewId]);

  const toggleLike = async () => {
    if (isSyncing) return;
    
    const newLikedState = !isLiked;
    const action = newLikedState ? 'like' : 'unlike';
    
    // Optimistic Update
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    setIsLiked(newLikedState);
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        
        // Update LocalStorage
        const likedReviews = JSON.parse(localStorage.getItem('likedReviews') || '[]');
        if (newLikedState) {
          localStorage.setItem('likedReviews', JSON.stringify([...likedReviews, reviewId]));
        } else {
          localStorage.setItem('likedReviews', JSON.stringify(likedReviews.filter((id: string) => id !== reviewId)));
        }
      } else {
        // Rollback on failure
        setLikes(prev => newLikedState ? prev - 1 : prev + 1);
        setIsLiked(!newLikedState);
      }
    } catch (err) {
      console.error("Like toggle failed", err);
      // Rollback
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
      setIsLiked(!newLikedState);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button 
      onClick={toggleLike}
      className={`flex items-center gap-1.5 text-[10px] font-black transition-all duration-300 transform active:scale-90 ${
        isLiked ? 'text-gold scale-110' : 'text-muted/40 hover:text-gold/60'
      }`}
    >
      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-gold' : ''}`} />
      <span className="tabular-nums">{likes}</span>
    </button>
  );
}

