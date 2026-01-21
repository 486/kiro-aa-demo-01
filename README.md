# AWS re:Invent Conference Sessions - Full Stack Application

A complete full-stack web application for browsing and managing AWS re:Invent conference sessions with an Express.js REST API backend and a modern Svelte frontend.

## 🚀 Features

### Frontend (Svelte)
- **Home/Agenda Page**: Browse all sessions in card or list view with pagination
- **Session Detail View**: Complete information including speakers, time, location, and description
- **Advanced Search & Filter**: Filter by type, track, level, date, speaker, and keywords
- **Personal Schedule Management**: Add/remove sessions with conflict detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Loading states, error handling, and toast notifications

### Backend (Express.js + SQLite)
- **RESTful API**: Well-structured endpoints for sessions, speakers, and schedules
- **SQLite Database**: Lightweight, file-based database with sample AWS re:Invent data
- **Advanced Filtering**: Search sessions by multiple criteria
- **User Schedules**: Create and manage personalized conference schedules
- **CORS Support**: Ready for cross-origin requests
- **Error Handling**: Comprehensive error handling and validation

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)

## ⚡ Quick Start

### Prerequisites
- Node.js 14.x or higher
- npm or yarn

### Run the Full Stack Application

1. **Clone and setup:**
   ```bash
   cd kiro-aa-demo-01
   
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Start backend server (Terminal 1):**
   ```bash
   npm start
   # Backend runs on http://localhost:3000
   ```

3. **Start frontend dev server (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
kiro-aa-demo-01/
├── frontend/                    # Svelte Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Alert.svelte
│   │   │   ├── Loading.svelte
│   │   │   ├── Navbar.svelte
│   │   │   ├── SearchFilters.svelte
│   │   │   ├── SessionCard.svelte
│   │   │   └── Toast.svelte
│   │   ├── pages/              # Page components
│   │   │   ├── Home.svelte     # Session catalog
│   │   │   ├── Schedule.svelte # User schedule
│   │   │   └── SessionDetail.svelte
│   │   ├── stores/             # State management
│   │   │   └── appStore.js
│   │   ├── utils/              # Utilities
│   │   │   └── api.js          # API client
│   │   ├── App.svelte          # Root component
│   │   ├── app.css             # Global styles
│   │   └── main.js             # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── svelte.config.js
│   ├── package.json
│   └── README.md
│
├── controllers/                # Backend Controllers
│   └── apiController.js        # Business logic
├── routes/                     # API Routes
│   └── api.js                  # Route definitions
├── db/                         # Database Layer
│   └── database.js             # Database access
├── middleware/                 # Express Middleware
│   └── errorHandler.js         # Error handling
├── server.js                   # Express server
├── package.json
├── reinvent_sessions.db        # SQLite database
├── reinvent_database.py        # Database setup script
└── README.md                   # This file
```

## 🔧 Installation

### Backend Setup

```bash
# Install dependencies
npm install

# Verify database exists (or create it)
# The database file reinvent_sessions.db should already exist
# If not, run:
python3 reinvent_database.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 💻 Development

### Backend Development

```bash
# Start with auto-reload (development)
npm run dev

# Start normally
npm start

# The API will be available at http://localhost:3000
```

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# The app will be available at http://localhost:5173
```

### Testing the API

```bash
# Test backend health
curl http://localhost:3000/health

# Get sessions
curl http://localhost:3000/api/sessions

# Search sessions
curl "http://localhost:3000/api/sessions/search?track=AI/ML"
```

## 🚢 Production Deployment

### Option 1: Separate Deployment

Deploy frontend and backend separately:

**Backend:**
```bash
# Set environment
export NODE_ENV=production
export PORT=3000

# Start with PM2
pm2 start server.js --name reinvent-api
```

**Frontend:**
```bash
cd frontend

# Build
npm run build

# Deploy dist/ folder to CDN or static hosting
# Configure API proxy to backend server
```

### Option 2: Unified Deployment

Serve frontend from Express.js:

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Set production environment
export NODE_ENV=production

# Start server (serves both API and frontend)
npm start

