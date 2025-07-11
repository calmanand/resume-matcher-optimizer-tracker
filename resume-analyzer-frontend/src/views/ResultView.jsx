import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultView = () => {
  const location = useLocation();
  const resultData = location.state;

  if (!resultData) {
    return <div className="text-center mt-10 text-red-500">No result data found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Analysis Result</h2>

      <div className="mb-4">
        <strong>Resume URL:</strong>{' '}
        <a href={resultData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          View Resume
        </a>
      </div>

      <div className="mb-4">
        <strong>Scores:</strong>
        <ul className="list-disc ml-6">
          <li>Skill Score: {resultData.skillScore ?? 'N/A'}</li>
          <li>TF-IDF Score: {resultData.tfidfScore ?? 'N/A'}</li>
          <li>BERT Score: {resultData.bertScore ?? 'N/A'}</li>
          <li>Hybrid Score: {resultData.hybridScore ?? 'N/A'}</li>
        </ul>
      </div>

      <div>
        <strong>AI Suggestions:</strong>
        <div className="mt-2 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {resultData.aiFeedback || 'No feedback generated.'}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
