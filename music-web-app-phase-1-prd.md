# 🎵 Music Web App — Phase 1 Product Requirements Document (PRD)

## 1. Product Overview

### Product Name
**[Temporary Name — Musify / TuneFlow / WaveMusic]**

### Product Type
Free, responsive music streaming web application.

### Technology Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML5 Audio API
- Legal/free music catalog API
- Vercel-compatible deployment

### Phase 1 Authentication
**No login or registration.**

The entire application must be publicly accessible.

User preferences such as:
- Favorites
- Recently played
- Local playlists
- Volume
- Player settings

must be stored locally using `localStorage` or IndexedDB.

---

# 2. Product Vision

Build a modern music streaming web application inspired by the usability of Spotify, YouTube Music, and Apple Music, while maintaining an original design.

Users should be able to:
- Discover music
- Search for songs
- Search artists
- Search albums
- Play music
- Pause music
- Skip tracks
- Seek through tracks
- Control volume
- Shuffle music
- Repeat music
- Create playlists
- Favorite songs
- View recently played songs
- Manage a playback queue
- Use the application on desktop and mobile

No account should be required.

---

# 3. Licensing and Music Source Requirements

## IMPORTANT

The application must only use music that the application has permission to stream.

Allowed sources include:
1. Royalty-free music
2. Open-license music
3. Public-domain music
4. A music API/catalog that explicitly permits streaming
5. Properly licensed commercial music

The application must NOT:
- Download music from YouTube
- Extract YouTube audio URLs
- Convert YouTube videos to MP3
- Scrape unauthorized audio streams
- Store copyrighted music without permission
- Circumvent DRM
- Bypass platform restrictions
- Proxy unauthorized music streams
- Use YouTube-to-MP3 services

The music provider must be implemented through an abstraction layer so that the provider can be replaced later.

---

# 4. Phase 1 Goals

## Must Have
- Homepage
- Music discovery
- Search
- Song cards
- Artist cards
- Album cards
- Audio player
- Queue
- Play/Pause
- Previous/Next
- Seek
- Volume control
- Shuffle
- Repeat
- Favorites
- Recently played
- Local playlists
- Responsive design
- Loading states
- Empty states
- Error handling
- Local persistence

## Not Required in Phase 1
- Login
- Registration
- Authentication
- User accounts
- Social login
- Cloud synchronization
- Payments
- Subscription
- Admin dashboard
- Artist dashboard
- Music uploads
- Comments
- Social networking
- Personalized cloud recommendations

---

# 5. Target User

The target user is a visitor who wants to:
1. Open the website
2. Discover music
3. Search for a song
4. Start playback
5. Continue browsing while music plays
6. Create local playlists
7. Favorite songs
8. View recently played songs
9. Return later and retain local preferences

No login should be necessary.

---

# 6. Application Routes

Recommended route structure:

```text
/
├── /search
├── /album/[id]
├── /artist/[id]
├── /playlist/[id]
├── /favorites
├── /recently-played
└── /library
```

Optional routes:
```text
/trending
/new-releases
/genres
```

---

# 7. Main Layout

## Desktop

```text
┌───────────────────────────────────────────────────────────┐
│ Logo        Search                          Theme / More │
├────────────────┬──────────────────────────────────────────┤
│                │                                          │
│ Home           │                                          │
│ Search         │              MAIN CONTENT                │
│                │                                          │
│ Library        │                                          │
│ Favorites      │                                          │
│ Recently Played│                                          │
│                │                                          │
│ Playlists      │                                          │
│ + New Playlist │                                          │
│                │                                          │
├────────────────┴──────────────────────────────────────────┤
│                    MUSIC PLAYER                           │
│ ◀   ▶   Song Name       ━━━━━━━━━━━    🔊   Queue        │
└───────────────────────────────────────────────────────────┘
```

## Mobile

