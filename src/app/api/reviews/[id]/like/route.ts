import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { action } = body; // 'like' or 'unlike'

    const review = await prisma.review.update({
      where: { id: resolvedParams.id },
      data: {
        likes: {
          increment: action === 'like' ? 1 : -1
        }
      }
    });

    return NextResponse.json({ likes: review.likes });
  } catch (error: any) {
    console.error('[API Error] Review Like Failed:', error);
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 });
  }
}
