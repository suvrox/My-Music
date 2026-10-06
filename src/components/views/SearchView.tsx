'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Track, ActiveView } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { INITIAL_TRACKS, INITIAL_ARTISTS } from '@/lib/music/providers/catalog';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveView?: (view: ActiveView) => void;
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

export function SearchView({ searchQuery, setSearchQuery, setActiveView }: SearchViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay, addToQueue } = useAudioPlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTab, setSearchTab] = useState<'all' | 'songs' | 'artists'>('all');

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          const fetchedTracks: Track[] = data.tracks || [];
          if (fetchedTracks.length > 0) {
            setResults(fetchedTracks);
          } else {
            // Fallback filter locally
            const lower = q.toLowerCase();
            const fallback = INITIAL_TRACKS.filter(t =>
              t.title.toLowerCase().includes(lower) ||
              t.artistName.toLowerCase().includes(lower) ||
              t.albumName?.toLowerCase().includes(lower)
            );
            setResults(fallback);
          }
        } else {
          const lower = q.toLowerCase();
          setResults(INITIAL_TRACKS.filter(t =>
            t.title.toLowerCase().includes(lower) ||
            t.artistName.toLowerCase().includes(lower)
          ));
        }
      } catch {
        const lower = q.toLowerCase();
        setResults(INITIAL_TRACKS.filter(t =>
          t.title.toLowerCase().includes(lower) ||
          t.artistName.toLowerCase().includes(lower)
        ));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handlePlay = (track: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, results.length > 0 ? results : INITIAL_TRACKS);
    }
  };

  // Derive unique artists matching this search query
  const matchingArtists = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const list: { id: string; name: string; imageUrl?: string }[] = [];

    // 1. Check INITIAL_ARTISTS
    INITIAL_ARTISTS.forEach(a => {
      const lowerName = a.name.toLowerCase();
      if ((lowerName.includes(q) || q.includes(lowerName)) && !seenNames.has(lowerName) && !seenIds.has(a.id)) {
        seenNames.add(lowerName);
        seenIds.add(a.id);
        list.push({ id: a.id, name: a.name, imageUrl: a.imageUrl });
      }
    });

    // 2. Check artists in search results
    results.forEach((r, idx) => {
      const artName = r.artistName?.trim();
      if (!artName || artName.length > 35) return;
      const lowerName = artName.toLowerCase();
      if (seenNames.has(lowerName)) return;

      const slug = lowerName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueId = `art-slug-${slug || `idx-${idx}`}`;
      if (seenIds.has(uniqueId)) return;

      seenNames.add(lowerName);
      seenIds.add(uniqueId);
      list.push({
        id: uniqueId,
        name: artName,
        imageUrl: r.artworkUrl
      });
    });

    return list.slice(0, 8);
  }, [results, searchQuery]);

  const topResult = results[0];
  const topSongs = results.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6" data-purpose="search-view-container">
      {/* 1. If no query, show Browse Genres */}
      {!searchQuery.trim() && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Browse All Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {GENRE_CARDS.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchQuery(genre.name)}
                className={`h-28 sm:h-36 rounded-lg p-3 sm:p-4 bg-gradient-to-br ${genre.color} relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition shadow-lg flex flex-col justify-between group`}
              >
                <h3 className="text-base sm:text-xl font-bold text-white drop-shadow">{genre.name}</h3>
                <div className="self-end text-white/30 text-3xl sm:text-5xl group-hover:scale-110 transition duration-300">
                  <i className={`fa-solid ${genre.icon}`}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-spotify-textSubdued py-8">
          <div className="w-5 h-5 border-2 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Searching YouTube for &ldquo;{searchQuery}&rdquo;...</span>
        </div>
      )}

      {/* 3. Search Results view */}
      {searchQuery.trim() && !loading && (
        <>
          {results.length > 0 ? (
            <div className="space-y-8">
              {/* Filter Tabs: All, Songs, Artists */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchTab('all')}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    searchTab === 'all'
                      ? 'bg-white text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSearchTab('songs')}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    searchTab === 'songs'
                      ? 'bg-white text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Songs ({results.length})
                </button>
                {matchingArtists.length > 0 && (
                  <button
                    onClick={() => setSearchTab('artists')}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      searchTab === 'artists'
                        ? 'bg-white text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Artists ({matchingArtists.length})
                  </button>
                )}
              </div>

              {/* View Tab: ALL */}
              {searchTab === 'all' && (
                <>
                  {/* Top Result + Top Songs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Top Result Card */}
                    {topResult && (
                      <div className="lg:col-span-5 space-y-3">
                        <h3 className="text-xl font-bold text-white tracking-tight">Top Result</h3>
                        <div
                          onClick={() => handlePlay(topResult)}
                          className="bg-spotify-card hover:bg-spotify-cardHover p-4 sm:p-5 rounded-lg transition duration-200 group cursor-pointer relative flex flex-col justify-between min-h-[190px] sm:h-[230px]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shadow-xl bg-zinc-800 flex-shrink-0">
                              <img
                                src={topResult.artworkUrl || 'https://via.placeholder.com/100'}
                                alt={topResult.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-lg sm:text-2xl font-bold text-white group-hover:underline line-clamp-2 leading-tight">
                                {topResult.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-spotify-textSubdued mt-1.5 truncate">
                                <span className="text-white font-medium hover:underline">
                                  {topResult.artistName}
                                </span>
                              </p>
                              <span className="inline-block mt-2 sm:mt-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                                Song
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-xs text-spotify-textSubdued font-mono">
                              {formatTime(topResult.duration || 180)}
                            </span>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                              <i className={`fa-solid ${currentTrack?.id === topResult.id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm sm:text-lg`}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Songs */}
                    <div className={`${topResult ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                      <h3 className="text-xl font-bold text-white tracking-tight">Songs</h3>
                      <div className="space-y-1">
                        {topSongs.map((track, idx) => {
                          const isCurrent = currentTrack?.id === track.id;
                          const isFav = isFavorite(track.id);
                          return (
                            <div
                              key={`top-song-${track.id}-${idx}`}
                              onClick={() => handlePlay(track)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-spotify-elevated transition cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                                  <img
                                    src={track.artworkUrl || 'https://via.placeholder.com/40'}
                                    alt={track.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
                                    <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play text-xs'} text-white`}></i>
                                  </div>
                                </div>
                                <div className="min-w-0 pr-2">
                                  <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
                                    {track.title}
                                  </p>
                                  <p className="text-xs text-spotify-textSubdued truncate">
                                    {track.artistName}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 sm:gap-4 text-spotify-textSubdued text-xs flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(track);
                                  }}
                                  className="hover:text-white cursor-pointer p-1"
                                  title={isFav ? 'Remove favorite' : 'Save to Your Library'}
                                >
                                  <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-70 sm:opacity-0 sm:group-hover:opacity-100'}`}></i>
                                </button>
                                <span className="font-mono">{formatTime(track.duration || 180)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Complete List of All Matching Songs */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        All Results from YouTube ({results.length} songs)
                      </h3>
                      <span className="text-xs text-spotify-textSubdued hidden sm:inline">
                        Click any song to play and queue all tracks
                      </span>
                    </div>

                    {/* Full Interactive Table */}
                    <div className="w-full" data-purpose="all-results-table">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 px-2 sm:px-4 py-2.5 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-8 md:col-span-6">Title</div>
                        <div className="col-span-3 hidden md:block truncate">Album</div>
                        <div className="col-span-3 md:col-span-2 text-right pr-2">Duration</div>
                      </div>

                      {/* Song Rows */}
                      <div className="divide-y divide-zinc-900/50 mt-1">
                        {results.map((track, idx) => {
                          const isCurrent = currentTrack?.id === track.id;
                          const isFav = isFavorite(track.id);

                          return (
                            <div
                              key={`all-row-${track.id}-${idx}`}
                              onClick={() => handlePlay(track)}
                              className={`grid grid-cols-12 items-center px-2 sm:px-4 py-2.5 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                                isCurrent ? 'bg-spotify-elevated/70' : ''
                              }`}
                            >
                              {/* Track Index or Play Icon */}
                              <div className="col-span-1 text-center text-spotify-textSubdued flex items-center justify-center">
                                <span className="group-hover:hidden font-mono">
                                  {isCurrent && isPlaying ? (
                                    <i className="fa-solid fa-volume-high text-spotify-green"></i>
                                  ) : (
                                    idx + 1
                                  )}
                                </span>
                                <span className="hidden group-hover:inline-block text-white">
                                  <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                </span>
                              </div>

                              {/* Title & Artist */}
                              <div className="col-span-8 md:col-span-6 flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                                <img
                                  src={track.artworkUrl || 'https://via.placeholder.com/40'}
                                  alt={track.title}
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0 bg-zinc-800 shadow-sm"
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

                              {/* Album Name */}
                              <div className="col-span-3 hidden md:block text-spotify-textSubdued truncate pr-2">
                                {track.albumName || 'Single'}
                              </div>

                              {/* Duration & Actions */}
                              <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2 sm:gap-3 text-spotify-textSubdued">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToQueue(track);
                                  }}
                                  className="hover:text-white transition cursor-pointer opacity-0 group-hover:opacity-100 p-1 hidden sm:inline-block"
                                  title="Add to queue"
                                >
                                  <i className="fa-solid fa-list-ul text-xs"></i>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(track);
                                  }}
                                  className="hover:text-white transition cursor-pointer p-1"
                                  title={isFav ? 'Remove favorite' : 'Save to Your Library'}
                                >
                                  <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-70 sm:opacity-0 sm:group-hover:opacity-100'}`}></i>
                                </button>
                                <span className="font-mono pr-1 sm:pr-2">{formatTime(track.duration || 180)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Matching Artists Grid */}
                  {matchingArtists.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                      <h3 className="text-xl font-bold text-white tracking-tight">Artists</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {matchingArtists.map((artist, idx) => (
                          <div
                            key={`grid-artist-${artist.id}-${idx}`}
                            onClick={() => {
                              if (setActiveView) {
                                setActiveView({ type: 'artist', id: artist.id });
                              } else {
                                setSearchQuery(artist.name);
                              }
                            }}
                            className="bg-spotify-card hover:bg-spotify-cardHover p-4 rounded-md transition duration-200 cursor-pointer group flex flex-col items-center text-center"
                          >
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-zinc-800 shadow-md">
                              <img
                                alt={artist.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                src={artist.imageUrl || 'https://via.placeholder.com/100'}
                              />
                            </div>
                            <span className="font-bold text-sm text-white truncate w-full mb-0.5">
                              {artist.name}
                            </span>
                            <span className="text-xs text-spotify-textSubdued">Artist</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* View Tab: SONGS ONLY */}
              {searchTab === 'songs' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    All Matching Songs ({results.length})
                  </h3>
                  <div className="w-full">
                    <div className="grid grid-cols-12 px-2 sm:px-4 py-2.5 text-xs font-semibold text-spotify-textSubdued border-b border-zinc-800 uppercase tracking-wider">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-8 md:col-span-6">Title</div>
                      <div className="col-span-3 hidden md:block truncate">Album</div>
                      <div className="col-span-3 md:col-span-2 text-right pr-2">Duration</div>
                    </div>

                    <div className="divide-y divide-zinc-900/50 mt-1">
                      {results.map((track, idx) => {
                        const isCurrent = currentTrack?.id === track.id;
                        const isFav = isFavorite(track.id);

                        return (
                          <div
                            key={`songs-tab-${track.id}-${idx}`}
                            onClick={() => handlePlay(track)}
                            className={`grid grid-cols-12 items-center px-2 sm:px-4 py-2.5 rounded-md hover:bg-spotify-elevated transition cursor-pointer group text-xs ${
                              isCurrent ? 'bg-spotify-elevated/70' : ''
                            }`}
                          >
                            <div className="col-span-1 text-center text-spotify-textSubdued flex items-center justify-center">
                              <span className="group-hover:hidden font-mono">
                                {isCurrent && isPlaying ? (
                                  <i className="fa-solid fa-volume-high text-spotify-green"></i>
                                ) : (
                                  idx + 1
                                )}
                              </span>
                              <span className="hidden group-hover:inline-block text-white">
                                <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                              </span>
                            </div>

                            <div className="col-span-8 md:col-span-6 flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                              <img
                                src={track.artworkUrl || 'https://via.placeholder.com/40'}
                                alt={track.title}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0 bg-zinc-800 shadow-sm"
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
                                  addToQueue(track);
                                }}
                                className="hover:text-white transition cursor-pointer opacity-0 group-hover:opacity-100 p-1 hidden sm:inline-block"
                                title="Add to queue"
                              >
                                <i className="fa-solid fa-list-ul text-xs"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(track);
                                }}
                                className="hover:text-white transition cursor-pointer p-1"
                                title={isFav ? 'Remove favorite' : 'Save to Your Library'}
                              >
                                <i className={`text-sm ${isFav ? 'fa-solid fa-heart text-spotify-green' : 'fa-regular fa-heart opacity-70 sm:opacity-0 sm:group-hover:opacity-100'}`}></i>
                              </button>
                              <span className="font-mono pr-1 sm:pr-2">{formatTime(track.duration || 180)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* View Tab: ARTISTS ONLY */}
              {searchTab === 'artists' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Artists ({matchingArtists.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {matchingArtists.map((artist, idx) => (
                      <div
                        key={`artists-tab-${artist.id}-${idx}`}
                        onClick={() => {
                          if (setActiveView) {
                            setActiveView({ type: 'artist', id: artist.id });
                          } else {
                            setSearchQuery(artist.name);
                          }
                        }}
                        className="bg-spotify-card hover:bg-spotify-cardHover p-5 rounded-md transition duration-200 cursor-pointer group flex flex-col items-center text-center"
                      >
                        <div className="w-28 h-28 rounded-full overflow-hidden mb-3 bg-zinc-800 shadow-md">
                          <img
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src={artist.imageUrl || 'https://via.placeholder.com/100'}
                          />
                        </div>
                        <span className="font-bold text-base text-white truncate w-full mb-1">
                          {artist.name}
                        </span>
                        <span className="text-xs text-spotify-textSubdued">Artist</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-spotify-textSubdued space-y-3">
              <i className="fa-solid fa-compact-disc text-4xl text-zinc-600 animate-spin-slow"></i>
              <h3 className="text-lg font-bold text-white">No results found for &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-xs text-spotify-textSubdued max-w-sm mx-auto">
                Please check your spelling, or try searching for another artist, song title, or genre.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
