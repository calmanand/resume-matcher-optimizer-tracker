import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const HRDashboard = () => {
  const [jobDescription, setJobDescription] = useState(`We are seeking a highly skilled Full Stack Developer with strong knowledge of React.js, Node.js, MongoDB, and Express. The ideal candidate should have experience with RESTful APIs, Git, cloud services (AWS preferred), and possess strong problem-solving and communication skills. Familiarity with CI/CD and Docker is a plus.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topResumes, setTopResumes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const loadingMessages = [
    "Please wait while we analyze your job description...",
    "We are finding the best matches for you...",
    "Just a moment, fetching top candidates...",
    "Shortlisting the most relevant resumes...",
    "Almost there! Finalizing the best picks..."
  ];

  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 5000);
    } else {
      setLoadingMsgIndex(0);
    }

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const testConnection = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/');
      toast.success('Backend connection successful!');
    } catch (err) {
      toast.error('Backend connection failed. Please ensure the server is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('jd_text', jobDescription);

      const response = await axiosInstance.post('/hr/top-matches', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTopResumes(response.data.topResumes);
      setShowResults(true);
      toast.success(`Found ${response.data.count} matching resumes!`);
    } catch (err) {
      console.error('Error fetching top matches:', err);
      if (err.response?.status === 404) {
        toast.error('No resumes found in database. Please upload some resumes first.');
      } else if (err.response?.status === 500) {
        toast.error('Server error. Please check if all dependencies are installed.');
      } else {
        toast.error(err.response?.data?.detail || 'Failed to get matching resumes');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HR Dashboard</h1>
      <p style={styles.subtitle}>Enter a job description to find the best matching resumes from our database.</p>
      <p style={styles.note}>We provide the best CANDIDATES as per your requirement.</p>

      <div style={styles.testContainer}>
        <button
          onClick={testConnection}
          disabled={isLoading}
          style={{
            ...styles.testButton,
            backgroundColor: isLoading ? '#ccc' : '#2196f3',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>
      </div>

      <textarea
        placeholder="Paste your job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={10}
        style={styles.textarea}
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          ...styles.button,
          backgroundColor: isSubmitting ? '#a5d6a7' : '#4caf50',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Analyzing...' : 'Find Best Matches'}
      </button>

      {isSubmitting && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <img
            src="https://i.gifer.com/ZZ5H.gif"
            alt="Loading..."
            style={{ width: '48px', marginBottom: '8px' }}
          />
          <p style={{ color: '#555', fontStyle: 'italic', transition: 'opacity 0.3s ease' }}>
            {loadingMessages[loadingMsgIndex]}
          </p>
        </div>
      )}

      {showResults && topResumes.length > 0 && (
        <div style={styles.resultsContainer}>
          <h2 style={styles.resultsTitle}>Top Matching Resumes</h2>
          <p style={styles.resultsSubtitle}>
            Found {topResumes.length} matching resumes for your job description
          </p>

          <div style={styles.resumesList}>
            {topResumes.map((resume, index) => (
              <div key={resume.resumeId} style={styles.resumeCard}>
                <div style={styles.resumeHeader}>
                  <h3 style={styles.resumeTitle}>
                    Candidate #{index + 1} - {resume.email}
                  </h3>
                  <div style={styles.scoreContainer}>
                    <span style={styles.scoreLabel}>Overall Score:</span>
                    <span style={{
                      ...styles.score,
                      color: getScoreColor(resume.scores.hybridScore)
                    }}>
                      {resume.scores.hybridScore.toFixed(1)}%
                    </span>
                    <span style={{
                      ...styles.scoreLabel,
                      color: getScoreColor(resume.scores.hybridScore)
                    }}>
                      ({getScoreLabel(resume.scores.hybridScore)})
                    </span>
                  </div>
                </div>

                <div style={styles.scoresGrid}>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreName}>Skill Match:</span>
                    <span style={styles.scoreValue}>
                      {resume.scores.skillScore.toFixed(1)}%
                    </span>
                  </div>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreName}>TF-IDF Score:</span>
                    <span style={styles.scoreValue}>
                      {resume.scores.tfidfScore.toFixed(1)}%
                    </span>
                  </div>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreName}>BERT Score:</span>
                    <span style={styles.scoreValue}>
                      {resume.scores.bertScore.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {resume.matchedSkills?.length > 0 && (
                  <div style={styles.skillsContainer}>
                    <h4 style={styles.skillsTitle}>Matched Skills:</h4>
                    <div style={styles.skillsList}>
                      {resume.matchedSkills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.resumeActions}>
                  <a
                    href={resume.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.viewButton}
                  >
                    View Resume
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && topResumes.length === 0 && (
        <div style={styles.noResults}>
          <h3>No matching resumes found</h3>
          <p>Try adjusting your job description or check if there are resumes in the database.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: { fontSize: '28px', color: '#2e7d32', marginBottom: '10px', textAlign: 'center' },
  subtitle: { color: '#444', fontSize: '16px', marginBottom: '10px', textAlign: 'center' },
  note: { color: '#2e7d32', fontSize: '15px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' },
  testContainer: { textAlign: 'center', marginBottom: '20px' },
  testButton: { padding: '8px 16px', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500' },
  textarea: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #a5d6a7', fontSize: '14px', resize: 'vertical', marginBottom: '20px' },
  button: { padding: '12px 24px', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.3s ease', display: 'block', margin: '0 auto 30px' },
  resultsContainer: { marginTop: '30px' },
  resultsTitle: { fontSize: '24px', color: '#2e7d32', marginBottom: '10px', textAlign: 'center' },
  resultsSubtitle: { color: '#666', fontSize: '16px', marginBottom: '30px', textAlign: 'center' },
  resumesList: { display: 'grid', gap: '20px' },
  resumeCard: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' },
  resumeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' },
  resumeTitle: { fontSize: '18px', color: '#333', margin: 0 },
  scoreContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  scoreLabel: { fontSize: '14px', color: '#666' },
  score: { fontSize: '18px', fontWeight: 'bold' },
  scoresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' },
  scoreItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' },
  scoreName: { fontSize: '14px', color: '#666' },
  scoreValue: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
  skillsContainer: { marginBottom: '15px' },
  skillsTitle: { fontSize: '16px', color: '#333', marginBottom: '8px' },
  skillsList: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  skillTag: { backgroundColor: '#e8f5e8', color: '#2e7d32', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  resumeActions: { display: 'flex', justifyContent: 'flex-end' },
  viewButton: { backgroundColor: '#2196f3', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  noResults: { textAlign: 'center', padding: '40px', color: '#666' },
};

export default HRDashboard;
