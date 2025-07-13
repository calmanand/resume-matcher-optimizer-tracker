#!/usr/bin/env python3
"""
Test script to verify database connection and basic operations
"""

from database import client, collection, resume_collection
from bson import ObjectId

def test_database_connection():
    """Test if we can connect to MongoDB"""
    try:
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test collections
        user_count = collection.count_documents({})
        resume_count = resume_collection.count_documents({})
        
        print(f"📊 User collection: {user_count} documents")
        print(f"📄 Resume collection: {resume_count} documents")
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing database connection...")
    test_database_connection() 