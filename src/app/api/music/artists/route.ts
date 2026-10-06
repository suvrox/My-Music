import { NextResponse } from 'next/server';
import { musicProvider } from '@/lib/music/provider';
import { INITIAL_ARTISTS } from '@/lib/music/providers/catalog';

export async function GET() {
  try {
    const artists = typeof musicProvider.getPopularArtists === 'function'
      ? await musicProvider.getPopularArtists()
      : INITIAL_ARTISTS;
    return NextResponse.json({ artists });
  } catch (err: any) {
    return NextResponse.json({ artists: INITIAL_ARTISTS });
  }
}
