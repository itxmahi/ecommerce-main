import { prisma } from './prisma';

export interface Review {
  id: string;
  userName: string;
  userCity?: string | null;
  rating: number;
  comment: string;
  productId: string;
  likes: number;
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

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reviews: true }
    });
    return products as unknown as Product[];
  } catch (error) {
    console.error('getProducts error:', error);
    return [];
  }
}

async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: { orderBy: { createdAt: 'desc' } } }
    });
    return product as unknown as Product | null;
  } catch (error) {
    console.error('getProductById error:', error);
    return null;
  }
}

async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return slides as unknown as HeroSlide[];
  } catch (error) {
    return [{ id: 'default', url: '/images/box-1.jpeg', type: 'IMAGE' }] as HeroSlide[];
  }
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    return setting?.value || null;
  } catch (error) {
    return null;
  }
}

async function getLatestReviews(limit: number = 3): Promise<Review[]> {
  try {
    const reviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return reviews as unknown as Review[];
  } catch (error) {
    console.error('getLatestReviews error:', error);
    return [];
  }
}

async function addProduct(productData: any): Promise<any> {
  try {
    const product = await prisma.product.create({
      data: productData,
    });
    return product;
  } catch (error) {
    console.error('addProduct error:', error);
    throw error;
  }
}

async function updateProduct(id: string, updatedFields: any): Promise<any> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updatedFields,
    });
    return product;
  } catch (error) {
    console.error('updateProduct error:', error);
    return null;
  }
}

async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('deleteProduct error:', error);
    return false;
  }
}

// FORCE STATIC EXPORTS FOR TURBOPACK
export {
  getProducts,
  getProductById,
  getHeroSlides,
  getSetting,
  getLatestReviews,
  addProduct,
  updateProduct,
  deleteProduct
};
