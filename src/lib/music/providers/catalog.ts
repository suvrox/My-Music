import { Track, Artist, Album, Playlist } from '@/types/music';
import { MusicProvider } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'yt-kPa7bsKwL-c',
    youtubeId: 'kPa7bsKwL-c',
    title: 'Die With A Smile',
    artistId: 'artist-lady-gaga',
    artistName: 'Lady Gaga, Bruno Mars',
    albumId: 'album-die-with-a-smile',
    albumName: 'Die With A Smile',
    artworkUrl: 'https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    duration: 252,
    genre: 'Pop / Global',
    source: 'YouTube Music'
  },
  {
    id: 'yt-BBrQWOuE_pg',
    youtubeId: 'BBrQWOuE_pg',
    title: 'Tauba Tauba',
    artistId: 'artist-karan-aujla',
    artistName: 'Karan Aujla',
    albumId: 'album-bad-newz',
    albumName: 'Bad Newz',
    artworkUrl: 'https://i.ytimg.com/vi/BBrQWOuE_pg/hqdefault.jpg',
    duration: 204,
    genre: 'Punjabi Pop',
    source: 'YouTube Music'
  },
  {
    id: 'yt-9jY8PItvMxo',
    youtubeId: '9jY8PItvMxo',
    title: 'Chuttamalle',
    artistId: 'artist-anirudh',
    artistName: 'Anirudh Ravichander, Shilpa Rao',
    albumId: 'album-devara',
    albumName: 'Devara Part 1',
    artworkUrl: 'https://i.ytimg.com/vi/9jY8PItvMxo/hqdefault.jpg',
    duration: 220,
    genre: 'Tamil Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt-k3g_WjLCsXM',
    youtubeId: 'k3g_WjLCsXM',
    title: 'O Sajni Re',
    artistId: 'artist-arijit-singh',
    artistName: 'Arijit Singh, Ram Sampath',
    albumId: 'album-laapataa-ladies',
    albumName: 'Laapataa Ladies',
    artworkUrl: 'https://i.ytimg.com/vi/k3g_WjLCsXM/hqdefault.jpg',
    duration: 172,
    genre: 'Bollywood & Chill',
    source: 'YouTube Music'
  },
  {
    id: 'yt-jfKfPfyJRdk',
    youtubeId: 'jfKfPfyJRdk',
    title: 'Sunny Days in Goa',
    artistId: 'artist-chill-groove',
    artistName: 'Acoustic Waves',
    albumId: 'album-happy-vibes',
    albumName: 'Happy Vibes Vol. 1',
    artworkUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 195,
    genre: 'Indie Acoustic',
    source: 'YouTube Music'
  },
  {
    id: 'yt-GxldQ9eX2wo',
    youtubeId: 'GxldQ9eX2wo',
    title: 'Until I Found You',
    artistId: 'artist-stephen-sanchez',
    artistName: 'Stephen Sanchez',
    albumId: 'album-pov-in-love',
    albumName: "pov: you're in love",
    artworkUrl: 'https://i.ytimg.com/vi/GxldQ9eX2wo/hqdefault.jpg',
    duration: 177,
    genre: 'Romance',
    source: 'YouTube Music'
  },
  {
    id: 'yt-73vZDNKa_Wg',
    youtubeId: '73vZDNKa_Wg',
    title: 'Maan Meri Jaan',
    artistId: 'artist-king',
    artistName: 'King',
    albumId: 'album-ipop-hits',
    albumName: 'Champagne Talk',
    artworkUrl: 'https://i.ytimg.com/vi/73vZDNKa_Wg/hqdefault.jpg',
    duration: 194,
    genre: 'Indian Pop',
    source: 'YouTube Music'
  },
  {
    id: 'yt-fnyd1hGyJIY',
    youtubeId: 'fnyd1hGyJIY',
    title: 'Chal Kudiye',
    artistId: 'artist-diljit-dosanjh',
    artistName: 'Diljit Dosanjh, Alia Bhatt',
    albumId: 'album-jigra',
    albumName: 'Jigra Soundtracks',
    artworkUrl: 'https://i.ytimg.com/vi/fnyd1hGyJIY/hqdefault.jpg',
    duration: 198,
    genre: 'Hindi Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt-cl0a3i2wFcc',
    youtubeId: 'cl0a3i2wFcc',
    title: 'Born To Shine',
    artistId: 'artist-diljit-dosanjh',
    artistName: 'Diljit Dosanjh',
    albumId: 'album-goat',
    albumName: 'G.O.A.T.',
    artworkUrl: 'https://i.ytimg.com/vi/cl0a3i2wFcc/hqdefault.jpg',
    duration: 214,
    genre: 'Punjabi Hits',
    source: 'YouTube Music'
  },
  {
    id: 'yt--w54aVt1JsY',
    youtubeId: '-w54aVt1JsY',
    title: 'Tokyo Midnight Drift',
    artistId: 'artist-phonk-master',
    artistName: 'Kordhell & DVRST Echoes',
    albumId: 'album-phonk-drift',
    albumName: 'the beat of your drift (PHONK)',
    artworkUrl: 'https://i.ytimg.com/vi/-w54aVt1JsY/hqdefault.jpg',
    duration: 152,
    genre: 'Drift Phonk',
    source: 'YouTube Music'
  },
  {
    id: 'yt-1-xGerv5FOk',
    youtubeId: '1-xGerv5FOk',
    title: 'Close Eyes',
    artistId: 'artist-dvrst',
    artistName: 'DVRST',
    albumId: 'album-close-eyes',
    albumName: 'Close Eyes (Single)',
    artworkUrl: 'https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg',
    duration: 132,
    genre: 'Drift Phonk',
    source: 'YouTube Music'
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-arijit-singh',
    name: 'Arijit Singh',
    imageUrl: 'https://yt3.ggpht.com/DcEzZrPCQRSSs47rMbdJ3UJkQUCN3X8SKf8aCnvOgd2BmPihAz-0jBGJgEVh9_P8EiSBVNyixDs=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'India’s most celebrated playback superstar with soulful romantic ballads and timeless melodies.',
    monthlyListeners: '42.5M monthly listeners',
    verified: true
  },
  {
    id: 'artist-karan-aujla',
    name: 'Karan Aujla',
    imageUrl: 'https://yt3.ggpht.com/Da4zbrS4XLxzb3xVNT14aKr22aBg1blJCuCBppbYglO_uDmElYopgoDk7XV6UWNxthI96XOYrw=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Global Punjabi hitmaker redefining modern desi hip hop, bhangra grooves, and viral party anthems.',
    monthlyListeners: '16.2M monthly listeners',
    verified: true
  },
  {
    id: 'artist-shreya-ghoshal',
    name: 'Shreya Ghoshal',
    imageUrl: 'https://yt3.ggpht.com/PgINZNe0qVxgMSXKG5vF82bNN4WCC12zgWsz9I7OLs4CLF9Cn0Vxq7Xc1ToupnzXrCv0nKfe3VM=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'National Award-winning Indian playback icon revered for exceptional vocal range and classical depth.',
    monthlyListeners: '31.8M monthly listeners',
    verified: true
  },
  {
    id: 'artist-anirudh',
    name: 'Anirudh Ravichander',
    imageUrl: 'https://yt3.ggpht.com/frx38y_CK6hAUwms55XGdBJbsb1866IM6x6P0Fio7v0FPQFtOhgEdok02Ng-SySN7UJJg4UE5g=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Renowned rockstar music director behind chartbusting Pan-Indian anthems and electrifying background scores.',
    monthlyListeners: '24.1M monthly listeners',
    verified: true
  },
  {
    id: 'artist-diljit-dosanjh',
    name: 'Diljit Dosanjh',
    imageUrl: 'https://yt3.ggpht.com/7EYXXMXY594V8y4sZT2aawmdKgDAGTu5jNm9C-HpR3jY9cZJ0NMxS__nZKBdWZ1PUpJPjc2BAA=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Global Punjabi superstar bringing electrifying concerts and Punjabi culture to international stadiums.',
    monthlyListeners: '20.4M monthly listeners',
    verified: true
  },
  {
    id: 'artist-taylor-swift',
    name: 'Taylor Swift',
    imageUrl: 'https://yt3.ggpht.com/5cW4-NDteLLBaWpsjSirr7EmaOKtFGyX8PG2-6Xx7RELneLZe50Y5Bv9oEothnH9BOqxUpClfA=s400-c-k-c0x00ffffff-no-rj-mo',
    description: '14-time Grammy-winning global powerhouse and prolific songwriter breaking streaming and stadium records worldwide.',
    monthlyListeners: '104.2M monthly listeners',
    verified: true
  },
  {
    id: 'artist-the-weeknd',
    name: 'The Weeknd',
    imageUrl: 'https://yt3.ggpht.com/WHvw1ak1FcJaHeEiTmG2iN0dqEjjPxAtT_tA8ruJ3MlNr9I-RHsAur1iAenYeQN_d6LNPH2Z8Ic=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Diamond-certified pop & R&B visionary behind cinematic 80s synthwave hits and record-shattering singles.',
    monthlyListeners: '112.0M monthly listeners',
    verified: true
  },
  {
    id: 'artist-ar-rahman',
    name: 'A.R. Rahman',
    imageUrl: 'https://yt3.ggpht.com/G2CwNAHy4CCMphIOmQhBTNyCUu3AcMjAc2QLg09h3ejq15FyIto6VyC-PPtudekC7kET3uxO=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Double Oscar and double Grammy-winning legend whose innovative compositions revolutionized modern film music.',
    monthlyListeners: '27.3M monthly listeners',
    verified: true
  },
  {
    id: 'artist-billie-eilish',
    name: 'Billie Eilish',
    imageUrl: 'https://yt3.ggpht.com/dirvtoDAmx-u0UR76-pxfhYL6Wxj2vfL2geUcxDwk62tTWWhGG6QDGc63RG3NdOz38-yBwRHDQ=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Multi-Grammy and Oscar-winning alt-pop trailblazer known for whisper vocals and genre-defining production.',
    monthlyListeners: '98.0M monthly listeners',
    verified: true
  },
  {
    id: 'artist-bruno-mars',
    name: 'Bruno Mars',
    imageUrl: 'https://yt3.ggpht.com/dxwzp4IYsNJKDcwNYgF0UGdw9vCWSMqkHaLtC08VVKg8eybNs69pbdTaGdoaKQYHVQjFyeybzA=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Multi-Grammy-winning showman effortlessly uniting funk, soul, pop, and timeless romance.',
    monthlyListeners: '120.5M monthly listeners',
    verified: true
  },
  {
    id: 'artist-ed-sheeran',
    name: 'Ed Sheeran',
    imageUrl: 'https://yt3.ggpht.com/pZQ5JMD4EOI8TcNYAPTzMexe_fC0CKnb_hYlV4rPfIzmDidF239fH1XKmzkeT30XSg7fxNwc_w=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Multi-platinum British singer-songwriter known for intimate acoustic melodies and universally resonant anthems.',
    monthlyListeners: '85.4M monthly listeners',
    verified: true
  },
  {
    id: 'artist-sidhu-moose-wala',
    name: 'Sidhu Moose Wala',
    imageUrl: 'https://yt3.ggpht.com/ytc/AIdro_kiQJ0Hhp0O-tdaY1dy81-gSNujjccUlWstnpFr686ZlMk=s400-c-k-c0x00ffffff-no-rj-mo',
    description: 'Legendary Punjabi pioneer whose fierce storytelling, swagger, and revolutionary style became an eternal legacy.',
    monthlyListeners: '18.9M monthly listeners',
    verified: true
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-bollywood-chill',
    name: 'Bollywood Romance & Chill 💖',
    description: 'Soulful Hindi chartbusters, heartfelt melodies, and late-night Bollywood vibes.',
    coverUrl: 'https://i.ytimg.com/vi/k3g_WjLCsXM/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-k3g_WjLCsXM',
        youtubeId: 'k3g_WjLCsXM',
        title: 'O Sajni Re',
        artistName: 'Arijit Singh, Ram Sampath',
        albumName: 'Laapataa Ladies',
        artworkUrl: 'https://i.ytimg.com/vi/k3g_WjLCsXM/hqdefault.jpg',
        duration: 172,
        genre: 'Bollywood & Chill',
        source: 'YouTube Music'
      },
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
      },
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
      }
    ]
  },
  {
    id: 'playlist-bengali-hits',
    name: 'Bangla Top Hits & Classics 🎵',
    description: 'Timeless melodies, romantic modern hits, and iconic Bengali masterpieces.',
    coverUrl: 'https://i.ytimg.com/vi/J2JQQm1h6xQ/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-J2JQQm1h6xQ',
        youtubeId: 'J2JQQm1h6xQ',
        title: 'Bojhena Shey Bojhena',
        artistName: 'Arijit Singh',
        albumName: 'Bojhena Shey Bojhena',
        artworkUrl: 'https://i.ytimg.com/vi/J2JQQm1h6xQ/hqdefault.jpg',
        duration: 249,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      },
      {
        id: 'yt-eORVpaICbzk',
        youtubeId: 'eORVpaICbzk',
        title: 'Mon Majhi Re',
        artistName: 'Arijit Singh',
        albumName: 'Boss (Bengali)',
        artworkUrl: 'https://i.ytimg.com/vi/eORVpaICbzk/hqdefault.jpg',
        duration: 266,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      },
      {
        id: 'yt-LkUqqoKB4rM',
        youtubeId: 'LkUqqoKB4rM',
        title: 'Tumi Jaake Bhalobasho',
        artistName: 'Iman Chakraborty',
        albumName: 'Praktan',
        artworkUrl: 'https://i.ytimg.com/vi/LkUqqoKB4rM/hqdefault.jpg',
        duration: 288,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      },
      {
        id: 'yt-YmIhZCNXfJE',
        youtubeId: 'YmIhZCNXfJE',
        title: 'Kolkata',
        artistName: 'Anupam Roy, Shreya Ghoshal',
        albumName: 'Praktan',
        artworkUrl: 'https://i.ytimg.com/vi/YmIhZCNXfJE/hqdefault.jpg',
        duration: 302,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      },
      {
        id: 'yt-u5zkgaOuQ8A',
        youtubeId: 'u5zkgaOuQ8A',
        title: 'Ami Banglay Gaan Gai',
        artistName: 'Pratul Mukhopadhyay',
        albumName: 'Bangla Classics',
        artworkUrl: 'https://i.ytimg.com/vi/u5zkgaOuQ8A/hqdefault.jpg',
        duration: 403,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      },
      {
        id: 'yt-JZ1CReueASQ',
        youtubeId: 'JZ1CReueASQ',
        title: 'Tomake Chai',
        artistName: 'Kabir Suman',
        albumName: 'Tomake Chai',
        artworkUrl: 'https://i.ytimg.com/vi/JZ1CReueASQ/hqdefault.jpg',
        duration: 384,
        genre: 'Bengali Songs',
        source: 'YouTube Music'
      }
    ]
  },
  {
    id: 'playlist-punjabi-chartbusters',
    name: 'Punjabi Hits & Bhangra 🔥',
    description: 'High-octane Punjabi bangers, desi hip hop, and chart-topping swagger.',
    coverUrl: 'https://i.ytimg.com/vi/BBrQWOuE_pg/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-BBrQWOuE_pg',
        youtubeId: 'BBrQWOuE_pg',
        title: 'Tauba Tauba',
        artistName: 'Karan Aujla',
        albumName: 'Bad Newz',
        artworkUrl: 'https://i.ytimg.com/vi/BBrQWOuE_pg/hqdefault.jpg',
        duration: 204,
        genre: 'Punjabi Pop',
        source: 'YouTube Music'
      },
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
      {
        id: 'yt-cl0a3i2wFcc',
        youtubeId: 'cl0a3i2wFcc',
        title: 'Born To Shine',
        artistName: 'Diljit Dosanjh',
        albumName: 'G.O.A.T.',
        artworkUrl: 'https://i.ytimg.com/vi/cl0a3i2wFcc/hqdefault.jpg',
        duration: 214,
        genre: 'Punjabi Hits',
        source: 'YouTube Music'
      },
      {
        id: 'yt-fnyd1hGyJIY',
        youtubeId: 'fnyd1hGyJIY',
        title: 'Chal Kudiye',
        artistName: 'Diljit Dosanjh, Alia Bhatt',
        albumName: 'Jigra Soundtracks',
        artworkUrl: 'https://i.ytimg.com/vi/fnyd1hGyJIY/hqdefault.jpg',
        duration: 198,
        genre: 'Punjabi Hits',
        source: 'YouTube Music'
      }
    ]
  },
  {
    id: 'playlist-midnight-lofi',
    name: 'Midnight Lo-Fi & Chill ☕',
    description: 'Relaxing Indian and global Lo-Fi beats, slow reverb acoustics, and focus rhythms.',
    coverUrl: 'https://i.ytimg.com/vi/RO04JSM3Mso/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-RO04JSM3Mso',
        youtubeId: 'RO04JSM3Mso',
        title: 'Bollywood Chill Lo-Fi Drive',
        artistName: 'Lo-Fi Records India',
        albumName: 'Late Night Drives',
        artworkUrl: 'https://i.ytimg.com/vi/RO04JSM3Mso/hqdefault.jpg',
        duration: 3600,
        genre: 'Lo-Fi & Chill',
        source: 'YouTube Music'
      },
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
      },
      {
        id: 'yt-jfKfPfyJRdk',
        youtubeId: 'jfKfPfyJRdk',
        title: 'Sunny Days in Goa',
        artistName: 'Acoustic Waves',
        albumName: 'Happy Vibes Vol. 1',
        artworkUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        duration: 195,
        genre: 'Indie Acoustic',
        source: 'YouTube Music'
      }
    ]
  },
  {
    id: 'playlist-festival-edm',
    name: 'Festival EDM & Bass Drops ⚡',
    description: 'Euphoric electronic dance music, massive synth drops, and festival mainstage anthems.',
    coverUrl: 'https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-60ItHLz5WEA',
        youtubeId: '60ItHLz5WEA',
        title: 'Faded',
        artistName: 'Alan Walker',
        albumName: 'Different World',
        artworkUrl: 'https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg',
        duration: 213,
        genre: 'Electronic / EDM',
        source: 'YouTube Music'
      },
      {
        id: 'yt-gCYcHz2k5x0',
        youtubeId: 'gCYcHz2k5x0',
        title: 'Animals',
        artistName: 'Martin Garrix',
        albumName: 'Gold Skies',
        artworkUrl: 'https://i.ytimg.com/vi/gCYcHz2k5x0/hqdefault.jpg',
        duration: 192,
        genre: 'Electronic / EDM',
        source: 'YouTube Music'
      },
      {
        id: 'yt-m7Bc3pLyij0',
        youtubeId: 'm7Bc3pLyij0',
        title: 'Happier',
        artistName: 'Marshmello, Bastille',
        albumName: 'Joytime II',
        artworkUrl: 'https://i.ytimg.com/vi/m7Bc3pLyij0/hqdefault.jpg',
        duration: 234,
        genre: 'Electronic / EDM',
        source: 'YouTube Music'
      },
      {
        id: 'yt-cMg8KaMdDYo',
        youtubeId: 'cMg8KaMdDYo',
        title: 'Fearless Funk',
        artistName: 'DR MØB, Chris Linton',
        albumName: 'Fearless Funk (Single)',
        artworkUrl: 'https://i.ytimg.com/vi/cMg8KaMdDYo/hqdefault.jpg',
        duration: 138,
        genre: 'Electronic / Phonk',
        source: 'YouTube Music'
      }
    ]
  },
  {
    id: 'playlist-phonk-drift',
    name: 'Phonk Drift & Gym Beast 🏎️',
    description: 'Aggressive drift phonk, distorted 808 cowbells, and unstoppable workout energy.',
    coverUrl: 'https://i.ytimg.com/vi/-w54aVt1JsY/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt--w54aVt1JsY',
        youtubeId: '-w54aVt1JsY',
        title: 'Tokyo Midnight Drift (PHONK)',
        artistName: 'Kordhell & DVRST Echoes',
        albumName: 'the beat of your drift',
        artworkUrl: 'https://i.ytimg.com/vi/-w54aVt1JsY/hqdefault.jpg',
        duration: 152,
        genre: 'Drift Phonk',
        source: 'YouTube Music'
      },
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
      {
        id: 'yt-1-xGerv5FOk',
        youtubeId: '1-xGerv5FOk',
        title: 'Close Eyes',
        artistName: 'DVRST',
        albumName: 'Close Eyes',
        artworkUrl: 'https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg',
        duration: 132,
        genre: 'Drift Phonk',
        source: 'YouTube Music'
      },
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
    ]
  },
  {
    id: 'playlist-global-pop',
    name: 'Global Billboard Hot 100 🌍',
    description: 'The biggest songs worldwide streaming non-stop right now.',
    coverUrl: 'https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
      {
        id: 'yt-kPa7bsKwL-c',
        youtubeId: 'kPa7bsKwL-c',
        title: 'Die With A Smile',
        artistName: 'Lady Gaga, Bruno Mars',
        albumName: 'Die With A Smile',
        artworkUrl: 'https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg',
        duration: 252,
        genre: 'Pop / Global',
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
        id: 'yt-4NRXx6U8ABQ',
        youtubeId: '4NRXx6U8ABQ',
        title: 'Blinding Lights',
        artistName: 'The Weeknd',
        albumName: 'After Hours',
        artworkUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        duration: 200,
        genre: 'Synthpop / Global',
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
        id: 'yt-dMMUH_ZpbB0',
        youtubeId: 'dMMUH_ZpbB0',
        title: 'Starboy',
        artistName: 'The Weeknd, Daft Punk',
        albumName: 'Starboy',
        artworkUrl: 'https://i.ytimg.com/vi/dMMUH_ZpbB0/hqdefault.jpg',
        duration: 230,
        genre: 'R&B / Pop',
        source: 'YouTube Music'
      },
      {
        id: 'yt-H5v3kku4y6Q',
        youtubeId: 'H5v3kku4y6Q',
        title: 'As It Was',
        artistName: 'Harry Styles',
        albumName: "Harry's House",
        artworkUrl: 'https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg',
        duration: 167,
        genre: 'Indie Pop',
        source: 'YouTube Music'
      }
    ]
  },
  {
    id: 'playlist-peace-of-mind',
    name: 'Peace of Mind & Soulful 🌿',
    description: 'Calming acoustic strings, meditative vocals, and serene healing sounds.',
    coverUrl: 'https://i.ytimg.com/vi/T94PHkuydcw/hqdefault.jpg',
    author: 'YouTube Music',
    tracks: [
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
        id: 'yt-GxldQ9eX2wo',
        youtubeId: 'GxldQ9eX2wo',
        title: 'Until I Found You',
        artistName: 'Stephen Sanchez',
        albumName: 'Easy On My Eyes',
        artworkUrl: 'https://i.ytimg.com/vi/GxldQ9eX2wo/hqdefault.jpg',
        duration: 177,
        genre: 'Romance',
        source: 'YouTube Music'
      },
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
      },
      {
        id: 'yt-450p7goxZqg',
        youtubeId: '450p7goxZqg',
        title: 'All of Me',
        artistName: 'John Legend',
        albumName: 'Love in the Future',
        artworkUrl: 'https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg',
        duration: 269,
        genre: 'Romance',
        source: 'YouTube Music'
      },
      {
        id: 'yt-0yW7w8F2TVA',
        youtubeId: '0yW7w8F2TVA',
        title: "Say You Won't Let Go",
        artistName: 'James Arthur',
        albumName: 'Back from the Edge',
        artworkUrl: 'https://i.ytimg.com/vi/0yW7w8F2TVA/hqdefault.jpg',
        duration: 211,
        genre: 'Romance',
        source: 'YouTube Music'
      }
    ]
  }
];

