# API Documentation

## AWS re:Invent Conference Sessions REST API

A comprehensive Express.js REST API backend for managing AWS re:Invent conference sessions, speakers, and personalized attendee schedules.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Installation

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- SQLite database file (`reinvent_sessions.db`)

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env file as needed
```

3. **Ensure database exists:**
```bash
# The database should already exist from the Python setup
# If not, run:
python3 reinvent_database.py
```

---

## Quick Start

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "message": "AWS re:Invent Sessions API is running",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

## 1. Sessions Endpoints

### 1.1 Get All Sessions

```
GET /api/sessions
```

Retrieve all sessions with pagination support.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Items per page

**Example Request:**
```bash
curl http://localhost:3000/api/sessions?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "session_id": "KEY001",
        "title": "Monday Night Live with Peter DeSantis",
        "description": "Join AWS Senior Vice President...",
        "session_type": "Keynote",
        "track": "Architecture",
        "level": "200 - Intermediate",
        "duration_minutes": 120,
        "venue": "Venetian",
        "room": "Main Hall",
        "date": "2025-12-01",
        "start_time": "18:00",
        "end_time": "20:00",
        "capacity": 5000,
        "tags": "keynote,architecture,innovation",
        "created_at": "2024-01-15 12:00:00",
        "updated_at": "2024-01-15 12:00:00"
      }
    ],
    "total": 15,
    "page": 1,
    "totalPages": 2,
    "limit": 10
  }
}
```

---

### 1.2 Get Single Session

```
GET /api/sessions/:id
```

Retrieve a single session with full details including speakers.

**Parameters:**
- `id` (required) - Session ID

**Example Request:**
```bash
curl http://localhost:3000/api/sessions/KEY001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "KEY001",
    "title": "Monday Night Live with Peter DeSantis",
    "description": "Join AWS Senior Vice President...",
    "session_type": "Keynote",
    "track": "Architecture",
    "level": "200 - Intermediate",
    "duration_minutes": 120,
    "venue": "Venetian",
    "room": "Main Hall",
    "date": "2025-12-01",
    "start_time": "18:00",
    "end_time": "20:00",
    "capacity": 5000,
    "tags": "keynote,architecture,innovation",
    "speakers": [
      {
        "speaker_id": 1,
        "name": "Peter DeSantis",
        "title": "Senior Vice President",
        "company": "Amazon Web Services",
        "bio": "Peter DeSantis is Senior Vice President...",
        "email": "peter.desantis@aws.amazon.com",
        "linkedin_url": "https://linkedin.com/in/peterdesantis",
        "twitter_handle": "@pdesantis",
        "photo_url": "https://example.com/photos/pdesantis.jpg",
        "speaker_order": 1,
        "is_primary": 1
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "error": "Session not found"
}
```

---

### 1.3 Search Sessions

```
GET /api/sessions/search
```

Search sessions with multiple filters.

**Query Parameters:**
- `session_type` (optional) - Filter by session type (e.g., "Keynote", "Workshop")
- `track` (optional) - Filter by track (e.g., "AI/ML", "Security")
- `level` (optional) - Filter by level (e.g., "300 - Advanced")
- `date` (optional) - Filter by date (format: YYYY-MM-DD)
- `speaker` (optional) - Search by speaker name (partial match)
- `keywords` (optional) - Search in title, description, and tags (partial match)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Items per page

**Example Request:**
```bash
# Search for AI/ML sessions at 300 level
curl "http://localhost:3000/api/sessions/search?track=AI/ML&level=300%20-%20Advanced&page=1&limit=10"

# Search by keywords
curl "http://localhost:3000/api/sessions/search?keywords=serverless"

# Search by speaker
curl "http://localhost:3000/api/sessions/search?speaker=Werner"

# Multiple filters
curl "http://localhost:3000/api/sessions/search?session_type=Workshop&date=2025-12-03&keywords=machine%20learning"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "session_id": "AIM302",
        "title": "Advanced machine learning on AWS",
        "description": "Deep dive into advanced ML techniques...",
        "session_type": "Breakout Session",
        "track": "AI/ML",
        "level": "300 - Advanced",
        "duration_minutes": 60,
        "venue": "MGM Grand",
        "room": "Level 3, Room 305",
        "date": "2025-12-02",
        "start_time": "14:00",
        "end_time": "15:00",
        "capacity": 300,
        "tags": "machine-learning,sagemaker,deep-learning"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "limit": 10,
    "filters": {
      "track": "AI/ML",
      "level": "300 - Advanced"
    }
  }
}
```

---

## 2. Speakers Endpoints

### 2.1 Get All Speakers

```
GET /api/speakers
```

Retrieve all speakers with pagination support.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Items per page

**Example Request:**
```bash
curl http://localhost:3000/api/speakers?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "speakers": [
      {
        "speaker_id": 1,
        "name": "Peter DeSantis",
        "title": "Senior Vice President",
        "company": "Amazon Web Services",
        "email": "peter.desantis@aws.amazon.com",
        "linkedin_url": "https://linkedin.com/in/peterdesantis",
        "twitter_handle": "@pdesantis",
        "photo_url": "https://example.com/photos/pdesantis.jpg",
        "session_count": 2
      }
    ],
    "total": 12,
    "page": 1,
    "totalPages": 2,
    "limit": 10
  }
}
```

---

### 2.2 Get Speaker by ID

```
GET /api/speakers/:id
```

Retrieve speaker details with all their sessions.

**Parameters:**
- `id` (required) - Speaker ID (numeric)

**Example Request:**
```bash
curl http://localhost:3000/api/speakers/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "speaker_id": 1,
    "name": "Peter DeSantis",
    "title": "Senior Vice President",
    "company": "Amazon Web Services",
    "bio": "Peter DeSantis is Senior Vice President...",
    "email": "peter.desantis@aws.amazon.com",
    "linkedin_url": "https://linkedin.com/in/peterdesantis",
    "twitter_handle": "@pdesantis",
    "photo_url": "https://example.com/photos/pdesantis.jpg",
    "sessions": [
      {
        "session_id": "KEY001",
        "title": "Monday Night Live with Peter DeSantis",
        "session_type": "Keynote",
        "track": "Architecture",
        "level": "200 - Intermediate",
        "duration_minutes": 120,
        "venue": "Venetian",
        "room": "Main Hall",
        "date": "2025-12-01",
        "start_time": "18:00",
        "end_time": "20:00",
        "speaker_order": 1,
        "is_primary": 1
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "error": "Speaker not found"
}
```

---

## 3. Schedule Endpoints

### 3.1 Add Session to Schedule

```
POST /api/schedule
```

Add a session to a user's personal schedule.

**Request Body:**
```json
{
  "userId": "user001@example.com",
  "sessionId": "AIM302",
  "notes": "Must attend - priority session"
}
```

**Required Fields:**
- `userId` (string) - User identifier
- `sessionId` (string) - Session ID to add

**Optional Fields:**
- `notes` (string) - Personal notes about the session

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user001@example.com",
    "sessionId": "AIM302",
    "notes": "Must attend - priority session"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Session added to schedule",
  "data": {
    "schedule_id": 1,
    "user_id": "user001@example.com",
    "session_id": "AIM302",
    "added_timestamp": "2024-01-15 12:00:00",
    "notes": "Must attend - priority session",
    "title": "Advanced machine learning on AWS",
    "session_type": "Breakout Session",
    "date": "2025-12-02",
    "start_time": "14:00",
    "end_time": "15:00",
    "venue": "MGM Grand",
    "room": "Level 3, Room 305"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Session not found"
}
```

**Error Response (409):**
```json
{
  "error": "Session already in schedule"
}
```

**Error Response (400):**
```json
{
  "error": "userId and sessionId are required"
}
```

---

### 3.2 Get User Schedule

```
GET /api/schedule/:userId
```

Retrieve a user's complete personal schedule.

**Parameters:**
- `userId` (required) - User identifier

**Example Request:**
```bash
curl http://localhost:3000/api/schedule/user001@example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user001@example.com",
    "scheduleCount": 2,
    "schedule": [
      {
        "schedule_id": 1,
        "user_id": "user001@example.com",
        "added_timestamp": "2024-01-15 12:00:00",
        "notes": "Must attend - priority session",
        "attended": 0,
        "rating": null,
        "session_id": "AIM302",
        "title": "Advanced machine learning on AWS",
        "description": "Deep dive into advanced ML techniques...",
        "session_type": "Breakout Session",
        "track": "AI/ML",
        "level": "300 - Advanced",
        "duration_minutes": 60,
        "venue": "MGM Grand",
        "room": "Level 3, Room 305",
        "date": "2025-12-02",
        "start_time": "14:00",
        "end_time": "15:00",
        "capacity": 300
      }
    ]
  }
}
```

---

### 3.3 Remove Session from Schedule

```
DELETE /api/schedule/:scheduleId
```

Remove a session from a user's schedule.

**Parameters:**
- `scheduleId` (required) - Schedule entry ID (numeric)

**Request Body:**
```json
{
  "userId": "user001@example.com"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/schedule/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": "user001@example.com"}'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session removed from schedule"
}
```

**Error Response (404):**
```json
{
  "error": "Schedule entry not found or unauthorized"
}
```

**Error Response (400):**
```json
{
  "error": "scheduleId and userId are required"
}
```

---

## 4. Utility Endpoints

### 4.1 Get Metadata

```
GET /api/metadata
```

Retrieve available session types, tracks, and levels for filtering.

**Example Request:**
```bash
curl http://localhost:3000/api/metadata
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionTypes": [
      "Breakout Session",
      "Builder Session",
      "Chalk Talk",
      "Keynote",
      "Lightning Talk",
      "Workshop"
    ],
    "tracks": [
      "AI/ML",
      "Analytics",
      "Architecture",
      "Cloud Operations",
      "Compute",
      "Containers",
      "Databases",
      "Developer Tools",
      "DevOps",
      "Security, Identity & Compliance",
      "Serverless",
      "Storage"
    ],
    "levels": [
      "100 - Foundational",
      "200 - Intermediate",
      "300 - Advanced",
      "400 - Expert"
    ]
  }
}
```

---

## Error Handling

The API uses consistent error response formats:

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Error with Details

```json
{
  "success": false,
  "error": "Validation Error",
  "details": {
    "field": "description of error"
  }
}
```

### HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or parameters
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate entry)
- `500 Internal Server Error` - Server error

