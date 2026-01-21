# Product Overview

AWS re:Invent Conference Sessions is a full-stack web application for browsing and managing AWS re:Invent conference sessions.

## Core Features

- **Session Catalog**: Browse sessions with card/list views and pagination
- **Advanced Search**: Filter by type, track, level, date, speaker, and keywords
- **Personal Schedule**: Add/remove sessions with automatic conflict detection
- **Session Details**: View complete session info including speakers, time, location

## User Flow

1. Browse sessions on the home page
2. Apply filters to find relevant sessions
3. View session details
4. Add sessions to personal schedule
5. Manage schedule and resolve conflicts

## Data Model

- **Sessions**: Conference sessions with metadata (type, track, level, date, venue)
- **Speakers**: Presenter information linked to sessions
- **User Schedules**: Personal session bookmarks with notes and conflict tracking
