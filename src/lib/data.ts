import { prisma } from './prisma';

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

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reviews: true }
    }) as (Product & { reviews: Review[] })[];

    // Priority Sorting:
    // 1. Pinned (isPinned)
    // 2. Limited Edition
    // 3. Newest (createdAt desc)
    return products.sort((a, b) => {
      // 1. Pinned check
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // 2. Limited check
      const aIsLimited = a.category?.toLowerCase().includes('limited') || a.title?.toLowerCase().includes('limited');
      const bIsLimited = b.category?.toLowerCase().includes('limited') || b.title?.toLowerCase().includes('limited');
      
      if (aIsLimited && !bIsLimited) return -1;
      if (!aIsLimited && bIsLimited) return 1;

      return 0; // Maintain original createdAt: desc order for the rest
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: { reviews: { orderBy: { createdAt: 'desc' } } }
    }) as (Product & { reviews: Review[] }) | null;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function addProduct(productData: Omit<Product, 'id' | 'reviews'>): Promise<Product> {
  const product = await prisma.product.create({
    data: productData as any,
  });
  return product as Product;
}

export async function updateProduct(id: string, updatedFields: Partial<Omit<Product, 'reviews'>>): Promise<Product | null> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updatedFields as any,
    });
    return product as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

export async function getLatestReviews(limit: number = 3): Promise<Review[]> {
  try {
     return await prisma.review.findMany({
       take: limit,
       orderBy: { createdAt: 'desc' },
     });
  } catch (error) {
    console.error('Error fetching latest reviews:', error);
    return [];
  }
}
