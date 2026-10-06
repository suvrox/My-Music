import { Track, Artist, Album, Playlist } from '@/types/music';

export interface MusicProvider {
  searchTracks(query: string): Promise<Track[]>;
  getTrack(id: string): Promise<Track | null>;
  getArtist(id: string): Promise<Artist | null>;
  getAlbum(id: string): Promise<Album | null>;
  getTrendingTracks(): Promise<Track[]>;
  getNewReleases(): Promise<Album[]>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
}
