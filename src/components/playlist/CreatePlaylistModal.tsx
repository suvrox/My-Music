'use client';

import React, { useState } from 'react';
import { usePlaylists } from '@/context/PlaylistContext';

export function CreatePlaylistModal() {
  const { isCreateModalOpen, closeCreateModal, createPlaylist } = usePlaylists();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name.trim(), description.trim());
    setName('');
    setDescription('');
    closeCreateModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-spotify-card border border-zinc-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Create Playlist</h2>
          <button
            onClick={closeCreateModal}
            className="text-spotify-textSubdued hover:text-white transition cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-spotify-textSubdued mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist #1"
              required
              autoFocus
              className="w-full h-10 px-3 rounded bg-spotify-elevated border border-transparent focus:border-white focus:outline-none text-sm text-white placeholder-zinc-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-spotify-textSubdued mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a catchy description..."
              rows={3}
              className="w-full p-3 rounded bg-spotify-elevated border border-transparent focus:border-white focus:outline-none text-xs text-white placeholder-zinc-500 resize-none font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreateModal}
              className="px-4 py-2 rounded-full text-xs font-bold text-spotify-textSubdued hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 rounded-full bg-spotify-green hover:scale-105 active:scale-95 text-xs font-bold text-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
