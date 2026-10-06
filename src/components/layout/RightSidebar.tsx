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
    clearQueue
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

  return (
    <aside
      className="w-[320px] bg-spotify-surface rounded-lg flex flex-col flex-shrink-0 overflow-y-auto p-4"
      data-purpose="now-playing-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white hover:underline cursor-pointer truncate pr-2">
          {isQueueOpen ? 'Playback Queue' : (currentTrack?.albumName || 'Sky is the limit 📈')}
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
              Next Up ({queue.length - currentIndex - 1})
            </span>
            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
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
                <p className="text-xs text-spotify-textSubdued italic p-2">
                  No upcoming tracks in queue. Add more songs to continue listening!
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Now Playing & Artist View matching Stitch */
        <>
          {/* Main Song Big Album Artwork */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-2xl bg-black">
            <img
              alt={currentTrack?.title || 'Fearless Funk'}
              className="w-full h-full object-cover filter contrast-150 brightness-75"
              src={
                currentTrack?.artworkUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA5-A5tvDVNA1zUz-P2fNxAW00Db5ym3CfrOJFQk-k2P77vTWqQjvEKAKGvywh3CHuCVi1INiU6cjJSpAx91bBTR7RLLNO6MO9Y5XVDzegiCf3TViS5VLvs5-CQAt1HkSz0btc1w6du8wzdewpqOpnkX8fJxL-ehZh-bIhAt-EVDpBVRKyEt-LFtKPb_W45DfYMBoFgjFDKWIL2DlQ0d8O7mSBiiePUCyRzx6qXsIjVLnk98ger4Rha7A'
              }
            />
            {/* NCS Style demonic silhouette overlay simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/30 to-black/80 flex flex-col justify-between p-3 pointer-events-none">
              <span className="text-red-500 font-extrabold tracking-widest text-xs">
                {currentTrack?.genre?.includes('Phonk') || currentTrack?.genre?.includes('Electronic') ? 'NCS' : 'FEATURED'}
              </span>
              <div className="self-center mb-6">
                <i className="fa-solid fa-person-burst text-4xl text-red-500/80"></i>
              </div>
            </div>
          </div>

          {/* Track Information & Verified Saved Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col min-w-0 pr-2">
              <h1 className="text-xl font-bold text-white truncate hover:underline cursor-pointer">
                {currentTrack?.title || 'Fearless Funk'}
              </h1>
              <p className="text-xs text-spotify-textSubdued truncate hover:underline cursor-pointer font-medium mt-0.5">
                {currentTrack?.artistName || 'DR MØB, Chris Linton'}
              </p>
            </div>
            <button
              onClick={() => currentTrack && toggleFavorite(currentTrack)}
              className="text-spotify-green hover:scale-105 transition flex-shrink-0 cursor-pointer"
              title={isCurrentFavorite ? 'Saved to your Liked Songs' : 'Save to Liked Songs'}
            >
              <i className={`text-lg ${isCurrentFavorite ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued hover:text-white'}`}></i>
            </button>
          </div>

          {/* About The Artist Card */}
          <div
            className="bg-spotify-card rounded-lg overflow-hidden relative group cursor-pointer shadow-lg mb-4"
            data-purpose="artist-bio-card"
          >
            <div className="relative h-44 w-full bg-zinc-800 overflow-hidden">
              <img
                alt={activeArtist.name}
                className="w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition duration-500"
                src={
                  activeArtist.imageUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7E5tMyhe2b5EaYOK4lJh2KRCtgQ_jKH3_O5K2E3CdMFvOlKbz3xMOrYIdBwP8Ark7XnDpT4o0VK-zWhQcFXXRmVLeGKocdo99aPU7xVvXUUSG3s6QxYWtzq3bRt7CPCzXdEid390YrGTZNkkaibp1RU2nCPyomMma8d-CpftdKjCpsRz3maoRMv0fDiYm1YIiihM3f1hkyi_0oOox5nw5wCGsbu2kcevSgV8d_6rrr1vWuo17-u-rQ'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-spotify-card via-black/40 to-transparent"></div>
              <div className="absolute top-3 left-3 text-xs font-bold text-white uppercase tracking-wider drop-shadow">
                About the artist
              </div>
            </div>
            <div className="p-3 -mt-6 relative">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base hover:underline">
                  {activeArtist.name}
                </span>
                <i className="fa-solid fa-certificate text-blue-400 text-xs" title="Verified Artist"></i>
              </div>
              <p className="text-xs text-spotify-textSubdued mt-1">
                {activeArtist.monthlyListeners || '124,592 monthly listeners'}
              </p>
              <p className="text-xs text-spotify-textSubdued mt-2 line-clamp-3 leading-relaxed">
                {activeArtist.description ||
                  'Multi-genre producer combining dark cyber-bass textures, Phonk grooves, and high-energy electronic soundscapes.'}
              </p>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
