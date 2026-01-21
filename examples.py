#!/usr/bin/env python3
"""
Example usage and advanced queries for the AWS re:Invent Conference Session Database.

This script demonstrates various ways to interact with the database
and provides examples of common use cases.
"""

from reinvent_database import ReInventDatabase
from datetime import datetime


def print_section(title):
    """Print a formatted section header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def demo_basic_queries():
    """Demonstrate basic database queries."""
    print_section("Basic Queries")
    
    with ReInventDatabase("reinvent_sessions.db") as db:
        # 1. Get all sessions for a specific track
        print("\n1. All Security Sessions:")
        sessions = db.get_sessions_by_track("Security, Identity & Compliance")
        for session in sessions:
            print(f"   {session['session_id']}: {session['title']}")
            print(f"   Level: {session['level']} | Duration: {session['duration_minutes']} min")
            print(f"   {session['date']} at {session['start_time']} | {session['venue']}")
            print()
        
        # 2. Search for sessions
        print("2. Search Results for 'AWS':")
        results = db.search_sessions("AWS")
        for session in results[:3]:  # Show first 3
            print(f"   • {session['session_id']}: {session['title']}")
        print(f"   ... and {len(results) - 3} more\n")
        
        # 3. Get sessions for a specific date
        print("3. Sessions on December 3, 2025:")
        date_sessions = db.get_sessions_by_date("2025-12-03")
        for session in date_sessions:
            print(f"   {session['start_time']}-{session['end_time']}: {session['title']}")
            print(f"   Type: {session['session_type']} | Track: {session['track']}")
            print()


def demo_user_schedules():
    """Demonstrate user schedule management."""
    print_section("User Schedule Management")
    
    with ReInventDatabase("reinvent_sessions.db") as db:
        # View existing schedule
        print("\n1. Current Schedule for user001@example.com:")
        schedule = db.get_user_schedule("user001@example.com")
        for item in schedule:
            print(f"   • {item['date']} {item['start_time']}: {item['title']}")
            if item['notes']:
                print(f"     📝 {item['notes']}")
        
        # Add new session to schedule
        print("\n2. Adding new session to schedule...")
        success = db.add_to_schedule(
            "user001@example.com", 
            "SEC302", 
            "Learn about zero trust security"
        )
        if success:
            print("   ✓ Session added successfully!")
        else:
            print("   ⚠ Session already in schedule")
        
        # Try adding duplicate (should fail gracefully)
        print("\n3. Attempting to add duplicate session...")
        success = db.add_to_schedule("user001@example.com", "KEY02", "")
        if not success:
            print("   ✓ Duplicate prevented - session already in schedule")


def demo_advanced_queries():
    """Demonstrate advanced SQL queries."""
    print_section("Advanced Queries")
    
    with ReInventDatabase("reinvent_sessions.db") as db:
        # Query 1: Sessions grouped by venue
        print("\n1. Sessions by Venue:")
        db.cursor.execute("""
            SELECT venue, COUNT(*) as session_count, 
                   GROUP_CONCAT(DISTINCT session_type) as types
            FROM sessions
            GROUP BY venue
            ORDER BY session_count DESC
        """)
        for row in db.cursor.fetchall():
            print(f"   • {row[0]}: {row[1]} sessions")
            print(f"     Types: {row[2]}")
        
        # Query 2: Sessions by level distribution
        print("\n2. Experience Level Distribution:")
        db.cursor.execute("""
            SELECT level, COUNT(*) as count, 
                   ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sessions), 1) as percentage
            FROM sessions
            GROUP BY level
            ORDER BY level
        """)
        for row in db.cursor.fetchall():
            print(f"   • {row[0]}: {row[1]} sessions ({row[2]}%)")
        
        # Query 3: Find scheduling conflicts for a user
        print("\n3. Time Slot Analysis for user001@example.com:")
        db.cursor.execute("""
            SELECT s1.session_id, s1.title, s1.start_time, s1.end_time,
                   COUNT(s2.session_id) as conflicts
            FROM user_schedules us1
            JOIN sessions s1 ON us1.session_id = s1.session_id
            LEFT JOIN user_schedules us2 ON us1.user_id = us2.user_id 
                AND us1.session_id != us2.session_id
            LEFT JOIN sessions s2 ON us2.session_id = s2.session_id
                AND s1.date = s2.date
                AND ((s1.start_time >= s2.start_time AND s1.start_time < s2.end_time)
                     OR (s1.end_time > s2.start_time AND s1.end_time <= s2.end_time))
            WHERE us1.user_id = 'user001@example.com'
            GROUP BY s1.session_id
            ORDER BY s1.date, s1.start_time
        """)
        for row in db.cursor.fetchall():
            conflict_status = "⚠ CONFLICT!" if row[4] > 0 else "✓ Clear"
            print(f"   {conflict_status} {row[0]}: {row[1]}")
            print(f"   Time: {row[2]}-{row[3]}")
        
        # Query 4: Most popular tracks
        print("\n4. Most Popular Tracks (by scheduled sessions):")
        db.cursor.execute("""
            SELECT s.track, COUNT(us.schedule_id) as bookings
            FROM sessions s
            LEFT JOIN user_schedules us ON s.session_id = us.session_id
            GROUP BY s.track
            HAVING bookings > 0
            ORDER BY bookings DESC
            LIMIT 5
        """)
        for row in db.cursor.fetchall():
            print(f"   • {row[0]}: {row[1]} bookings")
        
        # Query 5: Speaker workload
        print("\n5. Speaker Schedule (sessions per speaker):")
        db.cursor.execute("""
            SELECT sp.name, sp.company, 
                   GROUP_CONCAT(s.session_id || ': ' || s.title, ' | ') as sessions
            FROM speakers sp
            JOIN session_speakers ss ON sp.speaker_id = ss.speaker_id
            JOIN sessions s ON ss.session_id = s.session_id
            GROUP BY sp.speaker_id
            HAVING COUNT(s.session_id) >= 2
            ORDER BY COUNT(s.session_id) DESC
            LIMIT 3
        """)
        for row in db.cursor.fetchall():
            print(f"\n   {row[0]} ({row[1]}):")
            sessions = row[2].split(' | ')
            for session in sessions:
                print(f"   • {session}")


def demo_data_integrity():
    """Demonstrate data integrity features."""
    print_section("Data Integrity & Constraints")
    
    with ReInventDatabase("reinvent_sessions.db") as db:
        # Show foreign key relationships
        print("\n1. Foreign Key Enforcement:")
        print("   Attempting to add schedule for non-existent session...")
        try:
            db.cursor.execute("""
                INSERT INTO user_schedules (user_id, session_id)
                VALUES ('test@example.com', 'INVALID999')
            """)
            print("   ✗ Should have failed!")
        except Exception as e:
            print(f"   ✓ Foreign key constraint prevented invalid data: {type(e).__name__}")
        
        # Show unique constraints
        print("\n2. Unique Constraint Enforcement:")
        print("   Attempting to add duplicate speaker email...")
        try:
            db.cursor.execute("""
                INSERT INTO speakers (name, title, company, email)
                VALUES ('Test Speaker', 'Engineer', 'Test Co', NULL)
            """)
            db.cursor.execute("""
                INSERT INTO speakers (name, title, company, email)
                VALUES ('Another Speaker', 'Manager', 'Test Co', NULL)
            """)
            print("   ✓ NULL emails allowed (multiple)")
        except Exception as e:
            print(f"   Note: {e}")
        
        # Show check constraints
        print("\n3. Check Constraint Validation:")
        print("   Attempting to insert invalid session type...")
        try:
            db.cursor.execute("""
                INSERT INTO sessions (
                    session_id, title, session_type, track, level, 
                    duration_minutes, date, start_time, end_time
                ) VALUES (
                    'TEST001', 'Test Session', 'Invalid Type', 'Analytics',
                    '200 - Intermediate', 60, '2025-12-05', '10:00', '11:00'
                )
            """)
            print("   ✗ Should have failed!")
        except Exception as e:
            print(f"   ✓ Check constraint prevented invalid session type")
        
        # Rollback any test changes
        db.conn.rollback()


def demo_reporting():
    """Generate summary reports."""
    print_section("Conference Statistics & Reports")
    
    with ReInventDatabase("reinvent_sessions.db") as db:
        # Overall statistics
        stats = db.get_statistics()
        print("\n📊 Overall Conference Statistics:")
        print(f"   • Total Sessions: {stats['total_sessions']}")
        print(f"   • Total Speakers: {stats['total_speakers']}")
        print(f"   • Total Tracks: {stats['total_tracks']}")
        print(f"   • Registered Attendees: {stats['total_users']}")
        print(f"   • Total Bookings: {stats['total_schedule_entries']}")
        
        # Capacity analysis
        print("\n🏛️  Venue Capacity Analysis:")
        db.cursor.execute("""
            SELECT venue, 
                   COUNT(*) as sessions,
                   SUM(capacity) as total_capacity,
                   AVG(capacity) as avg_capacity
            FROM sessions
            GROUP BY venue
            ORDER BY total_capacity DESC
        """)
        for row in db.cursor.fetchall():
            print(f"   • {row[0]}:")
            print(f"     Sessions: {row[1]} | Total Capacity: {row[2]:,} | Avg: {int(row[3]):,}")
        
        # Daily schedule summary
        print("\n📅 Daily Schedule Summary:")
        db.cursor.execute("""
            SELECT date, 
                   COUNT(*) as sessions,
                   MIN(start_time) as first_session,
                   MAX(end_time) as last_session,
                   GROUP_CONCAT(DISTINCT session_type) as types
            FROM sessions
            GROUP BY date
            ORDER BY date
        """)
        for row in db.cursor.fetchall():
            date_obj = datetime.strptime(row[0], "%Y-%m-%d")
            formatted_date = date_obj.strftime("%A, %B %d, %Y")
            print(f"\n   {formatted_date}:")
            print(f"   • {row[1]} sessions from {row[2]} to {row[3]}")
            print(f"   • Types: {row[4]}")


def main():
    """Run all demonstrations."""
    print("\n" + "╔" + "═" * 68 + "╗")
    print("║" + " " * 10 + "AWS re:Invent Database - Usage Examples" + " " * 19 + "║")
    print("╚" + "═" * 68 + "╝")
    
    # Run all demos
    demo_basic_queries()
    demo_user_schedules()
    demo_advanced_queries()
    demo_data_integrity()
    demo_reporting()
    
    print("\n" + "=" * 70)
    print("  All demonstrations completed!")
    print("=" * 70)
    print("\n💡 Tip: Explore the ReInventDatabase class for more methods")
    print("   and check the README.md for additional query examples.\n")


if __name__ == "__main__":
    main()