```text
┌───────────────────────────┐
│ Logo                 🔍   │
├───────────────────────────┤
│                           │
│         CONTENT           │
│                           │
│                           │
├───────────────────────────┤
│ Current Song          ▶   │
│ ━━━━━━━━━━━━━━━━━━━━━━━   │
├───────────────────────────┤
│ Home   Search   Library   │
└───────────────────────────┘
```

---

# 8. Navigation

## Desktop Sidebar

### Main
- Home
- Search

### Your Library
- Favorites
- Recently Played
- Playlists

### Discover
- Trending
- New Releases
- Genres

The sidebar should remain fixed on desktop.

On mobile, use bottom navigation.

---

# 9. Homepage

The homepage is the primary discovery screen.

## Hero Section

Example:

> Discover your next favorite song.  
> A beautiful music experience built for discovery.

Button:
`Explore Music`

Do not claim a specific number of available songs unless the actual music catalog supports that claim.

## Recently Played

Display recently played tracks.

If there is no history:

> No recently played songs yet.  
> Start listening and your history will appear here.

## Trending Music

Display music supplied by the selected legal music provider.

Example card:

```text
┌──────────────────┐
│                  │
│    COVER IMAGE   │
│                  │
├──────────────────┤
│ Song Name        │
│ Artist Name      │
└──────────────────┘
```

On hover, display a play action.

## Popular Artists

Display artists using horizontal cards with circular artwork.

## Popular Albums

Display album cards in a responsive grid.

---

# 10. Search

Search is one of the core features.

Search input:

```text
🔍 Search songs, artists, albums...
```

Search should support:
- Song title
- Artist
- Album
- Genre where supported

## Search Behavior

Example query:

```text
arijit
```

Display:

```text
Songs
────────────────────────────
▶ Song 1                 Artist
▶ Song 2                 Artist
▶ Song 3                 Artist

Artists
────────────────────────────
◯ Artist 1

Albums
────────────────────────────
▣ Album 1
```

Use a debounce of approximately `300–500ms` to reduce unnecessary API requests.

---

# 11. Music Provider Architecture

Do not hard-code the music provider throughout the application.

Create a provider abstraction.

Recommended structure:

```text
lib/
└── music/
    ├── provider.ts
    ├── types.ts
    └── providers/
        └── provider-a.ts
```

Example interface:

```typescript
interface MusicProvider {
  searchTracks(query: string): Promise<Track[]>
  getTrack(id: string): Promise<Track | null>
  getArtist(id: string): Promise<Artist | null>
  getAlbum(id: string): Promise<Album | null>
  getTrendingTracks(): Promise<Track[]>
  getNewReleases(): Promise<Album[]>
}
```

The application should be able to switch music providers without rewriting the UI.

---

# 12. Track Data Model

```typescript
interface Track {
  id: string
  title: string
  artistId?: string
  artistName: string
  albumId?: string
  albumName?: string
  artworkUrl?: string
  audioUrl: string
  duration?: number
  genre?: string
  source: string
}
```

Optional:
```typescript
releaseDate?: string
explicit?: boolean
```

Never assume that a music provider supplies fields that it does not actually provide.

---

# 13. Artist Data Model

```typescript
interface Artist {
  id: string
  name: string
  imageUrl?: string
  description?: string
}
```

---

# 14. Album Data Model

```typescript
interface Album {
  id: string
  title: string
  artistName: string
  artistId?: string
  artworkUrl?: string
  releaseDate?: string
  tracks: Track[]
}
```

---

# 15. Audio Player

The audio player is the core component of the application.

Use the native HTML5 Audio API.

Recommended architecture:

```text
AudioPlayerContext
        │
        ├── currentTrack
        ├── queue
        ├── isPlaying
        ├── currentTime
        ├── duration
        ├── volume
        ├── shuffle
        └── repeat
```

There should ideally be only one global audio element:

```html
<audio />
```

Do not create one audio element for every song card.

---

# 16. Player Controls

## Required
- Previous
- Play/Pause
- Next
- Shuffle
- Repeat
- Volume
- Queue

