'use client';

import React, { useState } from 'react';
import { ActiveView } from '@/types/music';
import { TopHeader } from './TopHeader';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { BottomPlayerBar } from '../player/BottomPlayerBar';
import { HomeView } from '../views/HomeView';
import { SearchView } from '../views/SearchView';
import { PlaylistView } from '../views/PlaylistView';
import { FavoritesView } from '../views/FavoritesView';
import { HistoryView } from '../views/HistoryView';
import { ArtistView } from '../views/ArtistView';
import { CreatePlaylistModal } from '../playlist/CreatePlaylistModal';

export function MainLayout() {
  const [activeView, setActiveViewState] = useState<ActiveView>({ type: 'home' });
  const [historyStack, setHistoryStack] = useState<ActiveView[]>([{ type: 'home' }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(view);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setActiveViewState(historyStack[prevIdx]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setActiveViewState(historyStack[nextIdx]);
    }
  };

  return (
    <div className="bg-black text-white font-sans antialiased select-none h-screen flex flex-col overflow-hidden">
      {/* Top Header matching Stitch */}
      <TopHeader
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < historyStack.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
      />

      {/* Main Content Area matching Stitch */}
      <div className="flex-1 flex overflow-hidden px-2 pb-2 gap-2">
        {/* Left Sidebar Library */}
        <div className="hidden md:flex flex-shrink-0">
          <LeftSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        {/* Center Main Feed View */}
        <main className="flex-1 bg-spotify-surface rounded-lg overflow-hidden relative flex flex-col">
          {activeView.type === 'home' && <HomeView setActiveView={setActiveView} />}
          {activeView.type === 'search' && (
            <SearchView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}
          {activeView.type === 'favorites' && <FavoritesView />}
          {activeView.type === 'history' && <HistoryView />}
          {activeView.type === 'playlist' && (
            <PlaylistView playlistId={activeView.id} onBack={() => setActiveView({ type: 'home' })} />
          )}
          {activeView.type === 'artist' && (
            <ArtistView artistId={activeView.id} onBack={() => setActiveView({ type: 'home' })} />
          )}
        </main>

        {/* Right Sidebar Now Playing matching Stitch */}
        {isRightSidebarOpen && (
          <div className="hidden lg:flex flex-shrink-0">
            <RightSidebar onClose={() => setIsRightSidebarOpen(false)} />
          </div>
        )}
      </div>

      {/* Bottom Audio Player Bar matching Stitch */}
      <BottomPlayerBar />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal />
    </div>
  );
}
