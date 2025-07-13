# Backend Setup Guide

## Prerequisites
- Python 3.8+
- MongoDB (local or cloud)
- pip

## Installation Steps

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Create .env file:**
   Create a `.env` file in the Backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/resume_db
   JWT_SECRET_KEY=your-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### HR Dashboard API
- **POST** `/hr/top-matches` - Get top matching resumes for a job description
  - Body: Form data with `jd_text` field
  - Returns: Top 10 matching resumes with scores

### Authentication API
- **POST** `/auth/signup` - User registration
- **POST** `/auth/login` - User login
- **GET** `/auth/me` - Get current user

### Resume Upload API
- **POST** `/resume/upload` - Upload resume
- **GET** `/getme/resumes` - Get user's resumes

## Testing the HR Dashboard

1. Start the backend server
2. Navigate to `http://localhost:3000/hr-dashboard` in your frontend
3. Enter a job description and click "Find Best Matches"
4. The system will analyze all resumes in the database and return the best matches

## Troubleshooting

- Ensure MongoDB is running and accessible
- Check that all Python dependencies are installed
- Verify the spaCy model is downloaded
- Make sure the .env file is properly configured 