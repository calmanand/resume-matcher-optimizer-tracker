// src/views/HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Resume Analyzer</h1>
      <p style={styles.subtitle}>Choose your role to get started</p>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate("/login")} style={styles.button}>Score Resume</button>
        <button onClick={() => navigate("/hr-dashboard")} style={styles.buttonSecondary}>I am Hiring</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f8e9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#2e7d32',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonSecondary: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};

export default HomePage;
