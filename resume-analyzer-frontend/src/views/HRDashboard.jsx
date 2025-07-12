import React, { useState } from 'react';
import toast from 'react-hot-toast';

const HRDashboard = () => {
  const [jobDescription, setJobDescription] = useState(`We are seeking a highly skilled Full Stack Developer with strong knowledge of React.js, Node.js, MongoDB, and Express. The ideal candidate should have experience with RESTful APIs, Git, cloud services (AWS preferred), and possess strong problem-solving and communication skills. Familiarity with CI/CD and Docker is a plus.`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Job description saved successfully!');
      setJobDescription('');
    } catch (err) {
      toast.error('Failed to upload job description');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HR Dashboard</h1>
      <p style={styles.subtitle}>
        NOTE :To try our web app, you can proceed with the default job description below
        or paste your own custom description.
      </p>
      <p style={styles.note}>
        We provide the best CANDIDATES as per your requirement.
      </p>

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
        {isSubmitting ? 'Uploading...' : 'Upload JD'}
      </button>
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
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    color: '#2e7d32',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#444',
    fontSize: '16px',
    marginBottom: '10px',
  },
  note: {
    color: '#2e7d32',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #a5d6a7',
    fontSize: '14px',
    resize: 'vertical',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 24px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default HRDashboard;
