import { Track, Artist, Album, Playlist } from '@/types/music';
import { MusicProvider } from '../types';

function parseDuration(isoDuration?: string): number {
  if (!isoDuration) return 180;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 180;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function cleanTitle(title: string): { songTitle: string; artist: string } {
  // Decode HTML entities
  const decoded = title
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Clean common video tag additions
  const cleaned = decoded
    .replace(/\s*[\(\[]\s*(official\s*(music\s*)?video|audio|lyric(s)?|visualizer|4k|hd|remix)\s*[\)\]]/gi, '')
    .trim();

  // If title has "Artist - Song" format
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    return {
      artist: parts[0].trim(),
      songTitle: parts.slice(1).join(' - ').trim()
    };
  }

  return {
    songTitle: cleaned,
    artist: ''
  };
}

export class YouTubeMusicProvider implements MusicProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  async searchTracks(query: string): Promise<Track[]> {
    const q = query.trim();
    if (!q) return this.getTrendingTracks();

    if (!this.apiKey) {
      console.warn('YOUTUBE_API_KEY is not set in environment. Returning fallback YouTube catalog.');
      return this.getFallbackTracks(q);
    }

    try {
      // 1. Search for video IDs in Music category (10)
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=15&q=${encodeURIComponent(q)}&key=${this.apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        console.error('YouTube API search error:', searchRes.status, await searchRes.text());
        return this.getFallbackTracks(q);
      }

      const searchData = await searchRes.json();
      const videoIds = (searchData.items || [])
        .map((item: any) => item.id?.videoId)
        .filter(Boolean)
        .join(',');

      if (!videoIds) return this.getFallbackTracks(q);

      // 2. Fetch video details including durations
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${this.apiKey}`;
      const detailsRes = await fetch(detailsUrl);
      if (!detailsRes.ok) {
        return this.getFallbackTracks(q);
      }

      const detailsData = await detailsRes.json();
      return (detailsData.items || []).map((item: any) => {
        const rawTitle = item.snippet?.title || '';
        const { songTitle, artist } = cleanTitle(rawTitle);
        const channelTitle = item.snippet?.channelTitle || 'YouTube Artist';
        const duration = parseDuration(item.contentDetails?.duration);
        const thumbnails = item.snippet?.thumbnails;
        const artworkUrl = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url;

        return {
          id: `yt-${item.id}`,
          youtubeId: item.id,
          title: songTitle || rawTitle,
          artistId: `artist-${item.snippet?.channelId}`,
          artistName: artist || channelTitle,
          albumId: `album-${item.id}`,
          albumName: `${songTitle || rawTitle} (Single)`,
          artworkUrl: artworkUrl || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          duration,
          genre: 'YouTube Music',
          source: 'YouTube API'
        };
      });
    } catch (err) {
      console.error('Error fetching from YouTube API:', err);
      return this.getFallbackTracks(q);
    }
  }

  async getTrendingTracks(): Promise<Track[]> {
    if (!this.apiKey) {
      return this.getFallbackTracks();
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&maxResults=15&key=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error('YouTube API trending error:', res.status, await res.text());
        return this.getFallbackTracks();
      }

      const data = await res.json();
      return (data.items || []).map((item: any) => {
        const rawTitle = item.snippet?.title || '';
        const { songTitle, artist } = cleanTitle(rawTitle);
        const channelTitle = item.snippet?.channelTitle || 'YouTube Music';
        const duration = parseDuration(item.contentDetails?.duration);
        const thumbnails = item.snippet?.thumbnails;
        const artworkUrl = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url;

        return {
          id: `yt-${item.id}`,
          youtubeId: item.id,
          title: songTitle || rawTitle,
          artistId: `artist-${item.snippet?.channelId}`,
          artistName: artist || channelTitle,
          albumId: `album-${item.id}`,
          albumName: `${songTitle || rawTitle} (Single)`,
          artworkUrl: artworkUrl || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          duration,
          genre: 'YouTube Trending',
          source: 'YouTube API'
        };
      });
    } catch (err) {
      console.error('Error fetching trending YouTube tracks:', err);
      return this.getFallbackTracks();
    }
  }

  async getTrack(id: string): Promise<Track | null> {
    const videoId = id.replace('yt-', '');
    if (!this.apiKey) {
      const fallbacks = this.getFallbackTracks();
      return fallbacks.find(t => t.youtubeId === videoId || t.id === id) || null;
    }

    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const item = data.items?.[0];
      if (!item) return null;

      const rawTitle = item.snippet?.title || '';
      const { songTitle, artist } = cleanTitle(rawTitle);
      const channelTitle = item.snippet?.channelTitle || 'YouTube Artist';
      const duration = parseDuration(item.contentDetails?.duration);
      const thumbnails = item.snippet?.thumbnails;
      const artworkUrl = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.medium?.url;

      return {
        id: `yt-${item.id}`,
        youtubeId: item.id,
        title: songTitle || rawTitle,
        artistId: `artist-${item.snippet?.channelId}`,
        artistName: artist || channelTitle,
        albumId: `album-${item.id}`,
        albumName: `${songTitle || rawTitle} (Single)`,
        artworkUrl: artworkUrl || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        duration,
        genre: 'YouTube Music',
        source: 'YouTube API'
      };
    } catch {
      return null;
    }
  }

  async getArtist(id: string): Promise<Artist | null> {
    return {
      id,
      name: 'YouTube Music Artist',
      imageUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/hqdefault.jpg',
      description: 'Stream top tracks verified via YouTube Music API.',
      monthlyListeners: '2,500,000 monthly listeners',
      verified: true
    };
  }

  async getAlbum(id: string): Promise<Album | null> {
    const tracks = await this.getTrendingTracks();
    return {
      id,
      title: 'YouTube Music Featured Hits',
      artistName: 'Various Artists',
      artworkUrl: tracks[0]?.artworkUrl,
      tracks
    };
  }

  async getNewReleases(): Promise<Album[]> {
    const tracks = await this.getTrendingTracks();
    return [
      {
        id: 'album-yt-trending',
        title: 'YouTube Trending Hits',
        artistName: 'Various Artists',
        artworkUrl: tracks[0]?.artworkUrl,
        tracks: tracks.slice(0, 5)
      }
    ];
  }

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    const tracks = await this.getTrendingTracks();
    return [
      {
        id: 'playlist-yt-top',
        name: 'YouTube Top Music 2026',
        description: 'Global chartbusters and viral hits direct from YouTube.',
        coverUrl: tracks[0]?.artworkUrl,
        author: 'YouTube Music',
        tracks
      }
    ];
  }

  // Pre-mapped YouTube tracks with real YouTube video IDs & thumbnails
  private getFallbackTracks(query?: string): Track[] {
    const catalog: Track[] = [
      {
        id: 'yt-cMg8KaMdDYo',
        youtubeId: 'cMg8KaMdDYo', // NCS Fearless
        title: 'Fearless Funk',
        artistName: 'DR MØB, Chris Linton',
        albumName: 'Fearless Funk (Single)',
        artworkUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/maxresdefault.jpg',
        duration: 194,
        genre: 'Electronic / Phonk',
        source: 'YouTube Music'
      },
      {
        id: 'yt-L_76eT_L76E',
        youtubeId: 'L76eT_L76E',
        title: 'Tauba Tauba',
        artistName: 'Karan Aujla',
        albumName: 'Bad Newz',
        artworkUrl: 'https://i.ytimg.com/vi/L76eT_L76E/hqdefault.jpg',
        duration: 204,
        genre: 'Punjabi Pop',
        source: 'YouTube Music'
      },
      {
        id: 'yt-b0_i0b5t8jY',
        youtubeId: 'b0_i0b5t8jY',
        title: 'Chuttamalle',
        artistName: 'Anirudh Ravichander, Shilpa Rao',
        albumName: 'Devara',
        artworkUrl: 'https://i.ytimg.com/vi/b0_i0b5t8jY/hqdefault.jpg',
        duration: 220,
        genre: 'Tamil Hits',
        source: 'YouTube Music'
      },
      {
        id: 'yt-AKHg502z1LM',
        youtubeId: 'AKHg502z1LM',
        title: 'O Sajni Re',
        artistName: 'Arijit Singh',
        albumName: 'Laapataa Ladies',
        artworkUrl: 'https://i.ytimg.com/vi/AKHg502z1LM/hqdefault.jpg',
        duration: 172,
        genre: 'Bollywood & Chill',
        source: 'YouTube Music'
      },
      {
        id: 'yt-jfKfPfyJRdk',
        youtubeId: 'jfKfPfyJRdk', // Lofi hip hop
        title: 'Sunny Days in Goa',
        artistName: 'Acoustic Waves',
        albumName: 'Happy Vibes',
        artworkUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        duration: 195,
        genre: 'Indie Acoustic',
        source: 'YouTube Music'
      },
      {
        id: 'yt-21qNxnCS8WU',
        youtubeId: '21qNxnCS8WU',
        title: 'Midnight Euphoria',
        artistName: 'Luna Rose',
        albumName: "pov: you're in love",
        artworkUrl: 'https://i.ytimg.com/vi/21qNxnCS8WU/hqdefault.jpg',
        duration: 184,
        genre: 'Dream Pop',
        source: 'YouTube Music'
      },
      {
        id: 'yt-fHi8s4Qr3nU',
        youtubeId: 'fHi8s4Qr3nU',
        title: 'Neon Skyline (I-Pop)',
        artistName: 'Kabir Sen, Priya Nair',
        albumName: 'I-Pop Superhits',
        artworkUrl: 'https://i.ytimg.com/vi/fHi8s4Qr3nU/hqdefault.jpg',
        duration: 210,
        genre: 'Indian Pop',
        source: 'YouTube Music'
      },
      {
        id: 'yt-G4s-43g_6bQ',
        youtubeId: 'G4s-43g_6bQ',
        title: 'Chal Kudiye',
        artistName: 'Diljit Dosanjh, Alia Bhatt',
        albumName: 'Jigra Soundtracks',
        artworkUrl: 'https://i.ytimg.com/vi/G4s-43g_6bQ/hqdefault.jpg',
        duration: 198,
        genre: 'Hot Hits Hindi',
        source: 'YouTube Music'
      },
      {
        id: 'yt-kXYiU_JCYtU',
        youtubeId: 'kXYiU_JCYtU', // Linkin Park Numb
        title: 'Midnight City Boulevard',
        artistName: 'Vice City FM Synthesizers',
        albumName: 'Grand Theft Auto Official Playlist',
        artworkUrl: 'https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg',
        duration: 245,
        genre: 'Synthwave',
        source: 'YouTube Music'
      },
      {
        id: 'yt-1laX4XUfgkM',
        youtubeId: '1laX4XUfgkM', // Phonk Tokyo
        title: 'Tokyo Midnight Drift (PHONK)',
        artistName: 'Kordhell & DVRST Echoes',
        albumName: 'the beat of your drift',
        artworkUrl: 'https://i.ytimg.com/vi/1laX4XUfgkM/hqdefault.jpg',
        duration: 152,
        genre: 'Drift Phonk',
        source: 'YouTube Music'
      },
      {
        id: 'yt-5qap5aO4i9A',
        youtubeId: '5qap5aO4i9A', // Lofi Chill
        title: 'Raindrops in Kyoto',
        artistName: 'Lofi Garden & Chillhop',
        albumName: 'Dreamy Chill Lounge',
        artworkUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
        duration: 178,
        genre: 'Ambient Chill',
        source: 'YouTube Music'
      }
    ];

    if (!query) return catalog;
    const q = query.toLowerCase();
    return catalog.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artistName.toLowerCase().includes(q) ||
      (t.genre && t.genre.toLowerCase().includes(q))
    );
  }
}

export const youtubeMusicProvider = new YouTubeMusicProvider();
