import { RepeatMode } from '@/types/music';

const SETTINGS_KEY = 'music:settings';

export interface PlayerSettings {
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
}

const DEFAULT_SETTINGS: PlayerSettings = {
  volume: 0.75, // 75% matching Stitch UI
  shuffle: false,
  repeat: 'off'
};

export function getStoredSettings(): PlayerSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: Partial<PlayerSettings>): PlayerSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const current = getStoredSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
