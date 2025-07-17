import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

const HRDashboard = () => {
  const [jobDescription, setJobDescription] = useState(
    `We are seeking a highly skilled Full Stack Developer with strong knowledge of React.js, Node.js, MongoDB, and Express. The ideal candidate should have experience with RESTful APIs, Git, cloud services (AWS preferred), and possess strong problem-solving and communication skills. Familiarity with CI/CD and Docker is a plus.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topResumes, setTopResumes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const triviaFacts = [
    "📄 Traditional recruiters often spent hours reviewing piles of resumes manually.",
    "⏳ On average, hiring managers spend just 7 seconds scanning a resume.",
    "🤖 AI recruitment tools analyze skills, phrasing, and relevance in seconds.",
    "🧠 Data-driven hiring improves match quality and reduces unconscious bias.",
    "🔍 Models like TF-IDF and BERT understand context better than keyword filters."
  ];

  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % triviaFacts.length);
      }, 4000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting, triviaFacts.length]);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('jd_text', jobDescription);
      const response = await axiosInstance.post('/hr/top-matches', formData);
      setTopResumes(response.data.topResumes);
      setShowResults(true);
      toast.success(`Found ${response.data.count} matching resumes!`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to get matching resumes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md font-sans">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-2">HR Dashboard</h1>
      <p className="text-center text-gray-700 mb-1">Enter a job description to find the best matching resumes from our database.</p>
      <p className="text-center text-green-700 font-semibold mb-4">We provide the best CANDIDATES as per your requirement.</p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        className="w-full p-3 border border-green-300 rounded-md text-sm mb-4"
        placeholder="Paste your job description here..."
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`block mx-auto px-6 py-3 rounded text-white font-bold text-lg transition duration-300 ${
          isSubmitting ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        } mb-6`}
      >
        {isSubmitting ? 'Analyzing...' : 'Find Best Matches'}
      </button>

      {isSubmitting && (
        <div className="text-center mb-10">
          <p className="text-green-800 font-bold text-lg mb-3 animate-pulse">✨ Please wait while we pick the best for you...</p>
          <p className="text-base text-gray-700 font-medium mb-4">💡 Here's some trivia while we analyze:</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingMsgIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="mx-auto text-lg font-bold text-green-900 px-6 py-4 bg-green-100 border border-green-300 rounded-lg shadow-lg max-w-2xl"
            >
              {triviaFacts[loadingMsgIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {showResults && topResumes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-green-800 text-center mb-1">Top Matching Resumes</h2>
          <p className="text-center text-gray-600 mb-6">Found {topResumes.length} matching resumes for your job description</p>

          <div className="grid gap-6">
            {topResumes.map((resume, index) => (
              <div key={resume.resumeId} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Candidate #{index + 1} – {resume.email}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Overall Score:</span>
                    <span className={`text-lg font-bold ${getScoreColor(resume.scores.hybridScore)}`}>
                      {resume.scores.hybridScore.toFixed(1)}%
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(resume.scores.hybridScore)}`}>
                      ({getScoreLabel(resume.scores.hybridScore)})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm text-gray-600">Skill Match:</span>
                    <span className="font-bold text-gray-800">{resume.scores.skillScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm text-gray-600">TF-IDF Score:</span>
                    <span className="font-bold text-gray-800">{resume.scores.tfidfScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm text-gray-600">BERT Score:</span>
                    <span className="font-bold text-gray-800">{resume.scores.bertScore.toFixed(1)}%</span>
                  </div>
                </div>

                {resume.matchedSkills?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Matched Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-right">
                  <a
                    href={resume.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && topResumes.length === 0 && (
        <div className="text-center p-10 text-gray-600">
          <h3 className="text-lg font-semibold">No matching resumes found</h3>
          <p>Try adjusting your job description or check if there are resumes in the database.</p>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
