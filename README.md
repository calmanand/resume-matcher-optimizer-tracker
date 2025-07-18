# Resume Matcher Optimizer Tracker

A comprehensive resume analysis and matching system that helps HR professionals find the best candidates for job positions using AI-powered analysis.

## Features

### For Job Seekers
- Upload and analyze resumes
- Get detailed feedback and improvement suggestions
- Track analysis history
- View skill matching scores

### For HR Professionals
- Find the best matching resumes for job descriptions
- AI-powered candidate ranking
- Multiple scoring algorithms (Skill Match, TF-IDF, BERT)
- Detailed candidate profiles with matched skills

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for storing resumes and user data
- **spaCy** - NLP library for text processing
- **Sentence Transformers** - BERT-based similarity scoring
- **scikit-learn** - TF-IDF vectorization
- **PyMuPDF** - PDF text extraction

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications
- **Zustand** - State management
- **Tailwind CSS v-3"-for frontend appearance 

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Create environment file:**
   Create a `.env` file in the Backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/resume_db
   JWT_SECRET_KEY=your-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd resume-analyzer-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - HR Dashboard: [http://localhost:3000/hr-dashboard](http://localhost:3000/hr-dashboard)

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Resume Management
- `POST /resume/upload` - Upload resume
- `GET /getme/resumes` - Get user's resumes

### HR Dashboard
- `POST /hr/top-matches` - Get top matching resumes for job description

## Usage Guide

### For HR Professionals

1. **Access HR Dashboard:**
   - Navigate to `http://localhost:3000/hr-dashboard`

2. **Test Connection:**
   - Click "Test Backend Connection" to verify API connectivity

3. **Find Best Matches:**
   - Enter a detailed job description
   - Click "Find Best Matches"
   - View ranked candidates with detailed scores

4. **Analyze Results:**
   - Review overall scores (Excellent: 80%+, Good: 60%+, Fair: <60%)
   - Check individual scoring components (Skill Match, TF-IDF, BERT)
   - View matched skills for each candidate
   - Access original resumes via "View Resume" links

### For Job Seekers

1. **Register/Login:**
   - Create an account or login at `http://localhost:3000`

2. **Upload Resume:**
   - Navigate to the upload section
   - Upload your resume in PDF format

3. **View Analysis:**
   - Check detailed feedback and scores
   - Review skill matching results
   - Access improvement suggestions

## Scoring Algorithm

The system uses a hybrid scoring approach combining three algorithms:

1. **Skill Match Score (40%)** - Direct skill keyword matching
2. **TF-IDF Score (30%)** - Term frequency-inverse document frequency similarity
3. **BERT Score (30%)** - Semantic similarity using BERT embeddings

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running and accessible
- Check that all Python dependencies are installed
- Verify spaCy model is downloaded: `python -m spacy download en_core_web_sm`
- Confirm .env file is properly configured

### Frontend Issues
- Check if backend server is running on port 8000
- Verify CORS configuration in backend
- Check browser console for error messages
- Ensure all npm dependencies are installed

### Common Errors
- **"No resumes found"** - Upload some resumes first
- **"Backend connection failed"** - Check if server is running on port 8000
- **"Server error"** - Verify all dependencies are installed

## Development

### Project Structure
```
resume-matcher-optimizer-tracker/
├── Backend/
│   ├── main.py              # FastAPI app entry point
│   ├── hr_matches.py        # HR dashboard API
│   ├── calculation.py       # AI analysis algorithms
│   ├── database.py          # MongoDB configuration
│   ├── auth.py              # Authentication endpoints
│   ├── uploads.py           # Resume upload handling
│   └── requirements.txt     # Python dependencies
└── resume-analyzer-frontend/
    ├── src/
    │   ├── views/
    │   │   └── HRDashboard.jsx  # HR dashboard component
    │   ├── components/
    │   ├── store/
    │   └── lib/
    └── package.json         # Node.js dependencies
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