## Progress

Display:

```text
1:24 ━━━━━━━━━━━━━━━━━ 3:42
```

The user should be able to click or drag the progress bar.

---

# 17. Player Behavior

When the user clicks Play:

```text
if currentTrack exists:
    play currentTrack
else:
    select first queue item
```

When a song finishes:

```text
if repeat === "one":
    replay current track

else if queue has next:
    play next track

else if repeat === "all":
    restart queue

else:
    stop
```

---

# 18. Shuffle

Shuffle should randomize playback order.

Maintain:

```text
originalQueue
playbackQueue
currentIndex
```

Do not unnecessarily mutate the original playlist.

Shuffle should avoid immediately playing the same song again.

---

# 19. Repeat

Support three repeat modes:

```text
OFF
ALL
ONE
```

---

# 20. Queue

Create a queue drawer/panel.

```text
┌─────────────────────────────┐
│ Queue                   ×   │
├─────────────────────────────┤
│ Now Playing                 │
│ 🎵 Song A                   │
├─────────────────────────────┤
│ Next                        │
│ 🎵 Song B                   │
│ 🎵 Song C                   │
│ 🎵 Song D                   │
└─────────────────────────────┘
```

Users should be able to:
- Remove songs
- Reorder songs
- Select a song
- Clear queue

---

# 21. Favorites

Because Phase 1 has no authentication, favorites must be stored locally.

Use:

```text
localStorage
```

Example key:

```text
music:favorites
```

Store only track metadata or IDs.

Do not store audio files.

Favorite button:
- Inactive: `♡`
- Active: `♥`

---

# 22. Recently Played

Store recently played tracks locally.

Maximum history:

```text
50 tracks
```

Whenever playback starts:
- Add track to history
- If track already exists, move it to the top

---

# 23. Local Playlists

Phase 1 should support playlists without user accounts.

User clicks:

```text
+ New Playlist
```

Display a dialog:

```text
Create Playlist

Name:
[ Workout Music ]

[Cancel] [Create]
```

Store playlists in:

```text
localStorage
```

Example:

```json
{
  "id": "playlist-123",
  "name": "Workout Music",
  "tracks": []
}
```

Users should be able to:
- Create playlist
- Rename playlist
- Delete playlist
- Add songs
- Remove songs
- Play playlist
- Shuffle playlist

---

# 24. Local Storage Architecture

Create centralized storage utilities:

```text
lib/
└── storage/
    ├── favorites.ts
    ├── history.ts
    ├── playlists.ts
    └── settings.ts
```

Do not directly call `localStorage` from dozens of components.

Handle Next.js SSR carefully because `window` and `localStorage` are unavailable during server rendering.

---

# 25. Authentication

Phase 1 must NOT contain:
- Login
- Registration
- Password
- Google authentication
- OAuth
- User profiles
- Account pages

The application should work immediately when opened.

---

# 26. Music API Environment Variables

Example:

```env
MUSIC_API_KEY=
MUSIC_API_BASE_URL=
```

Private API keys must never be exposed through `NEXT_PUBLIC_` unless the provider explicitly requires a public key.

---

# 27. API Layer

Prefer Next.js Route Handlers.

Example:

```text
app/
└── api/
    └── music/
        ├── search/
        │   └── route.ts
        ├── trending/
        │   └── route.ts
        ├── artist/
        │   └── [id]/
        │       └── route.ts
        └── album/
            └── [id]/
                └── route.ts
```

Architecture:

```text
React UI
   ↓
Next.js API Route
   ↓
Music Provider
   ↓
Legal Music Catalog
```

---

# 28. API Caching

Music APIs may have rate limits.

Recommended caching:

```text
Trending:
10–30 minutes

New Releases:
30–60 minutes

Artist:
30 minutes

Album:
30 minutes

Search:
Short cache or no aggressive cache
```

Do not globally cache user-specific information.

---

# 29. Loading States

Every asynchronous section must have a loading state.

