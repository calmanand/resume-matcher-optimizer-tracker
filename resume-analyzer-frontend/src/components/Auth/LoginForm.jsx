import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    if (useAuthStore.getState().authUser) {
      navigate("/upload");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        {/* 🎯 DEMO INFO */}
        <div style={styles.demoBox}>
          <p><strong>Demo Credentials</strong></p>
          <p><span style={styles.label}>Email:</span> demo@resume.ai</p>
          <p><span style={styles.label}>Password:</span> demopass123</p>
        </div>

        <h2 style={styles.heading}>Login to ResumeChecker</h2>
        <p style={styles.subheading}>Welcome back!</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
          />
          <button type="submit" disabled={isLoggingIn} style={styles.button}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={styles.signupText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.link}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#e6f5ea',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  formBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  demoBox: {
    backgroundColor: '#f1f8e9',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#2e7d32',
    border: '1px dashed #a5d6a7',
  },
  label: {
    fontWeight: 'bold',
  },
  heading: {
    fontSize: '24px',
    color: '#2e7d32',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '14px',
    color: '#4caf50',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #a5d6a7',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: '14px',
    marginTop: '15px',
  },
  link: {
    color: '#2e7d32',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default LoginForm;
