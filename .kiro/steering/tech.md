# Tech Stack

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4
- **Database**: SQLite via better-sqlite3
- **Validation**: express-validator
- **CORS**: cors middleware

## Frontend
- **Framework**: Svelte 4
- **Build Tool**: Vite 5
- **Routing**: svelte-spa-router (hash-based SPA routing)
- **State**: Svelte stores (writable, derived)
- **HTTP**: Native Fetch API

## Testing
- **E2E**: Playwright

## Common Commands

### Backend
```bash
npm install          # Install dependencies
npm start            # Start server (port 3000)
npm run dev          # Start with nodemon (auto-reload)
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server (port 5173)
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run Playwright tests
npm run test:ui      # Playwright UI mode
```

### Full Stack
```bash
./start-dev.sh       # Start both servers
./build-prod.sh      # Production build
```

## Development Setup

1. Backend runs on `http://localhost:3000`
2. Frontend dev server runs on `http://localhost:5173`
3. Vite proxies `/api` requests to backend (configured in `frontend/vite.config.js`)
4. Database file: `reinvent_sessions.db`
5. Recreate database: `python3 reinvent_database.py`

## Environment Variables

- `PORT`: Backend port (default: 3000)
- `NODE_ENV`: production/development
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)
- `DB_PATH`: SQLite database path

## Version Control

This is a GitHub repository. Use the GitHub CLI (`gh`) for git operations:

```bash
gh repo clone <repo>     # Clone repository
gh pr create             # Create pull request
gh pr list               # List open PRs
gh pr checkout <number>  # Check out a PR locally
gh pr merge              # Merge current PR
gh issue list            # List issues
gh issue create          # Create new issue
```