Use skeleton loaders instead of blank sections.

---

# 30. Error Handling

If the music API fails:

> Something went wrong.  
> We couldn't load music right now.

Button:
`Try Again`

If audio playback fails:

> Unable to play this track.  
> Try another song.

If a track is unavailable:

> This track is currently unavailable.

The entire application must not crash because of a single failed track.

---

# 31. Empty States

## Favorites

> No favorites yet.  
> Tap the heart on a song to save it here.

## Playlists

> You don't have any playlists yet.  
> Create your first playlist.

## Recently Played

> Nothing played yet.  
> Start listening to build your history.

---

# 32. Responsive Design

The application must support:
- Desktop
- Laptop
- Tablet
- Mobile

Use Tailwind responsive breakpoints.

Mobile experience is a priority.

---

# 33. Mobile Player

Collapsed:

```text
┌────────────────────────────────┐
│ 🎵 Song Name          ▶    ⋮   │
└────────────────────────────────┘
```

Expanded:

```text
┌────────────────────────────────┐
│              ↓                 │
│                                │
│          ALBUM ART             │
│                                │
│          Song Name             │
│          Artist Name           │
│                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                │
│          ◀    ▶    ▶           │
│                                │
│           🔀   🔁              │
└────────────────────────────────┘
```

---

# 34. Theme and Visual Design

Default theme:

**Modern dark music interface**

Visual direction:
- Dark background
- Soft gradients
- Large artwork
- Rounded cards
- Subtle borders
- Minimal shadows
- High readability
- Smooth transitions
- Clean typography

Do not copy Spotify's interface exactly. Create an original visual identity.

---

# 35. Color System

Use CSS variables:

```css
--background
--foreground
--card
--card-hover
--primary
--secondary
--muted
--border
```

Do not hard-code colors throughout individual components.

---

# 36. Typography

Recommended:
- Inter
- Geist
- Manrope

Suggested hierarchy:

```text
H1: 32–48px
H2: 22–28px
Card title: 14–16px
Secondary text: 12–14px
```

---

# 37. Component Structure

Recommended:

```text
components/
│
├── layout/
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   ├── Header.tsx
│   └── MainLayout.tsx
│
├── music/
│   ├── TrackCard.tsx
│   ├── TrackRow.tsx
│   ├── ArtistCard.tsx
│   ├── AlbumCard.tsx
│   ├── PlaylistCard.tsx
│   └── MusicGrid.tsx
│
├── player/
│   ├── MusicPlayer.tsx
│   ├── PlayerControls.tsx
│   ├── ProgressBar.tsx
│   ├── VolumeControl.tsx
│   └── Queue.tsx
│
├── playlist/
│   ├── CreatePlaylistDialog.tsx
│   └── PlaylistMenu.tsx
│
└── ui/
```

---

# 38. State Management

Redux is not required for Phase 1.

Use React Context or a lightweight state manager.

Recommended:

```text
AudioPlayerContext
```

Responsibilities:
- currentTrack
- isPlaying
- queue
- currentIndex
- volume
- currentTime
- duration
- shuffle
- repeat

Separate contexts can be used for Favorites and Playlists if required.

---

# 39. Performance

The application should:
- Lazy-load images
- Use Next.js Image where compatible
- Avoid unnecessary API calls
- Debounce search
- Cache API responses
- Avoid rendering huge lists
- Use pagination/infinite scrolling where appropriate
- Keep the audio player mounted during navigation
- Avoid restarting audio during route changes

Example:

```text
Home
  ↓
Search
  ↓
Artist
  ↓
Album
```

The current music should continue playing.

---

# 40. SEO

Public pages should have:
- Title
- Description
- Open Graph metadata
- Dynamic metadata for artists
- Dynamic metadata for albums

Example:

```text
Music App — Discover and Listen to Music
```

---

# 41. Accessibility

Support:
- Keyboard navigation
- Visible focus states
- Accessible buttons
- `aria-label`
- Proper color contrast
- Screen reader compatibility

