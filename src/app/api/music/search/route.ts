import { NextRequest, NextResponse } from 'next/server';
import { musicProvider } from '@/lib/music/provider';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';

  try {
    const tracks = await musicProvider.searchTracks(q);
    return NextResponse.json({ tracks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Search failed' }, { status: 500 });
  }
}
