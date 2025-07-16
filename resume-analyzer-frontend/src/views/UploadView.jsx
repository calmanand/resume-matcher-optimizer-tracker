import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const UploadView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const demoJD = `We are looking for a passionate JavaScript Developer Intern to join our front-end engineering team focused on building modern, responsive web applications. ...`;

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
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Upload Resume and Job Description</h2>
        {authUser && (
          <button
            onClick={logout}
            className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-3">
        To test the app, you can upload your own resume or{' '}
        <button
          onClick={handleUseDemo}
          className="text-green-700 underline font-semibold hover:text-green-900"
        >
          use demo resume and JD
        </button>.
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="w-full border border-green-300 rounded-md p-2 mb-2 text-sm"
      />

      {resumeFile && (
        <p className="text-sm text-gray-600 mb-3">
          Selected file: <strong>{resumeFile.name}</strong>
        </p>
      )}

      <input
        type="url"
        placeholder="Paste Google Drive link here"
        value={driveUrl}
        onChange={(e) => setDriveUrl(e.target.value)}
        className="w-full border border-green-300 rounded-md p-2 mb-3 text-sm"
      />

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        rows={8}
        className="w-full border border-green-300 rounded-md p-2 mb-5 text-sm resize-y"
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 text-white font-bold rounded-md transition ${
          isSubmitting ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? 'Analyzing...' : 'Submit'}
      </button>

      <Link
        to="/getme"
        className="block mt-6 text-center text-green-700 underline font-semibold text-sm hover:text-green-900"
      >
        View Past Results
      </Link>
    </div>
  );
};

export default UploadView;
