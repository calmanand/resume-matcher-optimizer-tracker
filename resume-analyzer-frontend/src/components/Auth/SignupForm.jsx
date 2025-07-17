import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-tr from-lime-100 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl px-8 py-10"
      >
        <h2 className="text-3xl font-extrabold text-green-900 text-center mb-2">
          Create your account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Join <span className="font-semibold text-green-700">ResumeChecker</span> and optimize your career.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
            disabled={isSigningUp}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
              isSigningUp
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-800 shadow-md'
            }`}
          >
            {isSigningUp ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-bold underline hover:text-green-900">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupForm;
