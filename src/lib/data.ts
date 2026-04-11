import { prisma } from './prisma';
import { unstable_cache } from 'next/cache';

export interface Review {
  id: string;
  userName: string;
  userCity?: string | null;
  rating: number;
  comment: string;
  productId: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isPinned: boolean;
  reviews?: Review[];
}

export interface HeroSlide {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

// Cached version of getProducts
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { reviews: true }
      }) as (Product & { reviews: Review[] })[];

      return products.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        const aIsLimited = a.category?.toLowerCase().includes('limited') || a.title?.toLowerCase().includes('limited');
        const bIsLimited = b.category?.toLowerCase().includes('limited') || b.title?.toLowerCase().includes('limited');
        
        if (aIsLimited && !bIsLimited) return -1;
        if (!aIsLimited && bIsLimited) return 1;

        return 0;
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  ['products-list'],
  { revalidate: 3600, tags: ['products'] }
);

export async function getProductById(id: string): Promise<Product | null> {
  // We specify revalidate on the call or just use cache
  return unstable_cache(
    async () => {
      try {
        return await prisma.product.findUnique({
          where: { id },
          include: { reviews: { orderBy: { createdAt: 'desc' } } }
        }) as (Product & { reviews: Review[] }) | null;
      } catch (error) {
        console.error('Error fetching product by id:', error);
        return null;
      }
    },
    [`product-${id}`],
    { revalidate: 3600, tags: [`product-${id}`] }
  )();
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return unstable_cache(
    async () => {
      try {
        const slides = await prisma.heroSlide.findMany({
          orderBy: { displayOrder: 'asc' },
        });
        return slides as unknown as HeroSlide[];
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        return [{ id: 'default', url: '/images/box-1.jpeg', type: 'IMAGE' }] as HeroSlide[];
      }
    },
    ['hero-slides'],
    { revalidate: 3600, tags: ['hero-slides'] }
  )();
}

export async function getLatestReviews(limit: number = 3): Promise<Review[]> {
  return unstable_cache(
    async () => {
      try {
        return await prisma.review.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
      } catch (error) {
        console.error('Error fetching latest reviews:', error);
        return [];
      }
    },
    [`latest-reviews-${limit}`],
    { revalidate: 3600, tags: ['reviews'] }
  )();
}

export async function getSetting(key: string): Promise<string | null> {
  return unstable_cache(
    async () => {
      const setting = await prisma.setting.findUnique({
        where: { key }
      });
      return setting?.value || null;
    },
    [`setting-${key}`],
    { revalidate: 3600, tags: ['settings'] }
  )();
}

// These functions should revalidate the cache when called
export async function addProduct(productData: Omit<Product, 'id' | 'reviews'>): Promise<Product> {
  const { revalidateTag } = await import('next/cache');
  const product = await prisma.product.create({
    data: productData as any,
  });
  revalidateTag('products');
  return product as Product;
}

export async function updateProduct(id: string, updatedFields: Partial<Omit<Product, 'reviews'>>): Promise<Product | null> {
  const { revalidateTag } = await import('next/cache');
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updatedFields as any,
    });
    revalidateTag('products');
    revalidateTag(`product-${id}`);
    return product as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { revalidateTag } = await import('next/cache');
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidateTag('products');
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

