import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const UploadView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const demoJD = `We are seeking a full-stack developer with experience in React, Node.js, and cloud services like AWS. Knowledge of Docker and CI/CD pipelines is a plus.`;

  const handleUseDemo = async () => {
    try {
      const res = await fetch('/demo_resume.pdf');
      const blob = await res.blob();
      const file = new File([blob], 'demo_resume.pdf', { type: 'application/pdf' });
      setResumeFile(file);
      setJobDescription(demoJD);
      toast.success('Demo resume and JD loaded!');
    } catch (err) {
      toast.error('Failed to load demo resume.');
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile && !driveUrl.trim()) {
      return toast.error('Please upload a resume or provide a Drive link.');
    }

    if (!jobDescription) {
      return toast.error('Please enter a job description.');
    }

    const formData = new FormData();
    if (resumeFile) formData.append('file', resumeFile);
    formData.append('drive_url', driveUrl.trim());
    formData.append('jd_text', jobDescription);

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post('/resume/upload-resume-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete!');
      navigate('/results', { state: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Upload Resume and Job Description</h2>
        {authUser && (
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>

      <p style={styles.note}>
        To test the app, you can upload your own resume or{' '}
        <button onClick={handleUseDemo} style={styles.demoBtn}>use demo resume and JD</button>.
      </p>

      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => setResumeFile(e.target.files[0])} 
        style={styles.input}
      />

      {resumeFile && (
        <p style={styles.fileName}>Selected file: <strong>{resumeFile.name}</strong></p>
      )}

      <input
        type="url"
        placeholder="paste Google Drive link here "
        value={driveUrl}
        onChange={(e) => setDriveUrl(e.target.value)}
        style={styles.input}
      />

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        rows={8}
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
        {isSubmitting ? 'Analyzing...' : 'Submit'}
      </button>

      <Link to="/getme" style={styles.viewResultsLink}>
        View Past Results
      </Link>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
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
    marginBottom: '20px',
  },
  heading: {
    fontSize: '22px',
    color: '#2e7d32',
    fontWeight: 'bold',
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
  note: {
    marginBottom: '15px',
    fontSize: '14px',
    color: '#333',
  },
  demoBtn: {
    background: 'none',
    border: 'none',
    color: '#2e7d32',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: 0,
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #a5d6a7',
    fontSize: '14px',
  },
  fileName: {
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '15px',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #a5d6a7',
    marginBottom: '20px',
    fontSize: '14px',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  viewResultsLink: {
    display: 'block',
    marginTop: '20px',
    textAlign: 'center',
    color: '#2e7d32',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};

export default UploadView;
