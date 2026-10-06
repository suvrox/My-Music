'use client';

import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { INITIAL_TRACKS, INITIAL_ARTISTS } from '@/lib/music/providers/catalog';
import { Track, FilterTab, ActiveView } from '@/types/music';
import { getStoredHistory } from '@/lib/storage/history';
import { formatTime } from '@/lib/utils';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
}

interface CategoryRow {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  query: string;
  tracks: Track[];
  fallbackTracks: Track[];
}

export function HomeView({ setActiveView }: HomeViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [recentHistory, setRecentHistory] = useState<Track[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Dynamic Category Rows loaded from YouTube API
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(INITIAL_TRACKS.slice(0, 5));
  const [indiaTrendingTracks, setIndiaTrendingTracks] = useState<Track[]>(INITIAL_TRACKS.slice(1, 6));
  const [bollywoodTracks, setBollywoodTracks] = useState<Track[]>(INITIAL_TRACKS.slice(2, 7));
  const [loveTracks, setLoveTracks] = useState<Track[]>(INITIAL_TRACKS.slice(3, 8));
  const [happyTracks, setHappyTracks] = useState<Track[]>(INITIAL_TRACKS.slice(4, 9));
  const [ipopTracks, setIpopTracks] = useState<Track[]>(INITIAL_TRACKS.slice(5, 10));
  const [hotHitsTracks, setHotHitsTracks] = useState<Track[]>(INITIAL_TRACKS.slice(6, 11));
  const [phonkTracks, setPhonkTracks] = useState<Track[]>(INITIAL_TRACKS.slice(0, 5));
  const [podcastTracks, setPodcastTracks] = useState<Track[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);

  useEffect(() => {
    setRecentHistory(getStoredHistory());
  }, [currentTrack]);

  // Load live YouTube API data across all sections
  useEffect(() => {
    let isMounted = true;
    setIsLoadingFeed(true);

    const loadCategory = async (url: string): Promise<Track[]> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data.tracks) ? data.tracks : [];
      } catch {
        return [];
      }
    };

    // Parallel fetch for snappy responsiveness
    Promise.all([
      loadCategory('/api/music/trending'),
      loadCategory('/api/music/category?category=Trending Now India Hindi Top Songs'),
      loadCategory('/api/music/category?category=Bollywood Chill Acoustic Songs'),
      loadCategory('/api/music/category?category=pov you are in love songs hindi english'),
      loadCategory('/api/music/category?category=Happy Vibes upbeat feel good songs'),
      loadCategory('/api/music/category?category=Indian Pop hits indipop latest'),
      loadCategory('/api/music/category?category=Hot Hits Hindi Punjabi Billboard'),
      loadCategory('/api/music/category?category=drift phonk gym workout phonk'),
      loadCategory('/api/music/category?category=podcast storytelling english hindi full episode')
    ]).then(([trending, india, bollywood, love, happy, ipop, hothits, phonk, podcasts]) => {
      if (!isMounted) return;
      if (trending.length > 0) setTrendingTracks(trending);
      if (india.length > 0) setIndiaTrendingTracks(india);
      if (bollywood.length > 0) setBollywoodTracks(bollywood);
      if (love.length > 0) setLoveTracks(love);
      if (happy.length > 0) setHappyTracks(happy);
      if (ipop.length > 0) setIpopTracks(ipop);
      if (hothits.length > 0) setHotHitsTracks(hothits);
      if (phonk.length > 0) setPhonkTracks(phonk);
      if (podcasts.length > 0) setPodcastTracks(podcasts);
      setIsLoadingFeed(false);
    }).catch(() => {
      if (isMounted) setIsLoadingFeed(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlayOrPauseTrack = (track: Track, contextTracks: Track[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentTrack?.id === track.id || (currentTrack?.youtubeId && currentTrack?.youtubeId === track.youtubeId)) {
      togglePlay();
    } else {
      playTrack(track, contextTracks);
    }
  };

  const toggleExpand = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  // Render a uniform, responsive music row
  const renderTrackSection = (
    sectionId: string,
    title: string,
    subtitle: string,
    badgeText: string,
    tracks: Track[],
    accentColor: string = 'text-spotify-green'
  ) => {
    if (!tracks || tracks.length === 0) return null;
    const isExpanded = expandedSection === sectionId;
    const displayedTracks = isExpanded ? tracks : tracks.slice(0, 5);

    return (
      <section key={sectionId} data-purpose={`section-${sectionId}`} className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-youtube text-red-500 text-base"></i>
              <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                {title}
              </h2>
              {badgeText && (
                <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 ${accentColor}`}>
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-spotify-textSubdued mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={() => toggleExpand(sectionId)}
            className="text-xs font-bold text-spotify-textSubdued hover:text-white transition cursor-pointer"
          >
            {isExpanded ? 'Show less' : `Show all (${tracks.length})`}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedTracks.map((track) => {
            const isTrackActive =
              currentTrack?.id === track.id ||
              (currentTrack?.youtubeId && currentTrack?.youtubeId === track.youtubeId);

            return (
              <div
                key={track.id}
                onClick={() => handlePlayOrPauseTrack(track, tracks)}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3 rounded-lg transition duration-200 cursor-pointer group flex flex-col relative border border-transparent hover:border-zinc-800/80 shadow-md"
              >
                {/* Artwork with YouTube Badge and Play Overlay */}
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src={track.artworkUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
                    loading="lazy"
                  />
                  {/* YouTube Tag */}
                  <div className="absolute top-2 left-2 text-red-500 text-xs drop-shadow bg-black/70 px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                    <i className="fa-brands fa-youtube"></i>
                    <span className="text-[10px] text-white font-semibold">YT</span>
                  </div>

                  {/* Duration Badge */}
                  {Boolean(track.duration && track.duration > 0) && (
                    <div className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {formatTime(track.duration || 0)}
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className={`absolute right-2 bottom-2 transition-all duration-300 drop-shadow-xl ${
                    isTrackActive && isPlaying
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}>
                    <div className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition">
                      <i className={`fa-solid ${isTrackActive && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>

                {/* Track Title */}
                <h3 className={`font-bold text-sm truncate mb-0.5 ${isTrackActive ? 'text-spotify-green' : 'text-white'}`} title={track.title}>
                  {track.title}
                </h3>

                {/* Artist Name */}
                <p className="text-xs text-spotify-textSubdued truncate leading-snug" title={track.artistName}>
                  {track.artistName}
                </p>

                {/* Album / Channel source */}
                <span className="text-[11px] text-zinc-500 truncate mt-1">
                  {track.albumName || 'YouTube Music'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col" data-purpose="center-main-feed">
      {/* Top Violet Ambient Glow Background Banner */}
      <div className="custom-gradient-header pt-4 px-6 pb-6 sticky top-0 z-20">
        {/* Filter Tabs: All, Music, Podcasts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20 text-white font-medium'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab('music')}
            className={`px-3.5 py-1.5 rounded-full text-sm transition cursor-pointer ${
              filterTab === 'music'
                ? 'bg-white text-black font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-white font-medium'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setFilterTab('podcasts')}
            className={`px-3.5 py-1.5 rounded-full text-sm transition cursor-pointer ${
              filterTab === 'podcasts'
                ? 'bg-white text-black font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-white font-medium'
            }`}
          >
            Podcasts
          </button>

          {isLoadingFeed && (
            <div className="ml-auto flex items-center gap-2 text-xs text-spotify-textSubdued">
              <i className="fa-solid fa-circle-notch fa-spin text-spotify-green"></i>
              <span>Loading YouTube tracks...</span>
            </div>
          )}
        </div>
      </div>

      {/* Feed Content Sections */}
      <div className="px-6 space-y-9 pb-16 -mt-2">
        {/* SECTION: Recently Played (from local listening history) */}
        {recentHistory.length > 0 && filterTab !== 'podcasts' && (
          <section data-purpose="recently-played-row" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2
                onClick={() => setActiveView({ type: 'history' })}
                className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer"
              >
                Recently Played
              </h2>
              <button
                onClick={() => setActiveView({ type: 'history' })}
                className="text-xs font-bold text-spotify-textSubdued hover:underline cursor-pointer"
              >
                Show all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentHistory.slice(0, 5).map((track) => {
                const isTrackActive =
                  currentTrack?.id === track.id ||
                  (currentTrack?.youtubeId && currentTrack?.youtubeId === track.youtubeId);
                return (
                  <div
                    key={`hist-${track.id}`}
                    onClick={() => handlePlayOrPauseTrack(track, recentHistory)}
                    className="bg-spotify-card hover:bg-spotify-cardHover p-3 rounded-lg transition duration-200 cursor-pointer group flex flex-col relative border border-transparent hover:border-zinc-800"
                  >
                    <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                      <img
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={track.artworkUrl || 'https://via.placeholder.com/200'}
                      />
                      <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                        <div className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                          <i className={`fa-solid ${isTrackActive && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                        </div>
                      </div>
                    </div>
                    <h3 className={`font-bold text-sm truncate mb-0.5 ${isTrackActive ? 'text-spotify-green' : 'text-white'}`}>
                      {track.title}
                    </h3>
                    <p className="text-xs text-spotify-textSubdued truncate leading-snug">
                      {track.artistName}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MUSIC / ALL TABS SECTIONS (All powered by live YouTube API) */}
        {filterTab !== 'podcasts' && (
          <>
            {/* 1. Trending on YouTube */}
            {renderTrackSection(
              'trending-global',
              'Trending on YouTube',
              'Chart-topping viral songs streaming right now across YouTube',
              'Top Charts',
              trendingTracks,
              'text-red-400'
            )}

            {/* 2. Trending Now India */}
            {renderTrackSection(
              'trending-india',
              'Trending Now India',
              'Every track India is streaming on repeat today',
              'Trending India',
              indiaTrendingTracks,
              'text-emerald-400'
            )}

            {/* 3. Bollywood & Chill */}
            {renderTrackSection(
              'bollywood-chill',
              'Bollywood & Chill',
              'Sit back and unwind with soothing melodies and acoustic Bollywood hits',
              'Bollywood',
              bollywoodTracks,
              'text-yellow-300'
            )}

            {/* 4. pov: you\'re in love */}
            {renderTrackSection(
              'pov-in-love',
              "pov: you're in love",
              "Uff, you've fallen! Romantic anthems, soulful confessions, and heartbeat rhythms",
              'Romance',
              loveTracks,
              'text-pink-400'
            )}

            {/* 5. Happy Vibes */}
            {renderTrackSection(
              'happy-vibes',
              'Happy Vibes',
              'Bright, sunny, catchy tunes guaranteed to elevate your mood and energy',
              'Good Vibes',
              happyTracks,
              'text-amber-300'
            )}

            {/* 6. I-Pop Superhits */}
            {renderTrackSection(
              'ipop-superhits',
              'I-Pop Superhits',
              'Your ultimate daily indie-pop boost with fresh vocals and catchy hooks',
              'Indie Pop',
              ipopTracks,
              'text-cyan-400'
            )}

            {/* 7. Hot Hits Hindi & Global */}
            {renderTrackSection(
              'hot-hits',
              'More of what you like (Hot Hits)',
              'Hear a little bit of everything you love with heavy rotation chartbusters',
              'Hot Hits',
              hotHitsTracks,
              'text-red-500'
            )}

            {/* 8. the beat of your drift (PHONK) */}
            {renderTrackSection(
              'phonk-drift',
              'the beat of your drift (PHONK)',
              'High-octane drift phonk, dark cyberbass, and aggressive gym workout beats',
              'Phonk',
              phonkTracks,
              'text-purple-400'
            )}

            {/* 9. Popular Artists */}
            <section data-purpose="popular-artists-row" className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                    Popular Artists
                  </h2>
                  <p className="text-xs text-spotify-textSubdued mt-0.5">
                    Explore top verified artists streaming on the platform
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {INITIAL_ARTISTS.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setActiveView({ type: 'artist', id: artist.id })}
                    className="bg-spotify-card hover:bg-spotify-cardHover p-4 rounded-lg transition duration-200 cursor-pointer group flex flex-col items-center text-center relative border border-transparent hover:border-zinc-800"
                  >
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                      <img
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={artist.imageUrl || 'https://via.placeholder.com/150'}
                      />
                    </div>
                    <h3 className="font-bold text-sm text-white truncate mb-0.5 w-full">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-spotify-textSubdued truncate w-full">
                      Artist • {artist.monthlyListeners}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* PODCASTS TAB VIEW (Powered by YouTube Podcasts) */}
        {filterTab === 'podcasts' && (
          <div className="space-y-8">
            {renderTrackSection(
              'podcasts-youtube',
              'Popular Podcasts on YouTube',
              'Top talk shows, technology discussions, and captivating audio stories',
              'Podcast',
              podcastTracks.length > 0 ? podcastTracks : INITIAL_TRACKS.slice(0, 5),
              'text-indigo-400'
            )}

            <div className="bg-spotify-card/60 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-indigo-400">
                  <i className="fa-solid fa-podcast text-lg"></i>
                  <span className="text-xs font-bold uppercase tracking-wider">Audio Stories &amp; Shows</span>
                </div>
                <h3 className="text-lg font-bold text-white">Continuous Podcast Streaming via YouTube</h3>
                <p className="text-xs text-spotify-textSubdued">
                  Enjoy non-stop episodes, full interview recordings, and storytelling curated directly from official YouTube creators.
                </p>
              </div>
              <button
                onClick={() => setFilterTab('all')}
                className="px-4 py-2 bg-white text-black font-bold text-xs rounded-full hover:scale-105 transition"
              >
                Explore Music
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