---

## Input Validation

### Pagination Parameters

- `page`: Must be >= 1
- `limit`: Must be between 1 and 100

### Date Format

- Must follow ISO format: `YYYY-MM-DD`
- Example: `2025-12-02`

### Required Fields

All required fields are validated and will return a 400 error if missing.

---

## CORS Configuration

CORS is enabled by default. Configure allowed origins in `.env` file:

```env
# Allow all origins (development)
ALLOWED_ORIGINS=*

# Allow specific origins (production)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

## Examples

### Complete Workflow Example

```bash
# 1. Get all sessions
curl http://localhost:3000/api/sessions?page=1&limit=5

# 2. Search for AI/ML workshops
curl "http://localhost:3000/api/sessions/search?track=AI/ML&session_type=Workshop"

# 3. Get details of a specific session
curl http://localhost:3000/api/sessions/AIM302

# 4. Get all speakers
curl http://localhost:3000/api/speakers

# 5. Get a specific speaker with their sessions
curl http://localhost:3000/api/speakers/1

# 6. Add session to user's schedule
curl -X POST http://localhost:3000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "john.doe@example.com",
    "sessionId": "AIM302",
    "notes": "Important for Q1 project"
  }'

# 7. View user's complete schedule
curl http://localhost:3000/api/schedule/john.doe@example.com

