import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const PreviousResults = () => {
  const { authUser } = useAuthStore();
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axiosInstance.get('/getme', {
          params: { email: authUser?.email }
        });
        setResumes(res.data.resumes || []);
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to fetch past results');
      }
    };

    if (authUser?.email) fetchResumes();
  }, [authUser]);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px', color: '#2e7d32' }}>Past Resume Analysis Results</h2>
      {resumes.length === 0 ? (
        <p>No previous results found.</p>
      ) : (
        resumes.map((resume, idx) => (
          <div
            key={resume._id || idx}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <p><strong>Score:</strong> {resume.scores?.hybridScore ?? 'N/A'}</p>
            <p><strong>Uploaded:</strong> {new Date(resume.uploadedAt).toLocaleString()}</p>

            <p>
              <strong>Resume (Google Drive):</strong>{' '}
              {resume.driveUrl ? (
                <a
                  href={resume.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  View Resume
                </a>
              ) : (
                <span style={{ color: '#888' }}>N/A</span>
              )}
            </p>

            <div>
              <strong>AI Feedback:</strong>
              {Array.isArray(resume.aiFeedback) ? (
                <ul>
                  {resume.aiFeedback.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p>{resume.aiFeedback || 'No feedback provided.'}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PreviousResults;
