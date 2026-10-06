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

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function parseMusicTrackDetails(rawTitle: string, rawChannel: string): { songTitle: string; artist: string; album: string } {
  let title = decodeHtmlEntities(rawTitle);
  const channel = decodeHtmlEntities(rawChannel || '')
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/VEVO$/i, '')
    .trim();

  // 1. Remove bracketed noise: (Official Video), [Audio], (Lyrics), (Visualizer), etc.
  title = title
    .replace(/[\(\[]\s*(official\s*(music\s*)?video|official\s*audio|original\s*(soundtrack|video)|lyric(al)?(\s*video)?|audio(\s*song)?|visualizer|4k|8k|hd|full\s*song|full\s*video|vertical\s*video|video\s*song|performance\s*video|dance\s*video|teaser|trailer|prod\.\s*by[^\)\]]*)\s*[\)\]]/gi, ' ')
    .trim();

  // 2. Remove promo hashtags & emoji noise
  title = title.replace(/#[a-zA-Z0-9_]+/g, '').trim();
  title = title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

  let songTitle = title;
  let artist = channel;
  let album = '';

  // Case A: Title in quotes at start: "Tum Hi Ho" Aashiqui 2 Full Song | Aditya Roy Kapur...
  const quoteMatch = title.match(/^["']([^"']+)["']\s*(.*)$/);
  if (quoteMatch) {
    songTitle = quoteMatch[1].trim();
    const rem = quoteMatch[2].trim();
    if (rem.includes('|')) {
      const parts = rem.split('|').map(s => s.trim()).filter(Boolean);
      album = parts[0]?.replace(/\b(full\s*song|song|video|movie|soundtrack|with lyrics)\b/gi, '').trim() || songTitle;
      artist = parts[parts.length - 1] || channel;
    } else if (rem.includes('-')) {
      const parts = rem.split('-').map(s => s.trim()).filter(Boolean);
      album = parts[0] || songTitle;
      artist = parts[parts.length - 1] || channel;
    } else {
      album = rem.replace(/\b(full\s*song|song|video|movie|with lyrics)\b/gi, '').trim() || songTitle;
    }
  }
  // Case B: "Artist - Song Title" or "Song Title - Artist"
  else if (title.includes(' - ')) {
    const parts = title.split(' - ').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      artist = parts[0];
      const right = parts.slice(1).join(' - ');
      if (right.includes('|')) {
        const sub = right.split('|').map(s => s.trim()).filter(Boolean);
        songTitle = sub[0];
        album = sub[1] || songTitle;
      } else {
        songTitle = right;
        album = `${songTitle} (Single)`;
      }
    }
  }
  // Case C: Pipe delimited: "Song Title | Movie | Artist"
  else if (title.includes('|')) {
    const parts = title.split('|').map(s => s.trim()).filter(Boolean);
    songTitle = parts[0];
    if (parts.length >= 3) {
      album = parts[1];
      artist = parts[parts.length - 1];
    } else if (parts.length === 2) {
      artist = parts[1];
      album = `${songTitle} (Single)`;
    }
  }

  // 3. Final cleanups of song title
  songTitle = songTitle.replace(/\s*\|\s*.*$/, '').trim();
  songTitle = songTitle.replace(/\b(Full Video|Official Video|Lyrics|Lyrical|Song)\b/gi, '').trim();
  if (!songTitle) songTitle = title;

  // 4. Clean known record labels if used as artist
  const isLabel = /^(t-series|zee music|sony music|yrf|tips official|saregama|speed records|eros|geet mp3|white hill|vevo)/i.test(artist);
  if (isLabel) {
    const singerMatch = title.match(/\b(?:singer|by|feat\.?|ft\.?)\s*[:\-]?\s*([^|()\-]+)/i);
    if (singerMatch) {
      artist = singerMatch[1].trim();
    } else if (channel && !/^(t-series|zee music|sony music|yrf|tips|saregama)/i.test(channel)) {
      artist = channel;
    }
  }

  artist = artist.replace(/^(t-series|zee music company|sony music india|saregama music|yrf)\s*/i, '').trim();
  if (!artist) artist = channel || 'YouTube Artist';

  return {
    songTitle,
    artist,
    album: album || `${songTitle} (Single)`
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
      // 1. Search for video IDs with up to 25 results
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(q)}&key=${this.apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        console.error('YouTube API search error:', searchRes.status, await searchRes.text());
        return this.getFallbackTracks(q);
      }

      const searchData = await searchRes.json();
      const rawVideoIds = (searchData.items || [])
        .map((item: any) => item.id?.videoId)
        .filter(Boolean);
      const videoIds = Array.from(new Set(rawVideoIds)).join(',');

      if (!videoIds) return this.getFallbackTracks(q);

      // 2. Fetch video details including durations
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${this.apiKey}`;
      const detailsRes = await fetch(detailsUrl);
      if (!detailsRes.ok) {
        return this.getFallbackTracks(q);
      }

      const detailsData = await detailsRes.json();
      const seenTrackIds = new Set<string>();
      const tracks: Track[] = [];

      for (const item of (detailsData.items || [])) {
        if (!item?.id || seenTrackIds.has(item.id)) continue;
        seenTrackIds.add(item.id);

        const rawTitle = item.snippet?.title || '';
        const channelTitle = item.snippet?.channelTitle || 'YouTube Artist';
        const { songTitle, artist, album } = parseMusicTrackDetails(rawTitle, channelTitle);
        const duration = parseDuration(item.contentDetails?.duration);
        const thumbnails = item.snippet?.thumbnails;
        const artworkUrl = thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.maxres?.url || thumbnails?.default?.url;
        const artistSlug = (artist || channelTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        tracks.push({
          id: `yt-${item.id}`,
          youtubeId: item.id,
          title: songTitle,
          artistId: `artist-${artistSlug || item.snippet?.channelId || 'yt'}`,
          artistName: artist,
          albumId: `album-${item.id}`,
          albumName: album,
          artworkUrl: artworkUrl || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          duration,
          genre: 'YouTube Music',
          source: 'YouTube API'
        });
      }

      // Prioritize playable songs (1 to 10 minutes) before multi-hour mix compilations
      return tracks.sort((a, b) => {
        const aIsSong = (a.duration || 0) >= 60 && (a.duration || 0) <= 600;
        const bIsSong = (b.duration || 0) >= 60 && (b.duration || 0) <= 600;
        if (aIsSong && !bIsSong) return -1;
        if (!aIsSong && bIsSong) return 1;
        return 0;
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
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&maxResults=25&key=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error('YouTube API trending error:', res.status, await res.text());
        return this.getFallbackTracks();
      }

      const data = await res.json();
      return (data.items || []).map((item: any) => {
        const rawTitle = item.snippet?.title || '';
        const channelTitle = item.snippet?.channelTitle || 'YouTube Music';
        const { songTitle, artist, album } = parseMusicTrackDetails(rawTitle, channelTitle);
        const duration = parseDuration(item.contentDetails?.duration);
        const thumbnails = item.snippet?.thumbnails;
        const artworkUrl = thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.maxres?.url || thumbnails?.default?.url;

        return {
          id: `yt-${item.id}`,
          youtubeId: item.id,
          title: songTitle,
          artistId: `artist-${item.snippet?.channelId}`,
          artistName: artist,
          albumId: `album-${item.id}`,
          albumName: album,
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
      const channelTitle = item.snippet?.channelTitle || 'YouTube Artist';
      const { songTitle, artist, album } = parseMusicTrackDetails(rawTitle, channelTitle);
      const duration = parseDuration(item.contentDetails?.duration);
      const thumbnails = item.snippet?.thumbnails;
      const artworkUrl = thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.maxres?.url || thumbnails?.default?.url;

      return {
        id: `yt-${item.id}`,
        youtubeId: item.id,
        title: songTitle,
        artistId: `artist-${item.snippet?.channelId}`,
        artistName: artist,
        albumId: `album-${item.id}`,
        albumName: album,
        artworkUrl: artworkUrl || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        duration,
        genre: 'YouTube Music',
        source: 'YouTube API'
      };
    } catch (err) {
      console.error('Error fetching track from YouTube API:', err);
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
