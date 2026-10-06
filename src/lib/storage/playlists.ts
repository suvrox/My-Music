import { Playlist, Track } from '@/types/music';
import { INITIAL_PLAYLISTS, INITIAL_TRACKS } from '../music/providers/catalog';

const PLAYLISTS_KEY = 'music:playlists:v5';

export function getStoredPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return INITIAL_PLAYLISTS;
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (!raw) {
      // Check legacy keys for user-created custom playlists
      let customUserPlaylists: Playlist[] = [];
      const legacyRaw = localStorage.getItem('music:playlists') || localStorage.getItem('music:playlists:v2');
      if (legacyRaw) {
        try {
          const oldList: Playlist[] = JSON.parse(legacyRaw);
          customUserPlaylists = oldList.filter(p => p.author === 'You' || (!p.id.startsWith('playlist-bollywood') && !p.id.startsWith('playlist-bengali') && !p.id.startsWith('playlist-punjabi') && !p.id.startsWith('playlist-midnight') && !p.id.startsWith('playlist-festival') && !p.id.startsWith('playlist-phonk') && !p.id.startsWith('playlist-global') && !p.id.startsWith('playlist-peace') && !p.id.startsWith('playlist-sky') && !p.id.startsWith('playlist-diffsong') && !p.id.startsWith('playlist-fresh') && !p.id.startsWith('playlist-edm')));
        } catch {}
      }
      const combined = [...INITIAL_PLAYLISTS, ...customUserPlaylists];
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(combined));
      return combined;
    }
    const parsed: Playlist[] = JSON.parse(raw);
    // Ensure official curated playlists always have up-to-date tracks & metadata
    const userCreated = parsed.filter(p => !INITIAL_PLAYLISTS.some(ip => ip.id === p.id));
    return [...INITIAL_PLAYLISTS, ...userCreated];
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
