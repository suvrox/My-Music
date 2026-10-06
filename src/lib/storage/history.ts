import { Track } from '@/types/music';

const HISTORY_KEY = 'music:history';
const MAX_HISTORY = 50;

export function getStoredHistory(): Track[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredHistory(tracks: Track[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(tracks.slice(0, MAX_HISTORY)));
  } catch {}
}

export function addTrackToHistory(track: Track): Track[] {
  const current = getStoredHistory();
  const filtered = current.filter(t => t.id !== track.id);
  const updated = [track, ...filtered].slice(0, MAX_HISTORY);
  saveStoredHistory(updated);
  return updated;
}

export function clearStoredHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}