Example:

```html
<button aria-label="Play song">
```

---

# 42. Security

Never expose:
- Private API keys
- Provider credentials
- Server secrets

Do not use private credentials as `NEXT_PUBLIC_*`.

Use server-side API routes where possible.

Validate external API responses before passing them to UI components.

---

# 43. Analytics

Optional in Phase 1.

If implemented, track only useful anonymous metrics such as:
- Page views
- Search usage
- Playback errors
- Popular tracks

Do not collect unnecessary personal information.

---

# 44. Deployment

Target deployment:

```text
Vercel
```

Architecture:

```text
                 Browser
                    │
                    ▼
              Next.js / Vercel
                 │       │
                 │       └── LocalStorage
                 │
                 ▼
             Music API
                 │
                 ▼
         Legal Music Catalog
```

No custom music storage server should be required.

No music files should be stored in the application's cloud storage.

---

# 45. Database

## Phase 1

**No database is required.**

Use `localStorage` or IndexedDB for:
- Favorites
- History
- Playlists
- Settings

## Phase 2

Recommended:

```text
Supabase PostgreSQL
```

Potential tables:
- users
- favorites
- playlists
- playlist_tracks
- history
- settings

---

# 46. Future Phase 2 Features

Do not implement these in Phase 1.

## Authentication
- Google
- Email
- OAuth

## Cloud Synchronization
- Favorites
- Playlists
- History
- Settings

## Personalized Recommendations
- Recently played
- Favorite artists
- Favorite genres
- Listening behavior

## Social Features
- Share playlists
- Public playlists
- Follow users
- Follow artists

## Premium
Potential future features:
- Higher-quality audio
- Additional features
- Ad-free experience where legally permitted

---

# 47. Phase 1 Acceptance Criteria

## Discovery
- [ ] Homepage loads successfully
- [ ] Trending music loads
- [ ] Artists load
- [ ] Albums load
- [ ] Music cards work

## Search
- [ ] Search works
- [ ] Search is debounced
- [ ] Results display correctly
- [ ] Search errors are handled

## Playback
- [ ] Play works
- [ ] Pause works
- [ ] Resume works
- [ ] Previous works
- [ ] Next works
- [ ] Seek works
- [ ] Volume works
- [ ] Shuffle works
- [ ] Repeat works
- [ ] Automatic next track works
- [ ] Player persists during navigation

## Library
- [ ] Favorite works
- [ ] Favorite persists after refresh
- [ ] Recently played works
- [ ] Playlist creation works
- [ ] Playlist deletion works
- [ ] Add track to playlist works
- [ ] Remove track works

## UX
- [ ] Desktop responsive
- [ ] Tablet responsive
- [ ] Mobile responsive
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Empty states exist

## Technical
- [ ] TypeScript
- [ ] No unnecessary `any`
- [ ] Clean component architecture
- [ ] No API secrets exposed
- [ ] No unauthorized music downloading
- [ ] No YouTube audio extraction
- [ ] Production build succeeds
- [ ] Vercel deployment succeeds

---

# 48. Recommended Project Structure

```text
app/
├── api/
│   └── music/
│       ├── search/
│       │   └── route.ts
│       ├── trending/
│       │   └── route.ts
│       ├── artists/
│       │   └── [id]/
│       │       └── route.ts
│       └── albums/
│           └── [id]/
│               └── route.ts
│
├── album/
│   └── [id]/
│       └── page.tsx
│
├── artist/
│   └── [id]/
│       └── page.tsx
│
├── favorites/
│   └── page.tsx
│
├── recently-played/
│   └── page.tsx
│
├── playlist/
│   └── [id]/
│       └── page.tsx
│
├── search/
│   └── page.tsx
│
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── layout/
├── music/
├── player/
├── playlist/
└── ui/

context/
├── AudioPlayerContext.tsx
├── FavoritesContext.tsx
└── PlaylistContext.tsx

lib/
├── music/
│   ├── provider.ts
│   ├── types.ts
│   └── providers/
│
├── storage/
│   ├── favorites.ts
│   ├── history.ts
│   ├── playlists.ts
│   └── settings.ts
│
└── utils.ts

hooks/
├── useAudioPlayer.ts
├── useFavorites.ts
├── usePlaylists.ts
└── useRecentlyPlayed.ts

types/
└── music.ts
```

