'use client';

import React from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { formatTime } from '@/lib/utils';
import { Track } from '@/types/music';

export function FavoritesView() {
  const { favorites, toggleFavorite } = useFavorites();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      if (currentTrack?.id === favorites[0].id) {
        togglePlay();
      } else {
        playTrack(favorites[0], favorites);
      }
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, favorites);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header Banner matching Stitch Liked Songs */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#450af5]/70 to-spotify-surface flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pt-6 sm:pt-12 pb-4 sm:pb-6 text-center sm:text-left">
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg liked-songs-gradient shadow-2xl flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-heart text-white text-4xl sm:text-6xl shadow"></i>
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 w-full sm:w-auto">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Playlist</span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight truncate">
            Liked Songs
          </h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/90 font-medium mt-1 sm:mt-2">
            <span className="font-bold">Suvradip Maity</span>
            <span>•</span>
            <span>{favorites.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-6 bg-spotify-surface">
        <button
          onClick={handlePlayAll}
          disabled={favorites.length === 0}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer ${
            favorites.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Play All"
        >
          <i className={`fa-solid ${isPlaying && favorites.some(t => t.id === currentTrack?.id) ? 'fa-pause' : 'fa-play ml-0.5 sm:ml-1'} text-lg sm:text-xl`}></i>
        </button>
      </div>

      {/* Track List */}
      <div className="px-3 sm:px-6 pb-12 flex-1">
        {favorites.length > 0 ? (
          <div className="space-y-1">
            <div className="grid grid-cols-12 px-2 sm:px-3 py-2 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-8 md:col-span-6">Title</span>
              <span className="col-span-3 hidden md:block truncate">Album</span>
              <span className="col-span-3 md:col-span-2 text-right pr-2">
                <i className="fa-regular fa-clock"></i>
              </span>
            </div>

            {favorites.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handleTrackClick(track)}
                  className={`grid grid-cols-12 items-center px-2 sm:px-3 py-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                    isCurrent ? 'bg-spotify-elevated' : ''
                  }`}
                >
                  <div className="col-span-1 text-spotify-textSubdued text-center">
                    <span className="group-hover:hidden font-mono">{idx + 1}</span>
                    <span className="hidden group-hover:inline-block text-white">
                      <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </span>
                  </div>

                  <div className="col-span-8 md:col-span-6 flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                    <img
                      src={track.artworkUrl || 'https://via.placeholder.com/40'}
                      alt={track.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`font-semibold text-xs sm:text-sm truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-spotify-textSubdued truncate">
                        {track.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 hidden md:block text-spotify-textSubdued truncate pr-2">
                    {track.albumName || 'Single'}
                  </div>

                  <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2 sm:gap-3 text-spotify-textSubdued">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      className="text-spotify-green hover:scale-110 transition cursor-pointer p-1"
                      title="Remove from Liked Songs"
                    >
                      <i className="fa-solid fa-heart text-sm"></i>
                    </button>
                    <span className="font-mono pr-1">{formatTime(track.duration || 180)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-spotify-textSubdued space-y-3">
            <i className="fa-regular fa-heart text-5xl text-zinc-600"></i>
            <h3 className="text-lg font-bold text-white">Songs you like will appear here</h3>
            <p className="text-xs max-w-sm mx-auto">
              Save songs by tapping the heart icon anywhere on the player or song list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
