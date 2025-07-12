import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const SignupForm = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const success = await signup(formData);
    if (success) navigate('/upload');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create your account</h2>
        <p style={styles.subheading}>Join ResumeChecker and optimize your career</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            style={styles.input}
          />
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
          <button
            type="submit"
            disabled={isSigningUp}
            style={{
              ...styles.button,
              backgroundColor: isSigningUp ? '#a5d6a7' : '#4caf50',
              cursor: isSigningUp ? 'not-allowed' : 'pointer',
            }}
          >
            {isSigningUp ? 'Creating account...' : 'Sign Up'}
          </button>
          <p style={styles.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLink}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#2e7d32',
  },
  subheading: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #a5d6a7',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  loginText: {
    marginTop: '12px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  loginLink: {
    color: '#2e7d32',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
};

export default SignupForm;
