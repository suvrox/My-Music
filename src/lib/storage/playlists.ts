import { Playlist, Track } from '@/types/music';
import { INITIAL_PLAYLISTS } from '../music/providers/catalog';

const PLAYLISTS_KEY = 'music:playlists';

export function getStoredPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return INITIAL_PLAYLISTS;
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (!raw) {
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(INITIAL_PLAYLISTS));
      return INITIAL_PLAYLISTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PLAYLISTS;
  }
}

export function saveStoredPlaylists(playlists: Playlist[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  } catch {}
}

export function createStoredPlaylist(name: string, description?: string): Playlist {
  const current = getStoredPlaylists();
  const newPlaylist: Playlist = {
    id: `playlist-${Date.now()}`,
    name,
    description: description || 'Custom user playlist',
    author: 'You',
    tracks: [],
    createdAt: new Date().toISOString()
  };
  const updated = [...current, newPlaylist];
  saveStoredPlaylists(updated);
  return newPlaylist;
}

export function deleteStoredPlaylist(id: string): Playlist[] {
  const current = getStoredPlaylists();
  const updated = current.filter(p => p.id !== id);
  saveStoredPlaylists(updated);
  return updated;
}

export function renameStoredPlaylist(id: string, newName: string): Playlist[] {
  const current = getStoredPlaylists();
  const updated = current.map(p => p.id === id ? { ...p, name: newName } : p);
  saveStoredPlaylists(updated);
  return updated;
}

export function addTrackToStoredPlaylist(playlistId: string, track: Track): Playlist[] {
  const current = getStoredPlaylists();
  const updated = current.map(p => {
    if (p.id === playlistId) {
      if (p.tracks.some(t => t.id === track.id)) return p;
      return { ...p, tracks: [...p.tracks, track] };
    }
    return p;
  });
  saveStoredPlaylists(updated);
  return updated;
}

export function removeTrackFromStoredPlaylist(playlistId: string, trackId: string): Playlist[] {
  const current = getStoredPlaylists();
  const updated = current.map(p => {
    if (p.id === playlistId) {
      return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
    }
    return p;
  });
  saveStoredPlaylists(updated);
  return updated;
}
