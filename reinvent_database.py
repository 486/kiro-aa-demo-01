#!/usr/bin/env python3
"""
AWS re:Invent Conference Session Database Manager

This module provides functionality to:
- Create and initialize the SQLite database schema
- Seed the database with sample re:Invent session data
- Query and manage conference sessions, speakers, and user schedules
"""

import sqlite3
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class ReInventDatabase:
    """Manager class for AWS re:Invent conference session database."""
    
    def __init__(self, db_path: str = "reinvent_sessions.db"):
        """
        Initialize database connection.
        
        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        self.conn = None
        self.cursor = None
        
    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
        
    def connect(self):
        """Establish database connection."""
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # Enable column access by name
        self.cursor = self.conn.cursor()
        # Enable foreign key constraints
        self.cursor.execute("PRAGMA foreign_keys = ON")
        
    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.commit()
            self.conn.close()
            
    def initialize_schema(self, schema_file: str = "reinvent_schema.sql"):
        """
        Initialize database schema from SQL file.
        
        Args:
            schema_file: Path to SQL schema file
        """
        if not os.path.exists(schema_file):
            raise FileNotFoundError(f"Schema file not found: {schema_file}")
            
        with open(schema_file, 'r') as f:
            schema_sql = f.read()
            
        # Execute schema creation
        self.cursor.executescript(schema_sql)
        self.conn.commit()
        print(f"✓ Database schema initialized from {schema_file}")
        
    def seed_sample_data(self):
        """Seed database with sample AWS re:Invent session data."""
        print("\n🌱 Seeding database with sample data...")
        
        # Sample speakers
        speakers_data = [
            ("Werner Vogels", "VP & CTO", "Amazon Web Services", 
             "Werner Vogels is the CTO and VP of Amazon.com, where he is responsible for driving the company's customer-centric technology vision."),
            ("Swami Sivasubramanian", "VP of AI and Data", "Amazon Web Services",
             "Swami leads Amazon's AI and data services, including Amazon SageMaker, Amazon Bedrock, and all AWS database services."),
            ("Adam Selipsky", "CEO", "Amazon Web Services",
             "Adam Selipsky is CEO of Amazon Web Services. He rejoined AWS in 2021, having previously spent 11 years with the company."),
            ("Mai-Lan Tomsen Bukovec", "VP of Storage Services", "Amazon Web Services",
             "Mai-Lan leads Amazon S3, EBS, EFS, and all AWS storage services."),
            ("Deepak Singh", "VP of Compute Services", "Amazon Web Services",
             "Deepak leads Amazon EC2, Lambda, and core compute services at AWS."),
            ("Emily Fox", "Principal Solutions Architect", "Amazon Web Services",
             "Emily specializes in machine learning and AI solutions, helping customers build intelligent applications."),
            ("James Rodriguez", "Senior DevOps Engineer", "Netflix",
             "James leads the cloud infrastructure team at Netflix, managing their AWS deployment at scale."),
            ("Sarah Chen", "Head of Cloud Security", "Capital One",
             "Sarah oversees cloud security strategy and implementation at Capital One."),
            ("Michael Kim", "Principal Engineer", "Airbnb",
             "Michael architects data infrastructure and analytics platforms at Airbnb."),
            ("Lisa Patel", "Director of ML Engineering", "Lyft",
             "Lisa leads the machine learning platform team at Lyft."),
            ("David Johnson", "Cloud Architect", "GE Healthcare",
             "David designs cloud-native healthcare solutions using AWS services."),
            ("Jennifer Williams", "Staff Engineer", "Spotify",
             "Jennifer works on large-scale data processing and analytics at Spotify.")
        ]
        
        speaker_ids = []
        for speaker in speakers_data:
            self.cursor.execute("""
                INSERT INTO speakers (name, title, company, bio)
                VALUES (?, ?, ?, ?)
            """, speaker)
            speaker_ids.append(self.cursor.lastrowid)
        
        print(f"✓ Inserted {len(speakers_data)} speakers")
        
        # Sample sessions
        base_date = datetime(2025, 12, 1)  # re:Invent 2025 dates
        
        sessions_data = [
            # Keynotes
            ("KEY01", "Monday Night Live with Peter DeSantis", 
             "Join Peter DeSantis, SVP of Utility Computing, for an evening of deep dives into AWS infrastructure innovations.",
             "Keynote", "Architecture", "100 - Foundational", 120, "Venetian", "Grand Ballroom",
             base_date, "18:00", "20:00", 5000, "infrastructure,innovation,keynote"),
            
            ("KEY02", "Swami Sivasubramanian Keynote", 
             "Discover the latest AI and machine learning innovations from AWS, including new capabilities in Amazon Bedrock and SageMaker.",
             "Keynote", "AI/ML", "100 - Foundational", 120, "MGM Grand", "Garden Arena",
             base_date + timedelta(days=1), "08:30", "10:30", 5000, "AI,ML,innovation,keynote"),
            
            # Breakout Sessions
            ("STG301", "Deep Dive on Amazon S3", 
             "Learn advanced Amazon S3 features including Intelligent-Tiering, Object Lambda, and security best practices.",
             "Breakout Session", "Storage", "300 - Advanced", 60, "Venetian", "Titian 2203",
             base_date + timedelta(days=1), "13:00", "14:00", 500, "S3,storage,best-practices"),
            
            ("CMP301", "Optimizing Lambda for Performance and Cost", 
             "Discover techniques to optimize AWS Lambda functions for better performance, lower latency, and reduced costs.",
             "Breakout Session", "Serverless", "300 - Advanced", 60, "MGM Grand", "Level 2, Room 210",
             base_date + timedelta(days=1), "14:30", "15:30", 400, "Lambda,serverless,optimization"),
            
            ("SEC302", "Zero Trust Security on AWS", 
             "Implement zero trust security architecture using AWS services including IAM Identity Center, VPC, and CloudTrail.",
             "Breakout Session", "Security, Identity & Compliance", "300 - Advanced", 60, "Caesars Forum",
             "Summit 230", base_date + timedelta(days=2), "10:00", "11:00", 450, "security,zero-trust,IAM"),
            
            ("AIM301", "Building Production ML Systems with SageMaker", 
             "Build, train, and deploy production-grade machine learning models using Amazon SageMaker's complete ML workflow.",
             "Breakout Session", "AI/ML", "300 - Advanced", 60, "Wynn", "Latour Ballroom",
             base_date + timedelta(days=2), "15:00", "16:00", 600, "SageMaker,ML,production"),
            
            ("ANT301", "Real-Time Analytics with Amazon Kinesis", 
             "Process and analyze streaming data in real-time using Amazon Kinesis, Lambda, and analytics services.",
             "Breakout Session", "Analytics", "300 - Advanced", 60, "Venetian", "Murano 3304",
             base_date + timedelta(days=3), "11:00", "12:00", 350, "Kinesis,streaming,real-time"),
            
            # Workshops
            ("CMP401-W", "Containers from Code to Production", 
             "Hands-on workshop: Build, containerize, and deploy applications using ECS, EKS, and Fargate.",
             "Workshop", "Containers", "400 - Expert", 120, "MGM Grand", "Workshop Room A",
             base_date + timedelta(days=2), "13:00", "15:00", 100, "containers,ECS,EKS,hands-on"),
            
            ("DAT301-W", "Build a Data Lake on AWS", 
             "Workshop to architect and implement a secure, scalable data lake using S3, Glue, Athena, and Lake Formation.",
             "Workshop", "Databases", "300 - Advanced", 120, "Caesars Forum", "Workshop 4",
             base_date + timedelta(days=3), "09:00", "11:00", 80, "data-lake,analytics,hands-on"),
            
            # Chalk Talks
            ("ARC301-C", "Architecting for Resilience", 
             "Interactive discussion on designing highly available and fault-tolerant architectures using AWS services.",
             "Chalk Talk", "Architecture", "300 - Advanced", 60, "Venetian", "Casanova 502",
             base_date + timedelta(days=1), "16:00", "17:00", 50, "architecture,resilience,HA"),
            
            ("NET301-C", "Advanced VPC Design Patterns", 
             "Chalk talk on VPC architecture patterns, Transit Gateway, and multi-account networking strategies.",
             "Chalk Talk", "Networking & Content Delivery", "300 - Advanced", 60, "Wynn", "Primrose C",
             base_date + timedelta(days=3), "14:00", "15:00", 50, "VPC,networking,architecture"),
            
            # Builder Sessions
            ("DEV301-B", "Build a CI/CD Pipeline with CodePipeline", 
             "One-hour builder session to create an automated CI/CD pipeline using AWS CodePipeline and CodeBuild.",
             "Builder Session", "Developer Tools", "300 - Advanced", 60, "MGM Grand", "Builder Room 3",
             base_date + timedelta(days=2), "11:00", "12:00", 40, "CI-CD,DevOps,automation"),
            
            ("SVR201-B", "Build a Serverless API with API Gateway", 
             "Hands-on: Build a complete serverless REST API using API Gateway, Lambda, and DynamoDB.",
             "Builder Session", "Serverless", "200 - Intermediate", 60, "Venetian", "Builder Zone B",
             base_date + timedelta(days=3), "10:00", "11:00", 40, "API-Gateway,serverless,REST"),
            
            # Lightning Talks
            ("HYB201-L", "Edge Computing with AWS Outposts", 
             "Quick overview of hybrid cloud solutions using AWS Outposts for on-premises deployments.",
             "Lightning Talk", "Hybrid Cloud & Edge Computing", "200 - Intermediate", 20, "Caesars Forum",
             "Theater 1", base_date + timedelta(days=2), "12:30", "12:50", 150, "Outposts,hybrid,edge"),
            
            ("GRV201-L", "Graviton: Better Performance, Lower Cost", 
             "Learn how Graviton processors deliver better price-performance for your workloads.",
             "Lightning Talk", "Graviton", "200 - Intermediate", 20, "Venetian", "Theater 2",
             base_date + timedelta(days=3), "13:00", "13:20", 150, "Graviton,performance,cost"),
        ]
        
        for session in sessions_data:
            session_id, title, description, session_type, track, level, duration, venue, room, date, start, end, capacity, tags = session
            date_str = date.strftime("%Y-%m-%d")
            
            self.cursor.execute("""
                INSERT INTO sessions (
                    session_id, title, description, session_type, track, level,
                    duration_minutes, venue, room, date, start_time, end_time, capacity, tags
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (session_id, title, description, session_type, track, level,
                  duration, venue, room, date_str, start, end, capacity, tags))
        
        print(f"✓ Inserted {len(sessions_data)} sessions")
        
        # Link speakers to sessions
        session_speaker_mapping = [
            ("KEY01", [speaker_ids[4]], [1]),  # Deepak Singh
            ("KEY02", [speaker_ids[1]], [1]),  # Swami Sivasubramanian
            ("STG301", [speaker_ids[3]], [1]),  # Mai-Lan Tomsen Bukovec
            ("CMP301", [speaker_ids[4]], [1]),  # Deepak Singh
            ("SEC302", [speaker_ids[7]], [1]),  # Sarah Chen
            ("AIM301", [speaker_ids[5], speaker_ids[9]], [1, 0]),  # Emily Fox, Lisa Patel
            ("ANT301", [speaker_ids[8]], [1]),  # Michael Kim
            ("CMP401-W", [speaker_ids[6], speaker_ids[11]], [1, 0]),  # James Rodriguez, Jennifer Williams
            ("DAT301-W", [speaker_ids[8], speaker_ids[5]], [1, 0]),  # Michael Kim, Emily Fox
            ("ARC301-C", [speaker_ids[0]], [1]),  # Werner Vogels
            ("NET301-C", [speaker_ids[6]], [1]),  # James Rodriguez
            ("DEV301-B", [speaker_ids[11]], [1]),  # Jennifer Williams
            ("SVR201-B", [speaker_ids[5]], [1]),  # Emily Fox
            ("HYB201-L", [speaker_ids[10]], [1]),  # David Johnson
            ("GRV201-L", [speaker_ids[4]], [1]),  # Deepak Singh
        ]
        
        for session_id, speakers, is_primary in session_speaker_mapping:
            for idx, speaker_id in enumerate(speakers):
                self.cursor.execute("""
                    INSERT INTO session_speakers (session_id, speaker_id, speaker_order, is_primary)
                    VALUES (?, ?, ?, ?)
                """, (session_id, speaker_id, idx + 1, is_primary[idx]))
        
        print(f"✓ Linked speakers to sessions")
        
        # Sample user schedules
        user_schedules = [
            ("user001@example.com", "KEY02", "Excited for AI announcements!"),
            ("user001@example.com", "AIM301", "Must learn SageMaker best practices"),
            ("user001@example.com", "DAT301-W", "Workshop - bring laptop"),
            ("user002@example.com", "KEY01", ""),
            ("user002@example.com", "CMP301", "Lambda optimization tips"),
            ("user002@example.com", "SVR201-B", "Build demo API"),
            ("user003@example.com", "SEC302", "Zero trust implementation"),
            ("user003@example.com", "ARC301-C", "Ask about multi-region HA"),
            ("user003@example.com", "NET301-C", "VPC peering vs Transit Gateway"),
        ]
        
        for user_id, session_id, notes in user_schedules:
            self.cursor.execute("""
                INSERT INTO user_schedules (user_id, session_id, notes)
                VALUES (?, ?, ?)
            """, (user_id, session_id, notes))
        
        print(f"✓ Inserted {len(user_schedules)} user schedule entries")
        
        self.conn.commit()
        print("✅ Sample data seeding completed!\n")
        
    def get_sessions_by_track(self, track: str) -> List[sqlite3.Row]:
        """
        Get all sessions for a specific track.
        
        Args:
            track: Track name (e.g., 'AI/ML', 'Security, Identity & Compliance')
            
        Returns:
            List of session rows
        """
        self.cursor.execute("""
            SELECT * FROM sessions WHERE track = ? ORDER BY date, start_time
        """, (track,))
        return self.cursor.fetchall()
        
    def get_sessions_by_date(self, date: str) -> List[sqlite3.Row]:
        """
        Get all sessions for a specific date.
        
        Args:
            date: Date in YYYY-MM-DD format
            
        Returns:
            List of session rows
        """
        self.cursor.execute("""
            SELECT * FROM v_sessions_with_speakers WHERE date = ? ORDER BY start_time
        """, (date,))
        return self.cursor.fetchall()
        
    def get_user_schedule(self, user_id: str) -> List[sqlite3.Row]:
        """
        Get a user's complete schedule.
        
        Args:
            user_id: User identifier
            
        Returns:
            List of scheduled sessions with details
        """
        self.cursor.execute("""
            SELECT * FROM v_user_schedules_detailed WHERE user_id = ?
        """, (user_id,))
        return self.cursor.fetchall()
        
    def add_to_schedule(self, user_id: str, session_id: str, notes: str = "") -> bool:
        """
        Add a session to a user's schedule.
        
        Args:
            user_id: User identifier
            session_id: Session identifier
            notes: Optional notes
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.cursor.execute("""
                INSERT INTO user_schedules (user_id, session_id, notes)
                VALUES (?, ?, ?)
            """, (user_id, session_id, notes))
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False  # Already in schedule
            
    def search_sessions(self, keyword: str) -> List[sqlite3.Row]:
        """
        Search sessions by keyword in title, description, or tags.
        
        Args:
            keyword: Search keyword
            
        Returns:
            List of matching sessions
        """
        search_term = f"%{keyword}%"
        self.cursor.execute("""
            SELECT * FROM v_sessions_with_speakers 
            WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
            ORDER BY date, start_time
        """, (search_term, search_term, search_term))
        return self.cursor.fetchall()
        
    def get_speaker_sessions(self, speaker_id: int) -> List[sqlite3.Row]:
        """
        Get all sessions for a specific speaker.
        
        Args:
            speaker_id: Speaker identifier
            
        Returns:
            List of sessions
        """
        self.cursor.execute("""
            SELECT s.* FROM sessions s
            JOIN session_speakers ss ON s.session_id = ss.session_id
            WHERE ss.speaker_id = ?
            ORDER BY s.date, s.start_time
        """, (speaker_id,))
        return self.cursor.fetchall()
        
    def get_statistics(self) -> Dict[str, int]:
        """
        Get database statistics.
        
        Returns:
            Dictionary with counts
        """
        stats = {}
        
        self.cursor.execute("SELECT COUNT(*) FROM sessions")
        stats['total_sessions'] = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(*) FROM speakers")
        stats['total_speakers'] = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_schedules")
        stats['total_users'] = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(*) FROM user_schedules")
        stats['total_schedule_entries'] = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(DISTINCT track) FROM sessions")
        stats['total_tracks'] = self.cursor.fetchone()[0]
        
        return stats


def main():
    """Main function to demonstrate database functionality."""
    print("=" * 60)
    print("AWS re:Invent Conference Session Database")
    print("=" * 60)
    
    # Initialize database
    db_path = "reinvent_sessions.db"
    
    # Remove existing database for clean demo
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}\n")
    
    # Create and populate database
    with ReInventDatabase(db_path) as db:
        db.initialize_schema()
        db.seed_sample_data()
        
        # Display statistics
        stats = db.get_statistics()
        print("📊 Database Statistics:")
        print(f"   • Total Sessions: {stats['total_sessions']}")
        print(f"   • Total Speakers: {stats['total_speakers']}")
        print(f"   • Total Tracks: {stats['total_tracks']}")
        print(f"   • Total Users: {stats['total_users']}")
        print(f"   • Total Schedule Entries: {stats['total_schedule_entries']}")
        print()
        
        # Example queries
        print("🔍 Example Queries:\n")
        
        # 1. Sessions by track
        print("1. AI/ML Sessions:")
        ml_sessions = db.get_sessions_by_track("AI/ML")
        for session in ml_sessions:
            print(f"   • {session['session_id']}: {session['title']} ({session['level']})")
        print()
        
        # 2. User schedule
        print("2. Schedule for user001@example.com:")
        schedule = db.get_user_schedule("user001@example.com")
        for item in schedule:
            print(f"   • {item['date']} {item['start_time']}: {item['title']}")
            if item['notes']:
                print(f"     Notes: {item['notes']}")
        print()
        
        # 3. Search sessions
        print("3. Sessions about 'serverless':")
        serverless = db.search_sessions("serverless")
        for session in serverless:
            print(f"   • {session['session_id']}: {session['title']}")
        print()
        
        # 4. Sessions by date
        print("4. Sessions on 2025-12-02:")
        date_sessions = db.get_sessions_by_date("2025-12-02")
        for session in date_sessions[:5]:  # Show first 5
            print(f"   • {session['start_time']}-{session['end_time']}: {session['title']}")
        print()
        
    print("✅ Database created successfully!")
    print(f"📁 Database file: {db_path}")
    print("\nYou can now query the database using SQLite tools or the ReInventDatabase class.")


if __name__ == "__main__":
    main()