export class CatalogMusicProvider implements MusicProvider {
  async searchTracks(query: string): Promise<Track[]> {
    const q = query.toLowerCase().trim();
    if (!q) return INITIAL_TRACKS;

    // Search local preloaded catalog first
    const localMatches = INITIAL_TRACKS.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.artistName.toLowerCase().includes(q) || 
      (t.genre && t.genre.toLowerCase().includes(q))
    );

    // Also query iTunes Legal Preview Search API for vast legal library search
    try {
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
      if (itunesRes.ok) {
        const data = await itunesRes.json();
        if (data.results && Array.isArray(data.results)) {
          const remoteTracks: Track[] = data.results
            .filter((item: any) => item.previewUrl)
            .map((item: any) => ({
              id: `itunes-${item.trackId}`,
              title: item.trackName,
              artistId: `artist-${item.artistId}`,
              artistName: item.artistName,
              albumId: `album-${item.collectionId}`,
              albumName: item.collectionName,
              artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : undefined,
              audioUrl: item.previewUrl,
              duration: Math.round((item.trackTimeMillis || 30000) / 1000),
              genre: item.primaryGenreName,
              source: 'Legal Preview Stream',
              releaseDate: item.releaseDate
            }));

          // Merge unique tracks
          const seen = new Set(localMatches.map(m => m.id));
          for (const rt of remoteTracks) {
            if (!seen.has(rt.id)) {
              localMatches.push(rt);
            }
          }
        }
      }
    } catch {
      // Gracefully return local matches if network query fails
    }

