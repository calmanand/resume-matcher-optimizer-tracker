import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

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
      aiFeedback = resultData.aiFeedback.feedback.join('\n');
    } else if (Array.isArray(resultData.aiFeedback)) {
      aiFeedback = resultData.aiFeedback.join('\n');
    } else if (typeof resultData.aiFeedback === 'string') {
      aiFeedback = resultData.aiFeedback.trim();
    }
  }

  let feedbackText = '';
  if (hybridScore <= 40) feedbackText = 'Poor Match';
  else if (hybridScore <= 55) feedbackText = 'Average Match';
  else if (hybridScore <= 80) feedbackText = 'Above Average Match';
  else feedbackText = 'Excellent Match';

  if (!resultData) {
    return <div className="text-center text-red-600 font-bold mt-16">No result data found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-md font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Analysis Result</h2>
        {authUser && (
          <button onClick={logout} className="bg-green-600 text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-green-700 transition">Logout</button>
        )}
      </div>

      {skillScore !== null && (
        <div className="mb-5">
          <strong>Skill Matching Score:</strong> <span className="text-green-700 font-bold text-lg">{Math.round(skillScore)}</span>
        </div>
      )}

      {bertScore !== null && (
        <div className="mb-5">
          <strong>Phrasing Score:</strong> <span className="text-green-700 font-bold text-lg">{Math.round(bertScore)}</span>
        </div>
      )}

      <div className="mb-5">
        <strong>Evaluated Final Score:</strong> <span className="text-green-700 font-bold text-lg">{Math.round(hybridScore)}</span>
        <span className="ml-3 text-base text-gray-700">– {feedbackText}</span>
      </div>

      <div className="mb-5">
        <strong>AI Suggestions:</strong>
        <div className="bg-green-50 rounded-md p-4 text-sm leading-relaxed text-gray-800 mt-2">
          {aiFeedback ? (
            aiFeedback.split('\n').map((feedback, index) => (
              <p key={index} className="mb-2">{feedback}</p>
            ))
          ) : (
            <div className="italic text-gray-500">No AI suggestions available.</div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <strong>Google Drive Link:</strong>{' '}
        {resultData?.driveUrl ? (
          <a href={resultData.driveUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline font-semibold">
            {resultData.driveUrl}
          </a>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>

      <div className="mb-5">
        <strong>How We Evaluate:</strong>
        <div className="bg-green-100 rounded-md p-4 text-sm leading-relaxed text-green-800 mt-2">
          <p>Our system evaluates your resume using three key aspects:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Skill Matching Score (40%):</strong> Compares keywords from your resume to those in the job description.</li>
            <li><strong>TF-IDF Match (30%):</strong> Analyzes term importance and similarity.</li>
            <li><strong>Phrasing Score (30%):</strong> Uses AI to assess language and meaning similarity.</li>
          </ul>
          <p className="mt-2">These components are combined to calculate the <strong>Final Score</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
