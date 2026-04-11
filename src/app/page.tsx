import { Metadata } from 'next';
import { getProducts, getHeroSlides, getSetting } from '@/lib/data';

import { ProductCard, HeroSection, CustomOrder, Testimonials } from '@/components';
import { Search } from 'lucide-react';
import { Cinzel } from 'next/font/google';
import Link from 'next/link';

const cinzel = Cinzel({ subsets: ["latin"] });

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; category?: string }> 
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const category = resolvedParams.category;

  if (q) {
    return { title: `Search results for "${q}"` };
  }
  if (category) {
    return { title: `${category} Collection` };
  }
  return {};
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  
  // Parallel fetching for performance
  const [allProducts, heroSlides, heroDelay, heroVideoEnabled] = await Promise.all([
    getProducts(),
    getHeroSlides(),
    getSetting('heroDelay'),
    getSetting('heroVideoEnabled')
  ]);

  const query = resolvedParams.q?.toLowerCase() || '';
  const categoryFilter = resolvedParams.category || '';

  const filteredProducts = allProducts.filter((product: any) => {
    const matchesQuery = product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(allProducts.map((p: any) => p.category))) as string[];

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section - Now Full Bleed */}
      <HeroSection 
        initialSlides={heroSlides} 
        initialDelay={heroDelay ? parseInt(heroDelay) : undefined}
        initialVideoEnabled={heroVideoEnabled === 'true'}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Filters and Search */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-700 ${
                !categoryFilter 
                ? 'bg-gold text-white border-gold shadow-[0_15px_30px_rgba(212,175,55,0.3)]' 
                : 'bg-transparent text-muted hover:border-gold hover:text-gold'
              }`}
            >
              ALL PRODUCTS
            </Link>
            {categories.map((cat: string) => (
              <Link
                key={cat}
                href={`?category=${cat}`}
                className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border transition-all duration-700 ${
                  categoryFilter === cat 
                  ? 'bg-gold text-white border-gold shadow-[0_15px_30px_rgba(212,175,55,0.3)]' 
                  : 'bg-transparent text-muted hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <form action="/" className="relative w-full md:w-[450px] group animate-fade-up">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-gold transition-colors" strokeWidth={1.5} />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search the collection..."
              className={`${cinzel.className} w-full pl-16 pr-8 py-4 rounded-full bg-secondary/5 border border-border focus:ring-1 focus:ring-gold focus:border-gold transition-all text-[11px] font-bold tracking-widest uppercase outline-none placeholder:text-muted/40`}
            />
          </form>
        </section>

        {/* Product Grid */}
        <section id="products">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6">
              <h3 className="text-3xl font-black text-muted tracking-tighter">NO PRODUCTS FOUND</h3>
              <p className="text-muted">Try adjusting your search or filters to find what you're looking for.</p>
              <a href="/" className="btn-secondary inline-block">CLEAR ALL FILTERS</a>
            </div>
          )}
        </section>
        
        {/* Social Proof & Testimonials */}
        <Testimonials />

        {/* Custom Order Section */}
        <CustomOrder />
      </div>
    </div>
  );
}
