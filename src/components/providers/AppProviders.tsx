'use client';

import React from 'react';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { PlaylistProvider } from '@/context/PlaylistContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <PlaylistProvider>
        <AudioPlayerProvider>
          {children}
        </AudioPlayerProvider>
      </PlaylistProvider>
    </FavoritesProvider>
  );
}