# 8. Remove session from schedule
curl -X DELETE http://localhost:3000/api/schedule/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": "john.doe@example.com"}'

# 9. Get metadata for filters
curl http://localhost:3000/api/metadata
```

---

## Architecture

### Project Structure

```
kiro-aa-demo-01/
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── controllers/
│   └── apiController.js      # Business logic for API endpoints
├── routes/
│   └── api.js                # API route definitions
├── db/
│   └── database.js           # Database access layer (SQLite)
├── middleware/
│   └── errorHandler.js       # Error handling & logging middleware
└── reinvent_sessions.db      # SQLite database file
```

### Design Patterns

- **MVC Pattern**: Separation of routes, controllers, and data access
- **Middleware Pattern**: Modular request processing
- **Repository Pattern**: Database abstraction layer
- **Error Handling**: Centralized error handling middleware

---

## Development

### Running Tests

```bash
npm test
```

### Development Mode with Auto-Reload

```bash
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=*
DB_PATH=./reinvent_sessions.db
```

---

## Production Deployment

### Best Practices

1. **Set environment to production:**
   ```env
   NODE_ENV=production
   ```

2. **Configure specific CORS origins:**
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

3. **Use a process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name reinvent-api
   ```

4. **Enable HTTPS with reverse proxy (nginx):**
   ```nginx
   server {
       listen 443 ssl;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Built with Express.js, SQLite, and ❤️**
