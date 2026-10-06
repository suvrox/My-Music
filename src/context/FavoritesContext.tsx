'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Track } from '@/types/music';
import { getStoredFavorites, toggleStoredFavorite } from '@/lib/storage/favorites';

interface FavoritesContextType {
  favorites: Track[];
  isFavorite: (trackId: string) => boolean;
  toggleFavorite: (track: Track) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>([]);

  useEffect(() => {
    setFavorites(getStoredFavorites());
  }, []);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  const toggleFavorite = useCallback((track: Track) => {
    const result = toggleStoredFavorite(track);
    setFavorites(result.favorites);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
