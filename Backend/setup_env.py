#!/usr/bin/env python3
"""
Setup script for Resume Analyzer Backend
This script helps you create the necessary environment configuration.
"""

import os
import secrets

def create_env_file():
    """Create a .env file with default values"""
    
    # Generate a secure secret key
    secret_key = secrets.token_urlsafe(32)
    
    env_content = f"""# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/resume_db

# JWT Configuration
JWT_SECRET={secret_key}
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudinary Configuration (optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
HOST=0.0.0.0
PORT=8000
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file with secure JWT secret")
    print("📝 Please update the MongoDB URI and Cloudinary settings as needed")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import spacy
        try:
            spacy.load("en_core_web_sm")
            print("✅ spaCy model is installed")
        except OSError:
            print("⚠️ spaCy model not found. Please run: python -m spacy download en_core_web_sm")
    except ImportError:
        print("❌ spaCy not installed. Please run: pip install spacy")
    
    try:
        import sklearn
        print("✅ scikit-learn is installed")
    except ImportError:
        print("❌ scikit-learn not installed. Please run: pip install scikit-learn")
    
    try:
        import fitz
        print("✅ PyMuPDF is installed")
    except ImportError:
        print("❌ PyMuPDF not installed. Please run: pip install PyMuPDF")

if __name__ == "__main__":
    print("🚀 Resume Analyzer Backend Setup")
    print("=" * 40)
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("⚠️ .env file already exists. Skipping creation.")
    else:
        create_env_file()
    
    print("\n🔍 Checking dependencies...")
    check_dependencies()
    
    print("\n✅ Setup complete!")
    print("📋 Next steps:")
    print("1. Update .env file with your MongoDB URI")
    print("2. Install spaCy model: python -m spacy download en_core_web_sm")
    print("3. Start the server: uvicorn main:app --reload") 