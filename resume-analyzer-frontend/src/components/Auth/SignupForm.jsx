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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-gray-600 text-sm">Join ResumeChecker and optimize your career</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
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
            disabled={isSigningUp}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            {isSigningUp ? 'Creating account...' : 'Sign Up'}
          </button>
          <p className="text-sm text-center mt-2">
            Already have an account? <Link to="/login" className="text-green-600">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
