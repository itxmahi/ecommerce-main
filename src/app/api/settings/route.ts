import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });

  const setting = await prisma.setting.findUnique({
    where: { key }
  });

  return NextResponse.json(setting || { key, value: '' });
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
