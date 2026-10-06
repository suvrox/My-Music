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
    <header className="h-[52px] bg-black flex items-center justify-between px-2.5 sm:px-4 gap-2 flex-shrink-0 z-50">
      {/* Left: App Logo & History Navigation */}
      <div className="flex items-center gap-2 md:w-[260px] flex-shrink-0" data-purpose="left-controls">
        {/* My Music App Logo */}
        <button
          onClick={() => setActiveView({ type: 'home' })}
          className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer group flex-shrink-0"
          title="My Music"
        >
          <img
            src="/logo.webp"
            alt="My Music"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover group-hover:scale-105 transition shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('favicon.ico')) {
                target.src = '/favicon.ico';
              }
            }}
          />
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">My Music</span>
        </button>

        {/* Desktop More Options */}
        <button
          className="hidden md:inline-flex text-spotify-textSubdued hover:text-white px-1 py-1 text-xs transition cursor-pointer"
          title="More options"
        >
          <i className="fa-solid fa-ellipsis text-sm"></i>
        </button>

        {/* Back Button (Always accessible if navigation history exists) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-spotify-surface flex items-center justify-center transition cursor-pointer ${
              canGoBack
                ? 'text-spotify-textSubdued hover:text-white hover:bg-spotify-elevated'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[11px] sm:text-xs"></i>
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`hidden md:flex w-8 h-8 rounded-full bg-spotify-surface items-center justify-center transition cursor-pointer ${
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
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 max-w-[530px]" data-purpose="global-search-container">
        {/* Home Icon Button (Desktop only; mobile has bottom nav bar) */}
        <button
          onClick={() => setActiveView({ type: 'home' })}
          className={`hidden md:flex w-10 h-10 rounded-full hover:scale-105 active:scale-95 items-center justify-center transition flex-shrink-0 cursor-pointer ${
            activeView.type === 'home'
              ? 'bg-spotify-elevated text-white ring-1 ring-white/20'
              : 'bg-spotify-elevated text-spotify-textSubdued hover:text-white'
          }`}
          title="Home"
        >
          <i className="fa-solid fa-house text-base"></i>
        </button>

        {/* Search Input Bar */}
        <div className="flex-1 relative flex items-center group min-w-0">
          <div className="absolute left-3 text-spotify-textSubdued group-hover:text-white pointer-events-none transition text-xs sm:text-sm">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-8 sm:pr-10 rounded-full bg-spotify-elevated border-none text-xs sm:text-sm text-white placeholder-spotify-textSubdued focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-white hover:bg-spotify-highlight transition font-medium"
            placeholder="Search songs, artists..."
            type="text"
          />
          {searchQuery && (
            <div className="absolute right-2.5 flex items-center text-spotify-textSubdued my-auto">
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-white transition cursor-pointer text-xs p-1"
                title="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & Quick Actions */}
      <div className="flex items-center justify-end gap-1 sm:gap-2 md:w-[260px] flex-shrink-0" data-purpose="profile-and-window-actions">
        <button
          onClick={() => setActiveView({ type: 'favorites' })}
          className="text-spotify-textSubdued hover:text-spotify-green p-1.5 text-xs sm:text-sm transition cursor-pointer md:hidden"
          title="Liked Songs"
        >
          <i className="fa-solid fa-heart"></i>
        </button>
        <button className="hidden md:inline-flex text-spotify-textSubdued hover:text-white p-2 text-sm transition cursor-pointer" title="What's New">
          <i className="fa-regular fa-bell"></i>
        </button>
        <button className="hidden md:inline-flex text-spotify-textSubdued hover:text-white p-2 text-sm transition cursor-pointer" title="Friend Activity">
          <i className="fa-solid fa-user-group text-xs"></i>
        </button>
      </div>
    </header>
  );
}
