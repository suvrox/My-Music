import { MusicProvider } from './types';
import { defaultMusicProvider } from './providers/catalog';

// Central provider export allowing zero-friction swapping of providers
export const musicProvider: MusicProvider = defaultMusicProvider;
