import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Info, CheckCircle, ExternalLink } from 'lucide-react';

const ResultView = () => {
  const location = useLocation();
  const resultData = location.state;
  const { logout, authUser } = useAuthStore();

  const hybridScore = resultData?.hybridScore ?? resultData?.scores?.hybridScore ?? 0;
  const skillScore = resultData?.skillScore ?? resultData?.scores?.skillScore ?? null;
  const bertScore = resultData?.bertScore ?? resultData?.scores?.bertScore ?? null;

  let aiFeedback = '';
  if (resultData?.aiFeedback) {
    if (typeof resultData.aiFeedback === 'object' && resultData.aiFeedback.feedback) {
      aiFeedback = resultData.aiFeedback.feedback.join('. ');
    } else if (Array.isArray(resultData.aiFeedback)) {
      aiFeedback = resultData.aiFeedback.join('. ');
    } else if (typeof resultData.aiFeedback === 'string') {
      aiFeedback = resultData.aiFeedback.trim();
    }
  }

  const aiFeedbackList = aiFeedback
    ? aiFeedback
        .split(/(?<=[.?!])\s+(?=[A-Z])/)
        .filter((item) => item.trim().length > 0)
    : [];

  let feedbackText = '';
  let scoreColor = 'text-gray-600';
  if (hybridScore <= 40) {
    feedbackText = 'Poor Match';
    scoreColor = 'text-red-600';
  } else if (hybridScore <= 55) {
    feedbackText = 'Average Match';
    scoreColor = 'text-yellow-600';
  } else if (hybridScore <= 80) {
    feedbackText = 'Above Average Match';
    scoreColor = 'text-blue-600';
  } else {
    feedbackText = 'Excellent Match';
    scoreColor = 'text-green-700';
  }

  if (!resultData) {
    return <div className="text-center text-red-600 font-bold mt-16">No result data found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-tr from-lime-100 to-green-50 font-sans">
      {/* LEFT SIDE - Explanation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-white/80 backdrop-blur-lg shadow-inner"
      >
        <div className="max-w-xl w-full space-y-6">
          <h2 className="text-3xl font-bold text-green-900">Evaluation Criteria</h2>
          <div className="space-y-4 text-sm text-green-900">
            <div>
              <p className="flex gap-2 items-start">
                <Info className="w-5 h-5 mt-1 text-green-700" />
                <span>
                  <strong>Skill Matching (40%):</strong> Measures how many job-relevant skills your resume includes.
                </span>
              </p>
            </div>
            <div>
              <p className="flex gap-2 items-start">
                <Info className="w-5 h-5 mt-1 text-green-700" />
                <span>
                  <strong>TF-IDF Similarity (30%):</strong> Identifies important and unique terms relevant to the job post.
                </span>
              </p>
              <p className="text-xs text-gray-700 ml-7">
                🔍 Helps emphasize what makes your resume stand out.
              </p>
            </div>
            <div>
              <p className="flex gap-2 items-start">
                <Info className="w-5 h-5 mt-1 text-green-700" />
                <span>
                  <strong>BERT Score (30%):</strong> Evaluates how well the *meaning* of your resume matches the job using advanced NLP.
                </span>
              </p>
              <p className="text-xs text-gray-700 ml-7">
                🤖 BERT understands the *context* beyond keywords — like a human recruiter would.
              </p>
            </div>
            <p className="pt-2 text-green-800 text-sm">
              All these metrics are weighted and combined to form your final match score.
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Result */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-white"
      >
        <div className="max-w-xl w-full space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-green-900">Your Resume Match</h2>
            {authUser && (
              <button
                onClick={logout}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-800">
            <div>
              <strong>Skill Score:</strong>{' '}
              <span className="text-green-700 font-bold text-lg">{Math.round(skillScore)}</span>
            </div>
            <div>
              <strong>BERT Score:</strong>{' '}
              <span className="text-green-700 font-bold text-lg">{Math.round(bertScore)}</span>
            </div>
            <div>
              <strong>Final Score:</strong>{' '}
              <span className={`font-bold text-lg ${scoreColor}`}>{Math.round(hybridScore)}</span>
              <span className="ml-2 text-gray-700">– {feedbackText}</span>
            </div>
          </div>

          <div>
            <strong>AI Suggestions:</strong>
            <ul className="bg-green-50 rounded-md p-4 mt-2 text-sm text-gray-800 space-y-2 list-disc list-inside">
              {aiFeedbackList.length > 0 ? (
                aiFeedbackList.map((point, index) => (
                  <li key={index}>{point.trim()}</li>
                ))
              ) : (
                <li className="italic text-gray-500">No AI suggestions available.</li>
              )}
            </ul>
          </div>

          <div>
            <strong>Google Drive Link:</strong>{' '}
            {resultData?.driveUrl ? (
              <a
                href={resultData.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-green-700 underline font-semibold"
              >
                {resultData.driveUrl.slice(0, 45)}... <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultView;
