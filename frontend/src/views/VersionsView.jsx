import React, { useState, useEffect } from 'react';
import VersionChart from '../components/VersionChart/VersionChart';

const VersionsView = () => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading versions from API
    const loadVersions = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for versions
      const mockVersions = [
        {
          id: 1,
          name: "Software Engineer Resume v1",
          file: "resume_v1.pdf",
          overallScore: 85,
          sections: {
            content: { score: 88, feedback: "Excellent content with strong keywords" },
            formatting: { score: 82, feedback: "Good structure and layout" },
            skills: { score: 90, feedback: "Comprehensive skills section" },
            experience: { score: 85, feedback: "Strong experience descriptions" }
          },
          uploadDate: "2024-01-15T10:30:00Z",
          lastModified: "2024-01-15T10:30:00Z",
          status: "active"
        },
        {
          id: 2,
          name: "Software Engineer Resume v2",
          file: "resume_v2.pdf",
          overallScore: 92,
          sections: {
            content: { score: 95, feedback: "Outstanding content with industry keywords" },
            formatting: { score: 90, feedback: "Excellent structure and spacing" },
            skills: { score: 92, feedback: "Well-organized and relevant skills" },
            experience: { score: 91, feedback: "Quantified achievements and strong descriptions" }
          },
          uploadDate: "2024-01-20T14:15:00Z",
          lastModified: "2024-01-20T14:15:00Z",
          status: "active"
        },
        {
          id: 3,
          name: "Software Engineer Resume v3",
          file: "resume_v3.pdf",
          overallScore: 89,
          sections: {
            content: { score: 87, feedback: "Good content with room for improvement" },
            formatting: { score: 88, feedback: "Clean and professional layout" },
            skills: { score: 85, feedback: "Relevant skills but could be more specific" },
            experience: { score: 92, feedback: "Excellent experience section with metrics" }
          },
          uploadDate: "2024-01-25T09:45:00Z",
          lastModified: "2024-01-25T09:45:00Z",
          status: "draft"
        }
      ];
      
      setVersions(mockVersions);
      setIsLoading(false);
    };

    loadVersions();
  }, []);

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
  };

  const deleteVersion = (id) => {
    setVersions(prev => prev.filter(v => v.id !== id));
    if (selectedVersion?.id === id) {
      setSelectedVersion(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-purple-600 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your resume versions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Versions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track all your resume versions. Compare performance and identify your best version.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Versions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                All Versions ({versions.length})
              </h2>
              <div className="space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedVersion?.id === version.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleVersionSelect(version)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {version.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{version.file}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">
                        {version.overallScore}%
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {new Date(version.lastModified).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteVersion(version.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Version Details and Chart */}
          <div className="lg:col-span-2">
            {selectedVersion ? (
              <div className="space-y-6">
                {/* Version Details */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedVersion.name}
                    </h2>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedVersion.status)}`}>
                      {selectedVersion.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">File</p>
                      <p className="font-medium text-gray-900">{selectedVersion.file}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Overall Score</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedVersion.overallScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Upload Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedVersion.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Modified</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedVersion.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Section Scores */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Section Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedVersion.sections).map(([section, data]) => (
                        <div key={section} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 capitalize">{section}</span>
                            <span className="text-lg font-bold text-purple-600">{data.score}%</span>
                          </div>
                          <p className="text-sm text-gray-600">{data.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comparison Chart */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                  <VersionChart versions={versions} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No version selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a version from the list to view detailed analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionsView; 