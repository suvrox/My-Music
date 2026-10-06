'use client';

import React, { useRef } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatTime } from '@/lib/utils';

export function BottomPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    isQueueOpen,
    toggleQueue
  } = useAudioPlayer();

  const { isFavorite, toggleFavorite } = useFavorites();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;
  const isCurrentFav = currentTrack ? isFavorite(currentTrack.id) : false;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(ratio);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <footer
      className="h-[76px] bg-black border-t border-zinc-900 px-4 flex items-center justify-between select-none z-50 flex-shrink-0"
      data-purpose="persistent-audio-player"
    >
      {/* Left Section: Track Info Mini Widget */}
      <div className="flex items-center gap-3.5 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-zinc-900 shadow">
          <img
            alt={currentTrack?.title || 'Currently Playing'}
            className="w-full h-full object-cover filter contrast-125 brightness-75"
            src={
              currentTrack?.artworkUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAzWdoH6WxNHi1JSIbUqB4F-my1SN3_Fzv9LeJRNPwLDcazlunj7VV7g1Bfo38Q89V1wEKvR4ZJQROfNnQn5sMHvkGvcy3MgcpDO4kHyIhXeHRBY7-i6pjU_K7Q5r9NCzwDTB3U0VH17D6j0ZY2cUvy9QxYZX_rMjKzG817To6Nicf2bPEbY4hyokAZlE2_JH9Q9HOnCenWIA7M3nPdT2ppc2RBXirnVqjJyYdag3mdRteK8wf1YK6PpA'
            }
          />
        </div>
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
            {currentTrack?.title || 'Fearless Funk'}
          </span>
          <span className="text-xs text-spotify-textSubdued truncate hover:underline cursor-pointer">
            {currentTrack?.artistName || 'DR MØB, Chris Linton'}
          </span>
        </div>
        <button
          onClick={() => currentTrack && toggleFavorite(currentTrack)}
          className="text-spotify-green hover:scale-105 transition ml-1 cursor-pointer flex-shrink-0"
          title={isCurrentFav ? 'Saved' : 'Save track'}
        >
          <i className={`text-base ${isCurrentFav ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued hover:text-white'}`}></i>
        </button>
      </div>

      {/* Center Section: Playback Controls & Progress Bar */}
      <div className="flex flex-col items-center w-[40%] max-w-[650px] gap-1.5">
        {/* Player Buttons */}
        <div className="flex items-center gap-5 text-spotify-textSubdued">
          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            className={`transition text-xs cursor-pointer relative ${
              shuffle ? 'text-spotify-green' : 'hover:text-white'
            }`}
            title={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <i className="fa-solid fa-shuffle"></i>
            {shuffle && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
            )}
          </button>

          {/* Previous Button */}
          <button
            onClick={playPrev}
            className="hover:text-white transition text-sm cursor-pointer"
            title="Previous"
          >
            <i className="fa-solid fa-backward-step"></i>
          </button>

          {/* Circular Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition cursor-pointer shadow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            className="hover:text-white transition text-sm cursor-pointer"
            title="Next"
          >
            <i className="fa-solid fa-forward-step"></i>
          </button>

          {/* Repeat Button */}
          <button
            onClick={cycleRepeat}
            className={`transition text-xs cursor-pointer relative ${
              repeat !== 'off' ? 'text-spotify-green' : 'hover:text-white'
            }`}
            title={`Repeat mode: ${repeat.toUpperCase()}`}
          >
            <i className="fa-solid fa-repeat"></i>
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold">1</span>
            )}
            {repeat !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
            )}
          </button>
        </div>

        {/* Scrubber Seek Bar */}
        <div className="w-full flex items-center gap-2 text-[11px] text-spotify-textSubdued font-mono">
          <span>{formatTime(currentTime)}</span>
          {/* Progress track container */}
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer py-1 -my-1"
          >
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-spotify-green rounded-full relative transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              ></div>
            </div>
            {/* Hover thumb */}
            <div
              className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none"
              style={{ left: `calc(${Math.min(100, Math.max(0, progressPercent))}% - 6px)` }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section: Volume and Device Controls */}
      <div className="flex items-center justify-end gap-3 text-spotify-textSubdued w-[30%] min-w-[200px]">
        <button
          className="hover:text-white transition text-xs cursor-pointer"
          title="Lyrics"
        >
          <i className="fa-solid fa-microphone"></i>
        </button>

        <button
          onClick={toggleQueue}
          className={`transition text-xs cursor-pointer ${
            isQueueOpen ? 'text-spotify-green' : 'hover:text-white'
          }`}
          title="Queue"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <button
          className="hover:text-white transition text-xs cursor-pointer"
          title="Connect to a device"
        >
          <i className="fa-solid fa-computer"></i>
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-1.5 group">
          <button
            onClick={toggleMute}
            className="hover:text-white transition text-xs cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <i
              className={`fa-solid ${
                isMuted || volume === 0
                  ? 'fa-volume-xmark text-red-400'
                  : volume < 0.5
                  ? 'fa-volume-low'
                  : 'fa-volume-high'
              }`}
            ></i>
          </button>
          <div
            ref={volumeBarRef}
            onClick={handleVolumeClick}
            className="w-20 h-1 bg-zinc-800 rounded-full relative cursor-pointer py-1 -my-1"
          >
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-spotify-green rounded-full relative transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(0, volumePercent))}%` }}
              ></div>
            </div>
            <div
              className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow pointer-events-none"
              style={{ left: `calc(${Math.min(100, Math.max(0, volumePercent))}% - 5px)` }}
            ></div>
          </div>
        </div>

        <button
          className="hover:text-white transition text-xs cursor-pointer"
          title="Miniplayer"
        >
          <i className="fa-solid fa-film"></i>
        </button>

        <button
          onClick={handleFullScreen}
          className="hover:text-white transition text-xs cursor-pointer"
          title="Full screen"
        >
          <i className="fa-solid fa-expand"></i>
        </button>
      </div>
    </footer>
  );
}
