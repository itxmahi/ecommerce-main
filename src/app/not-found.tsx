import Link from 'next/link';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ["latin"] });

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center space-y-10">
      <div className="space-y-4">
        <h1 className={`${cinzel.className} text-8xl md:text-[12rem] font-black tracking-tighter text-gold/20 leading-none`}>404</h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase">Masterpiece Not Found</h2>
        <p className="text-muted max-w-md mx-auto text-lg">
          The art piece you are looking for has been archived or moved to a different collection.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/" className="btn-secondary px-12 py-5 border-2">
          RETURN TO GALLERY
        </Link>
        <Link href="/cart" className="btn-primary px-12 py-5">
          VIEW YOUR COLLECTION
        </Link>
      </div>

      <div className="pt-20">
        <p className={`${cinzel.className} text-[10px] font-black tracking-[0.5em] text-gold uppercase`}>RUHQALAM SPIRITUAL ART</p>
      </div>
    </div>
  );
}
