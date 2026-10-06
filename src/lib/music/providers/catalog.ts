import { Track, Artist, Album, Playlist } from '@/types/music';
import { MusicProvider } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-fearless-funk',
    title: 'Fearless Funk',
    artistId: 'artist-dr-mob',
    artistName: 'DR MØB, Chris Linton',
    albumId: 'album-ncs-release',
    albumName: 'Fearless Funk (Single)',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5-A5tvDVNA1zUz-P2fNxAW00Db5ym3CfrOJFQk-k2P77vTWqQjvEKAKGvywh3CHuCVi1INiU6cjJSpAx91bBTR7RLLNO6MO9Y5XVDzegiCf3TViS5VLvs5-CQAt1HkSz0btc1w6du8wzdewpqOpnkX8fJxL-ehZh-bIhAt-EVDpBVRKyEt-LFtKPb_W45DfYMBoFgjFDKWIL2DlQ0d8O7mSBiiePUCyRzx6qXsIjVLnk98ger4Rha7A',
    audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/deep_space_drive.ogg', // reliable royalty-free audio
    duration: 138, // 2:18 matching Stitch
    genre: 'Electronic / Phonk',
    source: 'NCS Royalty-Free Catalog'
  },
  {
    id: 'track-tauba-tauba',
    title: 'Tauba Tauba',
    artistId: 'artist-karan-aujla',
    artistName: 'Karan Aujla',
    albumId: 'album-bad-newz',
    albumName: 'Bad Newz',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ITEgoYGl_SE8l9wuE-_CnGrrPSWoiZl0T-HX5KpmYdBCuuqwX7-Yk_h3iGIr0zqhBcWE-UbBgZp0LnkgCJV8Is137HhD5bi7Vndfgmuee9HoFTANyGQ_T-lV3DuciOu6g58BwVKCqOgEZhhcSO61NQwWSQmpFpnVc3kR9Q_cBpPlBE6_FVYjCQU3OuXH3o3EG2gSUYDYxpDS0NBKgQRUSp6Qh5LpRUVD7rrdu0JzCjtBFCJr55yRA',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/carnival_crowd_and_rides.ogg',
    duration: 204,
    genre: 'Punjabi Pop',
    source: 'Trending India'
  },
  {
    id: 'track-chuttamalle',
    title: 'Chuttamalle',
    artistId: 'artist-anirudh',
    artistName: 'Anirudh Ravichander, Shilpa Rao',
    albumId: 'album-devara',
    albumName: 'Devara Part 1',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzoXdIy5kfJYX_DilbwKkzBdT5QMCYwB3-RBVcNsTFcB7t9mpgW0iXB9sqq-EvBpNy4ZRqqf0rTcd39GIsLdYZOmVLOgAmVCyhL67c_8Z-Sys1iqHypd4BVH_UJxidnDfLuOgi18aSZvTwcdA4s99deQda3QjY3nRDGXF2c9bIxRAiadSdQZUh5PV-Dg7WS_SxYTNKx75eUYUxNmFecFf2AYjd_RB7Dwbo4-Q_Rv04XjHp60mNzzlH0A',
    audioUrl: 'https://actions.google.com/sounds/v1/foley/swoosh_transition_medium.ogg',
    duration: 220,
    genre: 'Tamil Hits',
    source: 'Trending Tamil'
  },
  {
    id: 'track-o-sajni-re',
    title: 'O Sajni Re',
    artistId: 'artist-arijit-singh',
    artistName: 'Arijit Singh, Ram Sampath',
    albumId: 'album-laapataa-ladies',
    albumName: 'Laapataa Ladies',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3s5P-n1HV1lUeyy5iu8h2YK3GH-QQ5P6tA_WA2dnJvjnpQ2YZzMY7iVkRl_f4y7u4TGuYSOrMloPr9qammRZgLlZarXkLOOSgARa_hHaP-d2KXY-pqd-DgUGfFdcJd_8-8x-GYodSgZNTqFVjZNuxJkT_nZyUfK8xusdYJ3YMXUwIqLTb-kx_5rxhe6uV_eyVdRC0xvaIntkEcuHxNKNPc1B93aASa2BPHDDV50TA4-Q8mNd-BqwHWw',
    audioUrl: 'https://actions.google.com/sounds/v1/water/gentle_rain_on_pavement.ogg',
    duration: 172,
    genre: 'Bollywood & Chill',
    source: 'Bollywood & Chill'
  },
  {
    id: 'track-happy-vibes',
    title: 'Sunny Days in Goa',
    artistId: 'artist-chill-groove',
    artistName: 'Acoustic Waves',
    albumId: 'album-happy-vibes',
    albumName: 'Happy Vibes Vol. 1',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm0Wvim7hrP_Ix-Thx7IGW3U-rJxlanKQrxUX6OjQJk0qPzKbCS4DYYEgiG5vVgAbhWL6hw5MC7UnxJnlIvcayJj7Xl9JgsLOYwDrSQwkB5m7J1Hm43pnbNrQPLrmc2xcLDP2bgdV5oQtfKg8n-zyqmPDNNZlutq4auv8Tm3qkuziIgprzK7I9jsi2P-O9LDL1u5uqwc_FLn0ZGMmOxFYBzVjohOFbcYd0Luk6ppN2u_ieXKuLCz8Npw',
    audioUrl: 'https://actions.google.com/sounds/v1/water/lake_waves_small_dock.ogg',
    duration: 195,
    genre: 'Indie Acoustic',
    source: 'Happy Vibes'
  },
  {
    id: 'track-pov-in-love',
    title: 'Midnight Euphoria',
    artistId: 'artist-luna-rose',
    artistName: 'Luna Rose',
    albumId: 'album-pov-in-love',
    albumName: "pov: you're in love",
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArPqqhxGNQuAkPXNQ7Qo1IyjZGCe-6UY5BkAdZB840epb7OZ-A-1-PDInctHf_T7lMfoqdhuRB1oUop-bONhFIca7coVES6ug_4vzCnbBCqyJQIo-Wl29YnFx0jy5hg-JEmsqdKqrzT48krptPwCB-AxuaGnaabPDpKcMKXGdKibuwto-_YW8627ehGWTCEkkKqnrlpkFECUxblfTCJAUaCZKZih8iO4l3BfgsT6CTzIrEmIZEfqaiTg',
    audioUrl: 'https://actions.google.com/sounds/v1/weather/light_thunder_storm_and_rain.ogg',
    duration: 184,
    genre: 'Dream Pop / Romance',
    source: "pov: you're in love"
  },
  {
    id: 'track-ipop-hits',
    title: 'Neon Skyline',
    artistId: 'artist-kabir-sen',
    artistName: 'Kabir Sen, Priya Nair',
    albumId: 'album-ipop-hits',
    albumName: 'I-Pop Superhits 2026',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAopyW1fXaxyQ6fqqM6Mu--hATPxza6P9F25-XDm248qRcaYaO_Rk5h-jBQuwDdn4Sjvup5V-uxp69JVf4H-r2_0cw4iE1bc5tsvlDBLWrUQLV0CGvREMXRJyMt9MMr-13SEceLMsdvHb-0OkB5qkRyQ_VhbHiA7RxeBjH2TdVEa68FCX6nZX-cXVQVPDx-DIGbb9YzeFQC97W84sZXg80lxhaUyqrDzvO8bdvNV11puqLD-5-y2tCUVg',
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/subway_interior.ogg',
    duration: 210,
    genre: 'Indian Pop',
    source: 'I-Pop'
  },
  {
    id: 'track-hot-hits-hindi',
    title: 'Chal Kudiye',
    artistId: 'artist-diljit-dosanjh',
    artistName: 'Diljit Dosanjh, Alia Bhatt',
    albumId: 'album-jigra',
    albumName: 'Jigra Soundtracks',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXp2Y5r7pWKez5A7kdM13GjwX74bbXtPJbLKDFI7pLaLo7UNF6F1h0L2LW3FsINJQ66qE1Vf8ahdCGcTN6PZsjNR8XvcHJD96VMe0tbqvL1zlUOF56rit2OiEqd2FBtnbwtCJFJNvIc_6VFlNYZGDxuGoeo5h9PD3uRerWz7H5_5KvPdG3uFjue5Foyoj6m2n8baxuPPz_vx79Eynajy90ECk5SsK0e4rXUlVkk0wnBjWrl0ZQE_j8Lg',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market_mumbai.ogg',
    duration: 198,
    genre: 'Hindi Hits',
    source: 'Hot Hits Hindi'
  },
  {
    id: 'track-gta-beat',
    title: 'Midnight City Boulevard',
    artistId: 'artist-vice-fm',
    artistName: 'Vice City FM Synthesizers',
    albumId: 'album-gta-soundtrack',
    albumName: 'Grand Theft Auto Official Playlist',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnaAPj5qow9H9cawa408P83Lle6lbSm0Pm0Po1JEaS61p1dLP9WIVDmczbO9ueJffwozyUbsHi6qyHu62GlZgQgZ44FiK9xjTUhrAdUm9YEP3Sr0Z71lyIfx_8HeVXGFrODbdNgHhh4PytdqiASU3e0WG2-SRO1FmOWA6vXv1jl4SE-BES1tyzEnujvCV84vNF3tHpzZvBRgRHXzuO6WPlV4Tvut01hSA_qn7-5f9YKBVPD_q5gjZNlg',
    audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg',
    duration: 245,
    genre: 'Synthwave / Retro',
    source: 'Rockstar Games'
  },
  {
    id: 'track-phonk-drift',
    title: 'Tokyo Midnight Drift',
    artistId: 'artist-phonk-master',
    artistName: 'Kordhell & DVRST Echoes',
    albumId: 'album-phonk-drift',
    albumName: 'the beat of your drift (PHONK)',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0q7PqQYMt1bwVjLAxGuytTU42EM3iczCuwNsjzeTuVl84Nib7YyGP3ZTuT4FgNXyNS6bdk3_9AWtGkHrbPiGpQQZ2NjhNtHM34tZymmXUa13ZFENmmejd-VCLIF6tkRGWY57D97Un5pdLb1_-aVWaA4NKXUCarsnJczIoDZf3Uax8YUBhMiNa1TMErMUX8zbfu2ms0aeFJkFdaxiDhVnVt_wxKoTnqLCtnECB5Xc_LbWvaJrMQKHpEQ',
    audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/teleport_device_loop.ogg',
    duration: 152,
    genre: 'Drift Phonk',
    source: 'PHONK Records'
  },
  {
    id: 'track-dreamy-chill',
    title: 'Raindrops in Kyoto',
    artistId: 'artist-lofi-beats',
    artistName: 'Lofi Garden & Chillhop',
    albumId: 'album-dreamy-chill',
    albumName: 'Dreamy Chill Lounge',
    artworkUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhutN_e5d-q8qaz5HJax0urT6lq-Soxx1coRaITVv7_o0uyDlDSCW2cfSMIdVgGNp20tR2igJEoY22Ue6v4WKmRVvPQ5jiythYoy7v6TuqGPNLJjXjB6YatWQNHbsQNQMGPkuiBvutks7p1JMpGjNNdQMB_z9Z5BkMJuAhKq8YeAayWKSVQk6PPbOJMOYS-KZObQJ9-lZO-BJzQBmqFnUKFpUJem5upVdN5f3gSo6LHqy_2Cp3M6UU4g',
    audioUrl: 'https://actions.google.com/sounds/v1/water/creek_water_trickle.ogg',
    duration: 178,
    genre: 'Ambient Chill',
    source: 'Dreamy Chill'
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-dr-mob',
    name: 'DR MØB',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj7E5tMyhe2b5EaYOK4lJh2KRCtgQ_jKH3_O5K2E3CdMFvOlKbz3xMOrYIdBwP8Ark7XnDpT4o0VK-zWhQcFXXRmVLeGKocdo99aPU7xVvXUUSG3s6QxYWtzq3bRt7CPCzXdEid390YrGTZNkkaibp1RU2nCPyomMma8d-CpftdKjCpsRz3maoRMv0fDiYm1YIiihM3f1hkyi_0oOox5nw5wCGsbu2kcevSgV8d_6rrr1vWuo17-u-rQ',
    description: 'Multi-genre producer combining dark cyber-bass textures, Phonk grooves, and high-energy electronic soundscapes.',
    monthlyListeners: '124,592 monthly listeners',
    verified: true
  },
  {
    id: 'artist-arijit-singh',
    name: 'Arijit Singh',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3s5P-n1HV1lUeyy5iu8h2YK3GH-QQ5P6tA_WA2dnJvjnpQ2YZzMY7iVkRl_f4y7u4TGuYSOrMloPr9qammRZgLlZarXkLOOSgARa_hHaP-d2KXY-pqd-DgUGfFdcJd_8-8x-GYodSgZNTqFVjZNuxJkT_nZyUfK8xusdYJ3YMXUwIqLTb-kx_5rxhe6uV_eyVdRC0xvaIntkEcuHxNKNPc1B93aASa2BPHDDV50TA4-Q8mNd-BqwHWw',
    description: 'India’s most streamed playback singer and composer, celebrated for romantic and soulful melodies.',
    monthlyListeners: '38,914,020 monthly listeners',
    verified: true
  },
  {
    id: 'artist-karan-aujla',
    name: 'Karan Aujla',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL8ITEgoYGl_SE8l9wuE-_CnGrrPSWoiZl0T-HX5KpmYdBCuuqwX7-Yk_h3iGIr0zqhBcWE-UbBgZp0LnkgCJV8Is137HhD5bi7Vndfgmuee9HoFTANyGQ_T-lV3DuciOu6g58BwVKCqOgEZhhcSO61NQwWSQmpFpnVc3kR9Q_cBpPlBE6_FVYjCQU3OuXH3o3EG2gSUYDYxpDS0NBKgQRUSp6Qh5LpRUVD7rrdu0JzCjtBFCJr55yRA',
    description: 'Global Punjabi singer-songwriter redefining modern desi hip hop and dancefloor anthems.',
    monthlyListeners: '14,820,119 monthly listeners',
    verified: true
  },
  {
    id: 'artist-anirudh',
    name: 'Anirudh Ravichander',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzoXdIy5kfJYX_DilbwKkzBdT5QMCYwB3-RBVcNsTFcB7t9mpgW0iXB9sqq-EvBpNy4ZRqqf0rTcd39GIsLdYZOmVLOgAmVCyhL67c_8Z-Sys1iqHypd4BVH_UJxidnDfLuOgi18aSZvTwcdA4s99deQda3QjY3nRDGXF2c9bIxRAiadSdQZUh5PV-Dg7WS_SxYTNKx75eUYUxNmFecFf2AYjd_RB7Dwbo4-Q_Rv04XjHp60mNzzlH0A',
    description: 'Renowned Indian film composer known for high-octane background scores and viral chartbusters.',
    monthlyListeners: '22,431,900 monthly listeners',
    verified: true
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-sky-limit',
    name: 'Sky is the limit 📈',
    description: 'High energy beats, motivational anthems, and relentless drive.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOmQRIS8f3CS7eq3-ImvLihnpYXCuK4XFtSQaKbHJqpVuEXbiLOZKmF6CPSG-zLsfTvR6wib5bOzDbvfFyN2FgQxLEL4xQ3p9JgWh3eYkbLEwYy0lcJmS-OtS_b_bICeOBzAckeSTfIN82slGKPJh0JFltPB0MUs5bV78cerqpuKYyRNyULvyruUfqUzDvvZDUbI3KiIfAYZwd-rXwI9LhANOZei1IrGhoUfDDVIc3Dxhoy3RkJtOAVA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[8], INITIAL_TRACKS[9]]
  },
  {
    id: 'playlist-diffsong2',
    name: 'Diffsong2',
    description: 'Eclectic electronic cuts, indie melodies, and fresh discoveries.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCrrkIsO7PhuNhCQSglSzTl9Y6b6wyGC7Ru3DbJviiQQyy0fZsAy6_ohyfpXvd9K6NnEvYRvOrg1YGkyVtPwqcZsxNqSPWK0WZuyxg1GE-JcUppejk2hxpZSQG9EhUio0zARB6vVH1AW7PREWersKcNX-oUGQkUpqNk0qkeIntajuO4a7w4vM3psuPumnxQOQilDxyA2a4KA1tSF1YOw60cSlKZu0yO2ET0Rv19R3Q9wWH_ijLrlE0w',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[4], INITIAL_TRACKS[5], INITIAL_TRACKS[6]]
  },
  {
    id: 'playlist-bengali-songs',
    name: 'Bengali songs 🎵',
    description: 'Timeless melodies, Rabindra Sangeet, and contemporary Bangla hits.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0nwddKHCIdgGbgXSUBLSW19mAPIrcuYRnuC-ZSTYso9Lh6a7xe9Glm-PaHVTdSoIBoiVDSjdw0cEnMkFFNmQi9pJ-_t705z9ftMAA1JNHtLyenKove5xPjrmXUr-ek3pO7M1BVjOEAVigoGZ3sLkmVa3nU57nTv3M9hW_7xM8mM9GT2Of7zzFxDjNeiZIpFwJlTQtMYnvkctKQvxfENd_q5DWfXNwY0qtahkccrcSvvL1qYXvfLxoKQ',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[3], INITIAL_TRACKS[7], INITIAL_TRACKS[10]]
  },
  {
    id: 'playlist-fresh-bengali',
    name: 'Fresh bengali',
    description: 'Newest releases and vibrant beats from Kolkata and Dhaka.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8hXfAzQFPyxyinbqcC8K3pv5SLuK1HNKACKEMZu9AprpYG6-gYIyF0wno1ZewRK0tsW5tyu5Sk44k2BSt2S3RI7LGoXvPVxUWxhQkdInFcXspfU9oAVexI8HdTegXe9kHxL8d9dlaDmt3nGd4I_i3fsXV1hiFq_8DF1mKLHwIhm10y5dDowmO4HTBGHWRGvUEnNAwQRcoZmZrpixRA8zRWRsRJrhNG9TuZQo86mX5UhaDZ-zMHrSsZA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[1], INITIAL_TRACKS[3]]
  },
  {
    id: 'playlist-peace-of-mind',
    name: 'Peace of mind',
    description: 'Calm acoustic instruments, ambient strings, and mindful meditation.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDreGk7wvWOh72L6iEDdeeKBXvjjCSqqCa5v2WHwnT3mFXF98dc1X6U0l_qEeD6USzNrq3OurrnBib5S_p_CRAg0A96R9GDTQdxYgJIrw_P4zt8_Z0GhRt2wSVz00fQQwe5vHjUZrLfhvCygkAsCUD3gtaqygG5KCvrQ9FJUcsIR52inFaHPWBYbMKC9riYc-NT0HgKOQdT0j8RaYv6KLd0vF6Gz4AqqIumlXH2OCyEB85BVxPSBtmTVA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[4], INITIAL_TRACKS[10]]
  },
  {
    id: 'playlist-edm',
    name: 'EDM',
    description: 'Festival bass drops, house anthems, and euphoric dance beats.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpywiZIg-rc2TPlZxWCiCydIPpj_66RHQEzSfY0Dz3LQhAPN5dnYvTh-6QDLbgHdIIIXzWp62q5pMGngPN-QsBnJKWFkBYrn9BuMl_gGrHn9EA5o-xtD06JWE-dWeHY8piv6adGk4NSvpwJd4aocWY3EcDYk540Zl4VVO2r0i9aXoYNYae6XUhdqvXdZ-imK4WVyxvYRKQfsmUCcLXGuSMdjmGkSEQJ8yRNltpVi_P2JlRmNX2uMGTDA',
    author: 'Suvradip Maity',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[8], INITIAL_TRACKS[9]]
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

  async getTrendingTracks(): Promise<Track[]> {
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

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    return INITIAL_PLAYLISTS;
  }
}

export const defaultMusicProvider = new CatalogMusicProvider();
