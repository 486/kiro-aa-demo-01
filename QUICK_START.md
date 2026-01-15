# AWS re:Invent Database - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Run the Database Initialization
```bash
python3 reinvent_database.py
```
This creates and populates the database with sample data.

### Step 2: Run Examples
```bash
python3 examples.py
```
See comprehensive usage examples and advanced queries.

### Step 3: Use in Your Code
```python
from reinvent_database import ReInventDatabase

with ReInventDatabase("reinvent_sessions.db") as db:
    # Get all AI/ML sessions
    sessions = db.get_sessions_by_track("AI/ML")
    for session in sessions:
        print(f"{session['title']} - {session['level']}")
```

## 📖 Common Operations

### Find Sessions
```python
# By track
ml_sessions = db.get_sessions_by_track("AI/ML")

# By date
dec2_sessions = db.get_sessions_by_date("2025-12-02")

# Search by keyword
results = db.search_sessions("serverless")
```

### Manage User Schedules
```python
# Get user's schedule
schedule = db.get_user_schedule("user@example.com")

# Add to schedule
db.add_to_schedule("user@example.com", "STG301", "Important!")

# View schedule details
for item in schedule:
    print(f"{item['date']} {item['start_time']}: {item['title']}")
```

### Get Statistics
```python
stats = db.get_statistics()
print(f"Total Sessions: {stats['total_sessions']}")
print(f"Total Speakers: {stats['total_speakers']}")
```

## 🗄️ Database Tables

- **sessions** - Conference sessions (15 fields)
- **speakers** - Speaker information (10 fields)
- **session_speakers** - Links speakers to sessions (many-to-many)
- **user_schedules** - User's personalized schedules (8 fields)

## 🔍 Useful SQL Queries

### Find Sessions by Type
```sql
SELECT * FROM sessions WHERE session_type = 'Workshop';
```

### Get Sessions with Speakers
```sql
SELECT * FROM v_sessions_with_speakers WHERE date = '2025-12-02';
```

### User Schedule Details
```sql
SELECT * FROM v_user_schedules_detailed WHERE user_id = 'user001@example.com';
```

### Sessions by Popularity
```sql
SELECT s.title, COUNT(us.schedule_id) as bookings
FROM sessions s
LEFT JOIN user_schedules us ON s.session_id = us.session_id
GROUP BY s.session_id
ORDER BY bookings DESC;
```

## 📊 Session Types

- **Keynote** (120 min) - Major announcements
- **Breakout Session** (60 min) - Technical deep dives
- **Workshop** (120 min) - Hands-on learning
- **Chalk Talk** (60 min) - Interactive whiteboarding
- **Builder Session** (60 min) - Build in an hour
- **Lightning Talk** (20 min) - Quick overviews

## 🎯 Experience Levels

- **100 - Foundational** - No prior knowledge
- **200 - Intermediate** - Some familiarity
- **300 - Advanced** - In-depth knowledge
- **400 - Expert** - Deep expertise

## 📁 Project Files

- `reinvent_schema.sql` - Database schema (DDL)
- `reinvent_database.py` - Python API
- `reinvent_sessions.db` - SQLite database
- `examples.py` - Usage examples
- `README.md` - Full documentation
- `DESIGN_DOCUMENTATION.md` - Research & design
- `SCHEMA_DIAGRAM.txt` - Visual schema

## 🔗 Next Steps

1. Read **README.md** for complete documentation
2. Review **DESIGN_DOCUMENTATION.md** for design rationale
3. Check **SCHEMA_DIAGRAM.txt** for visual database structure
4. Run **examples.py** to see advanced usage
5. Extend the schema for your specific needs

## 💡 Tips

- Use context managers (`with` statement) for automatic connection handling
- Always use parameterized queries to prevent SQL injection
- Check the views (`v_*`) for pre-built complex queries
- Foreign keys are enforced - deleting sessions cascades to schedules
- Indexes are optimized for track, date, level, and venue queries

## ⚠️ Important Notes

- Database uses SQLite3 (included with Python, no installation needed)
- Foreign key constraints are enabled by default
- Sample data includes 15 sessions, 12 speakers, 3 users
- All timestamps are in UTC
- Session IDs follow AWS format (e.g., 'STG301', 'AIM402')

## 🎓 Learning Resources

Explore the example queries in `examples.py` to learn:
- Basic querying and filtering
- User schedule management
- Advanced SQL joins and aggregations
- Data integrity and constraints
- Statistical reporting and analytics

---

**Need Help?** Check README.md for detailed documentation or DESIGN_DOCUMENTATION.md for design decisions.
