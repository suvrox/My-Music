export interface Track {
  id: string;
  title: string;
  artistId?: string;
  artistName: string;
  albumId?: string;
  albumName?: string;
  artworkUrl?: string;
  audioUrl?: string;
  youtubeId?: string;
  duration?: number; // in seconds
  genre?: string;
  source: string;
  releaseDate?: string;
  explicit?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  monthlyListeners?: string;
  verified?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artistName: string;
  artistId?: string;
  artworkUrl?: string;
  releaseDate?: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
  createdAt?: string;
  author?: string;
  pinned?: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';
export type FilterTab = 'all' | 'music' | 'podcasts';
export type ActiveView = 
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'favorites' }
  | { type: 'history' }
  | { type: 'playlist'; id: string }
  | { type: 'artist'; id: string }
  | { type: 'album'; id: string };
