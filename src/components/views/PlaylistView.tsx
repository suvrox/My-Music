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
      <div className="p-6 bg-gradient-to-b from-indigo-900/60 to-spotify-surface flex items-end gap-6 pt-12 pb-6">
        <div className="w-48 h-48 rounded-lg overflow-hidden shadow-2xl bg-zinc-800 flex-shrink-0">
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
              <i className="fa-solid fa-music text-5xl"></i>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">Public Playlist</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight truncate">
            {playlist.name}
          </h1>
          <p className="text-xs text-spotify-textSubdued line-clamp-2">
            {playlist.description || 'Curated playlist on Web Player'}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium mt-1">
            <span className="font-bold">{playlist.author || 'Suvradip Maity'}</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-6 bg-spotify-surface">
        <button
          onClick={handlePlayAll}
          disabled={playlist.tracks.length === 0}
          className={`w-14 h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer ${
            playlist.tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Play"
        >
          <i className={`fa-solid ${isPlaying && playlist.tracks.some(t => t.id === currentTrack?.id) ? 'fa-pause' : 'fa-play ml-1'} text-xl`}></i>
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
      <div className="px-6 pb-12 flex-1">
        {playlist.tracks.length > 0 ? (
          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-3 py-2 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
              <span className="col-span-1">#</span>
              <span className="col-span-6">Title</span>
              <span className="col-span-3">Album</span>
              <span className="col-span-2 text-right">
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
                  className={`grid grid-cols-12 items-center px-3 py-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                    isCurrent ? 'bg-spotify-elevated' : ''
                  }`}
                >
                  {/* Index / Play Icon */}
                  <div className="col-span-1 text-spotify-textSubdued">
                    <span className="group-hover:hidden">{idx + 1}</span>
                    <span className="hidden group-hover:inline-block text-white">
                      <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </span>
                  </div>

                  {/* Title & Artist */}
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

                  {/* Album */}
                  <div className="col-span-3 text-spotify-textSubdued truncate pr-2">
                    {track.albumName || 'Single'}
                  </div>

                  {/* Duration & Favorite */}
                  <div className="col-span-2 flex items-center justify-end gap-3 text-spotify-textSubdued">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      className="hover:text-white cursor-pointer"
                    >
                      <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-0 group-hover:opacity-100'}`}></i>
                    </button>
                    <span className="font-mono">{formatTime(track.duration || 180)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromPlaylist(playlist.id, track.id);
                      }}
                      className="hover:text-red-400 opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
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
