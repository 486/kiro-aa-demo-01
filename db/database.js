const Database = require('better-sqlite3');
const path = require('path');

class DatabaseService {
  constructor(dbPath = './reinvent_sessions.db') {
    this.db = new Database(dbPath, { verbose: console.log });
    this.db.pragma('foreign_keys = ON');
  }

  // ============================================
  // SESSIONS METHODS
  // ============================================

  /**
   * Get all sessions with pagination
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @returns {Object} - { sessions: [], total: number, page: number, totalPages: number }
   */
  getAllSessions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM sessions');
    const { total } = countStmt.get();
    
    // Get paginated sessions
    const stmt = this.db.prepare(`
      SELECT * FROM sessions
      ORDER BY date DESC, start_time ASC
      LIMIT ? OFFSET ?
    `);
    
    const sessions = stmt.all(limit, offset);
    
    return {
      sessions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit)
    };
  }

  /**
   * Get a single session with speakers
   * @param {string} sessionId - Session ID
   * @returns {Object|null} - Session object with speakers array
   */
  getSessionById(sessionId) {
    // Get session details
    const sessionStmt = this.db.prepare('SELECT * FROM sessions WHERE session_id = ?');
    const session = sessionStmt.get(sessionId);
    
    if (!session) {
      return null;
    }
    
    // Get speakers for this session
    const speakersStmt = this.db.prepare(`
      SELECT 
        sp.speaker_id,
        sp.name,
        sp.title,
        sp.company,
        sp.bio,
        sp.email,
        sp.linkedin_url,
        sp.twitter_handle,
        sp.photo_url,
        ss.speaker_order,
        ss.is_primary
      FROM speakers sp
      JOIN session_speakers ss ON sp.speaker_id = ss.speaker_id
      WHERE ss.session_id = ?
      ORDER BY ss.speaker_order, ss.is_primary DESC
    `);
    
    const speakers = speakersStmt.all(sessionId);
    
    return {
      ...session,
      speakers
    };
  }

  /**
   * Search sessions with filters
   * @param {Object} filters - { session_type, track, level, date, speaker, keywords, page, limit }
   * @returns {Object} - Paginated search results
   */
  searchSessions(filters = {}) {
    const {
      session_type,
      track,
      level,
      date,
      speaker,
      keywords,
      page = 1,
      limit = 10
    } = filters;
    
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    
    // Build WHERE conditions
    if (session_type) {
      conditions.push('s.session_type = ?');
      params.push(session_type);
    }
    
    if (track) {
      conditions.push('s.track = ?');
      params.push(track);
    }
    
    if (level) {
      conditions.push('s.level = ?');
      params.push(level);
    }
    
    if (date) {
      conditions.push('s.date = ?');
      params.push(date);
    }
    
    if (keywords) {
      conditions.push('(s.title LIKE ? OR s.description LIKE ? OR s.tags LIKE ?)');
      const keywordPattern = `%${keywords}%`;
      params.push(keywordPattern, keywordPattern, keywordPattern);
    }
    
    // Handle speaker filter - need to join with speakers table
    let fromClause = 'FROM sessions s';
    if (speaker) {
      fromClause += `
        JOIN session_speakers ss ON s.session_id = ss.session_id
        JOIN speakers sp ON ss.speaker_id = sp.speaker_id
      `;
      conditions.push('sp.name LIKE ?');
      params.push(`%${speaker}%`);
    }
    
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(DISTINCT s.session_id) as total ${fromClause} ${whereClause}`;
    const countStmt = this.db.prepare(countQuery);
    const { total } = countStmt.get(...params);
    
    // Get paginated results
    const query = `
      SELECT DISTINCT s.*
      ${fromClause}
      ${whereClause}
      ORDER BY s.date DESC, s.start_time ASC
      LIMIT ? OFFSET ?
    `;
    
    const stmt = this.db.prepare(query);
    const sessions = stmt.all(...params, limit, offset);
    
    return {
      sessions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit),
      filters: { session_type, track, level, date, speaker, keywords }
    };
  }

  // ============================================
  // SPEAKERS METHODS
  // ============================================

  /**
   * Get all speakers with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} - Paginated speakers list
   */
  getAllSpeakers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM speakers');
    const { total } = countStmt.get();
    
    // Get paginated speakers with session count
    const stmt = this.db.prepare(`
      SELECT 
        sp.speaker_id,
        sp.name,
        sp.title,
        sp.company,
        sp.email,
        sp.linkedin_url,
        sp.twitter_handle,
        sp.photo_url,
        COUNT(ss.session_id) as session_count
      FROM speakers sp
      LEFT JOIN session_speakers ss ON sp.speaker_id = ss.speaker_id
      GROUP BY sp.speaker_id
      ORDER BY sp.name
      LIMIT ? OFFSET ?
    `);
    
    const speakers = stmt.all(limit, offset);
    
    return {
      speakers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit)
    };
  }

  /**
   * Get speaker details with their sessions
   * @param {number} speakerId - Speaker ID
   * @returns {Object|null} - Speaker object with sessions array
   */
  getSpeakerById(speakerId) {
    // Get speaker details
    const speakerStmt = this.db.prepare('SELECT * FROM speakers WHERE speaker_id = ?');
    const speaker = speakerStmt.get(speakerId);
    
    if (!speaker) {
      return null;
    }
    
    // Get sessions for this speaker
    const sessionsStmt = this.db.prepare(`
      SELECT 
        s.session_id,
        s.title,
        s.session_type,
        s.track,
        s.level,
        s.duration_minutes,
        s.venue,
        s.room,
        s.date,
        s.start_time,
        s.end_time,
        ss.speaker_order,
        ss.is_primary
      FROM sessions s
      JOIN session_speakers ss ON s.session_id = ss.session_id
      WHERE ss.speaker_id = ?
      ORDER BY s.date, s.start_time
    `);
    
    const sessions = sessionsStmt.all(speakerId);
    
    return {
      ...speaker,
      sessions
    };
  }

  // ============================================
  // USER SCHEDULE METHODS
  // ============================================

  /**
   * Add session to user's schedule
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID
   * @param {string} notes - Optional notes
   * @returns {Object} - Created schedule entry
   */
  addToSchedule(userId, sessionId, notes = null) {
    // Check if session exists
    const sessionStmt = this.db.prepare('SELECT session_id FROM sessions WHERE session_id = ?');
    const session = sessionStmt.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Check if already in schedule
    const existingStmt = this.db.prepare(`
      SELECT schedule_id FROM user_schedules 
      WHERE user_id = ? AND session_id = ?
    `);
    const existing = existingStmt.get(userId, sessionId);
    
    if (existing) {
      throw new Error('Session already in schedule');
    }
    
    // Insert into schedule
    const insertStmt = this.db.prepare(`
      INSERT INTO user_schedules (user_id, session_id, notes)
      VALUES (?, ?, ?)
    `);
    
    const result = insertStmt.run(userId, sessionId, notes);
    
    // Return the created entry
    const getStmt = this.db.prepare(`
      SELECT 
        us.schedule_id,
        us.user_id,
        us.session_id,
        us.added_timestamp,
        us.notes,
        s.title,
        s.session_type,
        s.date,
        s.start_time,
        s.end_time,
        s.venue,
        s.room
      FROM user_schedules us
      JOIN sessions s ON us.session_id = s.session_id
      WHERE us.schedule_id = ?
    `);
    
    return getStmt.get(result.lastInsertRowid);
  }

  /**
   * Get user's personal schedule
   * @param {string} userId - User ID
   * @returns {Array} - Array of scheduled sessions
   */
  getUserSchedule(userId) {
    const stmt = this.db.prepare(`
      SELECT 
        us.schedule_id,
        us.user_id,
        us.added_timestamp,
        us.notes,
        us.attended,
        us.rating,
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
        s.capacity
      FROM user_schedules us
      JOIN sessions s ON us.session_id = s.session_id
      WHERE us.user_id = ?
      ORDER BY s.date, s.start_time
    `);
    
    return stmt.all(userId);
  }

  /**
   * Remove session from schedule
   * @param {number} scheduleId - Schedule entry ID
   * @param {string} userId - User ID (for authorization)
   * @returns {boolean} - Success status
   */
  removeFromSchedule(scheduleId, userId) {
    // Check if schedule entry exists and belongs to user
    const checkStmt = this.db.prepare(`
      SELECT schedule_id FROM user_schedules 
      WHERE schedule_id = ? AND user_id = ?
    `);
    const entry = checkStmt.get(scheduleId, userId);
    
    if (!entry) {
      throw new Error('Schedule entry not found or unauthorized');
    }
    
    // Delete the entry
    const deleteStmt = this.db.prepare('DELETE FROM user_schedules WHERE schedule_id = ?');
    const result = deleteStmt.run(scheduleId);
    
    return result.changes > 0;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get unique session types
   * @returns {Array} - Array of session types
   */
  getSessionTypes() {
    const stmt = this.db.prepare('SELECT DISTINCT session_type FROM sessions ORDER BY session_type');
    return stmt.all().map(row => row.session_type);
  }

  /**
   * Get unique tracks
   * @returns {Array} - Array of tracks
   */
  getTracks() {
    const stmt = this.db.prepare('SELECT DISTINCT track FROM sessions ORDER BY track');
    return stmt.all().map(row => row.track);
  }

  /**
   * Get unique levels
   * @returns {Array} - Array of levels
   */
  getLevels() {
    const stmt = this.db.prepare('SELECT DISTINCT level FROM sessions ORDER BY level');
    return stmt.all().map(row => row.level);
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}

module.exports = DatabaseService;
