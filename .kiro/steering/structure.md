# Project Structure

```
├── server.js                 # Express app entry point
├── controllers/
│   └── apiController.js      # Request handlers (sessions, speakers, schedule)
├── routes/
│   └── api.js                # Route definitions (/api/*)
├── db/
│   └── database.js           # DatabaseService class (SQLite operations)
├── middleware/
│   └── errorHandler.js       # Error handling, logging, CORS config
├── frontend/                 # Svelte SPA
│   ├── src/
│   │   ├── App.svelte        # Root component with router
│   │   ├── main.js           # Entry point
│   │   ├── app.css           # Global styles
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.svelte
│   │   │   ├── SessionCard.svelte
│   │   │   ├── SearchFilters.svelte
│   │   │   ├── Toast.svelte
│   │   │   ├── Alert.svelte
│   │   │   └── Loading.svelte
│   │   ├── pages/            # Route page components
│   │   │   ├── Home.svelte
│   │   │   ├── SessionDetail.svelte
│   │   │   └── Schedule.svelte
│   │   ├── stores/
│   │   │   └── appStore.js   # Svelte stores (userId, schedule, filters)
│   │   └── utils/
│   │       └── api.js        # API client functions
│   ├── vite.config.js        # Vite config with API proxy
│   └── svelte.config.js
├── tests/
│   └── sessions.spec.ts      # Playwright E2E tests
├── reinvent_sessions.db      # SQLite database
├── reinvent_schema.sql       # Database schema
└── reinvent_database.py      # Database seed script
```

## Architecture Patterns

### Backend
- **MVC-style**: Routes → Controllers → Database service
- **Class-based DB**: `DatabaseService` encapsulates all SQLite operations
- **Centralized error handling**: Middleware catches and formats errors
- **RESTful API**: Standard CRUD operations at `/api/*`

### Frontend
- **Component hierarchy**: App → Pages → Components
- **Centralized state**: Svelte stores in `appStore.js`
- **API abstraction**: All HTTP calls through `api.js` utilities
- **Hash-based routing**: svelte-spa-router for SPA navigation

## API Endpoints

- `GET /api/sessions` - Paginated sessions
- `GET /api/sessions/:id` - Session with speakers
- `GET /api/sessions/search` - Filtered search
- `GET /api/speakers` - Paginated speakers
- `GET /api/speakers/:id` - Speaker with sessions
- `POST /api/schedule` - Add to schedule
- `GET /api/schedule/:userId` - User schedule
- `DELETE /api/schedule/:scheduleId` - Remove from schedule
- `GET /api/metadata` - Types, tracks, levels
