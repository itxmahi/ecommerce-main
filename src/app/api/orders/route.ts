import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customerName, customerPhone, customerAddress } = body;

    const order = await prisma.order.create({
      data: {
        total,
        customerName,
        customerPhone,
        customerAddress,
        items: {
          create: items.map((item: any) => ({
            productId: item.id.toString(),
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ 
      error: 'Database error while creating order', 
      details: error.message || error.toString() 
    }, { status: 500 });
  }
}
