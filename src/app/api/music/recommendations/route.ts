import { NextRequest, NextResponse } from 'next/server';
import { musicProvider } from '@/lib/music/provider';
import { Track } from '@/types/music';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackId = searchParams.get('trackId') || '';
  const youtubeId = searchParams.get('youtubeId') || '';
  const title = searchParams.get('title') || '';
  const artistName = searchParams.get('artistName') || '';
  const genre = searchParams.get('genre') || '';

  const mockTrack: Track = {
    id: trackId,
    youtubeId: youtubeId || (trackId.startsWith('yt-') ? trackId.replace('yt-', '') : undefined),
    title,
    artistName,
    genre,
    source: 'YouTube API'
  };

  try {
    const recommendations = await musicProvider.getRecommendations(mockTrack);
    return NextResponse.json({ tracks: recommendations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Recommendations failed' }, { status: 500 });
  }
}
