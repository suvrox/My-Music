import { Track, Artist, Album, Playlist } from '@/types/music';
import { MusicProvider } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'yt-cMg8KaMdDYo',
    youtubeId: 'cMg8KaMdDYo',
    title: 'Fearless Funk',
    artistId: 'artist-dr-mob',
    artistName: 'DR MØB, Chris Linton',
    albumId: 'album-ncs-release',
    albumName: 'Fearless Funk (Single)',
    artworkUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/hqdefault.jpg',
    duration: 138,
    genre: 'Electronic / Phonk',
    source: 'YouTube Music'
  },
  {
    id: 'yt-BBrQWOuE_pg',
    youtubeId: 'BBrQWOuE_pg',
    title: 'Tauba Tauba',
    artistId: 'artist-karan-aujla',
    artistName: 'Karan Aujla',
    albumId: 'album-bad-newz',
    albumName: 'Bad Newz',
    artworkUrl: 'https://i.ytimg.com/vi/BBrQWOuE_pg/hqdefault.jpg',
    duration: 204,
    genre: 'Punjabi Pop',
    source: 'YouTube Music'
  },
  {
    id: 'yt-9jY8PItvMxo',
    youtubeId: '9jY8PItvMxo',
    title: 'Chuttamalle',
    artistId: 'artist-anirudh',
    artistName: 'Anirudh Ravichander, Shilpa Rao',
    albumId: 'album-devara',
    albumName: 'Devara Part 1',
    artworkUrl: 'https://i.ytimg.com/vi/9jY8PItvMxo/hqdefault.jpg',
    duration: 220,
    genre: 'Tamil Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt-k3g_WjLCsXM',
    youtubeId: 'k3g_WjLCsXM',
    title: 'O Sajni Re',
    artistId: 'artist-arijit-singh',
    artistName: 'Arijit Singh, Ram Sampath',
    albumId: 'album-laapataa-ladies',
    albumName: 'Laapataa Ladies',
    artworkUrl: 'https://i.ytimg.com/vi/k3g_WjLCsXM/hqdefault.jpg',
    duration: 172,
    genre: 'Bollywood & Chill',
    source: 'YouTube Music'
  },
  {
    id: 'yt-jfKfPfyJRdk',
    youtubeId: 'jfKfPfyJRdk',
    title: 'Sunny Days in Goa',
    artistId: 'artist-chill-groove',
    artistName: 'Acoustic Waves',
    albumId: 'album-happy-vibes',
    albumName: 'Happy Vibes Vol. 1',
    artworkUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 195,
    genre: 'Indie Acoustic',
    source: 'YouTube Music'
  },
  {
    id: 'yt-GxldQ9eX2wo',
    youtubeId: 'GxldQ9eX2wo',
    title: 'Until I Found You',
    artistId: 'artist-stephen-sanchez',
    artistName: 'Stephen Sanchez',
    albumId: 'album-pov-in-love',
    albumName: "pov: you're in love",
    artworkUrl: 'https://i.ytimg.com/vi/GxldQ9eX2wo/hqdefault.jpg',
    duration: 177,
    genre: 'Romance',
    source: 'YouTube Music'
  },
  {
    id: 'yt-73vZDNKa_Wg',
    youtubeId: '73vZDNKa_Wg',
    title: 'Maan Meri Jaan',
    artistId: 'artist-king',
    artistName: 'King',
    albumId: 'album-ipop-hits',
    albumName: 'Champagne Talk',
    artworkUrl: 'https://i.ytimg.com/vi/73vZDNKa_Wg/hqdefault.jpg',
    duration: 194,
    genre: 'Indian Pop',
    source: 'YouTube Music'
  },
  {
    id: 'yt-fnyd1hGyJIY',
    youtubeId: 'fnyd1hGyJIY',
    title: 'Chal Kudiye',
    artistId: 'artist-diljit-dosanjh',
    artistName: 'Diljit Dosanjh, Alia Bhatt',
    albumId: 'album-jigra',
    albumName: 'Jigra Soundtracks',
    artworkUrl: 'https://i.ytimg.com/vi/fnyd1hGyJIY/hqdefault.jpg',
    duration: 198,
    genre: 'Hindi Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt-cl0a3i2wFcc',
    youtubeId: 'cl0a3i2wFcc',
    title: 'Born To Shine',
    artistId: 'artist-diljit-dosanjh',
    artistName: 'Diljit Dosanjh',
    albumId: 'album-goat',
    albumName: 'G.O.A.T.',
    artworkUrl: 'https://i.ytimg.com/vi/cl0a3i2wFcc/hqdefault.jpg',
    duration: 214,
    genre: 'Punjabi Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt--w54aVt1JsY',
    youtubeId: '-w54aVt1JsY',
    title: 'Tokyo Midnight Drift',
    artistId: 'artist-phonk-master',
    artistName: 'Kordhell & DVRST Echoes',
    albumId: 'album-phonk-drift',
    albumName: 'the beat of your drift (PHONK)',
    artworkUrl: 'https://i.ytimg.com/vi/-w54aVt1JsY/hqdefault.jpg',
    duration: 152,
    genre: 'Drift Phonk',
    source: 'YouTube Music'
  },
  {
    id: 'yt-1-xGerv5FOk',
    youtubeId: '1-xGerv5FOk',
    title: 'Close Eyes',
    artistId: 'artist-dvrst',
    artistName: 'DVRST',
    albumId: 'album-close-eyes',
    albumName: 'Close Eyes (Single)',
    artworkUrl: 'https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg',
    duration: 132,
    genre: 'Drift Phonk',
    source: 'YouTube Music'
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-dr-mob',
    name: 'DR MØB',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7E5tMyhe2b5EaYOK4lJh2KRCtgQ_jKH3_O5K2E3CdMFvOlKbz3xMOrYIdBwP8Ark7XnDpT4o0VK-zWhQcFXXRmVLeGKocdo99aPU7xVvXUUSG3s6QxYWtzq3bRt7CPCzXdEid390YrGTZNkkaibp1RU2nCPyomMma8d-CpftdKjCpsRz3maoRMv0fDiYm1YIiihM3f1hkyi_0oOox5nw5wCGsbu2kcevSgV8d_6rrr1vWuo17-u-rQ',
    description: 'Multi-genre producer combining dark cyber-bass textures, Phonk grooves, and high-energy electronic soundscapes.',
    monthlyListeners: '124,592 monthly listeners',
    verified: true
  },
  {
    id: 'artist-arijit-singh',
    name: 'Arijit Singh',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3s5P-n1HV1lUeyy5iu8h2YK3GH-QQ5P6tA_WA2dnJvjnpQ2YZzMY7iVkRl_f4y7u4TGuYSOrMloPr9qammRZgLlZarXkLOOSgARa_hHaP-d2KXY-pqd-DgUGfFdcJd_8-8x-GYodSgZNTqFVjZNuxJkT_nZyUfK8xusdYJ3YMXUwIqLTb-kx_5rxhe6uV_eyVdRC0xvaIntkEcuHxNKNPc1B93aASa2BPHDDV50TA4-Q8mNd-BqwHWw',
    description: 'India’s most streamed playback singer and composer, celebrated for romantic and soulful melodies.',
    monthlyListeners: '38,914,020 monthly listeners',
    verified: true
  },
  {
    id: 'artist-karan-aujla',
    name: 'Karan Aujla',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ITEgoYGl_SE8l9wuE-_CnGrrPSWoiZl0T-HX5KpmYdBCuuqwX7-Yk_h3iGIr0zqhBcWE-UbBgZp0LnkgCJV8Is137HhD5bi7Vndfgmuee9HoFTANyGQ_T-lV3DuciOu6g58BwVKCqOgEZhhcSO61NQwWSQmpFpnVc3kR9Q_cBpPlBE6_FVYjCQU3OuXH3o3EG2gSUYDYxpDS0NBKgQRUSp6Qh5LpRUVD7rrdu0JzCjtBFCJr55yRA',
    description: 'Global Punjabi singer-songwriter redefining modern desi hip hop and dancefloor anthems.',
    monthlyListeners: '14,820,119 monthly listeners',
    verified: true
  },
  {
    id: 'artist-anirudh',
    name: 'Anirudh Ravichander',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzoXdIy5kfJYX_DilbwKkzBdT5QMCYwB3-RBVcNsTFcB7t9mpgW0iXB9sqq-EvBpNy4ZRqqf0rTcd39GIsLdYZOmVLOgAmVCyhL67c_8Z-Sys1iqHypd4BVH_UJxidnDfLuOgi18aSZvTwcdA4s99deQda3QjY3nRDGXF2c9bIxRAiadSdQZUh5PV-Dg7WS_SxYTNKx75eUYUxNmFecFf2AYjd_RB7Dwbo4-Q_Rv04XjHp60mNzzlH0A',
    description: 'Renowned Indian film composer known for high-octane background scores and viral chartbusters.',
    monthlyListeners: '22,431,900 monthly listeners',
    verified: true
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-sky-limit',
    name: 'Sky is the limit 📈',
    description: 'High energy beats, motivational anthems, and relentless drive.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOmQRIS8f3CS7eq3-ImvLihnpYXCuK4XFtSQaKbHJqpVuEXbiLOZKmF6CPSG-zLsfTvR6wib5bOzDbvfFyN2FgQxLEL4xQ3p9JgWh3eYkbLEwYy0lcJmS-OtS_b_bICeOBzAckeSTfIN82slGKPJh0JFltPB0MUs5bV78cerqpuKYyRNyULvyruUfqUzDvvZDUbI3KiIfAYZwd-rXwI9LhANOZei1IrGhoUfDDVIc3Dxhoy3RkJtOAVA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[8], INITIAL_TRACKS[9]]
  },
  {
    id: 'playlist-diffsong2',
    name: 'Diffsong2',
    description: 'Eclectic electronic cuts, indie melodies, and fresh discoveries.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCrrkIsO7PhuNhCQSglSzTl9Y6b6wyGC7Ru3DbJviiQQyy0fZsAy6_ohyfpXvd9K6NnEvYRvOrg1YGkyVtPwqcZsxNqSPWK0WZuyxg1GE-JcUppejk2hxpZSQG9EhUio0zARB6vVH1AW7PREWersKcNX-oUGQkUpqNk0qkeIntajuO4a7w4vM3psuPumnxQOQilDxyA2a4KA1tSF1YOw60cSlKZu0yO2ET0Rv19R3Q9wWH_ijLrlE0w',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[4], INITIAL_TRACKS[5], INITIAL_TRACKS[6]]
  },
  {
    id: 'playlist-bengali-songs',
    name: 'Bengali songs 🎵',
    description: 'Timeless melodies, Rabindra Sangeet, and contemporary Bangla hits.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0nwddKHCIdgGbgXSUBLSW19mAPIrcuYRnuC-ZSTYso9Lh6a7xe9Glm-PaHVTdSoIBoiVDSjdw0cEnMkFFNmQi9pJ-_t705z9ftMAA1JNHtLyenKove5xPjrmXUr-ek3pO7M1BVjOEAVigoGZ3sLkmVa3nU57nTv3M9hW_7xM8mM9GT2Of7zzFxDjNeiZIpFwJlTQtMYnvkctKQvxfENd_q5DWfXNwY0qtahkccrcSvvL1qYXvfLxoKQ',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[3], INITIAL_TRACKS[7], INITIAL_TRACKS[10]]
  },
  {
    id: 'playlist-fresh-bengali',
    name: 'Fresh bengali',
    description: 'Newest releases and vibrant beats from Kolkata and Dhaka.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8hXfAzQFPyxyinbqcC8K3pv5SLuK1HNKACKEMZu9AprpYG6-gYIyF0wno1ZewRK0tsW5tyu5Sk44k2BSt2S3RI7LGoXvPVxUWxhQkdInFcXspfU9oAVexI8HdTegXe9kHxL8d9dlaDmt3nGd4I_i3fsXV1hiFq_8DF1mKLHwIhm10y5dDowmO4HTBGHWRGvUEnNAwQRcoZmZrpixRA8zRWRsRJrhNG9TuZQo86mX5UhaDZ-zMHrSsZA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[1], INITIAL_TRACKS[3]]
  },
  {
    id: 'playlist-peace-of-mind',
    name: 'Peace of mind',
    description: 'Calm acoustic instruments, ambient strings, and mindful meditation.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDreGk7wvWOh72L6iEDdeeKBXvjjCSqqCa5v2WHwnT3mFXF98dc1X6U0l_qEeD6USzNrq3OurrnBib5S_p_CRAg0A96R9GDTQdxYgJIrw_P4zt8_Z0GhRt2wSVz00fQQwe5vHjUZrLfhvCygkAsCUD3gtaqygG5KCvrQ9FJUcsIR52inFaHPWBYbMKC9riYc-NT0HgKOQdT0j8RaYv6KLd0vF6Gz4AqqIumlXH2OCyEB85BVxPSBtmTVA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[4], INITIAL_TRACKS[10]]
  },
  {
    id: 'playlist-edm',
    name: 'EDM',
    description: 'Festival bass drops, house anthems, and euphoric dance beats.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpywiZIg-rc2TPlZxWCiCydIPpj_66RHQEzSfY0Dz3LQhAPN5dnYvTh-6QDLbgHdIIIXzWp62q5pMGngPN-QsBnJKWFkBYrn9BuMl_gGrHn9EA5o-xtD06JWE-dWeHY8piv6adGk4NSvpwJd4aocWY3EcDYk540Zl4VVO2r0i9aXoYNYae6XUhdqvXdZ-imK4WVyxvYRKQfsmUCcLXGuSMdjmGkSEQJ8yRNltpVi_P2JlRmNX2uMGTDA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[8], INITIAL_TRACKS[9]]
  }
];