---

# 49. Development Order

## Step 1 — Project Setup

```text
Next.js
TypeScript
Tailwind CSS
ESLint
```

## Step 2 — Global Layout

Build:
- Sidebar
- Header
- Mobile navigation
- Main content area
- Global player container

## Step 3 — Music Provider

Implement the provider abstraction.

## Step 4 — Music API

Connect the selected legal music catalog.

## Step 5 — Homepage

Implement:
- Hero
- Trending
- Artists
- Albums
- Recently played

## Step 6 — Search

Implement:
- Search input
- Debouncing
- Search results
- Track results
- Artist results
- Album results

## Step 7 — Audio Player

Implement:
- Play
- Pause
- Previous
- Next
- Seek
- Volume
- Shuffle
- Repeat

## Step 8 — Queue

Implement:
- Add to queue
- Remove
- Reorder
- Clear queue

## Step 9 — Favorites

Implement local favorites.

## Step 10 — Recently Played

Implement local listening history.

## Step 11 — Playlists

Implement local playlists.

## Step 12 — Responsive UI

Optimize desktop, tablet, and mobile layouts.

## Step 13 — Performance

Optimize:
- Images
- API calls
- Caching
- Rendering
- Audio persistence

## Step 14 — SEO and Accessibility

Implement:
- Metadata
- Open Graph
- Keyboard navigation
- ARIA
- Focus states

## Step 15 — Production

Run:

```bash
npm run lint
npm run build
```

Fix all errors.

Deploy to Vercel.

---

# 50. Final User Flow

```text
User opens website
        ↓
Homepage
        ↓
Discover music
        ↓
Search song / artist
        ↓
Select song
        ↓
Audio starts
        ↓
Global player appears
        ↓
User continues browsing
        ↓
Music continues playing
        ↓
User favorites song
        ↓
Favorite saved locally
        ↓
User adds song to playlist
        ↓
Playlist saved locally
        ↓
User closes browser
        ↓
Returns later
        ↓
Local favorites/playlists/history remain
```

---

# 51. Core Product Principle

Phase 1 should follow this architecture:

```text
NO LOGIN
     +
NO MUSIC STORAGE
     +
NO CUSTOM MUSIC STREAMING SERVER
     +
LEGAL AUDIO SOURCE
     +
HTML5 AUDIO PLAYER
     +
LOCAL USER DATA
     +
NEXT.JS
     +
VERCEL
```

The application should be simple, fast, responsive, and production-quality.

The architecture must remain extensible so that Phase 2 can introduce authentication, a database, cloud synchronization, and personalized recommendations without rewriting the core audio player or music-provider layer.

---

# 52. Critical Antigravity Instructions

Build this as a **real functional MVP**, not merely a UI mockup.

Do not use fake audio URLs once the real provider is configured.

Do not download music files.

Do not scrape unauthorized audio streams.

Do not extract audio from YouTube.

Do not use YouTube-to-MP3 services.

Do not bypass DRM or platform restrictions.

Only play audio from a provider that explicitly permits the intended streaming use.

Keep the music-provider integration modular.

Prioritize:

1. Functional audio playback
2. Excellent UX
3. Mobile responsiveness
4. Clean architecture
5. Performance
6. Accessibility
7. Licensing compliance

Do NOT implement authentication in Phase 1.

Do NOT implement a database unless technically required.

Use `localStorage` or IndexedDB for:
- Favorites
- Recently played
- Playlists
- Settings

The user must be able to open the website and immediately start using it without creating an account.
