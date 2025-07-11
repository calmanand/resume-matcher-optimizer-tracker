// src/views/UploadView.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const UploadView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      return toast.error('Please upload a resume and enter a job description');
    }

    const formData = new FormData();
    formData.append('file', resumeFile);
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
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Resume and Job Description</h2>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => setResumeFile(e.target.files[0])} 
        className="mb-4 w-full border rounded p-2" 
      />
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        rows={8}
        className="w-full border rounded p-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 text-white font-semibold rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Analyzing...' : 'Submit'}
      </button>
    </div>
  );
};

export default UploadView;
