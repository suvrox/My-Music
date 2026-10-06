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
      <div className="p-6 bg-gradient-to-b from-[#450af5]/70 to-spotify-surface flex items-end gap-6 pt-12 pb-6">
        <div className="w-48 h-48 rounded-lg liked-songs-gradient shadow-2xl flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-heart text-white text-6xl shadow"></i>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight truncate">
            Liked Songs
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-2">
            <span className="font-bold">Suvradip Maity</span>
            <span>•</span>
            <span>{favorites.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-6 bg-spotify-surface">
        <button
          onClick={handlePlayAll}
          disabled={favorites.length === 0}
          className={`w-14 h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer ${
            favorites.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Play All"
        >
          <i className={`fa-solid ${isPlaying && favorites.some(t => t.id === currentTrack?.id) ? 'fa-pause' : 'fa-play ml-1'} text-xl`}></i>
        </button>
      </div>

      {/* Track List */}
      <div className="px-6 pb-12 flex-1">
        {favorites.length > 0 ? (
          <div className="space-y-1">
            <div className="grid grid-cols-12 px-3 py-2 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
              <span className="col-span-1">#</span>
              <span className="col-span-6">Title</span>
              <span className="col-span-3">Album</span>
              <span className="col-span-2 text-right">
                <i className="fa-regular fa-clock"></i>
              </span>
            </div>

            {favorites.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handleTrackClick(track)}
                  className={`grid grid-cols-12 items-center px-3 py-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                    isCurrent ? 'bg-spotify-elevated' : ''
                  }`}
                >
                  <div className="col-span-1 text-spotify-textSubdued">
                    <span className="group-hover:hidden">{idx + 1}</span>
                    <span className="hidden group-hover:inline-block text-white">
                      <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </span>
                  </div>

                  <div className="col-span-6 flex items-center gap-3 min-w-0 pr-2">
                    <img
                      src={track.artworkUrl || 'https://via.placeholder.com/40'}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-spotify-textSubdued truncate">
                        {track.artistName}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 text-spotify-textSubdued truncate pr-2">
                    {track.albumName || 'Single'}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-3 text-spotify-textSubdued">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      className="text-spotify-green hover:scale-110 transition cursor-pointer"
                      title="Remove from Liked Songs"
                    >
                      <i className="fa-solid fa-heart text-sm"></i>
                    </button>
                    <span className="font-mono">{formatTime(track.duration || 180)}</span>
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
