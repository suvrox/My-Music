'use client';

import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { getStoredHistory, clearStoredHistory } from '@/lib/storage/history';
import { Track } from '@/types/music';
import { formatTime } from '@/lib/utils';

export function HistoryView() {
  const [history, setHistory] = useState<Track[]>([]);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setHistory(getStoredHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all listening history?')) {
      clearStoredHistory();
      setHistory([]);
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, history);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Listening History</h1>
          <p className="text-xs text-spotify-textSubdued mt-1">
            Tracks you recently played on Web Player (up to 50 tracks)
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-1.5 rounded-full border border-zinc-700 hover:border-white text-xs font-semibold text-white transition cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-1">
          {history.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = isFavorite(track.id);
            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => handleTrackClick(track)}
                className={`flex items-center justify-between p-2.5 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                  isCurrent ? 'bg-spotify-elevated' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-5 text-center text-spotify-textSubdued group-hover:hidden">
                    {idx + 1}
                  </span>
                  <span className="w-5 text-center text-white hidden group-hover:inline-block">
                    <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </span>
                  <img
                    src={track.artworkUrl || 'https://via.placeholder.com/40'}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-spotify-textSubdued truncate">
                      {track.artistName} • {track.albumName || 'Single'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-spotify-textSubdued">
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
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-spotify-textSubdued space-y-3">
          <i className="fa-solid fa-clock-rotate-left text-4xl text-zinc-600"></i>
          <h3 className="text-lg font-bold text-white">Nothing played yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Start listening to songs from Home or Search to build your listening history.
          </p>
        </div>
      )}
    </div>
  );
}
