#!/usr/bin/env node
/**
 * Database Reset Script
 * Resets the database to a known seed state for testing and development.
 * 
 * Usage:
 *   node db/reset.js           # Reset database
 *   npm run db:reset           # Via npm script
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './reinvent_sessions.db';
const SEED_DATA_PATH = path.join(__dirname, 'seed-data.json');
const SCHEMA_PATH = path.join(__dirname, '..', 'reinvent_schema.sql');

function resetDatabase() {
  console.log('🔄 Resetting database to seed state...\n');

  // Load seed data
  if (!fs.existsSync(SEED_DATA_PATH)) {
    console.error(`❌ Seed data file not found: ${SEED_DATA_PATH}`);
    process.exit(1);
  }
  const seedData = JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));

  // Remove existing database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log(`✓ Removed existing database: ${DB_PATH}`);
  }

  // Create new database
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

  // Initialize schema
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`❌ Schema file not found: ${SCHEMA_PATH}`);
    process.exit(1);
  }
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
  console.log('✓ Database schema initialized');

  // Insert speakers
  const insertSpeaker = db.prepare(`
    INSERT INTO speakers (name, title, company, bio)
    VALUES (@name, @title, @company, @bio)
  `);

  const speakerIdMap = {};
  for (const speaker of seedData.speakers) {
    const result = insertSpeaker.run(speaker);
    speakerIdMap[speaker.name] = result.lastInsertRowid;
  }
  console.log(`✓ Inserted ${seedData.speakers.length} speakers`);

  // Insert sessions
  const insertSession = db.prepare(`
    INSERT INTO sessions (
      session_id, title, description, session_type, track, level,
      duration_minutes, venue, room, date, start_time, end_time, capacity, tags
    ) VALUES (
      @session_id, @title, @description, @session_type, @track, @level,
      @duration_minutes, @venue, @room, @date, @start_time, @end_time, @capacity, @tags
    )
  `);

  const insertSessionSpeaker = db.prepare(`
    INSERT INTO session_speakers (session_id, speaker_id, speaker_order, is_primary)
    VALUES (@session_id, @speaker_id, @speaker_order, @is_primary)
  `);

  for (const session of seedData.sessions) {
    const { speaker_names, ...sessionData } = session;
    insertSession.run(sessionData);

    // Link speakers
    if (speaker_names && speaker_names.length > 0) {
      speaker_names.forEach((name, index) => {
        const speakerId = speakerIdMap[name];
        if (speakerId) {
          insertSessionSpeaker.run({
            session_id: session.session_id,
            speaker_id: speakerId,
            speaker_order: index + 1,
            is_primary: index === 0 ? 1 : 0
          });
        }
      });
    }
  }
  console.log(`✓ Inserted ${seedData.sessions.length} sessions`);
  console.log('✓ Linked speakers to sessions');

  // Close database
  db.close();

  console.log('\n✅ Database reset complete!');
  console.log(`📁 Database file: ${DB_PATH}`);
}

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase, DB_PATH };
