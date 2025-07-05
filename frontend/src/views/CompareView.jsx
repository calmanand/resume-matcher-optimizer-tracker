import React, { useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import VersionChart from '../components/VersionChart/VersionChart';

const CompareView = () => {
  const [resumeVersions, setResumeVersions] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleVersionUpload = async (file, versionName) => {
    setIsComparing(true);
    try {
      // Simulate API call for resume analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis results for comparison
      const mockAnalysis = {
        id: Date.now(),
        name: versionName || `Version ${resumeVersions.length + 1}`,
        file: file.name,
        overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        sections: {
          content: { score: Math.floor(Math.random() * 30) + 70 },
          formatting: { score: Math.floor(Math.random() * 30) + 70 },
          skills: { score: Math.floor(Math.random() * 30) + 70 },
          experience: { score: Math.floor(Math.random() * 30) + 70 }
        },
        uploadDate: new Date().toISOString()
      };
      
      setResumeVersions(prev => [...prev, mockAnalysis]);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const removeVersion = (id) => {
    setResumeVersions(prev => prev.filter(version => version.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Resume Versions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload multiple versions of your resume to compare scores and identify the best performing version.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload New Version
              </h2>
              <FileUpload 
                onFileUpload={handleVersionUpload}
                isAnalyzing={isComparing}
                allowMultiple={true}
                placeholder="Upload resume version..."
              />
            </div>

            {/* Version List */}
            {resumeVersions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Versions ({resumeVersions.length})
                </h3>
                <div className="space-y-3">
                  {resumeVersions.map((version) => (
                    <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{version.name}</p>
                        <p className="text-sm text-gray-500">{version.file}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(version.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-blue-600">
                          {version.overallScore}%
                        </span>
                        <button
                          onClick={() => removeVersion(version.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Comparison Results
            </h2>
            {resumeVersions.length > 0 ? (
              <VersionChart versions={resumeVersions} />
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No versions to compare</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload at least one resume version to see comparison results.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isComparing && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-green-600 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing resume version...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareView; 