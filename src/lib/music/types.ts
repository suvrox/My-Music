import { Track, Artist, Album, Playlist } from '@/types/music';

export interface MusicProvider {
  searchTracks(query: string): Promise<Track[]>;
  getTrack(id: string): Promise<Track | null>;
  getArtist(id: string): Promise<Artist | null>;
  getPopularArtists?(): Promise<Artist[]>;
  getAlbum(id: string): Promise<Album | null>;
  getTrendingTracks(regionCode?: string): Promise<Track[]>;
  getRecommendations(track: Track): Promise<Track[]>;
  getCategoryTracks(category: string): Promise<Track[]>;
  getNewReleases(): Promise<Album[]>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
}
