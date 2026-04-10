import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ["latin"] });

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-black flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-2 border-gold/10 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-gold rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gold/5 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-3 text-center animate-pulse">
        <h2 className={`${cinzel.className} text-xl font-bold tracking-[0.3em] text-foreground uppercase`}>RUHQALAM</h2>
        <p className="text-[10px] font-black tracking-[0.5em] text-gold uppercase transition-opacity duration-1000">Spiritual Art Loading</p>
      </div>
    </div>
  );
}
