'use client';

import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Track } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { INITIAL_TRACKS, INITIAL_ARTISTS } from '@/lib/music/providers/catalog';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const GENRE_CARDS = [
  { name: 'Bollywood', color: 'from-orange-600 to-amber-700', icon: 'fa-film' },
  { name: 'Pop & I-Pop', color: 'from-pink-600 to-rose-700', icon: 'fa-star' },
  { name: 'Punjabi', color: 'from-yellow-600 to-amber-800', icon: 'fa-fire' },
  { name: 'Drift Phonk', color: 'from-purple-700 to-indigo-900', icon: 'fa-car' },
  { name: 'Chill & Lofi', color: 'from-emerald-700 to-teal-900', icon: 'fa-leaf' },
  { name: 'Electronic / EDM', color: 'from-cyan-600 to-blue-800', icon: 'fa-bolt' },
  { name: 'Tamil & South', color: 'from-red-600 to-rose-900', icon: 'fa-compact-disc' },
  { name: 'Rock & Metal', color: 'from-zinc-700 to-black', icon: 'fa-guitar' },
];

export function SearchView({ searchQuery, setSearchQuery }: SearchViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.tracks || []);
        } else {
          // fallback to local filter
          const q = searchQuery.toLowerCase();
          setResults(INITIAL_TRACKS.filter(t => 
            t.title.toLowerCase().includes(q) || 
            t.artistName.toLowerCase().includes(q)
          ));
        }
      } catch {
        const q = searchQuery.toLowerCase();
        setResults(INITIAL_TRACKS.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.artistName.toLowerCase().includes(q)
        ));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, results.length > 0 ? results : INITIAL_TRACKS);
    }
  };

  const topResult = results[0];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      {/* If no query, show Browse Genres */}
      {!searchQuery.trim() && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Browse All Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GENRE_CARDS.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchQuery(genre.name)}
                className={`h-36 rounded-lg p-4 bg-gradient-to-br ${genre.color} relative overflow-hidden cursor-pointer hover:scale-[1.02] transition shadow-lg flex flex-col justify-between`}
              >
                <h3 className="text-xl font-bold text-white drop-shadow">{genre.name}</h3>
                <div className="self-end text-white/30 text-4xl">
                  <i className={`fa-solid ${genre.icon}`}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-spotify-textSubdued py-8">
          <div className="w-5 h-5 border-2 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Searching legal catalog for &ldquo;{searchQuery}&rdquo;...</span>
        </div>
      )}

      {/* Results view */}
      {searchQuery.trim() && !loading && (
        <>
          {results.length > 0 ? (
            <div className="space-y-6">
              {/* Top Result + Songs Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Result Card */}
                {topResult && (
                  <div className="lg:col-span-1 space-y-2">
                    <h3 className="text-xl font-bold text-white">Top Result</h3>
                    <div
                      onClick={() => handlePlay(topResult)}
                      className="bg-spotify-card hover:bg-spotify-cardHover p-5 rounded-lg transition group cursor-pointer relative flex flex-col gap-3"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg bg-zinc-800">
                        <img
                          src={topResult.artworkUrl || 'https://via.placeholder.com/100'}
                          alt={topResult.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white group-hover:underline">
                          {topResult.title}
                        </h4>
                        <p className="text-sm text-spotify-textSubdued mt-1">
                          Song • <span className="text-white font-medium">{topResult.artistName}</span>
                        </p>
                      </div>
                      <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-300">
                        <i className={`fa-solid ${currentTrack?.id === topResult.id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-lg`}></i>
                      </div>
                    </div>
                  </div>
                )}

                {/* Songs List */}
                <div className={`${topResult ? 'lg:col-span-2' : 'col-span-3'} space-y-2`}>
                  <h3 className="text-xl font-bold text-white">Songs</h3>
                  <div className="space-y-1">
                    {results.slice(0, 5).map((track, idx) => {
                      const isCurrent = currentTrack?.id === track.id;
                      const isFav = isFavorite(track.id);
                      return (
                        <div
                          key={track.id}
                          onClick={() => handlePlay(track)}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="w-4 text-center text-xs text-spotify-textSubdued group-hover:hidden">
                              {idx + 1}
                            </span>
                            <span className="w-4 text-center text-xs text-white hidden group-hover:inline-block">
                              <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                            </span>
                            <img
                              src={track.artworkUrl || 'https://via.placeholder.com/40'}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                                {track.title}
                              </p>
                              <p className="text-xs text-spotify-textSubdued truncate">
                                {track.artistName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-spotify-textSubdued text-xs">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(track);
                              }}
                              className="hover:text-white cursor-pointer"
                              title={isFav ? 'Remove favorite' : 'Add to favorites'}
                            >
                              <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-0 group-hover:opacity-100'}`}></i>
                            </button>
                            <span className="font-mono">{formatTime(track.duration || 180)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Matching Artists */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Related Artists</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {INITIAL_ARTISTS.slice(0, 4).map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => setSearchQuery(artist.name)}
                      className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition cursor-pointer group flex flex-col items-center text-center"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-zinc-800 shadow">
                        <img
                          alt={artist.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          src={artist.imageUrl || 'https://via.placeholder.com/100'}
                        />
                      </div>
                      <span className="font-bold text-sm text-white truncate w-full">{artist.name}</span>
                      <span className="text-xs text-spotify-textSubdued">Artist</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-spotify-textSubdued space-y-2">
              <i className="fa-solid fa-music text-3xl text-zinc-600"></i>
              <h3 className="text-base font-bold text-white">No results found for &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-xs">
                Please check the spelling or search for another song title, artist, or genre.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
