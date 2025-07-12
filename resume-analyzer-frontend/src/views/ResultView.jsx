import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ResultView = () => {
  const location = useLocation();
  const resultData = location.state;
  const { logout, authUser } = useAuthStore();

  const hybridScore = resultData?.hybridScore ?? resultData?.scores?.hybridScore ?? 0;
  const skillScore = resultData?.skillScore ?? resultData?.scores?.skillScore ?? null;
  const bertScore = resultData?.bertScore ?? resultData?.scores?.bertScore ?? null;
  const aiFeedback = Array.isArray(resultData?.aiFeedback)
    ? resultData.aiFeedback.join(' ')
    : resultData?.aiFeedback?.trim();

  let feedbackText = '';
  if (hybridScore <= 40) feedbackText = 'Poor Match';
  else if (hybridScore <= 55) feedbackText = 'Average Match';
  else if (hybridScore <= 80) feedbackText = 'Above Average Match';
  else feedbackText = 'Excellent Match';

  if (!resultData) {
    return <div style={styles.centerText}>No result data found.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Analysis Result</h2>
        {authUser && (
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>

      {skillScore !== null && (
        <div style={styles.section}>
          <strong>Skill Matching Score:</strong>{' '}
          <span style={styles.score}>{Math.round(skillScore)}</span>
        </div>
      )}

      {bertScore !== null && (
        <div style={styles.section}>
          <strong>Phrasing Score:</strong>{' '}
          <span style={styles.score}>{Math.round(bertScore)}</span>
        </div>
      )}

      <div style={styles.section}>
        <strong>Evaluated Final Score:</strong>{' '}
        <span style={styles.score}>{Math.round(hybridScore)}</span>
        <span style={styles.scoreComment}> – {feedbackText}</span>
      </div>

      <div style={styles.section}>
        <strong>AI Suggestions:</strong>
        <div style={styles.feedbackBox}>
          {aiFeedback ? (
            <p style={styles.feedbackItem}>{aiFeedback}</p>
          ) : (
            <div style={{ fontStyle: 'italic', color: '#888' }}>
              No AI suggestions available.
            </div>
          )}
        </div>
      </div>

      {/* ✅ Show Google Drive link if available */}
      <div style={styles.section}>
        <strong>Google Drive Link:</strong>{' '}
        {resultData?.driveUrl ? (
          <a
            href={resultData.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            {resultData.driveUrl}
          </a>
        ) : (
          <span style={{ color: '#888' }}>N/A</span>
        )}
      </div>

      <div style={styles.section}>
        <strong>How We Evaluate:</strong>
        <div style={styles.explanationBox}>
          <p>Our system evaluates your resume using three key aspects:</p>
          <ul>
            <li>
              <strong>Skill Matching Score (40%):</strong> Compares keywords from your resume to those in the job description.
            </li>
            <li>
              <strong>TF-IDF Match (30%):</strong> Analyzes term importance and similarity.
            </li>
            <li>
              <strong>Phrasing Score (30%):</strong> Uses AI to assess language and meaning similarity.
            </li>
          </ul>
          <p>
            These components are combined to calculate the <strong>Final Score</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '60px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  logoutBtn: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  section: {
    marginBottom: '20px',
  },
  link: {
    color: '#2e7d32',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  score: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#388e3c',
  },
  scoreComment: {
    marginLeft: '10px',
    fontSize: '16px',
    color: '#555',
  },
  feedbackBox: {
    backgroundColor: '#f0f8f0',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
  },
  feedbackItem: {
    marginBottom: '10px',
  },
  centerText: {
    marginTop: '60px',
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  explanationBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2e7d32',
  },
};

export default ResultView;
