'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Track, RepeatMode } from '@/types/music';
import { INITIAL_TRACKS } from '@/lib/music/providers/catalog';
import { getStoredSettings, saveStoredSettings } from '@/lib/storage/settings';
import { addTrackToHistory } from '@/lib/storage/history';

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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(7); // matching Stitch initial 0:07
  const [duration, setDuration] = useState<number>(138); // matching Stitch initial 2:18
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(INITIAL_TRACKS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const originalQueueRef = useRef<Track[]>(INITIAL_TRACKS);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  // Initialize audio and settings on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const saved = getStoredSettings();
    setVolumeState(saved.volume);
    setShuffle(saved.shuffle);
    setRepeat(saved.repeat);
    audio.volume = saved.volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      handleNextTrackAuto();
    };

    const handleError = () => {
      console.warn('Playback error for audio URL:', audio.src);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (INITIAL_TRACKS[0]?.audioUrl) {
      audio.src = INITIAL_TRACKS[0].audioUrl;
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  const handleNextTrackAuto = useCallback(() => {
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextTrack = queue[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentTrack(nextTrack);
      if (audioRef.current && nextTrack.audioUrl) {
        audioRef.current.src = nextTrack.audioUrl;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        addTrackToHistory(nextTrack);
      }
    } else if (repeat === 'all' && queue.length > 0) {
      const firstTrack = queue[0];
      setCurrentIndex(0);
      setCurrentTrack(firstTrack);
      if (audioRef.current && firstTrack.audioUrl) {
        audioRef.current.src = firstTrack.audioUrl;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        addTrackToHistory(firstTrack);
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, queue, repeat]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    const activeQueue = newQueue || queue;
    let idx = activeQueue.findIndex(t => t.id === track.id);
    if (idx === -1) {
      // Append to queue if not present
      activeQueue.push(track);
      idx = activeQueue.length - 1;
    }

    if (newQueue) {
      originalQueueRef.current = newQueue;
      setQueue(newQueue);
    }

    setCurrentIndex(idx);
    setCurrentTrack(track);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Autoplay prevented or network error:', e);
        setIsPlaying(false);
      });
    }

    addTrackToHistory(track);
  }, [queue]);

  const togglePlay = useCallback(() => {
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
      }).catch((e) => {
        console.warn('Playback error:', e);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, currentTrack]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    const nextTrack = queue[nextIdx];
    setCurrentIndex(nextIdx);
    setCurrentTrack(nextTrack);

    if (audioRef.current) {
      audioRef.current.src = nextTrack.audioUrl;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    addTrackToHistory(nextTrack);
  }, [currentIndex, queue]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    // If > 3 seconds into track, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIdx = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevTrack = queue[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentTrack(prevTrack);

    if (audioRef.current) {
      audioRef.current.src = prevTrack.audioUrl;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    addTrackToHistory(prevTrack);
  }, [currentIndex, queue]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    saveStoredSettings({ volume: val });
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev;
      saveStoredSettings({ shuffle: next });

      if (next) {
        // Randomize queue while keeping currentTrack at index 0
        const rest = queue.filter(t => t.id !== currentTrack?.id);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        const newQ = currentTrack ? [currentTrack, ...shuffled] : shuffled;
        setQueue(newQ);
        setCurrentIndex(0);
      } else {
        // Restore original queue order
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