# Everything available at http://localhost:3000
```

The Express server will:
- Serve API endpoints at `/api/*`
- Serve static frontend files from `/frontend/dist`
- Handle SPA routing with fallback to `index.html`

### Environment Variables

**Backend (.env):**
```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
DB_PATH=./reinvent_sessions.db
```

**Frontend:**
No environment variables needed. API base URL configured in `src/utils/api.js`.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Key Endpoints

#### Sessions
- `GET /api/sessions` - Get all sessions (paginated)
- `GET /api/sessions/:id` - Get session details
- `GET /api/sessions/search` - Search with filters

#### Speakers
- `GET /api/speakers` - Get all speakers (paginated)
- `GET /api/speakers/:id` - Get speaker details

#### Schedule
- `POST /api/schedule` - Add session to schedule
- `GET /api/schedule/:userId` - Get user schedule
- `DELETE /api/schedule/:scheduleId` - Remove from schedule

#### Metadata
- `GET /api/metadata` - Get types, tracks, levels

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🛠️ Technologies Used

### Frontend
- **Svelte 4** - Modern reactive framework
- **Vite 5** - Fast build tool and dev server
- **svelte-spa-router** - Client-side routing
- **Fetch API** - HTTP requests
- **CSS3** - Custom styling with AWS branding

### Backend
- **Express.js 4** - Web framework
- **better-sqlite3** - SQLite database driver
- **express-validator** - Input validation
- **cors** - CORS middleware
- **Node.js** - JavaScript runtime

### Database
- **SQLite** - Lightweight embedded database
- Sample AWS re:Invent sessions data

## 🎨 Key Features Explained

### 1. Search & Filter
- Multi-criteria filtering (type, track, level, date, speaker, keywords)
- Real-time search with debouncing
- Maintains filter state across navigation
- URL query parameters support (future enhancement)

### 2. Personal Schedule
- Add/remove sessions with optional notes
- Organized by date and time
- Visual timeline interface
- **Automatic conflict detection** for overlapping sessions
- Summary statistics display

### 3. Conflict Detection
The application automatically detects scheduling conflicts:
- Compares session times on the same date
- Warns users about overlapping sessions
- Visual indicators for conflicting sessions
- Summary of all conflicts in schedule view

### 4. Responsive Design
- Mobile-first CSS approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly UI elements
- Adaptive layouts and navigation

### 5. State Management
Svelte stores for reactive state:
- `userId` - User identification (persisted)
- `userSchedule` - Personal schedule
- `metadata` - Session filters metadata
- `searchFilters` - Current search state
- `scheduleConflicts` - Derived conflict detection
- `toasts` - Notification system

## 📱 User Flow

1. **Browse Sessions**: View catalog with card/list toggle
2. **Filter & Search**: Apply multiple filters to find sessions
3. **View Details**: Click session for full information
4. **Add to Schedule**: Save interesting sessions
5. **Manage Schedule**: View timeline, detect conflicts, add notes
6. **Export** (future): Download as calendar file

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Browse sessions in card and list view
- [ ] Apply various filters and search
- [ ] View session details
- [ ] Add/remove sessions from schedule
- [ ] Check conflict detection
- [ ] Test responsive design (mobile/desktop)
- [ ] Verify error handling
- [ ] Check loading states

**Backend:**
- [ ] API endpoints return correct data
- [ ] Pagination works correctly
- [ ] Filters work as expected
- [ ] Schedule operations succeed
- [ ] Error handling returns proper status codes
- [ ] CORS headers present

### Test Script

```bash
# Run the provided test script
./test-api.sh
```

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection issues
1. Ensure backend is running on port 3000
2. Check proxy config in `frontend/vite.config.js`
3. Verify CORS settings in backend

### Database errors
```bash
# Recreate database
python3 reinvent_database.py
```

## 📈 Performance Considerations

- **Pagination**: Limits data transfer
- **Lazy Loading**: Future enhancement for images
- **Code Splitting**: Vite automatically splits code
- **Caching**: Metadata cached in store
- **Optimistic UI**: Immediate feedback before API response

## 🔐 Security Considerations

- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (Svelte auto-escapes)
- CORS configuration for allowed origins
- No sensitive data in localStorage
- (Future) Add authentication and authorization

## 🚀 Future Enhancements

- [ ] User authentication (OAuth/JWT)
- [ ] Real-time updates (WebSocket)
- [ ] Calendar export (iCal format)
- [ ] Email notifications
- [ ] Social sharing
- [ ] Session ratings and reviews
- [ ] Advanced analytics dashboard
- [ ] PWA with offline support
- [ ] Multi-language support

## 📄 License

ISC

## 👥 Contributing

This is a demonstration project. For production use, consider:
1. Adding comprehensive tests (Jest, Vitest, Playwright)
2. Implementing CI/CD pipeline
3. Adding monitoring and logging
4. Setting up staging environment
5. Implementing proper authentication

## 📞 Support

For questions or issues:
- Check the documentation in `/frontend/README.md` and API_DOCUMENTATION.md
- Review code comments
- Contact the development team

---

**Built with Express.js, Svelte, SQLite, and ❤️**
