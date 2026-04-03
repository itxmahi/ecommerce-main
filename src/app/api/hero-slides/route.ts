import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return NextResponse.json(slides);
}

export async function POST(req: Request) {
  try {
    const { url, type, displayOrder } = await req.json();
    const slide = await prisma.heroSlide.create({
      data: { url, type, displayOrder: displayOrder || 0 },
    });
    return NextResponse.json(slide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
