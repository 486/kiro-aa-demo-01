# AWS re:Invent Sessions - Frontend

A modern, responsive Svelte web application for browsing and managing AWS re:Invent conference sessions.

## Features

### Pages & Components
- **Home/Agenda Page**: Browse all sessions in card or list view with pagination
- **Session Detail View**: Complete session information including speakers, time, location, and description
- **Search & Filter Interface**: Advanced filtering by session type, track, level, date, speaker, and keywords
- **Personal Schedule View**: Manage your personalized schedule with conflict detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Functionality
- ✅ Browse complete session catalog
- ✅ Search and filter sessions with multiple criteria
- ✅ View detailed information for individual sessions
- ✅ Add/remove sessions to/from personal schedule
- ✅ View and manage personal schedule organized by date/time
- ✅ **Conflict detection** for overlapping sessions
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Toast notifications for user feedback
- ✅ Persistent user identification (localStorage)

## Technology Stack

- **Framework**: Svelte 4
- **Build Tool**: Vite 5
- **Router**: svelte-spa-router
- **State Management**: Svelte stores
- **API Communication**: Fetch API
- **Styling**: Custom CSS with AWS re:Invent branding

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Alert.svelte     # Alert messages
│   │   ├── Loading.svelte   # Loading spinner
│   │   ├── Navbar.svelte    # Navigation bar
│   │   ├── SearchFilters.svelte  # Search and filter interface
│   │   ├── SessionCard.svelte    # Session card/list item
│   │   └── Toast.svelte     # Toast notifications
│   ├── pages/              # Page components
│   │   ├── Home.svelte     # Home/agenda page
│   │   ├── Schedule.svelte # Personal schedule page
│   │   └── SessionDetail.svelte  # Session detail page
│   ├── stores/             # Svelte stores for state management
│   │   └── appStore.js     # Application state
│   ├── utils/              # Utility functions
│   │   └── api.js          # API communication layer
│   ├── App.svelte          # Root component
│   ├── app.css             # Global styles
│   └── main.js             # Application entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── svelte.config.js        # Svelte configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## API Integration

The frontend connects to the Express.js backend API running on `http://localhost:3000`. All API calls are proxied through Vite's development server.

### API Endpoints Used

- `GET /api/sessions` - Get all sessions with pagination
- `GET /api/sessions/:id` - Get session details
- `GET /api/sessions/search` - Search sessions with filters
- `POST /api/schedule` - Add session to schedule
- `GET /api/schedule/:userId` - Get user schedule
- `DELETE /api/schedule/:scheduleId` - Remove session from schedule
- `GET /api/metadata` - Get session types, tracks, and levels

## Features in Detail

### Search & Filter

The application provides comprehensive filtering capabilities:
- **Keyword search**: Search across titles, descriptions, and tags
- **Session type**: Filter by Keynote, Workshop, Breakout Session, etc.
- **Track**: Filter by AI/ML, Security, Serverless, etc.
- **Level**: Filter by experience level (100-400)
- **Date**: Filter sessions by specific date
- **Speaker**: Search by speaker name

### Personal Schedule

- Add sessions with optional personal notes
- View schedule organized by date and time
- Visual timeline view with time markers
- **Automatic conflict detection** for overlapping sessions
- Warning alerts for scheduling conflicts
- Summary statistics (total sessions, duration, conflicts)

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized navigation for mobile devices

### User Experience

- Loading spinners during data fetching
- Error messages with helpful context
- Success/error toast notifications
- Confirmation dialogs for destructive actions
- Smooth transitions and animations
- Accessible UI components

## State Management

The application uses Svelte stores for state management:

- **userId**: Stores the user identifier (persisted to localStorage)
- **userSchedule**: Manages the user's personal schedule
- **metadata**: Caches session types, tracks, and levels
- **searchFilters**: Maintains current search/filter state
- **scheduleConflicts**: Derived store that detects time conflicts
- **toasts**: Manages toast notifications

## Styling

Custom CSS with AWS re:Invent brand colors:
- Primary: `#ff9900` (AWS Orange)
- Secondary: `#232f3e` (AWS Squid Ink)
- Accent: `#0073bb` (AWS Blue)

Utility classes for rapid development:
- Layout: `.container`, `.grid`, `.flex`
- Components: `.btn`, `.card`, `.badge`, `.input`, `.select`
- Spacing: `.mt-*`, `.mb-*`, `.gap-*`
- Typography: `.text-*`, `.font-*`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Running with Backend

1. Start the backend server:
   ```bash
   cd ..
   npm start
   ```

2. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

### Environment Variables

The frontend uses Vite's proxy configuration to connect to the backend. No environment variables are required for development.

For production, ensure the API base URL is correctly configured in `src/utils/api.js`.

## Production Deployment

### Build

```bash
npm run build
```

This creates optimized production files in the `dist` directory.

### Serve

The built files can be served by any static file server. The backend Express.js server can also serve the frontend:

1. Build the frontend
2. Copy `dist/*` to the backend's `public` directory
3. Configure Express to serve static files

Or use a dedicated web server like Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Future Enhancements

Potential improvements for future versions:
- User authentication and authorization
- Session favorites/bookmarking
- Calendar export (iCal format)
- Social sharing features
- Real-time updates via WebSocket
- Offline support with Service Workers
- Advanced analytics and reporting
- Multi-language support

## Troubleshooting

### Backend Connection Issues

If the frontend can't connect to the backend:
1. Ensure the backend is running on port 3000
2. Check CORS configuration in the backend
3. Verify the proxy configuration in `vite.config.js`

### Build Errors

If you encounter build errors:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Ensure you're using a compatible Node.js version

## License

ISC

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Built with Svelte, Vite, and ❤️**
