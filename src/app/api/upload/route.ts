import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  console.log('[API] Upload request received');
  
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is missing in query string' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[API] No file found in FormData');
      return NextResponse.json({ error: 'Form data must contain a "file" field' }, { status: 400 });
    }

    console.log(`[API] Processing upload: ${filename} (${file.size} bytes)`);

    // Ensure token is present
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('[API] BLOB_READ_WRITE_TOKEN is not defined in environment variables');
      return NextResponse.json({ error: 'Cloud storage token missing in server configuration' }, { status: 500 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });

    console.log(`[API] Success: ${blob.url}`);
    return NextResponse.json({ url: blob.url });

  } catch (error: any) {
    console.error('[API] Critical Upload Error:', error.message);
    return NextResponse.json({ 
      error: 'Vercel Blob synchronization failed', 
      details: error.message 
    }, { status: 500 });
  }
}
