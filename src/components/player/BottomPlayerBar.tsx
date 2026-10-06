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

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  return (
    <>
      <footer
        className="fixed bottom-[60px] left-2 right-2 md:static md:bottom-auto md:left-auto md:right-auto md:w-full h-[58px] md:h-[76px] bg-zinc-900/95 md:bg-black border border-zinc-800 md:border-t md:border-b-0 md:border-x-0 rounded-xl md:rounded-none px-3 md:px-4 flex items-center justify-between select-none z-40 md:z-50 shadow-2xl md:shadow-none backdrop-blur-md md:backdrop-blur-none flex-shrink-0"
        data-purpose="persistent-audio-player"
      >
        {/* Top Progress Line on Mobile */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-zinc-800 md:hidden overflow-hidden rounded-t-xl">
          <div
            className="h-full bg-spotify-green transition-all duration-75"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Left Section: Track Info Mini Widget (Tapping on mobile opens full player) */}
        <div
          onClick={() => currentTrack && setIsMobileModalOpen(true)}
          className="flex items-center gap-2.5 sm:gap-3.5 flex-1 md:w-[30%] md:flex-initial min-w-0 cursor-pointer md:cursor-default"
        >
          {currentTrack ? (
            <>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded overflow-hidden flex-shrink-0 bg-zinc-900 shadow">
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
              <div className="flex flex-col min-w-0 pr-1 flex-1">
                <span className="text-xs md:text-sm font-semibold text-white truncate hover:underline" title={currentTrack.title}>
                  {currentTrack.title}
                </span>
                <span className="text-[11px] md:text-xs text-spotify-textSubdued truncate hover:underline" title={currentTrack.artistName}>
                  {currentTrack.artistName}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(currentTrack);
                }}
                className="text-spotify-green hover:scale-105 transition ml-1 cursor-pointer flex-shrink-0 hidden sm:inline-flex"
                title={isCurrentFav ? 'Saved' : 'Save track'}
              >
                <i className={`text-base ${isCurrentFav ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued hover:text-white'}`}></i>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5 text-spotify-textSubdued">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded bg-zinc-900/90 flex items-center justify-center text-zinc-600 border border-zinc-800">
                <i className="fa-solid fa-music text-sm md:text-base"></i>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-zinc-300">No track playing</span>
                <span className="text-[10px] md:text-[11px] text-zinc-500">Choose a song to start</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-Only Quick Playback Buttons (Right side on mobile) */}
        <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
          {currentTrack && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(currentTrack);
              }}
              className="text-spotify-green p-1.5 cursor-pointer transition active:scale-90"
              title="Favorite"
            >
              <i className={`text-base ${isCurrentFav ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-spotify-textSubdued'}`}></i>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            disabled={!currentTrack}
            className={`w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow transition ${
              currentTrack ? 'active:scale-95 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playNext();
            }}
            disabled={!currentTrack}
            className={`p-1.5 text-spotify-textSubdued hover:text-white transition ${
              currentTrack ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
            title="Next"
          >
            <i className="fa-solid fa-forward-step text-sm"></i>
          </button>
        </div>

        {/* Center Section: Desktop Playback Controls & Progress Bar */}
        <div className="hidden md:flex flex-col items-center w-[40%] max-w-[650px] gap-1.5">
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
              disabled={!currentTrack}
              className={`hover:text-white transition text-sm p-1 ${currentTrack ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              title="Previous"
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
              disabled={!currentTrack}
              className={`hover:text-white transition text-sm p-1 ${currentTrack ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
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

        {/* Right Section: Desktop Volume and Device Controls */}
        <div className="hidden md:flex items-center justify-end gap-3 text-spotify-textSubdued w-[30%] min-w-[200px]">
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
            onClick={handleFullScreen}
            className="hover:text-white transition text-xs cursor-pointer p-1"
            title="Full screen"
          >
            <i className="fa-solid fa-expand"></i>
          </button>
        </div>
      </footer>

      {/* Fullscreen Mobile Now Playing Sheet */}
      {isMobileModalOpen && currentTrack && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 flex flex-col justify-between md:hidden animate-in slide-in-from-bottom duration-300">
          {/* Top Bar with Down Chevron */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileModalOpen(false)}
              className="text-white p-2 -ml-2 text-lg active:scale-90 transition cursor-pointer"
              title="Close player"
            >
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <div className="text-center flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Playing from
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[200px]">
                {currentTrack.genre || 'YouTube Music'}
              </span>
            </div>
            <button
              onClick={() => toggleQueue()}
              className={`p-2 -mr-2 text-sm transition cursor-pointer ${
                isQueueOpen ? 'text-spotify-green' : 'text-zinc-400 hover:text-white'
              }`}
              title="Queue"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          {/* Large Album Artwork */}
          <div className="my-auto py-4 flex justify-center">
            <div className="w-[78vw] max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 bg-zinc-900">
              <img
                src={
                  currentTrack.artworkUrl ||
                  `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`
                }
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (currentTrack.youtubeId && !target.src.includes(currentTrack.youtubeId)) {
                    target.src = `https://i.ytimg.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
            </div>
          </div>

          {/* Track Info & Like */}
          <div className="space-y-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 pr-3">
                <h2 className="text-xl font-bold text-white truncate" title={currentTrack.title}>
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-spotify-textSubdued truncate" title={currentTrack.artistName}>
                  {currentTrack.artistName}
                </p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack)}
                className="text-spotify-green text-xl active:scale-125 transition p-2 cursor-pointer flex-shrink-0"
                title={isCurrentFav ? 'Saved' : 'Save track'}
              >
                <i className={`${isCurrentFav ? 'fa-solid fa-circle-check' : 'fa-regular fa-heart text-white/80'}`}></i>
              </button>
            </div>

            {/* Scrubber Seek Bar */}
            <div className="space-y-1">
              <div
                ref={progressBarRef}
                onPointerDown={handleSeekPointerDown}
                className="w-full h-5 flex items-center relative cursor-pointer touch-none"
              >
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow pointer-events-none"
                  style={{ left: `calc(${Math.min(100, Math.max(0, progressPercent))}% - 7px)` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>{formatTime(activeCurrentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between px-2 pt-2">
              <button
                onClick={toggleShuffle}
                className={`text-base p-2 active:scale-90 transition ${
                  shuffle ? 'text-spotify-green' : 'text-zinc-400'
                }`}
                title="Shuffle"
              >
                <i className="fa-solid fa-shuffle"></i>
              </button>

              <button
                onClick={playPrev}
                className="text-xl text-white p-2 active:scale-90 transition"
                title="Previous"
              >
                <i className="fa-solid fa-backward-step"></i>
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
              </button>

              <button
                onClick={playNext}
                className="text-xl text-white p-2 active:scale-90 transition"
                title="Next"
              >
                <i className="fa-solid fa-forward-step"></i>
              </button>

              <button
                onClick={cycleRepeat}
                className={`text-base p-2 active:scale-90 transition relative ${
                  repeat !== 'off' ? 'text-spotify-green' : 'text-zinc-400'
                }`}
                title="Repeat"
              >
                <i className="fa-solid fa-repeat"></i>
                {repeat === 'one' && (
                  <span className="absolute top-1 right-1 text-[8px] font-bold bg-spotify-green text-black rounded-full px-0.5">
                    1
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
