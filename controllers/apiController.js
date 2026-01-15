const DatabaseService = require('../db/database');
const db = new DatabaseService();

// ============================================
// SESSION CONTROLLERS
// ============================================

/**
 * Get all sessions with pagination
 */
exports.getAllSessions = (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.' 
      });
    }
    
    const result = db.getAllSessions(page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getAllSessions:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve sessions',
      message: error.message 
    });
  }
};

/**
 * Get single session with full details including speakers
 */
exports.getSessionById = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const session = db.getSessionById(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in getSessionById:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve session',
      message: error.message 
    });
  }
};

/**
 * Search sessions with filters
 */
exports.searchSessions = (req, res) => {
  try {
    const {
      session_type,
      track,
      level,
      date,
      speaker,
      keywords,
      page = 1,
      limit = 10
    } = req.query;
    
    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.' 
      });
    }
    
    // Validate date format if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ 
        error: 'Invalid date format. Use YYYY-MM-DD.' 
      });
    }
    
    const result = db.searchSessions({
      session_type,
      track,
      level,
      date,
      speaker,
      keywords,
      page: pageNum,
      limit: limitNum
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in searchSessions:', error);
    res.status(500).json({ 
      error: 'Failed to search sessions',
      message: error.message 
    });
  }
};

// ============================================
// SPEAKER CONTROLLERS
// ============================================

/**
 * Get all speakers with pagination
 */
exports.getAllSpeakers = (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.' 
      });
    }
    
    const result = db.getAllSpeakers(page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getAllSpeakers:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve speakers',
      message: error.message 
    });
  }
};

/**
 * Get speaker details with their sessions
 */
exports.getSpeakerById = (req, res) => {
  try {
    const { id } = req.params;
    const speakerId = parseInt(id);
    
    if (!speakerId || isNaN(speakerId)) {
      return res.status(400).json({ error: 'Valid speaker ID is required' });
    }
    
    const speaker = db.getSpeakerById(speakerId);
    
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    
    res.json({
      success: true,
      data: speaker
    });
  } catch (error) {
    console.error('Error in getSpeakerById:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve speaker',
      message: error.message 
    });
  }
};

// ============================================
// SCHEDULE CONTROLLERS
// ============================================

/**
 * Add session to user's personal schedule
 */
exports.addToSchedule = (req, res) => {
  try {
    const { userId, sessionId, notes } = req.body;
    
    // Validate required fields
    if (!userId || !sessionId) {
      return res.status(400).json({ 
        error: 'userId and sessionId are required' 
      });
    }
    
    // Validate types
    if (typeof userId !== 'string' || typeof sessionId !== 'string') {
      return res.status(400).json({ 
        error: 'userId and sessionId must be strings' 
      });
    }
    
    // Validate notes if provided
    if (notes !== undefined && notes !== null && typeof notes !== 'string') {
      return res.status(400).json({ 
        error: 'notes must be a string' 
      });
    }
    
    const scheduleEntry = db.addToSchedule(userId, sessionId, notes || null);
    
    res.status(201).json({
      success: true,
      message: 'Session added to schedule',
      data: scheduleEntry
    });
  } catch (error) {
    console.error('Error in addToSchedule:', error);
    
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message === 'Session already in schedule') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to add session to schedule',
      message: error.message 
    });
  }
};

/**
 * Get user's personal schedule
 */
exports.getUserSchedule = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const schedule = db.getUserSchedule(userId);
    
    res.json({
      success: true,
      data: {
        userId,
        scheduleCount: schedule.length,
        schedule
      }
    });
  } catch (error) {
    console.error('Error in getUserSchedule:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve user schedule',
      message: error.message 
    });
  }
};

/**
 * Remove session from schedule
 */
exports.removeFromSchedule = (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!scheduleId || !userId) {
      return res.status(400).json({ 
        error: 'scheduleId and userId are required' 
      });
    }
    
    const scheduleIdNum = parseInt(scheduleId);
    if (isNaN(scheduleIdNum)) {
      return res.status(400).json({ 
        error: 'scheduleId must be a valid number' 
      });
    }
    
    const success = db.removeFromSchedule(scheduleIdNum, userId);
    
    if (success) {
      res.json({
        success: true,
        message: 'Session removed from schedule'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to remove session from schedule' 
      });
    }
  } catch (error) {
    console.error('Error in removeFromSchedule:', error);
    
    if (error.message === 'Schedule entry not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to remove session from schedule',
      message: error.message 
    });
  }
};

// ============================================
// UTILITY CONTROLLERS
// ============================================

/**
 * Get metadata (session types, tracks, levels)
 */
exports.getMetadata = (req, res) => {
  try {
    const metadata = {
      sessionTypes: db.getSessionTypes(),
      tracks: db.getTracks(),
      levels: db.getLevels()
    };
    
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error in getMetadata:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve metadata',
      message: error.message 
    });
  }
};
