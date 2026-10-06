import { NextRequest, NextResponse } from 'next/server';
import { musicProvider } from '@/lib/music/provider';

export async function GET(request: NextRequest) {
  try {
    const region = request.nextUrl.searchParams.get('region') || 'US';
    const tracks = await musicProvider.getTrendingTracks(region);
    return NextResponse.json({ tracks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch trending tracks' }, { status: 500 });
  }
}
