'use client';

import React from 'react';
import { usePlaylists } from '@/context/PlaylistContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatTime } from '@/lib/utils';
import { Track } from '@/types/music';

interface PlaylistViewProps {
  playlistId: string;
  onBack: () => void;
}

export function PlaylistView({ playlistId, onBack }: PlaylistViewProps) {
  const { getPlaylistById, deletePlaylist, removeTrackFromPlaylist } = usePlaylists();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const playlist = getPlaylistById(playlistId);

  if (!playlist) {
    return (
      <div className="flex-1 p-8 text-center text-spotify-textSubdued">
        <p>Playlist not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-full text-xs">
          Return to Home
        </button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      if (currentTrack?.id === playlist.tracks[0].id) {
        togglePlay();
      } else {
        playTrack(playlist.tracks[0], playlist.tracks);
      }
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, playlist.tracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-indigo-900/60 to-spotify-surface flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pt-6 sm:pt-12 pb-4 sm:pb-6 text-center sm:text-left">
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-lg overflow-hidden shadow-2xl bg-zinc-800 flex-shrink-0">
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
              <i className="fa-solid fa-music text-3xl sm:text-5xl"></i>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 w-full sm:w-auto">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80">Public Playlist</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight truncate">
            {playlist.name}
          </h1>
          <p className="text-xs text-spotify-textSubdued line-clamp-2">
            {playlist.description || 'Curated playlist on Web Player'}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/90 font-medium mt-1">
            <span className="font-bold">{playlist.author || 'Suvradip Maity'}</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-6 bg-spotify-surface">
        <button
          onClick={handlePlayAll}
          disabled={playlist.tracks.length === 0}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer ${
            playlist.tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Play"
        >
          <i className={`fa-solid ${isPlaying && playlist.tracks.some(t => t.id === currentTrack?.id) ? 'fa-pause' : 'fa-play ml-0.5 sm:ml-1'} text-lg sm:text-xl`}></i>
        </button>

        {playlist.id.startsWith('playlist-') && !playlist.author?.includes('Suvradip') && (
          <button
            onClick={() => {
              if (confirm(`Delete playlist "${playlist.name}"?`)) {
                deletePlaylist(playlist.id);
                onBack();
              }
            }}
            className="text-spotify-textSubdued hover:text-red-400 transition cursor-pointer text-sm"
            title="Delete Playlist"
          >
            <i className="fa-regular fa-trash-can text-lg"></i>
          </button>
        )}
      </div>

      {/* Track List Table */}
      <div className="px-3 sm:px-6 pb-12 flex-1">
        {playlist.tracks.length > 0 ? (
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-2 sm:px-3 py-2 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-8 md:col-span-6">Title</span>
              <span className="col-span-3 hidden md:block truncate">Album</span>
              <span className="col-span-3 md:col-span-2 text-right pr-2">
                <i className="fa-regular fa-clock"></i>
              </span>
            </div>

            {/* Table Rows */}
            {playlist.tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isFav = isFavorite(track.id);
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handleTrackClick(track)}
                  className={`grid grid-cols-12 items-center px-2 sm:px-3 py-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                    isCurrent ? 'bg-spotify-elevated' : ''
                  }`}
                >
                  {/* Index / Play Icon */}
                  <div className="col-span-1 text-spotify-textSubdued text-center">
                    <span className="group-hover:hidden font-mono">{idx + 1}</span>
                    <span className="hidden group-hover:inline-block text-white">
                      <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </span>
                  </div>

                  {/* Title & Artist */}
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

                  {/* Album */}
                  <div className="col-span-3 hidden md:block text-spotify-textSubdued truncate pr-2">
                    {track.albumName || 'Single'}
                  </div>

                  {/* Duration & Favorite */}
                  <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2 sm:gap-3 text-spotify-textSubdued">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      className="hover:text-white cursor-pointer p-1"
                    >
                      <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-70 sm:opacity-0 sm:group-hover:opacity-100'}`}></i>
                    </button>
                    <span className="font-mono pr-1">{formatTime(track.duration || 180)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromPlaylist(playlist.id, track.id);
                      }}
                      className="hover:text-red-400 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1 cursor-pointer"
                      title="Remove from playlist"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-spotify-textSubdued space-y-2">
            <i className="fa-solid fa-music text-3xl text-zinc-600"></i>
            <h3 className="text-base font-bold text-white">This playlist is empty</h3>
            <p className="text-xs">Find songs to add to &ldquo;{playlist.name}&rdquo; using the Search bar above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
