import { Track } from '@/types/music';

const FAVORITES_KEY = 'music:favorites';

export function getStoredFavorites(): Track[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredFavorites(tracks: Track[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(tracks));
  } catch {}
}

export function toggleStoredFavorite(track: Track): { favorites: Track[]; isFavorite: boolean } {
  const current = getStoredFavorites();
  const exists = current.some(t => t.id === track.id);
  const updated = exists ? current.filter(t => t.id !== track.id) : [track, ...current];
  saveStoredFavorites(updated);
  return { favorites: updated, isFavorite: !exists };
}

export function isStoredFavorite(trackId: string): boolean {
  return getStoredFavorites().some(t => t.id === trackId);
}
