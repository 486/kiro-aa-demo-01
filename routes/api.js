const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// ============================================
// SESSION ROUTES
// ============================================

/**
 * @route   GET /api/sessions
 * @desc    Get all sessions with pagination
 * @query   page (number, default: 1), limit (number, default: 10)
 * @access  Public
 */
router.get('/sessions', apiController.getAllSessions);

/**
 * @route   GET /api/sessions/search
 * @desc    Search sessions with filters
 * @query   session_type, track, level, date, speaker, keywords, page, limit
 * @access  Public
 */
router.get('/sessions/search', apiController.searchSessions);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get single session with full details including speakers
 * @param   id - Session ID
 * @access  Public
 */
router.get('/sessions/:id', apiController.getSessionById);

// ============================================
// SPEAKER ROUTES
// ============================================

/**
 * @route   GET /api/speakers
 * @desc    Get all speakers with pagination
 * @query   page (number, default: 1), limit (number, default: 10)
 * @access  Public
 */
router.get('/speakers', apiController.getAllSpeakers);

/**
 * @route   GET /api/speakers/:id
 * @desc    Get speaker details with their sessions
 * @param   id - Speaker ID
 * @access  Public
 */
router.get('/speakers/:id', apiController.getSpeakerById);

// ============================================
// SCHEDULE ROUTES
// ============================================

/**
 * @route   POST /api/schedule
 * @desc    Add session to user's personal schedule
 * @body    { userId: string, sessionId: string, notes?: string }
 * @access  Public
 */
router.post('/schedule', apiController.addToSchedule);

/**
 * @route   GET /api/schedule/:userId
 * @desc    Get user's personal schedule
 * @param   userId - User ID
 * @access  Public
 */
router.get('/schedule/:userId', apiController.getUserSchedule);

/**
 * @route   DELETE /api/schedule/:scheduleId
 * @desc    Remove session from schedule
 * @param   scheduleId - Schedule entry ID
 * @body    { userId: string }
 * @access  Public
 */
router.delete('/schedule/:scheduleId', apiController.removeFromSchedule);

// ============================================
// UTILITY ROUTES
// ============================================

/**
 * @route   GET /api/metadata
 * @desc    Get metadata (session types, tracks, levels)
 * @access  Public
 */
router.get('/metadata', apiController.getMetadata);

module.exports = router;
