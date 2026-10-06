import { MusicProvider } from './types';
import { youtubeMusicProvider } from './providers/youtube';

// Active provider using YouTube Data API with environment-based API key
export const musicProvider: MusicProvider = youtubeMusicProvider;
