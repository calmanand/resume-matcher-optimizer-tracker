import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';

const AuthView = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading, authError, clearError } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Signup failed:', error);
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
    clearError();
  };

  const switchToLogin = () => {
    setIsLogin(true);
    clearError();
  };

  return (
    <div className="min-h-screen">
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={switchToSignup}
          isLoading={loading}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={switchToLogin}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default AuthView; 