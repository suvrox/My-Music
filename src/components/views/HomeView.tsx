'use client';

import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { INITIAL_TRACKS, INITIAL_ARTISTS } from '@/lib/music/providers/catalog';
import { Track, FilterTab, ActiveView } from '@/types/music';
import { getStoredHistory } from '@/lib/storage/history';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
}

export function HomeView({ setActiveView }: HomeViewProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [youtubeTrending, setYoutubeTrending] = useState<Track[]>([]);
  const [recentHistory, setRecentHistory] = useState<Track[]>([]);

  useEffect(() => {
    setRecentHistory(getStoredHistory());
  }, [currentTrack]);

  useEffect(() => {
    fetch('/api/music/trending')
      .then(res => res.json())
      .then(data => {
        if (data.tracks && Array.isArray(data.tracks)) {
          setYoutubeTrending(data.tracks);
        }
      })
      .catch(() => {});
  }, []);

  const handlePlayOrPauseTrack = (track: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, INITIAL_TRACKS);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col" data-purpose="center-main-feed">
      {/* Top Violet Ambient Glow Background Banner matching Stitch */}
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
        </div>
      </div>

      {/* Feed Grid Sections Container */}
      <div className="px-6 space-y-8 pb-12 -mt-2">
        {/* Recently Played Section (if user has listening history) */}
        {recentHistory.length > 0 && filterTab !== 'podcasts' && (
          <section data-purpose="recently-played-row">
            <div className="flex items-center justify-between mb-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentHistory.slice(0, 5).map((track) => {
                const isTrackActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayOrPauseTrack(track)}
                    className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
                  >
                    <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                      <img
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={track.artworkUrl || 'https://via.placeholder.com/200'}
                      />
                      {/* Play Button Overlay on Hover */}
                      <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                        <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                          <i className={`fa-solid ${isTrackActive && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                        </div>
                      </div>
                    </div>
                    <h3 className={`font-bold text-sm truncate mb-1 ${isTrackActive ? 'text-spotify-green' : 'text-white'}`}>
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

        {/* Dynamic YouTube Trending Row */}
        {youtubeTrending.length > 0 && filterTab !== 'podcasts' && (
          <section data-purpose="youtube-trending-row">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-youtube text-red-500 text-xl"></i>
                <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                  Trending on YouTube
                </h2>
              </div>
              <span className="text-xs font-semibold text-spotify-textSubdued">
                Live from YouTube API
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {youtubeTrending.slice(0, 5).map((track) => {
                const isTrackActive = currentTrack?.id === track.id || currentTrack?.youtubeId === track.youtubeId;
                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayOrPauseTrack(track)}
                    className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
                  >
                    <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                      <img
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={track.artworkUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
                      />
                      <div className="absolute top-2 left-2 text-red-500 text-sm drop-shadow bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <i className="fa-brands fa-youtube"></i>
                      </div>
                      <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                        <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                          <i className={`fa-solid ${isTrackActive && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                        </div>
                      </div>
                    </div>
                    <h3 className={`font-bold text-sm truncate mb-1 ${isTrackActive ? 'text-spotify-green' : 'text-white'}`}>
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

        {/* SECTION 1: Trending Now matching Stitch */}
        {filterTab !== 'podcasts' && (
          <section data-purpose="trending-row">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                Trending Now
              </h2>
              <a className="text-xs font-bold text-spotify-textSubdued hover:underline" href="#">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Card 1: Trending Now India */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[1])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="Trending India"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ITEgoYGl_SE8l9wuE-_CnGrrPSWoiZl0T-HX5KpmYdBCuuqwX7-Yk_h3iGIr0zqhBcWE-UbBgZp0LnkgCJV8Is137HhD5bi7Vndfgmuee9HoFTANyGQ_T-lV3DuciOu6g58BwVKCqOgEZhhcSO61NQwWSQmpFpnVc3kR9Q_cBpPlBE6_FVYjCQU3OuXH3o3EG2gSUYDYxpDS0NBKgQRUSp6Qh5LpRUVD7rrdu0JzCjtBFCJr55yRA"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760] text-sm drop-shadow">
                    <i className="fa-brands fa-spotify text-lg"></i>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-emerald-400 font-extrabold text-base italic leading-tight drop-shadow-md">
                      Trending<br /><span className="text-yellow-300">Now India</span>
                    </span>
                  </div>
                  {/* Hover play */}
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[1].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Trending Now India</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Every track you&apos;re listening/should be...
                </p>
              </div>

              {/* Card 2: Bollywood & Chill */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[3])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="Bollywood & Chill"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3s5P-n1HV1lUeyy5iu8h2YK3GH-QQ5P6tA_WA2dnJvjnpQ2YZzMY7iVkRl_f4y7u4TGuYSOrMloPr9qammRZgLlZarXkLOOSgARa_hHaP-d2KXY-pqd-DgUGfFdcJd_8-8x-GYodSgZNTqFVjZNuxJkT_nZyUfK8xusdYJ3YMXUwIqLTb-kx_5rxhe6uV_eyVdRC0xvaIntkEcuHxNKNPc1B93aASa2BPHDDV50TA4-Q8mNd-BqwHWw"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute bottom-2 left-2 text-yellow-300 font-bold text-sm drop-shadow">
                    Bollywood &amp; Chill
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[3].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Bollywood &amp; Chill</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Sit back, and chill with Bollywood&apos;s...
                </p>
              </div>

              {/* Card 3: Happy Vibes */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[4])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="Happy Vibes"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm0Wvim7hrP_Ix-Thx7IGW3U-rJxlanKQrxUX6OjQJk0qPzKbCS4DYYEgiG5vVgAbhWL6hw5MC7UnxJnlIvcayJj7Xl9JgsLOYwDrSQwkB5m7J1Hm43pnbNrQPLrmc2xcLDP2bgdV5oQtfKg8n-zyqmPDNNZlutq4auv8Tm3qkuziIgprzK7I9jsi2P-O9LDL1u5uqwc_FLn0ZGMmOxFYBzVjohOFbcYd0Luk6ppN2u_ieXKuLCz8Npw"
                  />
                  <div className="absolute top-2 left-2 text-white/90">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white font-extrabold text-base drop-shadow-md">
                    Happy Vibes
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[4].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Happy Vibes</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Bright, sunny, catchy tunes put a smile on...
                </p>
              </div>

              {/* Card 4: pov: you're in love */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[5])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="In Love"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArPqqhxGNQuAkPXNQ7Qo1IyjZGCe-6UY5BkAdZB840epb7OZ-A-1-PDInctHf_T7lMfoqdhuRB1oUop-bONhFIca7coVES6ug_4vzCnbBCqyJQIo-Wl29YnFx0jy5hg-JEmsqdKqrzT48krptPwCB-AxuaGnaabPDpKcMKXGdKibuwto-_YW8627ehGWTCEkkKqnrlpkFECUxblfTCJAUaCZKZih8iO4l3BfgsT6CTzIrEmIZEfqaiTg"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute top-2 right-2 text-yellow-300 text-xs font-semibold drop-shadow">
                    pov: you&apos;re in love
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[5].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">pov: you&apos;re in love</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Uff, you&apos;ve fallen! 💜
                </p>
              </div>

              {/* Card 5: I-Pop */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[6])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="I-Pop Superhits"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAopyW1fXaxyQ6fqqM6Mu--hATPxza6P9F25-XDm248qRcaYaO_Rk5h-jBQuwDdn4Sjvup5V-uxp69JVf4H-r2_0cw4iE1bc5tsvlDBLWrUQLV0CGvREMXRJyMt9MMr-13SEceLMsdvHb-0OkB5qkRyQ_VhbHiA7RxeBjH2TdVEa68FCX6nZX-cXVQVPDx-DIGbb9YzeFQC97W84sZXg80lxhaUyqrDzvO8bdvNV11puqLD-5-y2tCUVg"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute bottom-2 left-2 text-cyan-400 font-extrabold text-sm drop-shadow">
                    I-Pop
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[6].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">I-Pop Superhits</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Your ultimate daily pop workout boost...
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: More of what you like matching Stitch */}
        {filterTab !== 'podcasts' && (
          <section data-purpose="more-of-what-you-like">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-spotify-textSubdued font-medium tracking-wide">
                  Hear a little bit of everything you love.
                </p>
                <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                  More of what you like
                </h2>
              </div>
              <a className="text-xs font-bold text-spotify-textSubdued hover:underline" href="#">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Card 1: Trending Now Tamil */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[2])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="Trending Tamil"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzoXdIy5kfJYX_DilbwKkzBdT5QMCYwB3-RBVcNsTFcB7t9mpgW0iXB9sqq-EvBpNy4ZRqqf0rTcd39GIsLdYZOmVLOgAmVCyhL67c_8Z-Sys1iqHypd4BVH_UJxidnDfLuOgi18aSZvTwcdA4s99deQda3QjY3nRDGXF2c9bIxRAiadSdQZUh5PV-Dg7WS_SxYTNKx75eUYUxNmFecFf2AYjd_RB7Dwbo4-Q_Rv04XjHp60mNzzlH0A"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-emerald-400 font-extrabold text-base italic leading-tight drop-shadow-md">
                      Trending<br /><span className="text-pink-500">Now Tamil</span>
                    </span>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[2].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Trending Now Tamil</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Top Trending Tamil Songs on Social...
                </p>
              </div>

              {/* Card 2: HOT HITS HINDI */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[7])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-red-950 shadow-lg">
                  <img
                    alt="Hot Hits Hindi"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 filter contrast-125"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXp2Y5r7pWKez5A7kdM13GjwX74bbXtPJbLKDFI7pLaLo7UNF6F1h0L2LW3FsINJQ66qE1Vf8ahdCGcTN6PZsjNR8XvcHJD96VMe0tbqvL1zlUOF56rit2OiEqd2FBtnbwtCJFJNvIc_6VFlNYZGDxuGoeo5h9PD3uRerWz7H5_5KvPdG3uFjue5Foyoj6m2n8baxuPPz_vx79Eynajy90ECk5SsK0e4rXUlVkk0wnBjWrl0ZQE_j8Lg"
                  />
                  <div className="absolute top-2 left-2 text-white">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute top-1 right-2 text-red-500 font-black tracking-widest text-xs">
                    HOT HITS
                  </div>
                  <div className="absolute bottom-2 left-2 text-white font-extrabold text-xs tracking-wider bg-black/60 px-1 py-0.5 rounded">
                    HINDI
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[7].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Hot Hits Hindi</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Hottest Hindi music that India is listening...
                </p>
              </div>

              {/* Card 3: Grand Theft Auto Official Playlist */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[8])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="GTA Playlist"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnaAPj5qow9H9cawa408P83Lle6lbSm0Pm0Po1JEaS61p1dLP9WIVDmczbO9ueJffwozyUbsHi6qyHu62GlZgQgZ44FiK9xjTUhrAdUm9YEP3Sr0Z71lyIfx_8HeVXGFrODbdNgHhh4PytdqiASU3e0WG2-SRO1FmOWA6vXv1jl4SE-BES1tyzEnujvCV84vNF3tHpzZvBRgRHXzuO6WPlV4Tvut01hSA_qn7-5f9YKBVPD_q5gjZNlg"
                  />
                  <div className="absolute top-2 left-2 text-white">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] leading-tight font-bold text-white drop-shadow bg-black/50 p-1 rounded">
                    Grand Theft Auto Official Playlist
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[8].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Grand Theft Auto Official...</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Listen to all the music from Grand Theft Au...
                </p>
              </div>

              {/* Card 4: the beat of your drift (PHONK) */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[9])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-purple-950 shadow-lg">
                  <img
                    alt="PHONK"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 filter hue-rotate-60"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0q7PqQYMt1bwVjLAxGuytTU42EM3iczCuwNsjzeTuVl84Nib7YyGP3ZTuT4FgNXyNS6bdk3_9AWtGkHrbPiGpQQZ2NjhNtHM34tZymmXUa13ZFENmmejd-VCLIF6tkRGWY57D97Un5pdLb1_-aVWaA4NKXUCarsnJczIoDZf3Uax8YUBhMiNa1TMErMUX8zbfu2ms0aeFJkFdaxiDhVnVt_wxKoTnqLCtnECB5Xc_LbWvaJrMQKHpEQ"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute right-2 bottom-2 text-white font-black tracking-widest text-lg rotate-90 origin-bottom-right drop-shadow">
                    PHONK
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[9].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">the beat of your drift</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  the beat of your drift
                </p>
              </div>

              {/* Card 5: Dreamy Chill */}
              <div
                onClick={() => handlePlayOrPauseTrack(INITIAL_TRACKS[10])}
                className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col relative"
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 bg-zinc-800 shadow-lg">
                  <img
                    alt="Dream Chill"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhutN_e5d-q8qaz5HJax0urT6lq-Soxx1coRaITVv7_o0uyDlDSCW2cfSMIdVgGNp20tR2igJEoY22Ue6v4WKmRVvPQ5jiythYoy7v6TuqGPNLJjXjB6YatWQNHbsQNQMGPkuiBvutks7p1JMpGjNNdQMB_z9Z5BkMJuAhKq8YeAayWKSVQk6PPbOJMOYS-KZObQJ9-lZO-BJzQBmqFnUKFpUJem5upVdN5f3gSo6LHqy_2Cp3M6UU4g"
                  />
                  <div className="absolute top-2 left-2 text-[#1ed760]">
                    <i className="fa-brands fa-spotify text-lg drop-shadow"></i>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-xl">
                    <div className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95">
                      <i className={`fa-solid ${currentTrack?.id === INITIAL_TRACKS[10].id && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-sm`}></i>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">Dreamy Chill</h3>
                <p className="text-xs text-spotify-textSubdued truncate-2-lines leading-snug">
                  Relax with ambient chill beats...
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: Popular Artists matching PRD Section 9 */}
        {filterTab !== 'podcasts' && (
          <section data-purpose="popular-artists-row">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                Popular Artists
              </h2>
              <a className="text-xs font-bold text-spotify-textSubdued hover:underline" href="#">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INITIAL_ARTISTS.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => setActiveView({ type: 'artist', id: artist.id })}
                  className="bg-spotify-card hover:bg-spotify-cardHover p-3.5 rounded-md transition duration-200 cursor-pointer group flex flex-col items-center text-center relative"
                >
                  <div className="relative w-36 h-36 rounded-full overflow-hidden mb-3 bg-zinc-800 shadow-lg">
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
        )}

        {/* Podcasts empty/preview view if Podcasts tab selected */}
        {filterTab === 'podcasts' && (
          <div className="py-16 text-center text-spotify-textSubdued space-y-3">
            <i className="fa-solid fa-podcast text-4xl text-zinc-600"></i>
            <h3 className="text-lg font-bold text-white">Podcasts on Web Player</h3>
            <p className="text-xs max-w-sm mx-auto">
              Follow and listen to talk shows, storytelling, and tech podcasts. New episodes release daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
