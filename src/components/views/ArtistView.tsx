'use client';

import React from 'react';
import { INITIAL_ARTISTS, INITIAL_TRACKS } from '@/lib/music/providers/catalog';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatTime } from '@/lib/utils';
import { Track } from '@/types/music';

interface ArtistViewProps {
  artistId: string;
  onBack: () => void;
}

export function ArtistView({ artistId, onBack }: ArtistViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [dynamicTracks, setDynamicTracks] = React.useState<Track[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const artist = INITIAL_ARTISTS.find(a => a.id === artistId) || INITIAL_ARTISTS[0];
  const fallbackTracks = INITIAL_TRACKS.filter(t => t.artistId === artist.id || t.artistName.includes(artist.name));

  React.useEffect(() => {
    setIsLoading(true);
    fetch(`/api/music/search?q=${encodeURIComponent(artist.name + ' top songs')}`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.tracks) && d.tracks.length > 0) {
          setDynamicTracks(d.tracks);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [artist.name]);

  const artistTracks = dynamicTracks.length > 0 ? dynamicTracks : fallbackTracks;

  const handlePlayAll = () => {
    if (artistTracks.length > 0) {
      if (currentTrack?.id === artistTracks[0].id) {
        togglePlay();
      } else {
        playTrack(artistTracks[0], artistTracks);
      }
    }
  };

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, artistTracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Banner */}
      <div className="relative h-64 w-full bg-zinc-900 overflow-hidden flex items-end p-6">
        <img
          src={artist.imageUrl || 'https://via.placeholder.com/800'}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-spotify-surface via-black/40 to-transparent"></div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <i className="fa-solid fa-certificate text-blue-400"></i>
            <span>Verified Artist</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{artist.name}</h1>
          <p className="text-xs text-white/80">{artist.monthlyListeners || '124,592 monthly listeners'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-4 bg-spotify-surface">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer"
          title="Play"
        >
          <i className={`fa-solid ${isPlaying && artistTracks.some(t => t.id === currentTrack?.id) ? 'fa-pause' : 'fa-play ml-1'} text-xl`}></i>
        </button>
        <button className="px-4 py-1.5 rounded-full border border-zinc-600 text-xs font-semibold text-white hover:border-white transition cursor-pointer">
          Follow
        </button>
      </div>

      {/* Popular Tracks */}
      <div className="px-6 pb-12 space-y-6">
        <h2 className="text-xl font-bold text-white">Popular</h2>
        <div className="space-y-1">
          {artistTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = isFavorite(track.id);
            return (
              <div
                key={track.id}
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
                    <p className={`font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-spotify-textSubdued truncate">
                      {track.albumName || 'Single'}
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

        {/* Bio */}
        <div className="p-4 rounded-lg bg-spotify-card max-w-xl space-y-2">
          <h3 className="text-sm font-bold text-white">About</h3>
          <p className="text-xs text-spotify-textSubdued leading-relaxed">
            {artist.description}
          </p>
        </div>
      </div>
    </div>
  );
}
