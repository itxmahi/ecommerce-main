import { prisma } from './prisma';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await prisma.product.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return await prisma.product.create({
    data: product,
  });
}

export async function updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | null> {
  try {
    return await prisma.product.update({
      where: { id },
      data: updatedFields,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

