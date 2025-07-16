import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lime-50 flex flex-col items-center justify-center px-5 text-center font-sans">
      <h1 className="text-3xl font-bold mb-2 text-green-800">
        Resume Matcher Optimizer Tracker
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        AI-powered resume scoring & smart hiring assistant
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mb-10 text-left">
        <p className="text-base text-gray-800 mb-4">
          This project helps job seekers optimize their resumes using AI feedback, and enables recruiters to find the most relevant candidates.
        </p>
        <p className="font-semibold text-sm text-green-800 mb-2">
          ⚙️ Tech Stack Used:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 leading-relaxed">
          <li><strong>Frontend:</strong> React, Zustand, React Router, Toast</li>
          <li><strong>Backend:</strong> FastAPI, JWT Auth, MongoDB</li>
          <li><strong>AI & NLP:</strong> spaCy, BERT, TF-IDF, Sentence Transformers</li>
          <li><strong>Extras:</strong> Cloudinary, Resume PDF parsing, Google Drive link support</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-5 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Score Resume
        </button>
        <button
          onClick={() => navigate("/hr-dashboard")}
          className="bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          I am Hiring
        </button>
      </div>
    </div>
  );
};

export default HomePage;
