# Application Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SVELTE FRONTEND                           │   │
│  │                  (http://localhost:5173)                     │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │   Home.svelte │  │SessionDetail │  │Schedule.svelte│     │   │
│  │  │   (Catalog)   │  │   (Details)  │  │  (Personal)   │     │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │   │
│  │         │                  │                  │              │   │
│  │         └──────────────────┴──────────────────┘              │   │
│  │                           │                                   │   │
│  │                    ┌──────▼──────┐                          │   │
│  │                    │  Components │                          │   │
│  │                    │  - Navbar   │                          │   │
│  │                    │  - SessionCard                         │   │
│  │                    │  - SearchFilters                       │   │
│  │                    │  - Toast, Alert, Loading               │   │
│  │                    └──────┬──────┘                          │   │
│  │                           │                                   │   │
│  │                    ┌──────▼──────┐                          │   │
│  │                    │   Stores    │                          │   │
│  │                    │  - userId   │                          │   │
│  │                    │  - userSchedule                        │   │
│  │                    │  - metadata │                          │   │
│  │                    │  - searchFilters                       │   │
│  │                    │  - conflicts (derived)                 │   │
│  │                    └──────┬──────┘                          │   │
│  │                           │                                   │   │
│  │                    ┌──────▼──────┐                          │   │
│  │                    │  API Client │                          │   │
│  │                    │  (api.js)   │                          │   │
│  │                    └──────┬──────┘                          │   │
│  └───────────────────────────┼───────────────────────────────┘   │
│                               │                                     │
│                               │ HTTP Requests                       │
│                               │ (Proxied by Vite)                   │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                                │
        ┌───────────────────────▼───────────────────────┐
        │         VITE DEV SERVER (Development)         │
        │            Proxy: /api → :3000                │
        └───────────────────────┬───────────────────────┘
                                │
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                      EXPRESS.JS BACKEND                              │
│                    (http://localhost:3000)                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        server.js                             │   │
│  │                    (Express Application)                     │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │  Middleware  │  │    Routes    │  │ Controllers  │      │   │
│  │  │              │  │              │  │              │      │   │
│  │  │ - CORS       │──│ /api/sessions│──│ sessionCtrl  │      │   │
│  │  │ - Error      │  │ /api/speakers│  │ speakerCtrl  │      │   │
│  │  │ - Logging    │  │ /api/schedule│  │ scheduleCtrl │      │   │
│  │  │              │  │ /api/metadata│  │ metadataCtrl │      │   │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘      │   │
│  │                                               │              │   │
│  │                                        ┌──────▼───────┐     │   │
│  │                                        │   Database   │     │   │
│  │                                        │   Layer      │     │   │
│  │                                        │ (database.js)│     │   │
│  │                                        └──────┬───────┘     │   │
│  └───────────────────────────────────────────────┼─────────────┘   │
│                                                   │                  │
│                                            ┌──────▼───────┐         │
│                                            │    SQLite    │         │
│                                            │   Database   │         │
│                                            │              │         │
│                                            │ reinvent_    │         │
│                                            │ sessions.db  │         │
│                                            └──────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Browse Sessions Flow

```
User Action: Opens Home Page
     │
     ▼
┌─────────────────┐
│  Home.svelte    │
│  onMount()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ loadMetadata()  │──────► GET /api/metadata ──────► Database
│                 │◄────── Returns types, tracks, levels
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ loadSessions()  │──────► GET /api/sessions?page=1&limit=12
│                 │◄────── Returns paginated sessions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Results │
│ - SessionCard   │
│ - Pagination    │
└─────────────────┘
```

### 2. Add to Schedule Flow

```
User Action: Clicks "Add to Schedule"
     │
     ▼
┌─────────────────┐
│ SessionCard     │
│ toggleSchedule()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check userId    │───► No userId ──► Show toast "Sign in"
│                 │
│      Yes        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ scheduleAPI.add()│──────► POST /api/schedule
│ (userId,        │        { userId, sessionId, notes }
│  sessionId)     │◄────── Returns schedule entry
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Store    │
│ userSchedule    │
│ .add(session)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Show Toast      │
│ "Added to       │
│  schedule"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update UI       │
│ Star → Solid    │
└─────────────────┘
```

### 3. Conflict Detection Flow

```
User Schedule Loads
     │
     ▼
┌─────────────────┐
│ GET /api/       │
│ schedule/:userId│──────► Database Query
└────────┬────────┘◄────── Returns all user sessions
         │
         ▼
┌─────────────────┐
│ Store: Update   │
│ userSchedule    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Derived Store: scheduleConflicts    │
│                                     │
│ FOR each session pair:              │
│   IF same date:                     │
│     IF time overlaps:               │
│       ADD to conflicts[]            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Schedule.svelte │
│ Displays:       │
│ - Conflict count│
│ - Warning banner│
│ - Highlights    │
└─────────────────┘
```

### 4. Search and Filter Flow

```
User Action: Applies Filters
     │
     ▼
┌─────────────────┐
│ SearchFilters   │
│ handleSearch()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Store    │
│ searchFilters   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Home.svelte     │
│ loadSessions()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Build Query     │
│ /api/sessions/  │
│ search?track=   │
│ AI/ML&level=300 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend Filter  │
│ SQL WHERE       │
│ clauses         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Filtered │
│ Results         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Results │
│ with filters    │
│ applied         │
└─────────────────┘
```

## Component Hierarchy

```
App.svelte
├── Navbar.svelte
│   ├── Link: Home
│   ├── Link: My Schedule
│   └── User Actions (Sign In/Out)
│
├── Router
│   │
│   ├── Route: / (Home)
│   │   └── Home.svelte
│   │       ├── SearchFilters.svelte
│   │       └── SessionCard.svelte (multiple)
│   │
│   ├── Route: /session/:id
│   │   └── SessionDetail.svelte
│   │       └── Speaker Cards
│   │
│   └── Route: /schedule
│       └── Schedule.svelte
│           └── Timeline Items
│               └── SessionCard.svelte
│
└── Toast.svelte (Global notifications)
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Svelte Stores                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   userId     │  │userSchedule  │  │  metadata    │  │
│  │ (writable)   │  │ (writable)   │  │ (writable)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         │                  │                  │          │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐  │
│  │searchFilters │  │   toasts     │  │  conflicts   │  │
│  │ (writable)   │  │ (writable)   │  │  (derived)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
         │                  │                  │
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                      Components                          │
│  (Subscribe to stores, automatically update on change)   │
└─────────────────────────────────────────────────────────┘
```

## API Communication Architecture

```
Frontend                        Backend
┌─────────────┐                ┌─────────────┐
│  Component  │                │  Controller │
└──────┬──────┘                └──────▲──────┘
       │                              │
       │ Call API function            │
       ▼                              │
┌─────────────┐                       │
│  api.js     │                       │
│             │   HTTP Request        │
│ sessionsAPI ├──────────────────────►│
│ speakersAPI │                       │
│ scheduleAPI │   HTTP Response       │
│ metadataAPI │◄──────────────────────┤
└─────────────┘                       │
       │                              │
       │ Return data or throw error   │
       ▼                              │
┌─────────────┐                ┌─────▼──────┐
│  Component  │                │  Database  │
│  (update)   │                │   Layer    │
└─────────────┘                └─────┬──────┘
                                     │
                               ┌─────▼──────┐
                               │   SQLite   │
                               └────────────┘
```

## Database Schema

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   sessions   │         │ session_speakers │         │   speakers   │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ session_id PK├────────►│ session_id    FK ├────────►│ speaker_id PK│
│ title        │         │ speaker_id    FK │         │ name         │
│ description  │         │ speaker_order    │         │ title        │
│ session_type │         │ is_primary       │         │ company      │
│ track        │         └──────────────────┘         │ bio          │
│ level        │                                       │ email        │
│ date         │                                       │ linkedin_url │
│ start_time   │                                       │ twitter_     │
│ end_time     │                                       │  handle      │
│ venue        │                                       │ photo_url    │
│ room         │                                       └──────────────┘
│ capacity     │
│ tags         │
└──────┬───────┘
       │
       │
       ▼
┌──────────────────┐
│ user_schedules   │
├──────────────────┤
│ schedule_id   PK │
│ user_id          │
│ session_id    FK ├───────┐
│ added_timestamp  │       │
│ notes            │       │
│ attended         │       │
│ rating           │       │
└──────────────────┘       │
                           │
                           └─────────────┐
                                         │
                         (Many-to-Many relationship:
                          Users can have many sessions,
                          Sessions can have many users)
```

## Deployment Architecture

### Development
```
┌──────────────────────┐     ┌──────────────────────┐
│  Vite Dev Server     │     │  Express Server      │
│  localhost:5173      │────►│  localhost:3000      │
│  (Frontend)          │     │  (Backend + API)     │
│  - HMR enabled       │     │  - Nodemon restart   │
│  - Proxy /api        │     │  - Dev logging       │
└──────────────────────┘     └──────────┬───────────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │  SQLite Database     │
                             │  reinvent_sessions.db│
                             └──────────────────────┘
```

### Production (Option 1: Unified)
```
┌────────────────────────────────────────┐
│        Express Server                  │
│        localhost:3000 or :80/:443      │
│                                        │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Static      │  │  API Routes  │   │
│  │  Frontend    │  │  /api/*      │   │
│  │  /frontend/  │  │              │   │
│  │  dist/       │  │              │   │
│  └──────────────┘  └──────┬───────┘   │
└───────────────────────────┼────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  SQLite Database     │
                 │  reinvent_sessions.db│
                 └──────────────────────┘
```

### Production (Option 2: Separated)
```
┌──────────────────────┐     ┌──────────────────────┐
│  CDN / Static Host   │     │  API Server          │
│  (Vercel/Netlify)    │────►│  (AWS/Heroku/DO)     │
│  - Frontend dist/    │     │  - Express API       │
│  - Global CDN        │     │  - /api/*            │
│  - HTTPS             │     │  - CORS configured   │
└──────────────────────┘     └──────────┬───────────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │  SQLite Database     │
                             │  or Cloud DB         │
                             └──────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component structure
- ✅ Efficient state management
- ✅ RESTful API design
- ✅ Flexible deployment options
- ✅ Maintainable codebase
