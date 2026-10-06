'use client';

import React, { useState } from 'react';
import { usePlaylists } from '@/context/PlaylistContext';
import { useFavorites } from '@/context/FavoritesContext';
import { ActiveView } from '@/types/music';

interface LeftSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function LeftSidebar({ activeView, setActiveView }: LeftSidebarProps) {
  const { playlists, openCreateModal } = usePlaylists();
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState<'all' | 'playlists' | 'podcasts' | 'albums'>('all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredPlaylists = playlists.filter(p => {
    if (filter === 'podcasts' || filter === 'albums') return false;
    if (!librarySearch) return true;
    return p.name.toLowerCase().includes(librarySearch.toLowerCase());
  });

  return (
    <aside className="w-[340px] bg-spotify-surface rounded-lg flex flex-col flex-shrink-0 overflow-hidden" data-purpose="your-library-panel">
      {/* Library Header */}
      <div className="px-4 py-3 flex items-center justify-between text-spotify-textSubdued">
        <button
          onClick={() => setActiveView({ type: 'home' })}
          className="flex items-center gap-2.5 hover:text-white transition font-bold text-sm cursor-pointer group"
        >
          <img
            src="/logo.webp"
            alt="My Music"
            className="w-5 h-5 rounded-full object-cover group-hover:scale-105 transition"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('favicon.ico')) {
                target.src = '/favicon.ico';
              }
            }}
          />
          <span className="text-white text-base">Your Library</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="w-8 h-8 rounded-full hover:bg-spotify-highlight hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Create playlist or folder"
          >
            <i className="fa-solid fa-plus text-sm"></i>
          </button>
          <button
            onClick={() => setActiveView({ type: 'history' })}
            className="w-8 h-8 rounded-full hover:bg-spotify-highlight hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Listening History / Enlarge"
          >
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-hidden text-xs font-semibold">
        <button
          onClick={() => setFilter(filter === 'playlists' ? 'all' : 'playlists')}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
            filter === 'playlists' ? 'bg-white text-black' : 'bg-spotify-elevated hover:bg-spotify-highlight text-white'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setFilter(filter === 'podcasts' ? 'all' : 'podcasts')}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
            filter === 'podcasts' ? 'bg-white text-black' : 'bg-spotify-elevated hover:bg-spotify-highlight text-white'
          }`}
        >
          Podcasts
        </button>
        <button
          onClick={() => setFilter(filter === 'albums' ? 'all' : 'albums')}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
            filter === 'albums' ? 'bg-white text-black' : 'bg-spotify-elevated hover:bg-spotify-highlight text-white'
          }`}
        >
          Albums
        </button>
        <button
          onClick={() => setFilter('all')}
          className="w-7 h-7 rounded-full bg-spotify-elevated hover:bg-spotify-highlight text-spotify-textSubdued hover:text-white flex items-center justify-center flex-shrink-0 ml-auto cursor-pointer"
          title="Reset filter"
        >
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>

      {/* Search & Sort Row */}
      <div className="px-3 py-1.5 flex items-center justify-between text-spotify-textSubdued text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="w-7 h-7 rounded-full hover:bg-spotify-elevated hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Search in Your Library"
          >
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </button>
          {showSearchInput && (
            <input
              type="text"
              placeholder="Search in Library..."
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              className="h-6 w-36 px-2 text-xs rounded bg-spotify-elevated text-white placeholder-zinc-500 focus:outline-none"
              autoFocus
            />
          )}
        </div>
        <button
          onClick={() => setActiveView({ type: 'history' })}
          className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          title="View Recents"
        >
          <span>Recents</span>
          <i className="fa-solid fa-bars-staggered text-xs"></i>
        </button>
      </div>

      {/* Playlist Items Scrollable List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5" data-purpose="playlist-items-list">
        {/* Liked Songs Entry matching Stitch */}
        <div
          onClick={() => setActiveView({ type: 'favorites' })}
          className={`flex items-center gap-3 p-2 rounded-md hover:bg-spotify-elevated cursor-pointer group transition ${
            activeView.type === 'favorites' ? 'bg-spotify-elevated' : ''
          }`}
        >
          <div className="w-12 h-12 rounded liked-songs-gradient flex items-center justify-center flex-shrink-0 shadow">
            <i className="fa-solid fa-heart text-white text-base"></i>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-sm font-semibold truncate">Liked Songs</span>
            <div className="flex items-center gap-1 text-xs text-spotify-textSubdued">
              <i className="fa-solid fa-thumbtack text-spotify-green text-[10px] rotate-45 mr-0.5"></i>
              <span className="truncate">Playlist • {favorites.length} songs</span>
            </div>
          </div>
        </div>

        {/* Dynamic & Initial Playlists */}
        {filteredPlaylists.map((pl) => {
          const isSelected = activeView.type === 'playlist' && activeView.id === pl.id;
          return (
            <div
              key={pl.id}
              onClick={() => setActiveView({ type: 'playlist', id: pl.id })}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-spotify-elevated cursor-pointer group transition ${
                isSelected ? 'bg-spotify-elevated' : ''
              }`}
            >
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                {pl.coverUrl ? (
                  <img
                    alt={pl.name}
                    className="w-full h-full object-cover"
                    src={pl.coverUrl}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logo.webp';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <i className="fa-solid fa-music text-base"></i>
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-semibold truncate">{pl.name}</span>
                <span className="text-xs text-spotify-textSubdued truncate">
                  Playlist • {pl.author || 'YouTube Music'}
                </span>
              </div>
            </div>
          );
        })}

        {filter === 'podcasts' && (
          <div className="p-4 text-center text-xs text-spotify-textSubdued">
            No podcasts saved yet.
          </div>
        )}
        {filter === 'albums' && (
          <div className="p-4 text-center text-xs text-spotify-textSubdued">
            No albums saved in library.
          </div>
        )}
      </div>
    </aside>
  );
}