    return localMatches;
  }

  async getTrack(id: string): Promise<Track | null> {
    const found = INITIAL_TRACKS.find(t => t.id === id);
    if (found) return found;

    // If it's an itunes track ID
    if (id.startsWith('itunes-')) {
      const itunesId = id.replace('itunes-', '');
      try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}&entity=song`);
        if (res.ok) {
          const data = await res.json();
          const item = data.results?.[0];
          if (item && item.previewUrl) {
            return {
              id,
              title: item.trackName,
              artistId: `artist-${item.artistId}`,
              artistName: item.artistName,
              albumId: `album-${item.collectionId}`,
              albumName: item.collectionName,
              artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : undefined,
              audioUrl: item.previewUrl,
              duration: Math.round((item.trackTimeMillis || 30000) / 1000),
              genre: item.primaryGenreName,
              source: 'Legal Preview Stream'
            };
          }
        }
      } catch {}
    }

    return null;
  }

  async getArtist(id: string): Promise<Artist | null> {
    const found = INITIAL_ARTISTS.find(a => a.id === id);
    return found || null;
  }

  async getAlbum(id: string): Promise<Album | null> {
    const tracks = INITIAL_TRACKS.filter(t => t.albumId === id);
    if (tracks.length > 0) {
      return {
        id,
        title: tracks[0].albumName || 'Album',
        artistName: tracks[0].artistName,
        artistId: tracks[0].artistId,
        artworkUrl: tracks[0].artworkUrl,
        tracks
      };
    }
    return null;
  }

  async getTrendingTracks(regionCode?: string): Promise<Track[]> {
    if (regionCode?.toUpperCase() === 'IN') {
      return INITIAL_TRACKS.filter(t => t.genre?.includes('Punjabi') || t.genre?.includes('Bollywood') || t.genre?.includes('Tamil') || t.genre?.includes('Indian Pop'));
    }
    return INITIAL_TRACKS;
  }

  async getNewReleases(): Promise<Album[]> {
    return [
      {
        id: 'album-ncs-release',
        title: 'Fearless Funk (Single)',
        artistName: 'DR MØB, Chris Linton',
        artworkUrl: INITIAL_TRACKS[0].artworkUrl,
        tracks: [INITIAL_TRACKS[0]]
      },
      {
        id: 'album-bad-newz',
        title: 'Bad Newz',
        artistName: 'Karan Aujla',
        artworkUrl: INITIAL_TRACKS[1].artworkUrl,
        tracks: [INITIAL_TRACKS[1]]
      }
    ];
  }

  async getRecommendations(track: Track): Promise<Track[]> {
    return INITIAL_TRACKS.filter(t => t.id !== track.id).slice(0, 10);
  }

  async getCategoryTracks(category: string): Promise<Track[]> {
    const q = category.toLowerCase();
    const matches = INITIAL_TRACKS.filter(t => (t.genre && t.genre.toLowerCase().includes(q)) || t.title.toLowerCase().includes(q));
    return matches.length > 0 ? matches : INITIAL_TRACKS;
  }

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    return INITIAL_PLAYLISTS;
  }
}

export const defaultMusicProvider = new CatalogMusicProvider();
