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

// Initial default tracks with YouTube IDs
const INITIAL_YOUTUBE_TRACKS: Track[] = [
  {
    id: 'yt-cMg8KaMdDYo',
    youtubeId: 'cMg8KaMdDYo',
    title: 'Fearless Funk',
    artistId: 'artist-dr-mob',
    artistName: 'DR MØB, Chris Linton',
    albumId: 'album-ncs-release',
    albumName: 'Fearless Funk (Single)',
    artworkUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/hqdefault.jpg',
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
  recommendations: Track[];
  isRecommendationsLoading: boolean;
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
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  // Synchronization refs to prevent stale closure bugs in callbacks
  const currentTrackRef = useRef<Track | null>(currentTrack);
  currentTrackRef.current = currentTrack;

  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const volumeRef = useRef<number>(volume);
  volumeRef.current = volume;

  const isMutedRef = useRef<boolean>(isMuted);
  isMutedRef.current = isMuted;

  const repeatRef = useRef<RepeatMode>(repeat);
  repeatRef.current = repeat;

  const queueRef = useRef<Track[]>(queue);
  queueRef.current = queue;

  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const recommendationsRef = useRef<Track[]>(recommendations);
  recommendationsRef.current = recommendations;

  const originalQueueRef = useRef<Track[]>(INITIAL_YOUTUBE_TRACKS);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pendingTrackRef = useRef<Track | null>(null);
  const pendingPlayRef = useRef<boolean>(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Direct playback execution
  const playTrackDirect = useCallback((track: Track) => {
    currentTrackRef.current = track;
    setCurrentTrack(track);

    if (track.youtubeId) {
      if (audioRef.current) audioRef.current.pause();

      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.loadVideoById(track.youtubeId);
          ytPlayerRef.current.playVideo();

          const volVal = isMutedRef.current ? 0 : volumeRef.current * 100;
          ytPlayerRef.current.setVolume(volVal);
          if (isMutedRef.current) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();

          setIsPlaying(true);
        } catch (err) {
          console.warn('YouTube loadVideoById error:', err);
        }
      } else {
        pendingTrackRef.current = track;
        pendingPlayRef.current = true;
        setIsPlaying(true);
      }
    } else if (track.audioUrl) {
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try { ytPlayerRef.current.pauseVideo(); } catch {}
      }
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = isMutedRef.current ? 0 : volumeRef.current;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }

    addTrackToHistory(track);
  }, []);

  // Auto-advance track when current song finishes
  const handleNextTrackAuto = useCallback(() => {
    const curRepeat = repeatRef.current;
    const curQueue = queueRef.current;
    const curIdx = currentIndexRef.current;
    const curTrack = currentTrackRef.current;

    // Repeat one track mode
    if (curRepeat === 'one' && curTrack) {
      if (curTrack.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch {}
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // Play next song in queue
    if (curIdx < curQueue.length - 1) {
      const nextIdx = curIdx + 1;
      const nextTrack = curQueue[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentTrack(nextTrack);
      playTrackDirect(nextTrack);
    } else if (curRepeat === 'all' && curQueue.length > 0) {
      // Loop back to beginning of queue
      const firstTrack = curQueue[0];
      setCurrentIndex(0);
      setCurrentTrack(firstTrack);
      playTrackDirect(firstTrack);
    } else {
      // Queue finished: automatically play from YouTube recommendations for continuous stream!
      const unplayedRec = recommendationsRef.current.find(
        r => !curQueue.some(q => q.id === r.id || (q.youtubeId && q.youtubeId === r.youtubeId))
      );

      if (unplayedRec) {
        const updated = [...curQueue, unplayedRec];
        queueRef.current = updated;
        setQueue(updated);
        const nextIdx = updated.length - 1;
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
        setCurrentTrack(unplayedRec);
        playTrackDirect(unplayedRec);
      } else {
        setIsPlaying(false);
      }
    }
  }, [playTrackDirect]);

  // Fetch real-time YouTube recommendations whenever the current track changes
  useEffect(() => {
    if (!currentTrack) return;
    setIsRecommendationsLoading(true);

    const params = new URLSearchParams({
      trackId: currentTrack.id,
      youtubeId: currentTrack.youtubeId || '',
      title: currentTrack.title,
      artistName: currentTrack.artistName,
      genre: currentTrack.genre || ''
    });

    fetch(`/api/music/recommendations?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.tracks && Array.isArray(data.tracks)) {
          setRecommendations(data.tracks);
          recommendationsRef.current = data.tracks;
        }
      })
      .catch(() => {})
      .finally(() => setIsRecommendationsLoading(false));
  }, [currentTrack?.id]);

  // Initialize Audio & YouTube API on Mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const saved = getStoredSettings();
    setVolumeState(saved.volume);
    volumeRef.current = saved.volume;
    setShuffle(saved.shuffle);
    setRepeat(saved.repeat);
    repeatRef.current = saved.repeat;
    audio.volume = saved.volume;

    const handleAudioTimeUpdate = () => {
      if (!currentTrackRef.current?.youtubeId) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleAudioLoadedMetadata = () => {
      if (!currentTrackRef.current?.youtubeId && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleAudioEnded = () => {
      if (!currentTrackRef.current?.youtubeId) {
        handleNextTrackAuto();
      }
    };

    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);

    // Suppress cross-origin frame access SecurityErrors caused by YouTube iframe postMessage inspections
    const handleSecurityError = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes('SecurityError') ||
          event.message.includes('cross-origin') ||
          event.message.includes('document'))
      ) {
        event.preventDefault();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleSecurityError);
    }

    // Mount YouTube player host element strictly on document.body outside of React's Virtual DOM
    let host = document.getElementById('yt-player-host');
    if (!host && typeof document !== 'undefined') {
      host = document.createElement('div');
      host.id = 'yt-player-host';
      host.style.position = 'fixed';
      host.style.bottom = '0';
      host.style.right = '0';
      host.style.width = '200px';
      host.style.height = '200px';
      host.style.pointerEvents = 'none';
      host.style.opacity = '0.001';
      host.style.zIndex = '-999';
      host.style.overflow = 'hidden';

      const inner = document.createElement('div');
      inner.id = 'yt-player-container';
      host.appendChild(inner);
      document.body.appendChild(host);
    }

    // Initialize YouTube Player instance
    const initYT = () => {
      if (typeof window === 'undefined' || !window.YT || !window.YT.Player) return false;
      if (ytPlayerRef.current) return true;

      const container = document.getElementById('yt-player-container');
      if (!container) return false;

      try {
        ytPlayerRef.current = new window.YT.Player('yt-player-container', {
          height: '200',
          width: '200',
          videoId: currentTrackRef.current?.youtubeId || INITIAL_YOUTUBE_TRACKS[0]?.youtubeId || 'cMg8KaMdDYo',
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
              const curVol = volumeRef.current;
              const curMuted = isMutedRef.current;
              event.target.setVolume(curMuted ? 0 : curVol * 100);
              if (curMuted) event.target.mute();

              if (pendingTrackRef.current?.youtubeId) {
                event.target.loadVideoById(pendingTrackRef.current.youtubeId);
                if (pendingPlayRef.current) {
                  event.target.playVideo();
                  setIsPlaying(true);
                }
                pendingTrackRef.current = null;
                pendingPlayRef.current = false;
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) { // ENDED
                handleNextTrackAuto();
              }
            },
            onError: (event: any) => {
              console.warn('YouTube Player error event:', event.data);
              handleNextTrackAuto();
            }
          }
        });
        return true;
      } catch (e) {
        console.error('Error creating YouTube player:', e);
        return false;
      }
    };

    if (typeof window !== 'undefined') {
      const isAlreadyReady = initYT();
      if (!isAlreadyReady) {
        const oldCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (oldCallback) oldCallback();
          initYT();
        };

        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(tag);
        }

        let attempts = 0;
        const ytCheckTimer = setInterval(() => {
          attempts++;
          if (initYT() || attempts > 25) {
            clearInterval(ytCheckTimer);
          }
        }, 200);
      }
    }

    // Polling interval for accurate YouTube playback position & duration
    pollIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const state = ytPlayerRef.current.getPlayerState();
          if (state === 1 || state === 3) {
            const curr = ytPlayerRef.current.getCurrentTime() || 0;
            const dur = ytPlayerRef.current.getDuration() || 0;
            setCurrentTime(curr);
            if (dur > 0 && isFinite(dur)) {
              setDuration(dur);
            }
          }
        } catch {}
      }
    }, 250);

    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleSecurityError);
      }
      audio.pause();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [handleNextTrackAuto]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    const activeQueue = newQueue ? [...newQueue] : queueRef.current;
    let idx = activeQueue.findIndex(t => t.id === track.id || (t.youtubeId && t.youtubeId === track.youtubeId));
    if (idx === -1) {
      activeQueue.push(track);
      idx = activeQueue.length - 1;
    }

    if (newQueue) {
      originalQueueRef.current = [...newQueue];
      queueRef.current = activeQueue;
      setQueue(activeQueue);
    }

    currentIndexRef.current = idx;
    setCurrentIndex(idx);
    playTrackDirect(track);
  }, [playTrackDirect]);

  const togglePlay = useCallback(() => {
    const track = currentTrackRef.current;
    if (!track) return;

    if (track.youtubeId) {
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          const state = ytPlayerRef.current.getPlayerState();
          if (state === 1 || state === 3) {
            ytPlayerRef.current.pauseVideo();
            setIsPlaying(false);
          } else {
            ytPlayerRef.current.playVideo();
            const curVol = isMutedRef.current ? 0 : volumeRef.current * 100;
            ytPlayerRef.current.setVolume(curVol);
            if (isMutedRef.current) ytPlayerRef.current.mute();
            else ytPlayerRef.current.unMute();
            setIsPlaying(true);
            addTrackToHistory(track);
          }
        } catch {
          setIsPlaying(false);
        }
      } else {
        pendingTrackRef.current = track;
        pendingPlayRef.current = !isPlayingRef.current;
        setIsPlaying(!isPlayingRef.current);
      }
      return;
    }

    if (!audioRef.current) return;
    if (isPlayingRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && track.audioUrl) {
        audioRef.current.src = track.audioUrl;
      }
      audioRef.current.volume = isMutedRef.current ? 0 : volumeRef.current;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          addTrackToHistory(track);
        })
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const playNext = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    const curIdx = currentIndexRef.current;

    if (curIdx < q.length - 1) {
      const nextIdx = curIdx + 1;
      const nextTrack = q[nextIdx];
      currentIndexRef.current = nextIdx;
      setCurrentIndex(nextIdx);
      setCurrentTrack(nextTrack);
      playTrackDirect(nextTrack);
    } else {
      // If at end of queue, try playing next recommendation
      const unplayedRec = recommendationsRef.current.find(
        r => !q.some(item => item.id === r.id || (item.youtubeId && item.youtubeId === r.youtubeId))
      );
      if (unplayedRec) {
        const updated = [...q, unplayedRec];
        queueRef.current = updated;
        setQueue(updated);
        const nextIdx = updated.length - 1;
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
        setCurrentTrack(unplayedRec);
        playTrackDirect(unplayedRec);
      } else {
        // Loop back if repeat all
        if (repeatRef.current === 'all' && q.length > 0) {
          currentIndexRef.current = 0;
          setCurrentIndex(0);
          setCurrentTrack(q[0]);
          playTrackDirect(q[0]);
        }
      }
    }
  }, [playTrackDirect]);

  const playPrev = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    const curIdx = currentIndexRef.current;
    const prevIdx = curIdx > 0 ? curIdx - 1 : q.length - 1;
    const prevTrack = q[prevIdx];
    currentIndexRef.current = prevIdx;
    setCurrentIndex(prevIdx);
    setCurrentTrack(prevTrack);
    playTrackDirect(prevTrack);
  }, [currentTime, playTrackDirect]);

  const seek = useCallback((time: number) => {
    const clamped = Math.max(0, time);
    setCurrentTime(clamped);

    const track = currentTrackRef.current;
    if (track?.youtubeId && ytPlayerRef.current && isYtReadyRef.current) {
      try {
        ytPlayerRef.current.seekTo(clamped, true);
      } catch {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    volumeRef.current = val;

    if (val > 0 && isMutedRef.current) {
      setIsMuted(false);
      isMutedRef.current = false;
    }

    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : val;
    }

    if (ytPlayerRef.current && isYtReadyRef.current) {
      try {
        if (isMutedRef.current || val === 0) {
          ytPlayerRef.current.mute();
          ytPlayerRef.current.setVolume(0);
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(val * 100);
        }
      } catch {}
    }

    saveStoredSettings({ volume: val });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      isMutedRef.current = next;

      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volumeRef.current;
      }

      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          if (next) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(volumeRef.current * 100);
          }
        } catch {}
      }

      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev;
      saveStoredSettings({ shuffle: next });

      const curTrack = currentTrackRef.current;
      if (next) {
        const rest = queueRef.current.filter(t => t.id !== curTrack?.id);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        const newQ = curTrack ? [curTrack, ...shuffled] : shuffled;
        queueRef.current = newQ;
        setQueue(newQ);
        currentIndexRef.current = 0;
        setCurrentIndex(0);
      } else {
        const restored = originalQueueRef.current;
        queueRef.current = restored;
        setQueue(restored);
        const idx = restored.findIndex(t => t.id === curTrack?.id);
        const validIdx = idx >= 0 ? idx : 0;
        currentIndexRef.current = validIdx;
        setCurrentIndex(validIdx);
      }
      return next;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat(prev => {
      const next: RepeatMode = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      repeatRef.current = next;
      saveStoredSettings({ repeat: next });
      return next;
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => {
      const updated = [...prev, track];
      queueRef.current = updated;
      return updated;
    });
    originalQueueRef.current.push(track);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => {
      const updated = prev.filter((_, i) => i !== index);
      queueRef.current = updated;
      return updated;
    });
  }, []);

  const clearQueue = useCallback(() => {
    const curTrack = currentTrackRef.current;
    if (curTrack) {
      queueRef.current = [curTrack];
      setQueue([curTrack]);
      currentIndexRef.current = 0;
      setCurrentIndex(0);
    } else {
      queueRef.current = [];
      setQueue([]);
      currentIndexRef.current = -1;
      setCurrentIndex(-1);
    }
  }, []);

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
        recommendations,
        isRecommendationsLoading,
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