export class CatalogMusicProvider implements MusicProvider {
  async searchTracks(query: string): Promise<Track[]> {
    const q = query.toLowerCase().trim();
    if (!q) return INITIAL_TRACKS;

    // Search local preloaded catalog first
    const localMatches = INITIAL_TRACKS.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.artistName.toLowerCase().includes(q) || 
      (t.genre && t.genre.toLowerCase().includes(q))
    );

    // Also query iTunes Legal Preview Search API for vast legal library search
    try {
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
      if (itunesRes.ok) {
        const data = await itunesRes.json();
        if (data.results && Array.isArray(data.results)) {
          const remoteTracks: Track[] = data.results
            .filter((item: any) => item.previewUrl)
            .map((item: any) => ({
              id: `itunes-${item.trackId}`,
              title: item.trackName,
              artistId: `artist-${item.artistId}`,
              artistName: item.artistName,
              albumId: `album-${item.collectionId}`,
              albumName: item.collectionName,
              artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : undefined,
              audioUrl: item.previewUrl,
              duration: Math.round((item.trackTimeMillis || 30000) / 1000),
              genre: item.primaryGenreName,
              source: 'Legal Preview Stream',
              releaseDate: item.releaseDate
            }));

          // Merge unique tracks
          const seen = new Set(localMatches.map(m => m.id));
          for (const rt of remoteTracks) {
            if (!seen.has(rt.id)) {
              localMatches.push(rt);
            }
          }
        }
      }
    } catch {
      // Gracefully return local matches if network query fails
    }

