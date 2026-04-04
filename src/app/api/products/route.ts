import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = await addProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('[API Error] Product Creation Failed:', error);
    return NextResponse.json({ 
      error: 'Failed to create product', 
      message: error.message || 'Unknown database error' 
    }, { status: 500 });
  }
}
