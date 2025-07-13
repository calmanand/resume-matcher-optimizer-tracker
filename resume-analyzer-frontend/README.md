# Resume Analyzer Frontend

A React-based frontend for the Resume Analyzer application that allows users to upload resumes and HR professionals to find the best matching candidates.

## Features

- **User Authentication**: Sign up and login functionality
- **Resume Upload**: Upload and analyze resumes
- **HR Dashboard**: Find the best matching resumes for job descriptions
- **Results View**: View detailed analysis results
- **Previous Results**: Access historical analysis data

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - HR Dashboard: [http://localhost:3000/hr-dashboard](http://localhost:3000/hr-dashboard)

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8000`. Make sure:

1. The backend server is running on port 8000
2. CORS is properly configured in the backend
3. All required environment variables are set in the backend

## HR Dashboard Usage

1. Navigate to the HR Dashboard
2. Click "Test Backend Connection" to verify the API is working
3. Enter a job description in the text area
4. Click "Find Best Matches" to analyze resumes
5. View the top matching candidates with detailed scores

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Dependencies

- React 19.1.0
- React Router DOM 7.6.3
- Axios 1.10.0
- React Hot Toast 2.5.2
- Zustand 5.0.6

## Troubleshooting

- If the backend connection fails, ensure the backend server is running
- Check the browser console for any error messages
- Verify that the backend API endpoints are accessible
- Make sure all required dependencies are installed
