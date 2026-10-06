'use client';

import React from 'react';
import { ActiveView } from '@/types/music';

interface TopHeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export function TopHeader({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward
}: TopHeaderProps) {
  const isSearchActive = activeView.type === 'search';

  const handleSearchFocus = () => {
    if (activeView.type !== 'search') {
      setActiveView({ type: 'search' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (activeView.type !== 'search') {
      setActiveView({ type: 'search' });
    }
  };

  return (
    <header className="h-[52px] bg-black flex items-center justify-between px-3 gap-2 flex-shrink-0 z-50">
      {/* Left: Window Controls & History Navigation */}
      <div className="flex items-center gap-3 w-[280px]" data-purpose="left-controls">
        {/* Windows Window Dots / Options */}
        <button
          className="text-spotify-textSubdued hover:text-white px-1.5 py-1 text-xs transition cursor-pointer"
          title="More options"
        >
          <i className="fa-solid fa-ellipsis text-sm"></i>
        </button>
        {/* Back / Forward Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full bg-spotify-surface flex items-center justify-center transition cursor-pointer ${
              canGoBack
                ? 'text-spotify-textSubdued hover:text-white hover:bg-spotify-elevated'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full bg-spotify-surface flex items-center justify-center transition cursor-pointer ${
              canGoForward
                ? 'text-spotify-textSubdued hover:text-white hover:bg-spotify-elevated'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Center: Home Button and Search Input Pill */}
      <div className="flex items-center gap-2 flex-1 max-w-[530px]" data-purpose="global-search-container">
        {/* Home Icon Button */}
        <button
          onClick={() => setActiveView({ type: 'home' })}
          className={`w-10 h-10 rounded-full hover:scale-105 active:scale-95 flex items-center justify-center transition flex-shrink-0 cursor-pointer ${
            activeView.type === 'home'
              ? 'bg-spotify-elevated text-white ring-1 ring-white/20'
              : 'bg-spotify-elevated text-spotify-textSubdued hover:text-white'
          }`}
          title="Home"
        >
          <i className="fa-solid fa-house text-base"></i>
        </button>

        {/* Search Input Bar */}
        <div className="flex-1 relative flex items-center group">
          <div className="absolute left-3 text-spotify-textSubdued group-hover:text-white pointer-events-none transition">
            <i className="fa-solid fa-magnifying-glass text-base"></i>
          </div>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-spotify-elevated border-none text-sm text-white placeholder-spotify-textSubdued focus:outline-none focus:ring-2 focus:ring-white hover:bg-spotify-highlight transition font-medium"
            placeholder="What do you want to play?"
            type="text"
          />
          <div className="absolute right-3 flex items-center gap-2 text-spotify-textSubdued border-l border-zinc-700 pl-2.5 my-auto">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-white transition cursor-pointer text-xs mr-1"
                title="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
            <button
              onClick={() => setActiveView({ type: 'search' })}
              className="hover:text-white transition cursor-pointer"
              title="Browse"
            >
              <i className="fa-solid fa-layer-group text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Right: User, Notifications, Window Status */}
      <div className="flex items-center justify-end gap-3 w-[280px]" data-purpose="profile-and-window-actions">
        <button className="text-spotify-textSubdued hover:text-white p-2 text-sm transition cursor-pointer" title="What's New">
          <i className="fa-regular fa-bell"></i>
        </button>
        <button className="text-spotify-textSubdued hover:text-white p-2 text-sm transition cursor-pointer" title="Friend Activity">
          <i className="fa-solid fa-user-group text-xs"></i>
        </button>

        {/* Profile Avatar with Red Ring matching Stitch */}
        <div className="relative cursor-pointer group" title="Account (Guest / No Login Required)">
          <div className="w-8 h-8 rounded-full bg-red-950 p-[2px] flex items-center justify-center border border-red-600/80 overflow-hidden shadow group-hover:scale-105 transition">
            <img
              alt="Avatar"
              className="w-full h-full object-cover rounded-full filter brightness-75 contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHcGIXt9tgnr69pqdGfkaALYlK4ONPxluKhyNToQQZd1J8pzVN8kisKxRMYQLNfwYe07xXejp0YW3GJJ8SeRITPLl7qgHKpy7MR4HxOyXXs_0Gro-CREcEM7GnRCs47A_avqiqh77hKsE9P_8kCMMXDKNP4Z1ob9a89lvYtXI5CMf7ymuDkWCL7PLsPufElYZvTPfVa1AmXv5DECw_zcR1jiE5IEZLx-UUWVRK9DDQtgCwWy6yPML69Q"
            />
          </div>
        </div>

        {/* Native Windows Window Buttons */}
        <div className="flex items-center gap-3.5 ml-2 text-spotify-textSubdued text-xs">
          <button className="hover:text-white cursor-pointer" title="Minimize"><i className="fa-solid fa-minus"></i></button>
          <button className="hover:text-white cursor-pointer" title="Maximize"><i className="fa-regular fa-square"></i></button>
          <button className="hover:text-white cursor-pointer" title="Close"><i className="fa-solid fa-xmark text-sm"></i></button>
        </div>
      </div>
    </header>
  );
}