    return localMatches;
  }

  async getTrack(id: string): Promise<Track | null> {
    const found = INITIAL_TRACKS.find(t => t.id === id);
    if (found) return found;

    // If it's an itunes track ID
    if (id.startsWith('itunes-')) {
      const itunesId = id.replace('itunes-', '');
      try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}&entity=song`);
        if (res.ok) {
          const data = await res.json();
          const item = data.results?.[0];
          if (item && item.previewUrl) {
            return {
              id,
              title: item.trackName,
              artistId: `artist-${item.artistId}`,
              artistName: item.artistName,
              albumId: `album-${item.collectionId}`,
              albumName: item.collectionName,
              artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : undefined,
              audioUrl: item.previewUrl,
              duration: Math.round((item.trackTimeMillis || 30000) / 1000),
              genre: item.primaryGenreName,
              source: 'Legal Preview Stream'
            };
          }
        }
      } catch {}
    }

    return null;
  }

  async getArtist(id: string): Promise<Artist | null> {
    const found = INITIAL_ARTISTS.find(a => a.id === id);
    return found || null;
  }

  async getAlbum(id: string): Promise<Album | null> {
    const tracks = INITIAL_TRACKS.filter(t => t.albumId === id);
    if (tracks.length > 0) {
      return {
        id,
        title: tracks[0].albumName || 'Album',
        artistName: tracks[0].artistName,
        artistId: tracks[0].artistId,
        artworkUrl: tracks[0].artworkUrl,
        tracks
      };
    }
    return null;
  }

  async getTrendingTracks(): Promise<Track[]> {
    return INITIAL_TRACKS;
  }

  async getNewReleases(): Promise<Album[]> {
    return [
      {
        id: 'album-ncs-release',
        title: 'Fearless Funk (Single)',
        artistName: 'DR MØB, Chris Linton',
        artworkUrl: INITIAL_TRACKS[0].artworkUrl,
        tracks: [INITIAL_TRACKS[0]]
      },
      {
        id: 'album-bad-newz',
        title: 'Bad Newz',
        artistName: 'Karan Aujla',
        artworkUrl: INITIAL_TRACKS[1].artworkUrl,
        tracks: [INITIAL_TRACKS[1]]
      }
    ];
  }

  async getRecommendations(track: Track): Promise<Track[]> {
    return INITIAL_TRACKS.filter(t => t.id !== track.id).slice(0, 10);
  }

  async getCategoryTracks(category: string): Promise<Track[]> {
    const q = category.toLowerCase();
    const matches = INITIAL_TRACKS.filter(t => (t.genre && t.genre.toLowerCase().includes(q)) || t.title.toLowerCase().includes(q));
    return matches.length > 0 ? matches : INITIAL_TRACKS;
  }

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    return INITIAL_PLAYLISTS;
  }
}

export const defaultMusicProvider = new CatalogMusicProvider();
