import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-tr from-lime-100 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl px-8 py-10"
      >
        {/* 🎯 DEMO INFO */}
        <div className="bg-lime-100 border border-green-300 text-green-800 rounded-xl p-4 mb-6 text-sm shadow-inner">
          <p className="font-semibold mb-1"> <span className="underline">Demo Credentials</span></p>
          <p><span className="font-medium">Email:</span> demo@resume.ai</p>
          <p><span className="font-medium">Password:</span> demopass123</p>
        </div>

        <h2 className="text-3xl font-extrabold text-green-900 text-center mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Log in to <span className="font-semibold text-green-700">ResumeChecker</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
              isLoggingIn
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-800 shadow-md'
            }`}
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-green-700 font-bold underline hover:text-green-900">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
