import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  await login(formData);  // wait for login to complete
  if (useAuthStore.getState().authUser) {
    navigate("/upload");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sign in to your account</h2>
          <p className="text-gray-600 text-sm">Welcome back to ResumeChecker</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-sm text-center mt-2">
            Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
