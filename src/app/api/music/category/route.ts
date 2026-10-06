import { NextRequest, NextResponse } from 'next/server';
import { musicProvider } from '@/lib/music/provider';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'trending';

  try {
    const tracks = await musicProvider.getCategoryTracks(category);
    return NextResponse.json({ tracks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Category tracks fetch failed' }, { status: 500 });
  }
}
