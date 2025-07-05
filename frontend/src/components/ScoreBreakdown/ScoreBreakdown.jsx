import React from 'react';

const ScoreBreakdown = ({ overallScore, sections }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '👍';
    if (score >= 70) return '⚠️';
    return '❌';
  };

  const getOverallScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! Your resume is well-optimized.';
    if (score >= 80) return 'Good! Your resume has strong potential.';
    if (score >= 70) return 'Fair. There\'s room for improvement.';
    return 'Needs work. Consider significant revisions.';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resume Analysis
      </h2>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getOverallScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 text-2xl">
            {getScoreIcon(overallScore)}
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          {getOverallScoreMessage(overallScore)}
        </p>
      </div>

      {/* Section Breakdown */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Section Breakdown
        </h3>
        
        <div className="space-y-4">
          {Object.entries(sections).map(([sectionName, sectionData]) => (
            <div key={sectionName} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {sectionName === 'content' && '📝'}
                    {sectionName === 'formatting' && '🎨'}
                    {sectionName === 'skills' && '⚡'}
                    {sectionName === 'experience' && '💼'}
                  </span>
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {sectionName}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(sectionData.score)}`}>
                    {sectionData.score}%
                  </span>
                  <span className="text-lg">
                    {getScoreIcon(sectionData.score)}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    sectionData.score >= 90 ? 'bg-green-500' :
                    sectionData.score >= 80 ? 'bg-blue-500' :
                    sectionData.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sectionData.score}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {sectionData.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Quick Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Focus on quantifiable achievements</li>
          <li>• Use industry-specific keywords</li>
          <li>• Keep formatting clean and consistent</li>
          <li>• Tailor content to job requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default ScoreBreakdown; 