import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UploadView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const demoJD = `We are looking for a passionate JavaScript Developer Intern to join our front-end engineering team focused on building modern, responsive web applications. You will work with React, REST APIs, and collaborate with designers and product managers to build features users love.`;

  const handleUseDemo = async () => {
    try {
      const res = await fetch('/demoResume.pdf');
      const blob = await res.blob();
      const file = new File([blob], 'demo_resume.pdf', { type: 'application/pdf' });
      setResumeFile(file);
      setJobDescription(demoJD);
      toast.success('Demo resume and JD loaded!');
    } catch (err) {
      toast.error('Failed to load demo resume.');
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile && !driveUrl.trim()) {
      return toast.error('Please upload a resume or provide a Drive link.');
    }

    if (!jobDescription) {
      return toast.error('Please enter a job description.');
    }

    const formData = new FormData();
    if (resumeFile) formData.append('file', resumeFile);
    formData.append('drive_url', driveUrl.trim());
    formData.append('jd_text', jobDescription);

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post('/resume/upload-resume-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete!');
      navigate('/results', { state: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-lime-100 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 14,
          duration: 0.6,
        }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl px-8 py-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-green-900">Upload Resume & JD</h2>
          {authUser && (
            <button
              onClick={logout}
              className="bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-800 transition"
            >
              Logout
            </button>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-5">
          Upload your resume or{' '}
          <button
            onClick={handleUseDemo}
            className="text-green-700 font-semibold underline hover:text-green-900"
          >
            use demo resume & JD
          </button>
        </p>

        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full border border-green-300 rounded-lg px-4 py-3 text-sm bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {resumeFile && (
            <p className="text-sm text-gray-600">
              Selected file: <strong>{resumeFile.name}</strong>
            </p>
          )}

          <input
            type="url"
            placeholder="Paste Google Drive link"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            className="w-full border border-green-300 rounded-lg px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            rows={6}
            className="w-full border border-green-300 rounded-lg px-4 py-3 text-sm resize-y shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`mt-6 w-full py-3 text-white font-bold rounded-lg transition-all duration-300 ${
            isSubmitting
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-700 hover:bg-green-800 shadow-md'
          }`}
        >
          {isSubmitting ? 'Analyzing...' : 'Submit'}
        </button>

        <Link
          to="/getme"
          className="block text-center mt-6 text-green-700 underline font-semibold text-sm hover:text-green-900"
        >
          View Past Results
        </Link>
      </motion.div>
    </div>
  );
};

export default UploadView;
