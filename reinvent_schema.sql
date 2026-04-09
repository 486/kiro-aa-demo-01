-- AWS re:Invent Conference Session Database Schema
-- SQLite Database for managing conference sessions, speakers, and attendee schedules

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,  -- Unique identifier (e.g., 'STG301', 'CMP202')
    title TEXT NOT NULL,
    description TEXT,
    session_type TEXT NOT NULL CHECK(session_type IN (
        'Keynote',
        'Breakout Session',
        'Workshop',
        'Chalk Talk',
        'Builder Session',
        'Lightning Talk',
        'Builders Session',
        'Code Talk',
        'Demo Theater',
        'Partner Session'
    )),
    track TEXT NOT NULL CHECK(track IN (
        'Analytics',
        'AI/ML',
        'Application Integration',
        'Architecture',
        'Blockchain',
        'Business Applications',
        'Cloud Financial Management',
        'Cloud Operations',
        'Compute',
        'Containers',
        'Customer Enablement',
        'Data Protection & Disaster Recovery',
        'Databases',
        'Developer Tools',
        'DevOps',
        'End User Computing',
        'Enterprise Strategy',
        'Front-End Web & Mobile',
        'Games',
        'Graviton',
        'High Performance Computing',
        'Hybrid Cloud & Edge Computing',
        'Industry',
        'Internet of Things',
        'Management & Governance',
        'Media & Entertainment',
        'Migration & Modernization',
        'Networking & Content Delivery',
        'Open Source',
        'Quantum Technologies',
        'Resilience',
        'Robotics',
        'Security, Identity & Compliance',
        'Serverless',
        'Storage',
        'Sustainability'
    )),
    level TEXT NOT NULL CHECK(level IN ('100 - Foundational', '200 - Intermediate', '300 - Advanced', '400 - Expert')),
    duration_minutes INTEGER NOT NULL,
    venue TEXT,  -- e.g., 'Venetian', 'MGM Grand', 'Wynn', 'Caesars Forum'
    room TEXT,   -- Specific room identifier
    date TEXT,   -- ISO format date: YYYY-MM-DD
    start_time TEXT,  -- Time in HH:MM format
    end_time TEXT,    -- Time in HH:MM format
    capacity INTEGER,
    tags TEXT,   -- Comma-separated tags for additional categorization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_sessions_track ON sessions(track);
CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_venue ON sessions(venue);

-- ============================================
-- SPEAKERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS speakers (
    speaker_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,  -- Job title
    company TEXT,
    bio TEXT,
    email TEXT UNIQUE,
    linkedin_url TEXT,
    twitter_handle TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for speaker lookup
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);
CREATE INDEX IF NOT EXISTS idx_speakers_company ON speakers(company);

-- ============================================
-- SESSION_SPEAKERS JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS session_speakers (
    session_id TEXT NOT NULL,
    speaker_id INTEGER NOT NULL,
    speaker_order INTEGER DEFAULT 1,  -- Order of speakers in multi-speaker sessions
    is_primary BOOLEAN DEFAULT 0,     -- Flag for primary/lead speaker
    PRIMARY KEY (session_id, speaker_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(speaker_id) ON DELETE CASCADE
);

-- Indexes for junction table queries
CREATE INDEX IF NOT EXISTS idx_session_speakers_session ON session_speakers(session_id);
CREATE INDEX IF NOT EXISTS idx_session_speakers_speaker ON session_speakers(speaker_id);

-- ============================================
-- USER_SCHEDULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_schedules (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,  -- User identifier (could be email, UUID, etc.)
    session_id TEXT NOT NULL,
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,  -- Personal notes about the session
    reminder_sent BOOLEAN DEFAULT 0,
    attended BOOLEAN DEFAULT 0,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),  -- 1-5 star rating
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    UNIQUE(user_id, session_id)  -- Prevent duplicate schedules
);

-- Indexes for user schedule queries
CREATE INDEX IF NOT EXISTS idx_user_schedules_user ON user_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_schedules_session ON user_schedules(session_id);
CREATE INDEX IF NOT EXISTS idx_user_schedules_timestamp ON user_schedules(added_timestamp);

-- ============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================
CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp 
AFTER UPDATE ON sessions
BEGIN
    UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = NEW.session_id;
END;

CREATE TRIGGER IF NOT EXISTS update_speakers_timestamp 
AFTER UPDATE ON speakers
BEGIN
    UPDATE speakers SET updated_at = CURRENT_TIMESTAMP WHERE speaker_id = NEW.speaker_id;
END;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Complete session information with speaker details
CREATE VIEW IF NOT EXISTS v_sessions_with_speakers AS
SELECT 
    s.session_id,
    s.title,
    s.description,
    s.session_type,
    s.track,
    s.level,
    s.duration_minutes,
    s.venue,
    s.room,
    s.date,
    s.start_time,
    s.end_time,
    s.capacity,
    s.tags,
    GROUP_CONCAT(sp.name || ' (' || sp.title || ', ' || sp.company || ')', '; ') as speakers
FROM sessions s
LEFT JOIN session_speakers ss ON s.session_id = ss.session_id
LEFT JOIN speakers sp ON ss.speaker_id = sp.speaker_id
GROUP BY s.session_id;

-- View: User schedule with session details
CREATE VIEW IF NOT EXISTS v_user_schedules_detailed AS
SELECT 
    us.schedule_id,
    us.user_id,
    us.added_timestamp,
    us.notes,
    us.attended,
    us.rating,
    s.session_id,
    s.title,
    s.session_type,
    s.track,
    s.level,
    s.date,
    s.start_time,
    s.end_time,
    s.venue,
    s.room
FROM user_schedules us
JOIN sessions s ON us.session_id = s.session_id
ORDER BY s.date, s.start_time;

-- View: Speaker session count
CREATE VIEW IF NOT EXISTS v_speaker_session_count AS
SELECT 
    sp.speaker_id,
    sp.name,
    sp.company,
    COUNT(ss.session_id) as session_count
FROM speakers sp
LEFT JOIN session_speakers ss ON sp.speaker_id = ss.speaker_id
GROUP BY sp.speaker_id;
