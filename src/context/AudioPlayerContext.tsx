'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Track, RepeatMode } from '@/types/music';
import { getStoredSettings, saveStoredSettings } from '@/lib/storage/settings';
import { addTrackToHistory } from '@/lib/storage/history';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Initial default track with YouTube integration matching Stitch UI
const INITIAL_YOUTUBE_TRACKS: Track[] = [
  {
    id: 'yt-cMg8KaMdDYo',
    youtubeId: 'cMg8KaMdDYo',
    title: 'Fearless Funk',
    artistId: 'artist-dr-mob',
    artistName: 'DR MØB, Chris Linton',
    albumId: 'album-ncs-release',
    albumName: 'Fearless Funk (Single)',
    artworkUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/maxresdefault.jpg',
    duration: 138,
    genre: 'Electronic / Phonk',
    source: 'YouTube Music'
  },
  {
    id: 'yt-L76eT_L76E',
    youtubeId: 'L76eT_L76E',
    title: 'Tauba Tauba',
    artistName: 'Karan Aujla',
    albumName: 'Bad Newz',
    artworkUrl: 'https://i.ytimg.com/vi/L76eT_L76E/hqdefault.jpg',
    duration: 204,
    genre: 'Punjabi Pop',
    source: 'YouTube Music'
  },
  {
    id: 'yt-b0_i0b5t8jY',
    youtubeId: 'b0_i0b5t8jY',
    title: 'Chuttamalle',
    artistName: 'Anirudh Ravichander, Shilpa Rao',
    albumName: 'Devara',
    artworkUrl: 'https://i.ytimg.com/vi/b0_i0b5t8jY/hqdefault.jpg',
    duration: 220,
    genre: 'Tamil Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt-AKHg502z1LM',
    youtubeId: 'AKHg502z1LM',
    title: 'O Sajni Re',
    artistName: 'Arijit Singh',
    albumName: 'Laapataa Ladies',
    artworkUrl: 'https://i.ytimg.com/vi/AKHg502z1LM/hqdefault.jpg',
    duration: 172,
    genre: 'Bollywood & Chill',
    source: 'YouTube Music'
  },
  {
    id: 'yt-1laX4XUfgkM',
    youtubeId: '1laX4XUfgkM',
    title: 'Tokyo Midnight Drift (PHONK)',
    artistName: 'Kordhell & DVRST Echoes',
    albumName: 'the beat of your drift',
    artworkUrl: 'https://i.ytimg.com/vi/1laX4XUfgkM/hqdefault.jpg',
    duration: 152,
    genre: 'Drift Phonk',
    source: 'YouTube Music'
  }
];

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Track[];
  currentIndex: number;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  isQueueOpen: boolean;
  toggleQueue: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_YOUTUBE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(138);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(INITIAL_YOUTUBE_TRACKS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalQueueRef = useRef<Track[]>(INITIAL_YOUTUBE_TRACKS);

  // Initialize YouTube API & Audio element
  useEffect(() => {
    // 1. Initialize HTML5 audio fallback
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const saved = getStoredSettings();
    setVolumeState(saved.volume);
    setShuffle(saved.shuffle);
    setRepeat(saved.repeat);
    audio.volume = saved.volume;

    const handleAudioTimeUpdate = () => {
      if (!currentTrack?.youtubeId) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleAudioLoadedMetadata = () => {
      if (!currentTrack?.youtubeId && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleAudioEnded = () => {
      if (!currentTrack?.youtubeId) {
        handleNextTrackAuto();
      }
    };

    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);

    // 2. Load YouTube IFrame Player API
    const initYT = () => {
      if (window.YT && window.YT.Player) {
        ytPlayerRef.current = new window.YT.Player('yt-player-container', {
          height: '200',
          width: '200',
          videoId: INITIAL_YOUTUBE_TRACKS[0]?.youtubeId || 'cMg8KaMdDYo',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : ''
          },
          events: {
            onReady: (event: any) => {
              isYtReadyRef.current = true;
              event.target.setVolume(saved.volume * 100);
            },
            onStateChange: (event: any) => {
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) { // ENDED
                handleNextTrackAuto();
              }
            }
          }
        });
      }
    };

    if (typeof window !== 'undefined') {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        window.onYouTubeIframeAPIReady = initYT;
        document.body.appendChild(tag);
      } else {
        initYT();
      }
    }

    // 3. Polling for YouTube player progress tracking
    pollIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const state = ytPlayerRef.current.getPlayerState();
          if (state === 1) { // is playing
            const curr = ytPlayerRef.current.getCurrentTime() || 0;
            const dur = ytPlayerRef.current.getDuration() || 0;
            setCurrentTime(curr);
            if (dur > 0) setDuration(dur);
          }
        } catch {}
      }
    }, 250);

    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleNextTrackAuto = useCallback(() => {
    if (repeat === 'one') {
      if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextTrack = queue[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentTrack(nextTrack);
      playTrackDirect(nextTrack);
    } else if (repeat === 'all' && queue.length > 0) {
      const firstTrack = queue[0];
      setCurrentIndex(0);
      setCurrentTrack(firstTrack);
      playTrackDirect(firstTrack);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue, repeat, currentTrack]);

  const playTrackDirect = useCallback((track: Track) => {
    if (track.youtubeId) {
      // Pause HTML5 audio
      if (audioRef.current) audioRef.current.pause();

      if (ytPlayerRef.current && isYtReadyRef.current) {
        ytPlayerRef.current.loadVideoById(track.youtubeId);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (track.audioUrl) {
      // Pause YouTube player
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try { ytPlayerRef.current.pauseVideo(); } catch {}
      }
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
    addTrackToHistory(track);
  }, []);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    const activeQueue = newQueue || queue;
    let idx = activeQueue.findIndex(t => t.id === track.id || (t.youtubeId && t.youtubeId === track.youtubeId));
    if (idx === -1) {
      activeQueue.push(track);
      idx = activeQueue.length - 1;
    }

    if (newQueue) {
      originalQueueRef.current = newQueue;
      setQueue(newQueue);
    }

    setCurrentIndex(idx);
    setCurrentTrack(track);
    playTrackDirect(track);
  }, [queue, playTrackDirect]);

  const togglePlay = useCallback(() => {
    if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
      try {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) { // Playing
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          addTrackToHistory(currentTrack);
        }
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentTrack?.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (currentTrack) addTrackToHistory(currentTrack);
      }).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    const nextTrack = queue[nextIdx];
    setCurrentIndex(nextIdx);
    setCurrentTrack(nextTrack);
    playTrackDirect(nextTrack);
  }, [currentIndex, queue, playTrackDirect]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const prevIdx = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevTrack = queue[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentTrack(prevTrack);
    playTrackDirect(prevTrack);
  }, [currentIndex, queue, currentTime, playTrackDirect]);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
    if (currentTrack?.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.seekTo(time, true);
      } catch {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, [currentTrack]);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.setVolume(isMuted ? 0 : val * 100);
      } catch {}
    }
    saveStoredSettings({ volume: val });
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          if (next) ytPlayerRef.current.mute();
          else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volume * 100);
          }
        } catch {}
      }
      return next;
    });
  }, [volume]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev;
      saveStoredSettings({ shuffle: next });

      if (next) {
        const rest = queue.filter(t => t.id !== currentTrack?.id);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        const newQ = currentTrack ? [currentTrack, ...shuffled] : shuffled;
        setQueue(newQ);
        setCurrentIndex(0);
      } else {
        const restored = originalQueueRef.current;
        setQueue(restored);
        const idx = restored.findIndex(t => t.id === currentTrack?.id);
        setCurrentIndex(idx >= 0 ? idx : 0);
      }
      return next;
    });
  }, [queue, currentTrack]);

  const cycleRepeat = useCallback(() => {
    setRepeat(prev => {
      const next: RepeatMode = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      saveStoredSettings({ repeat: next });
      return next;
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    originalQueueRef.current.push(track);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setCurrentIndex(0);
    } else {
      setQueue([]);
      setCurrentIndex(-1);
    }
  }, [currentTrack]);

  const toggleQueue = useCallback(() => {
    setIsQueueOpen(prev => !prev);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        shuffle,
        repeat,
        queue,
        currentIndex,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isQueueOpen,
        toggleQueue
      }}
    >
      {/* Hidden YouTube Player IFrame container for pure audio stream playback */}
      <div
        id="yt-player-container"
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -100
        }}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
