'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { INITIAL_ARTISTS } from '@/lib/music/providers/catalog';

interface RightSidebarProps {
  onClose?: () => void;
}

export function RightSidebar({ onClose }: RightSidebarProps) {
  const {
    currentTrack,
    isQueueOpen,
    queue,
    currentIndex,
    playTrack,
    removeFromQueue,
    clearQueue,
    recommendations,
    isRecommendationsLoading,
    addToQueue
  } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const activeArtist = currentTrack
    ? INITIAL_ARTISTS.find(a => a.id === currentTrack.artistId || a.name === currentTrack.artistName) || {
        id: 'artist-current',
        name: currentTrack.artistName,
        imageUrl: currentTrack.artworkUrl,
        description: `Popular artist streaming on the platform with verified releases.`,
        monthlyListeners: '1,420,890 monthly listeners',
        verified: true
      }
    : INITIAL_ARTISTS[0];

  const isCurrentFavorite = currentTrack ? isFavorite(currentTrack.id) : false;

  const upNextTrack = queue[currentIndex + 1] || recommendations[0];

  return (
    <aside
      className="w-[320px] bg-spotify-surface rounded-lg flex flex-col flex-shrink-0 overflow-y-auto p-4"
      data-purpose="now-playing-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white hover:underline cursor-pointer truncate pr-2">
          {isQueueOpen ? 'Playback Queue' : (currentTrack ? (currentTrack.albumName || currentTrack.title) : 'Now Playing')}
        </h2>
        <div className="flex items-center gap-3 text-spotify-textSubdued text-sm">
          <button className="hover:text-white cursor-pointer" title="Options">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:text-white cursor-pointer"
              title="Close Panel"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {isQueueOpen ? (
        /* Queue View (PRD Section 20) */
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-spotify-textSubdued uppercase">
              Now Playing
            </span>
            <button
              onClick={clearQueue}
              className="text-xs text-spotify-textSubdued hover:text-white transition cursor-pointer"
            >
              Clear queue
            </button>
          </div>

          {currentTrack && (
            <div className="flex items-center gap-3 p-2 rounded bg-spotify-elevated">
              <img
                src={currentTrack.artworkUrl || 'https://via.placeholder.com/48'}
                alt={currentTrack.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-spotify-green truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-spotify-textSubdued truncate">
                  {currentTrack.artistName}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <span className="text-xs font-semibold text-spotify-textSubdued uppercase mb-2 block">
              Next Up in Queue ({queue.length - currentIndex - 1})
            </span>
            <div className="space-y-1 overflow-y-auto max-h-[220px]">
              {queue.slice(currentIndex + 1).map((track, i) => {
                const actualIndex = currentIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${actualIndex}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-spotify-card transition group"
                  >
                    <div
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <img
                        src={track.artworkUrl || 'https://via.placeholder.com/40'}
                        alt={track.title}
                        className="w-9 h-9 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate group-hover:text-spotify-green">
                          {track.title}
                        </p>
                        <p className="text-[11px] text-spotify-textSubdued truncate">
                          {track.artistName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromQueue(actualIndex)}
                      className="text-spotify-textSubdued hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs"
                      title="Remove from queue"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                );
              })}
              {queue.length - currentIndex - 1 === 0 && (
                <p className="text-xs text-spotify-textSubdued italic p-2 bg-spotify-elevated/50 rounded">
                  No upcoming tracks in queue. The YouTube recommendations below will automatically stream next!
                </p>
              )}
            </div>
          </div>

          {/* YouTube Recommendations Section (Auto-plays Next) */}
          <div className="pt-3 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <i className="fa-brands fa-youtube text-red-500 text-sm"></i>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Recommended Next (YouTube API)
                </span>
              </div>
              {isRecommendationsLoading && (
                <i className="fa-solid fa-circle-notch fa-spin text-xs text-spotify-textSubdued"></i>
              )}
            </div>
            <p className="text-[11px] text-spotify-textSubdued mb-2">
              Similar songs curated from YouTube suggestions. Plays automatically when your queue ends.
            </p>
            <div className="space-y-1.5 overflow-y-auto max-h-[320px]">
              {recommendations.slice(0, 10).map((recTrack) => (
                <div
                  key={recTrack.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-spotify-card transition group bg-spotify-card/40"
                >
                  <div
                    onClick={() => playTrack(recTrack)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative w-9 h-9 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={recTrack.artworkUrl || 'https://via.placeholder.com/40'}
                        alt={recTrack.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <i className="fa-solid fa-play text-white text-[10px]"></i>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-spotify-green">
                        {recTrack.title}
                      </p>
                      <p className="text-[11px] text-spotify-textSubdued truncate">
                        {recTrack.artistName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToQueue(recTrack)}
                    className="text-spotify-textSubdued hover:text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer ml-1"
                    title="Add to queue"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              ))}
              {recommendations.length === 0 && !isRecommendationsLoading && (
                <p className="text-xs text-spotify-textSubdued italic p-2">
                  No suggestions available right now.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : currentTrack ? (
        /* Standard Now Playing & Artist View */
        <>
          {/* Main Song Big Album Artwork */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-2xl bg-zinc-900 border border-zinc-800">
            <img
              alt={currentTrack.title}
              className="w-full h-full object-cover filter brightness-95"
              src={
                currentTrack.artworkUrl ||
                `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
              }
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (currentTrack.youtubeId && !target.src.includes(currentTrack.youtubeId)) {
                  target.src = `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`;
                }
              }}
            />
            {currentTrack.genre && (
              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                {currentTrack.genre}
              </div>
            )}
          </div>

          {/* Track Information & Verified Saved Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col min-w-0 pr-2">
              <h1 className="text-xl font-bold text-white truncate hover:underline cursor-pointer" title={currentTrack.title}>
                {currentTrack.title}
              </h1>
              <p className="text-xs text-spotify-textSubdued truncate hover:underline cursor-pointer font-medium mt-0.5" title={currentTrack.artistName}>
                {currentTrack.artistName}
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack)}
              className="text-spotify-green hover:scale-105 transition flex-shrink-0 cursor-pointer"
              title={isCurrentFavorite ? 'Saved to your Liked Songs' : 'Save to Liked Songs'}
            >
              <i className={`text-lg ${isCurrentFavorite ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued hover:text-white'}`}></i>
            </button>
          </div>

          {/* Up Next Card Preview */}
          {upNextTrack && (
            <div className="bg-spotify-card/80 p-3 rounded-lg mb-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-spotify-textSubdued flex items-center gap-1.5">
                  <i className="fa-brands fa-youtube text-red-500"></i>
                  Next in Queue
                </span>
                <span className="text-[10px] text-spotify-green font-semibold">Autoplay</span>
              </div>
              <div
                onClick={() => playTrack(upNextTrack)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <img
                  src={upNextTrack.artworkUrl || `https://i.ytimg.com/vi/${upNextTrack.youtubeId}/hqdefault.jpg`}
                  alt={upNextTrack.title}
                  className="w-10 h-10 rounded object-cover flex-shrink-0 group-hover:scale-105 transition"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-spotify-green">
                    {upNextTrack.title}
                  </p>
                  <p className="text-[11px] text-spotify-textSubdued truncate">
                    {upNextTrack.artistName}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-spotify-green group-hover:text-black flex items-center justify-center text-white transition flex-shrink-0">
                  <i className="fa-solid fa-play text-[10px] ml-0.5"></i>
                </div>
              </div>
            </div>
          )}

          {/* About The Artist Card */}
          <div
            className="bg-spotify-card rounded-lg overflow-hidden relative group cursor-pointer shadow-lg mb-4 border border-zinc-850"
            data-purpose="artist-bio-card"
          >
            <div className="relative h-36 w-full bg-zinc-800 overflow-hidden">
              <img
                alt={activeArtist.name}
                className="w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition duration-500"
                src={activeArtist.imageUrl || currentTrack.artworkUrl || 'https://via.placeholder.com/300'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-spotify-card via-black/40 to-transparent"></div>
              <div className="absolute top-3 left-3 text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                About the artist
              </div>
            </div>
            <div className="p-3 -mt-4 relative">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base hover:underline">
                  {activeArtist.name}
                </span>
                <i className="fa-solid fa-certificate text-blue-400 text-xs" title="Verified Artist"></i>
              </div>
              <p className="text-xs text-spotify-textSubdued mt-1">
                {activeArtist.monthlyListeners || '1,200,000 monthly listeners'}
              </p>
              <p className="text-xs text-spotify-textSubdued mt-2 line-clamp-3 leading-relaxed">
                {activeArtist.description || 'Verified recording artist with active releases streaming across the platform.'}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Empty State when no track is selected yet */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3.5 my-auto">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shadow-inner">
            <i className="fa-solid fa-headphones-simple text-2xl"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No song playing</h3>
            <p className="text-xs text-spotify-textSubdued leading-relaxed max-w-[210px]">
              Select any track from Trending, Bollywood, or your playlists to view track info, artist bio, and suggestions here.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
