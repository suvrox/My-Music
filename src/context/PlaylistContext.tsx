'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Playlist, Track } from '@/types/music';
import {
  getStoredPlaylists,
  createStoredPlaylist,
  deleteStoredPlaylist,
  renameStoredPlaylist,
  addTrackToStoredPlaylist,
  removeTrackFromStoredPlaylist
} from '@/lib/storage/playlists';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setPlaylists(getStoredPlaylists());
  }, []);

  const createPlaylist = useCallback((name: string, description?: string) => {
    const newP = createStoredPlaylist(name, description);
    setPlaylists(getStoredPlaylists());
    return newP;
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    const updated = deleteStoredPlaylist(id);
    setPlaylists(updated);
  }, []);

  const renamePlaylist = useCallback((id: string, name: string) => {
    const updated = renameStoredPlaylist(id, name);
    setPlaylists(updated);
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    const updated = addTrackToStoredPlaylist(playlistId, track);
    setPlaylists(updated);
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    const updated = removeTrackFromStoredPlaylist(playlistId, trackId);
    setPlaylists(updated);
  }, []);

  const getPlaylistById = useCallback((id: string) => {
    return playlists.find(p => p.id === id);
  }, [playlists]);

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        getPlaylistById,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}
