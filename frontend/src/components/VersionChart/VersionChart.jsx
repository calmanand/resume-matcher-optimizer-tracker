import React from 'react';

const VersionChart = ({ versions }) => {
  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for comparison</p>
      </div>
    );
  }

  const maxScore = Math.max(...versions.map(v => v.overallScore));
  const sectionNames = ['content', 'formatting', 'skills', 'experience'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const getBarColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score Comparison</h3>
        <div className="space-y-3">
          {versions.map((version, index) => (
            <div key={version.id} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">
                {version.name}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${getBarColor(version.overallScore)}`}
                  style={{ width: `${(version.overallScore / maxScore) * 100}%` }}
                ></div>
              </div>
              <div className={`w-12 text-right font-bold ${getScoreColor(version.overallScore)}`}>
                {version.overallScore}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Breakdown Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Breakdown</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 mb-3">
              <div className="text-sm font-medium text-gray-700">Version</div>
              {sectionNames.map((section, index) => (
                <div key={section} className="text-sm font-medium text-gray-700 capitalize text-center">
                  {section}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {versions.map((version) => (
              <div key={version.id} className="grid grid-cols-5 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {version.name}
                </div>
                {sectionNames.map((section, index) => {
                  const score = version.sections[section]?.score || 0;
                  return (
                    <div key={section} className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getBarColor(score)}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(...versions.map(v => v.overallScore))}%
            </div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(versions.reduce((sum, v) => sum + v.overallScore, 0) / versions.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {versions.length}
            </div>
            <div className="text-sm text-gray-600">Versions</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Recommendations
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the highest-scoring version as your primary resume</li>
          <li>• Combine the best elements from different versions</li>
          <li>• Focus on improving the lowest-scoring sections</li>
          <li>• Test different versions for different job applications</li>
        </ul>
      </div>
    </div>
  );
};

export default VersionChart; 