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
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        {/* 🎯 DEMO INFO */}
        <div className="bg-lime-100 border border-dashed border-green-300 text-green-700 rounded-lg p-4 mb-5 text-sm">
          <p className="font-bold">Demo Credentials</p>
          <p><span className="font-semibold">Email:</span> demo@resume.ai</p>
          <p><span className="font-semibold">Password:</span> demopass123</p>
        </div>

        <h2 className="text-2xl font-bold text-green-800 mb-2">Login to ResumeChecker</h2>
        <p className="text-sm text-green-600 mb-6">Welcome back!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="p-3 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="p-3 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`bg-green-600 text-white py-3 rounded-md font-bold transition hover:bg-green-700 ${
              isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-700 font-bold underline hover:text-green-900">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
