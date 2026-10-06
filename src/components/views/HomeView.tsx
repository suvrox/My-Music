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

  // Pre-configured distinct initial track sets so each section is full and unique on mount
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([
    INITIAL_TRACKS[0], // Die With A Smile
    {
      id: 'yt-ekr2nIex040',
      youtubeId: 'ekr2nIex040',
      title: 'APT.',
      artistName: 'ROSÉ, Bruno Mars',
      albumName: 'rosie',
      artworkUrl: 'https://i.ytimg.com/vi/ekr2nIex040/hqdefault.jpg',
      duration: 170,
      genre: 'Pop / K-Pop',
      source: 'YouTube Music'
    },
    {
      id: 'yt-eVli-tstM5E',
      youtubeId: 'eVli-tstM5E',
      title: 'Espresso',
      artistName: 'Sabrina Carpenter',
      albumName: 'Short n Sweet',
      artworkUrl: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg',
      duration: 175,
      genre: 'Pop / Global',
      source: 'YouTube Music'
    },
    {
      id: 'yt-V9PVRfjEBTI',
      youtubeId: 'V9PVRfjEBTI',
      title: 'Birds of a Feather',
      artistName: 'Billie Eilish',
      albumName: 'Hit Me Hard and Soft',
      artworkUrl: 'https://i.ytimg.com/vi/V9PVRfjEBTI/hqdefault.jpg',
      duration: 198,
      genre: 'Alternative / Pop',
      source: 'YouTube Music'
    },
    {
      id: 'yt-JGwWNGJdvx8',
      youtubeId: 'JGwWNGJdvx8',
      title: 'Shape of You',
      artistName: 'Ed Sheeran',
      albumName: '÷ (Divide)',
      artworkUrl: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
      duration: 233,
      genre: 'Pop / Global',
      source: 'YouTube Music'
    },
    {
      id: 'yt-4NRXx6U8ABQ',
      youtubeId: '4NRXx6U8ABQ',
      title: 'Blinding Lights',
      artistName: 'The Weeknd',
      albumName: 'After Hours',
      artworkUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
      duration: 200,
      genre: 'Synthpop / Global',
      source: 'YouTube Music'
    }
  ]);

  const [indiaTrendingTracks, setIndiaTrendingTracks] = useState<Track[]>([
    INITIAL_TRACKS[1], // Tauba Tauba
    INITIAL_TRACKS[2], // Chuttamalle
    INITIAL_TRACKS[3], // O Sajni Re
    {
      id: 'yt-lXqvdKl3S2k',
      youtubeId: 'lXqvdKl3S2k',
      title: 'Tum Se',
      artistName: 'Sachin-Jigar, Raghav Chaitanya',
      albumName: 'Teri Baaton Mein Aisa Uljha Jiya',
      artworkUrl: 'https://i.ytimg.com/vi/lXqvdKl3S2k/hqdefault.jpg',
      duration: 263,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    },
    {
      id: 'yt-Pz_FkqA2x6s',
      youtubeId: 'Pz_FkqA2x6s',
      title: 'Ve Kamleya',
      artistName: 'Arijit Singh, Shreya Ghoshal',
      albumName: 'Rocky Aur Rani Kii Prem Kahaani',
      artworkUrl: 'https://i.ytimg.com/vi/Pz_FkqA2x6s/hqdefault.jpg',
      duration: 247,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    }
  ]);

  const [bollywoodTracks, setBollywoodTracks] = useState<Track[]>([
    {
      id: 'yt-jHNNMj5bNQw',
      youtubeId: 'jHNNMj5bNQw',
      title: 'Kabira',
      artistName: 'Arijit Singh, Harshdeep Kaur',
      albumName: 'Yeh Jawaani Hai Deewani',
      artworkUrl: 'https://i.ytimg.com/vi/jHNNMj5bNQw/hqdefault.jpg',
      duration: 215,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    },
    {
      id: 'yt-bzSTpdcs-EI',
      youtubeId: 'bzSTpdcs-EI',
      title: 'Channa Mereya',
      artistName: 'Arijit Singh, Pritam',
      albumName: 'Ae Dil Hai Mushkil',
      artworkUrl: 'https://i.ytimg.com/vi/bzSTpdcs-EI/hqdefault.jpg',
      duration: 289,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    },
    {
      id: 'yt-sK7riqg2mr4',
      youtubeId: 'sK7riqg2mr4',
      title: 'Agar Tum Saath Ho',
      artistName: 'Arijit Singh, Alka Yagnik',
      albumName: 'Tamasha',
      artworkUrl: 'https://i.ytimg.com/vi/sK7riqg2mr4/hqdefault.jpg',
      duration: 341,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    },
    {
      id: 'yt-T94PHkuydcw',
      youtubeId: 'T94PHkuydcw',
      title: 'Kun Faya Kun',
      artistName: 'A.R. Rahman, Mohit Chauhan, Javed Ali',
      albumName: 'Rockstar',
      artworkUrl: 'https://i.ytimg.com/vi/T94PHkuydcw/hqdefault.jpg',
      duration: 470,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    },
    {
      id: 'yt-u2NAuswnTKs',
      youtubeId: 'u2NAuswnTKs',
      title: 'Apna Bana Le',
      artistName: 'Arijit Singh, Sachin-Jigar',
      albumName: 'Bhediya',
      artworkUrl: 'https://i.ytimg.com/vi/u2NAuswnTKs/hqdefault.jpg',
      duration: 261,
      genre: 'Bollywood & Chill',
      source: 'YouTube Music'
    }
  ]);

  const [loveTracks, setLoveTracks] = useState<Track[]>([
    {
      id: 'yt-BddP6PYo2gs',
      youtubeId: 'BddP6PYo2gs',
      title: 'Kesariya',
      artistName: 'Arijit Singh, Pritam',
      albumName: 'Brahmāstra',
      artworkUrl: 'https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg',
      duration: 268,
      genre: 'Romance',
      source: 'YouTube Music'
    },
    {
      id: 'yt-RLzC55ai0eo',
      youtubeId: 'RLzC55ai0eo',
      title: 'Heeriye',
      artistName: 'Jasleen Royal, Arijit Singh',
      albumName: 'Heeriye (Single)',
      artworkUrl: 'https://i.ytimg.com/vi/RLzC55ai0eo/hqdefault.jpg',
      duration: 194,
      genre: 'Romance',
      source: 'YouTube Music'
    },
    {
      id: 'yt-gvyUuxdRdR4',
      youtubeId: 'gvyUuxdRdR4',
      title: 'Raataan Lambiyan',
      artistName: 'Jubin Nautiyal, Asees Kaur',
      albumName: 'Shershaah',
      artworkUrl: 'https://i.ytimg.com/vi/gvyUuxdRdR4/hqdefault.jpg',
      duration: 230,
      genre: 'Romance',
      source: 'YouTube Music'
    },
    INITIAL_TRACKS[5], // Until I Found You
    {
      id: 'yt-2Vv-BfVoq4g',
      youtubeId: '2Vv-BfVoq4g',
      title: 'Perfect',
      artistName: 'Ed Sheeran',
      albumName: '÷ (Divide)',
      artworkUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
      duration: 263,
      genre: 'Romance',
      source: 'YouTube Music'
    }
  ]);

  const [happyTracks, setHappyTracks] = useState<Track[]>([
    INITIAL_TRACKS[4], // Sunny Days in Goa
    {
      id: 'yt-TUVcZfQe-Kw',
      youtubeId: 'TUVcZfQe-Kw',
      title: 'Levitating',
      artistName: 'Dua Lipa',
      albumName: 'Future Nostalgia',
      artworkUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg',
      duration: 203,
      genre: 'Happy Vibes',
      source: 'YouTube Music'
    },
    {
      id: 'yt-ApXoWvfEYVU',
      youtubeId: 'ApXoWvfEYVU',
      title: 'Sunflower',
      artistName: 'Post Malone, Swae Lee',
      albumName: 'Spider-Man: Into the Spider-Verse',
      artworkUrl: 'https://i.ytimg.com/vi/ApXoWvfEYVU/hqdefault.jpg',
      duration: 158,
      genre: 'Happy Vibes',
      source: 'YouTube Music'
    },
    {
      id: 'yt-ZbZSe6N_BXs',
      youtubeId: 'ZbZSe6N_BXs',
      title: 'Happy',
      artistName: 'Pharrell Williams',
      albumName: 'G I R L',
      artworkUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg',
      duration: 233,
      genre: 'Happy Vibes',
      source: 'YouTube Music'
    },
    {
      id: 'yt-hT_nvWreIhg',
      youtubeId: 'hT_nvWreIhg',
      title: 'Counting Stars',
      artistName: 'OneRepublic',
      albumName: 'Native',
      artworkUrl: 'https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg',
      duration: 257,
      genre: 'Happy Vibes',
      source: 'YouTube Music'
    }
  ]);

  const [ipopTracks, setIpopTracks] = useState<Track[]>([
    INITIAL_TRACKS[6], // Maan Meri Jaan
    {
      id: 'yt-AX6OrbgS8lI',
      youtubeId: 'AX6OrbgS8lI',
      title: 'Baarishein',
      artistName: 'Anuv Jain',
      albumName: 'Baarishein (Single)',
      artworkUrl: 'https://i.ytimg.com/vi/AX6OrbgS8lI/hqdefault.jpg',
      duration: 207,
      genre: 'Indian Pop',
      source: 'YouTube Music'
    },
    {
      id: 'yt-0IIJxkDtkHY',
      youtubeId: '0IIJxkDtkHY',
      title: 'Husn',
      artistName: 'Anuv Jain',
      albumName: 'Husn (Single)',
      artworkUrl: 'https://i.ytimg.com/vi/0IIJxkDtkHY/hqdefault.jpg',
      duration: 219,
      genre: 'Indian Pop',
      source: 'YouTube Music'
    },
    {
      id: 'yt-EiiOYwqk3A0',
      youtubeId: 'EiiOYwqk3A0',
      title: 'Faasle',
      artistName: 'Aditya Rikhari',
      albumName: 'Faasle (Single)',
      artworkUrl: 'https://i.ytimg.com/vi/EiiOYwqk3A0/hqdefault.jpg',
      duration: 196,
      genre: 'Indian Pop',
      source: 'YouTube Music'
    },
    {
      id: 'yt-8GkPMG8IwBQ',
      youtubeId: '8GkPMG8IwBQ',
      title: 'Tu Hai Kahan',
      artistName: 'AUR',
      albumName: 'Tu Hai Kahan',
      artworkUrl: 'https://i.ytimg.com/vi/8GkPMG8IwBQ/hqdefault.jpg',
      duration: 263,
      genre: 'Indian Pop',
      source: 'YouTube Music'
    }
  ]);

  const [hotHitsTracks, setHotHitsTracks] = useState<Track[]>([
    INITIAL_TRACKS[7], // Chal Kudiye
    {
      id: 'yt--Chif1XK2e8',
      youtubeId: '-Chif1XK2e8',
      title: 'Softly',
      artistName: 'Karan Aujla, Ikky',
      albumName: 'Making Memories',
      artworkUrl: 'https://i.ytimg.com/vi/-Chif1XK2e8/hqdefault.jpg',
      duration: 156,
      genre: 'Punjabi Hits',
      source: 'YouTube Music'
    },
    INITIAL_TRACKS[8], // Born To Shine
    {
      id: 'yt-OPf0YbXqDm0',
      youtubeId: 'OPf0YbXqDm0',
      title: 'Uptown Funk',
      artistName: 'Mark Ronson, Bruno Mars',
      albumName: 'Uptown Special',
      artworkUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
      duration: 270,
      genre: 'Happy Vibes',
      source: 'YouTube Music'
    },
    {
      id: 'yt-4NRXx6U8ABQ',
      youtubeId: '4NRXx6U8ABQ',
      title: 'Blinding Lights',
      artistName: 'The Weeknd',
      albumName: 'After Hours',
      artworkUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
      duration: 200,
      genre: 'Synthpop / Global',
      source: 'YouTube Music'
    }
  ]);

  const [phonkTracks, setPhonkTracks] = useState<Track[]>([
    INITIAL_TRACKS[9], // Tokyo Midnight Drift
    {
      id: 'yt-w-sQRS-Lc9k',
      youtubeId: 'w-sQRS-Lc9k',
      title: 'Murder In My Mind',
      artistName: 'KORDHELL',
      albumName: 'Murder In My Mind',
      artworkUrl: 'https://i.ytimg.com/vi/w-sQRS-Lc9k/hqdefault.jpg',
      duration: 145,
      genre: 'Drift Phonk',
      source: 'YouTube Music'
    },
    INITIAL_TRACKS[10], // Close Eyes
    {
      id: 'yt--dhx7Hnu-wo',
      youtubeId: '-dhx7Hnu-wo',
      title: 'Metamorphosis',
      artistName: 'INTERWORLD',
      albumName: 'Metamorphosis',
      artworkUrl: 'https://i.ytimg.com/vi/-dhx7Hnu-wo/hqdefault.jpg',
      duration: 142,
      genre: 'Drift Phonk',
      source: 'YouTube Music'
    },
    {
      id: 'yt-F5tSoaJ93ac',
      youtubeId: 'F5tSoaJ93ac',
      title: 'Override',
      artistName: 'KSLV Noh',
      albumName: 'Override',
      artworkUrl: 'https://i.ytimg.com/vi/F5tSoaJ93ac/hqdefault.jpg',
      duration: 114,
      genre: 'Drift Phonk',
      source: 'YouTube Music'
    }
  ]);

  const [podcastTracks, setPodcastTracks] = useState<Track[]>([
    {
      id: 'yt-_L2cqQayZSo',
      youtubeId: '_L2cqQayZSo',
      title: 'The Ranveer Show (TRS) Podcast',
      artistName: 'BeerBiceps',
      albumName: 'The Ranveer Show',
      artworkUrl: 'https://i.ytimg.com/vi/_L2cqQayZSo/hqdefault.jpg',
      duration: 3600,
      genre: 'Podcast',
      source: 'YouTube Podcasts'
    },
    {
      id: 'yt-psb7bt1IfnA',
      youtubeId: 'psb7bt1IfnA',
      title: 'WTF is AI & Future Tech',
      artistName: 'Nikhil Kamath Podcast',
      albumName: 'WTF Podcast',
      artworkUrl: 'https://i.ytimg.com/vi/psb7bt1IfnA/hqdefault.jpg',
      duration: 5400,
      genre: 'Podcast',
      source: 'YouTube Podcasts'
    },
    {
      id: 'yt-SFX8FIHFLE4',
      youtubeId: 'SFX8FIHFLE4',
      title: 'Huberman Lab - Focus & Brain Science',
      artistName: 'Dr. Andrew Huberman',
      albumName: 'Huberman Lab',
      artworkUrl: 'https://i.ytimg.com/vi/SFX8FIHFLE4/hqdefault.jpg',
      duration: 4200,
      genre: 'Podcast',
      source: 'YouTube Podcasts'
    }
  ]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);

  useEffect(() => {
    setRecentHistory(getStoredHistory());
  }, [currentTrack]);

  // Load each category independently in parallel without blocking
  useEffect(() => {
    let isMounted = true;

    const fetchCategoryRow = (url: string, setter: (tracks: Track[]) => void) => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (isMounted && Array.isArray(data.tracks) && data.tracks.length > 0) {
            setter(data.tracks);
          }
        })
        .catch(() => {});
    };

    // Independent parallel fetching for instantaneous updates
    fetchCategoryRow('/api/music/trending?region=US', setTrendingTracks);
    fetchCategoryRow('/api/music/category?category=india', setIndiaTrendingTracks);
    fetchCategoryRow('/api/music/category?category=bollywood', setBollywoodTracks);
    fetchCategoryRow('/api/music/category?category=love', setLoveTracks);
    fetchCategoryRow('/api/music/category?category=happy', setHappyTracks);
    fetchCategoryRow('/api/music/category?category=ipop', setIpopTracks);
    fetchCategoryRow('/api/music/category?category=hothits', setHotHitsTracks);
    fetchCategoryRow('/api/music/category?category=phonk', setPhonkTracks);
    fetchCategoryRow('/api/music/category?category=podcast', setPodcastTracks);

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

  const scrollRow = (sectionId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(`scroll-row-${sectionId}`);
    if (el) {
      const scrollAmount = direction === 'left' ? -550 : 550;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderTrackCard = (track: Track, contextTracks: Track[]) => {
    const isTrackActive =
      currentTrack?.id === track.id ||
      (currentTrack?.youtubeId && currentTrack?.youtubeId === track.youtubeId);

    return (
      <div
        key={track.id}
        onClick={() => handlePlayOrPauseTrack(track, contextTracks)}
        className={`bg-spotify-card hover:bg-spotify-cardHover p-2.5 sm:p-3 rounded-lg transition duration-200 cursor-pointer group flex flex-col relative border ${
          isTrackActive ? 'border-spotify-green/60 shadow-lg shadow-spotify-green/10' : 'border-transparent hover:border-zinc-800/80 shadow-md'
        }`}
      >
        {/* Artwork with YouTube Badge and Play Overlay */}
        <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2 bg-zinc-800 shadow-lg">
          <img
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            src={track.artworkUrl || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (track.youtubeId && !target.src.includes(track.youtubeId)) {
                target.src = `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`;
              }
            }}
            loading="lazy"
          />
          {/* YouTube Tag */}
          <div className="absolute top-1.5 left-1.5 text-red-500 text-xs drop-shadow bg-black/70 px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
            <i className="fa-brands fa-youtube"></i>
            <span className="text-[10px] text-white font-semibold">YT</span>
          </div>

          {/* Equalizer animation when playing */}
          {isTrackActive && isPlaying && (
            <div className="absolute top-1.5 right-1.5 bg-black/80 px-1.5 py-1 rounded backdrop-blur-sm flex items-center gap-0.5">
              <span className="w-1 h-2.5 bg-spotify-green animate-pulse rounded-full"></span>
              <span className="w-1 h-3.5 bg-spotify-green animate-bounce rounded-full"></span>
              <span className="w-1 h-2 bg-spotify-green animate-pulse rounded-full"></span>
            </div>
          )}

          {/* Duration Badge */}
          {Boolean(track.duration && track.duration > 0) && (
            <div className="absolute bottom-1.5 left-1.5 text-[9px] sm:text-[10px] text-white/90 font-medium bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
              {formatTime(track.duration || 0)}
            </div>
          )}

          {/* Play Button Overlay */}
          <div className={`absolute right-1.5 bottom-1.5 transition-all duration-300 drop-shadow-xl ${
            isTrackActive && isPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition">
              <i className={`fa-solid ${isTrackActive && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
            </div>
          </div>
        </div>

        {/* Track Title */}
        <h3 className={`font-semibold text-xs sm:text-sm truncate mb-0.5 ${isTrackActive ? 'text-spotify-green' : 'text-white'}`} title={track.title}>
          {track.title}
        </h3>

        {/* Artist Name */}
        <p className="text-[11px] sm:text-xs text-spotify-textSubdued truncate leading-snug" title={track.artistName}>
          {track.artistName}
        </p>

        {/* Album / Channel source */}
        <span className="text-[10px] sm:text-[11px] text-zinc-500 truncate mt-0.5 block">
          {track.albumName || 'YouTube Music'}
        </span>
      </div>
    );
  };

  // Render a uniform, responsive music row with smooth horizontal scroll and grid expansion
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
          <div className="flex items-center gap-1.5">
            {!isExpanded && tracks.length > 5 && (
              <div className="flex items-center gap-1 mr-1">
                <button
                  onClick={() => scrollRow(sectionId, 'left')}
                  title="Scroll left"
                  aria-label="Scroll left"
                  className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => scrollRow(sectionId, 'right')}
                  title="Scroll right"
                  aria-label="Scroll right"
                  className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            )}
            <button
              onClick={() => toggleExpand(sectionId)}
              className="text-xs font-bold text-spotify-textSubdued hover:text-white transition cursor-pointer px-2 py-1 rounded hover:bg-white/5"
            >
              {isExpanded ? 'Show less' : `Show all (${tracks.length})`}
            </button>
          </div>
        </div>

        {isExpanded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {tracks.map((track) => renderTrackCard(track, tracks))}
          </div>
        ) : (
          <div
            id={`scroll-row-${sectionId}`}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 -mx-1 px-1"
          >
            {tracks.map((track) => (
              <div key={track.id} className="track-card-carousel-item">
                {renderTrackCard(track, tracks)}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col" data-purpose="center-main-feed">
      {/* Top Violet Ambient Glow Background Banner */}
      <div className="custom-gradient-header pt-3 px-3 sm:px-6 pb-4 sm:pb-6 sticky top-0 z-20">
        {/* Filter Tabs: All, Music, Podcasts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20 text-white font-medium'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab('music')}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm transition cursor-pointer ${
              filterTab === 'music'
                ? 'bg-white text-black font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-white font-medium'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setFilterTab('podcasts')}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm transition cursor-pointer ${
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
              <span className="hidden sm:inline">Loading YouTube tracks...</span>
            </div>
          )}
        </div>
      </div>

      {/* Feed Content Sections */}
      <div className="px-3 sm:px-6 space-y-7 sm:space-y-9 pb-20 sm:pb-16 -mt-2">
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
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 -mx-1 px-1">
              {recentHistory.slice(0, 10).map((track) => (
                <div key={`hist-${track.id}`} className="track-card-carousel-item">
                  {renderTrackCard(track, recentHistory)}
                </div>
              ))}
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
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-certificate text-spotify-green text-sm"></i>
                    <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">
                      Popular Artists
                    </h2>
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-spotify-green">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-spotify-textSubdued mt-0.5">
                    Explore top verified artists streaming on YouTube Music
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {INITIAL_ARTISTS.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setActiveView({ type: 'artist', id: artist.id })}
                    className="bg-spotify-card hover:bg-spotify-cardHover p-3 sm:p-4 rounded-lg transition duration-200 cursor-pointer group flex flex-col items-center text-center relative border border-transparent hover:border-zinc-800"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 bg-zinc-800 shadow-lg ring-2 ring-transparent group-hover:ring-spotify-green/50 transition">
                      <img
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={artist.imageUrl || '/logo.webp'}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/logo.webp';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 max-w-full justify-center">
                      <h3 className="font-bold text-sm text-white truncate mb-0.5" title={artist.name}>
                        {artist.name}
                      </h3>
                      <i className="fa-solid fa-circle-check text-spotify-green text-[11px] flex-shrink-0" title="Verified Artist"></i>
                    </div>
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
