import React, { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const UploadView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser } = useAuthStore();

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      return toast.error('Please upload resume and enter job description');
    }

    if (!authUser) {
      return toast.error('You need to be logged in');
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescription);

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Resume analyzed successfully!');
      console.log('Backend Response:', res.data);
      // You can store or route with the result here
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Submission failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Resume and Job Description</h2>
      <input 
        type="file" 
        accept=".pdf,.doc,.docx" 
        onChange={handleResumeChange}
        className="mb-4 w-full"
      />
      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 text-white font-semibold rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default UploadView;
