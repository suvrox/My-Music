'use client';

import React, { useRef, useState } from 'react';
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

  // Dragging states for smooth slider interaction
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [dragSeekTime, setDragSeekTime] = useState(0);

  const activeCurrentTime = isDraggingSeek ? dragSeekTime : currentTime;
  const progressPercent = duration > 0 ? (activeCurrentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;
  const isCurrentFav = currentTrack ? isFavorite(currentTrack.id) : false;

  // Pointer drag handler for Progress Scrubber
  const handleSeekPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    setIsDraggingSeek(true);

    const calcTime = (clientX: number) => {
      if (!progressBarRef.current) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetTime = ratio * duration;
      setDragSeekTime(targetTime);
      return targetTime;
    };

    calcTime(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      calcTime(ev.clientX);
    };

    const onPointerUp = (ev: PointerEvent) => {
      const finalTime = calcTime(ev.clientX);
      seek(finalTime);
      setIsDraggingSeek(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Pointer drag handler for Volume Bar
  const handleVolumePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;

    const calcVolume = (clientX: number) => {
      if (!volumeBarRef.current) return;
      const rect = volumeBarRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      setVolume(ratio);
    };

    calcVolume(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      calcVolume(ev.clientX);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
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
        {currentTrack ? (
          <>
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-zinc-900 shadow">
              <img
                alt={currentTrack.title}
                className="w-full h-full object-cover filter contrast-125 brightness-90"
                src={
                  currentTrack.artworkUrl ||
                  `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
                }
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (currentTrack.youtubeId && !target.src.includes(currentTrack.youtubeId)) {
                    target.src = `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
            </div>
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer" title={currentTrack.title}>
                {currentTrack.title}
              </span>
              <span className="text-xs text-spotify-textSubdued truncate hover:underline cursor-pointer" title={currentTrack.artistName}>
                {currentTrack.artistName}
              </span>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack)}
              className="text-spotify-green hover:scale-105 transition ml-1 cursor-pointer flex-shrink-0"
              title={isCurrentFav ? 'Saved' : 'Save track'}
            >
              <i className={`text-base ${isCurrentFav ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued hover:text-white'}`}></i>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 text-spotify-textSubdued">
            <div className="w-12 h-12 rounded bg-zinc-900/90 flex items-center justify-center text-zinc-600 border border-zinc-800">
              <i className="fa-solid fa-music text-base"></i>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-300">No track playing</span>
              <span className="text-[11px] text-zinc-500">Choose a song to start</span>
            </div>
          </div>
        )}
      </div>

      {/* Center Section: Playback Controls & Progress Bar */}
      <div className="flex flex-col items-center w-[40%] max-w-[650px] gap-1.5">
        {/* Player Buttons */}
        <div className="flex items-center gap-5 text-spotify-textSubdued">
          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            className={`transition text-xs cursor-pointer relative p-1.5 ${
              shuffle ? 'text-spotify-green hover:scale-105' : 'text-spotify-textSubdued hover:text-white'
            }`}
            title={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <i className="fa-solid fa-shuffle"></i>
            {shuffle && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
            )}
          </button>

          {/* Previous Button */}
          <button
            onClick={playPrev}
            className="hover:text-white transition text-sm cursor-pointer p-1"
            title="Previous (or restart song)"
          >
            <i className="fa-solid fa-backward-step"></i>
          </button>

          {/* Circular Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className={`w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition shadow ${
              currentTrack
                ? 'hover:scale-105 active:scale-95 cursor-pointer hover:bg-zinc-200'
                : 'opacity-50 cursor-not-allowed'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            className="hover:text-white transition text-sm cursor-pointer p-1"
            title="Next song"
          >
            <i className="fa-solid fa-forward-step"></i>
          </button>

          {/* Repeat Button */}
          <button
            onClick={cycleRepeat}
            className={`transition text-xs cursor-pointer relative p-1.5 ${
              repeat !== 'off' ? 'text-spotify-green hover:scale-105' : 'text-spotify-textSubdued hover:text-white'
            }`}
            title={`Repeat mode: ${repeat === 'off' ? 'Off' : repeat === 'all' ? 'Repeat all' : 'Repeat one'}`}
          >
            <i className="fa-solid fa-repeat"></i>
            {repeat === 'one' && (
              <span className="absolute top-0 right-0 text-[8px] font-extrabold leading-none bg-spotify-green text-black rounded-full px-0.5">
                1
              </span>
            )}
            {repeat !== 'off' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
            )}
          </button>
        </div>

        {/* Scrubber Seek Bar with Drag Support */}
        <div className="w-full flex items-center gap-2 text-[11px] text-spotify-textSubdued font-mono">
          <span className="w-10 text-right">{formatTime(activeCurrentTime)}</span>
          {/* Progress track container */}
          <div
            ref={progressBarRef}
            onPointerDown={handleSeekPointerDown}
            className="flex-1 h-3 flex items-center relative group cursor-pointer touch-none"
          >
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white group-hover:bg-spotify-green rounded-full relative transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              ></div>
            </div>
            {/* Thumb */}
            <div
              className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none"
              style={{ left: `calc(${Math.min(100, Math.max(0, progressPercent))}% - 6px)` }}
            ></div>
          </div>
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section: Volume and Device Controls */}
      <div className="flex items-center justify-end gap-3 text-spotify-textSubdued w-[30%] min-w-[200px]">
        <button
          className="hover:text-white transition text-xs cursor-pointer p-1"
          title="Lyrics"
        >
          <i className="fa-solid fa-microphone"></i>
        </button>

        <button
          onClick={toggleQueue}
          className={`transition text-xs cursor-pointer p-1 ${
            isQueueOpen ? 'text-spotify-green' : 'hover:text-white'
          }`}
          title="Queue"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <button
          className="hover:text-white transition text-xs cursor-pointer p-1"
          title="Connect to a device"
        >
          <i className="fa-solid fa-computer"></i>
        </button>

        {/* Volume Slider with Drag Support */}
        <div className="flex items-center gap-1.5 group">
          <button
            onClick={toggleMute}
            className="hover:text-white transition text-xs cursor-pointer p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <i
              className={`fa-solid ${
                isMuted || volume === 0
                  ? 'fa-volume-xmark text-red-400'
                  : volume < 0.5
                  ? 'fa-volume-low text-white'
                  : 'fa-volume-high text-white'
              }`}
            ></i>
          </button>
          <div
            ref={volumeBarRef}
            onPointerDown={handleVolumePointerDown}
            className="w-20 h-3 flex items-center relative cursor-pointer group touch-none"
          >
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
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
          className="hover:text-white transition text-xs cursor-pointer p-1"
          title="Miniplayer"
        >
          <i className="fa-solid fa-film"></i>
        </button>

        <button
          onClick={handleFullScreen}
          className="hover:text-white transition text-xs cursor-pointer p-1"
          title="Full screen"
        >
          <i className="fa-solid fa-expand"></i>
        </button>
      </div>
    </footer>
  );
}
