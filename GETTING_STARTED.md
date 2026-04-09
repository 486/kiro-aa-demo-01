# Getting Started Guide

This guide will walk you through setting up and running the AWS re:Invent Sessions full-stack application.

## What You'll Build

A complete conference session management system with:
- Browse and search conference sessions
- View detailed session information
- Create and manage your personal schedule
- Automatic conflict detection for overlapping sessions
- Responsive design for all devices

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (version 14.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A terminal/command prompt
- A code editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Step-by-Step Setup

### Step 1: Verify Prerequisites

Open your terminal and check Node.js and npm are installed:

```bash
node --version
# Should show v14.x.x or higher

npm --version
# Should show 6.x.x or higher
```

### Step 2: Navigate to Project Directory

```bash
cd /path/to/kiro-aa-demo-01
```

### Step 3: Install Backend Dependencies

```bash
# In the project root directory
npm install
```

This installs all backend dependencies including:
- Express.js (web framework)
- better-sqlite3 (database driver)
- cors (Cross-Origin Resource Sharing)
- express-validator (input validation)

### Step 4: Verify Database

The SQLite database file `reinvent_sessions.db` should already exist. If not:

```bash
python3 reinvent_database.py
```

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

This installs all frontend dependencies including:
- Svelte 4 (UI framework)
- Vite 5 (build tool)
- svelte-spa-router (routing)

### Step 6: Start the Backend Server

Open a terminal window and run:

```bash
npm start
```

You should see output like:
```
==================================================
🚀 AWS re:Invent Sessions API Server
==================================================
📡 Server running on port 3000
🌐 API URL: http://localhost:3000
💚 Health check: http://localhost:3000/health
📚 Documentation: http://localhost:3000
==================================================
```

**Keep this terminal window open!**

### Step 7: Start the Frontend Server

Open a **new** terminal window and run:

```bash
cd frontend
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Keep this terminal window open too!**

### Step 8: Open the Application

Open your web browser and navigate to:
```
http://localhost:5173
```

🎉 **Congratulations!** The application should now be running.

## Using the Application

### 1. First Visit - Sign In

When you first open the application:
1. Click the "Sign In" button in the top-right corner
2. Enter any email address (e.g., `john.doe@example.com`)
3. Your "user session" is now active

### 2. Browse Sessions

On the home page, you can:
- **View all sessions** in card or list view
- **Toggle view mode** using the button in the top-right
- **See session details** including title, type, track, level, time, and location
- **Navigate pages** using the pagination controls at the bottom

### 3. Search and Filter

Use the search panel to find specific sessions:
- **Keywords**: Search in titles, descriptions, and tags
- **Session Type**: Filter by Keynote, Workshop, Breakout Session, etc.
- **Track**: Filter by AI/ML, Security, Serverless, etc.
- **Level**: Filter by experience level (100-400)
- **Date**: Select a specific conference date
- **Speaker**: Search by speaker name

Click "Search" to apply filters or "Reset Filters" to clear them.

### 4. View Session Details

Click on any session card or "View Details" button to see:
- Complete session description
- Speaker information and bios
- Full schedule details
- Venue and room information
- Tags and categories

### 5. Add Sessions to Your Schedule

From any session card or detail page:
1. Click the **star icon (☆)** or "Add to My Schedule" button
2. Optionally add a personal note
3. The session is added to your schedule
4. The star turns solid (★) to indicate it's in your schedule

### 6. View Your Schedule

Click "My Schedule" in the navigation bar to:
- See all your selected sessions
- View sessions organized by date and time
- See summary statistics (total sessions, duration, conflicts)
- Review your personal notes
- **See conflict warnings** if sessions overlap

### 7. Manage Conflicts

If you have overlapping sessions:
- A **warning banner** appears at the top of your schedule
- Conflicting sessions are **highlighted** in yellow
- A **conflict badge** appears on affected sessions
- The summary shows the number of conflicts

To resolve conflicts:
1. Review the conflicting sessions
2. Remove one from your schedule
3. The conflict warning disappears

### 8. Remove Sessions

To remove a session from your schedule:
- Click the **solid star (★)** to toggle it off, OR
- Go to "My Schedule" and click the "Remove" button
- Confirm the removal

## Common Tasks

### View All Session Types

The application includes various session types:
- **Keynote**: Major presentations by AWS leaders
- **Breakout Session**: Technical deep-dives
- **Workshop**: Hands-on learning sessions
- **Chalk Talk**: Interactive discussions
- **Builder Session**: Small-group coding sessions
- **Lightning Talk**: Quick 15-20 minute presentations

### Search for Specific Topics

To find sessions about specific AWS services or topics:
1. Use the **Keywords** field
2. Enter terms like "Lambda", "S3", "Machine Learning", etc.
3. Click "Search"

### Find Sessions by Expert Level

Filter sessions by your experience level:
- **100 - Foundational**: New to AWS or the topic
- **200 - Intermediate**: Some experience with AWS
- **300 - Advanced**: Deep technical knowledge
- **400 - Expert**: Expert-level technical content

### Plan Your Conference Day

To plan a full day:
1. Filter by a specific **Date**
2. Browse available sessions
3. Add interesting sessions to your schedule
4. Switch to "My Schedule" to see your timeline
5. Check for conflicts
6. Adjust as needed

## Architecture Overview

### How It Works

The application consists of two parts:

**Frontend (Svelte)**
- Runs on `http://localhost:5173`
- User interface and interactions
- Communicates with backend via API calls
- Manages local state (filters, schedule, user info)

**Backend (Express.js)**
- Runs on `http://localhost:3000`
- REST API endpoints
- SQLite database with session data
- Handles all data operations

**Communication**
- Frontend makes HTTP requests to backend
- Vite dev server proxies `/api` requests to backend
- Data flows: Frontend → API → Database → API → Frontend

### Data Flow Example

When you add a session to your schedule:
1. **Frontend**: You click "Add to Schedule"
2. **API Request**: POST to `/api/schedule` with userId and sessionId
3. **Backend**: Validates data and saves to database
4. **Database**: Inserts record in `user_schedules` table
5. **API Response**: Returns success with schedule data
6. **Frontend**: Updates local state and shows toast notification
7. **UI Updates**: Star icon turns solid, session appears in schedule

## Troubleshooting

### Backend Won't Start

**Error: `Cannot find module 'express'`**
```bash
# Solution: Reinstall dependencies
npm install
```

**Error: `Address already in use (port 3000)`**
```bash
# Solution: Kill process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: `Cannot open database`**
```bash
# Solution: Create database
python3 reinvent_database.py
```

### Frontend Won't Start

**Error: `Cannot find module 'svelte'`**
```bash
# Solution: Reinstall frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: `Port 5173 already in use`**
```bash
# Solution: Vite will automatically try next available port
# Or specify a different port:
npm run dev -- --port 5174
```

### Frontend Can't Connect to Backend

**Symptoms**: Loading spinners forever, error toasts

**Solutions**:
1. Verify backend is running on port 3000
2. Check proxy configuration in `frontend/vite.config.js`
3. Check browser console for CORS errors
4. Verify backend CORS settings in `middleware/errorHandler.js`

### No Data Appears

**Solution 1**: Check database has data
```bash
sqlite3 reinvent_sessions.db "SELECT COUNT(*) FROM sessions;"
# Should return 15 or more
```

**Solution 2**: Recreate database
```bash
python3 reinvent_database.py
```

### Schedule Not Saving

**Issue**: Sessions don't stay in schedule after refresh

**Cause**: User ID not set or localStorage cleared

**Solution**:
1. Click "Sign In" again
2. Enter an email address
3. Add sessions again

## Next Steps

Now that you have the application running, you can:

1. **Explore the Code**
   - Frontend: `frontend/src/`
   - Backend: `controllers/`, `routes/`, `db/`
   - Database: `reinvent_sessions.db`

2. **Customize the Application**
   - Modify styles in `frontend/src/app.css`
   - Add new components in `frontend/src/components/`
   - Extend API in `controllers/apiController.js`

3. **Learn Svelte**
   - [Svelte Tutorial](https://svelte.dev/tutorial)
   - [Svelte Docs](https://svelte.dev/docs)

4. **Learn Express.js**
   - [Express.js Guide](https://expressjs.com/en/guide/routing.html)
   - API Documentation in `API_DOCUMENTATION.md`

5. **Deploy to Production**
   - See production deployment guide in main README
   - Consider hosting options (AWS, Vercel, Netlify)

## Tips for Development

### Hot Reload

Both servers support hot reload:
- **Frontend**: Changes automatically reload in browser
- **Backend**: With `npm run dev`, server restarts on file changes

### Debugging

**Frontend (Browser DevTools)**:
```javascript
// Add to any component
console.log('Debug info:', variable);
```

**Backend (Console)**:
```javascript
// In controller or route
console.log('Debug info:', request.body);
```

### API Testing

Test API directly with curl:
```bash
# Get sessions
curl http://localhost:3000/api/sessions

# Search sessions
curl "http://localhost:3000/api/sessions/search?track=AI/ML"

# Add to schedule
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{"userId":"test@example.com","sessionId":"AIM302"}'
```

Or use tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

## Keyboard Shortcuts

**Vite Dev Server**:
- `r` - Restart server
- `u` - Show server URL
- `o` - Open in browser
- `c` - Clear console
- `q` - Quit

## Additional Resources

- **Main README**: `README.md` - Project overview
- **API Documentation**: `API_DOCUMENTATION.md` - Complete API reference
- **Frontend README**: `frontend/README.md` - Frontend-specific details
- **Backend README**: `README_BACKEND.md` - Backend database details

## Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all dependencies are installed
6. Try restarting both servers

---

**Happy Coding! 🚀**
