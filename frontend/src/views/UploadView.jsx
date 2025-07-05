import React, { useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import ScoreBreakdown from '../components/ScoreBreakdown/ScoreBreakdown';
import SuggestionsPanel from '../components/SuggestionsPanel/SuggestionsPanel';

const UploadView = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = async (file) => {
    setIsAnalyzing(true);
    try {
      // Simulate API call for resume analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockAnalysis = {
        overallScore: 78,
        sections: {
          content: { score: 85, feedback: "Strong content with relevant keywords" },
          formatting: { score: 72, feedback: "Good structure, could improve spacing" },
          skills: { score: 80, feedback: "Well-organized skills section" },
          experience: { score: 75, feedback: "Good experience descriptions" }
        },
        suggestions: [
          "Add more quantifiable achievements",
          "Include industry-specific keywords",
          "Improve action verb usage",
          "Add a professional summary"
        ]
      };
      
      setResumeData(mockAnalysis);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant feedback and suggestions to improve your resume and increase your chances of landing interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <FileUpload 
              onFileUpload={handleFileUpload}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Analysis Results */}
          {analysisComplete && resumeData && (
            <>
              <div className="lg:col-span-1">
                <ScoreBreakdown 
                  overallScore={resumeData.overallScore}
                  sections={resumeData.sections}
                />
              </div>
              
              <div className="lg:col-span-1">
                <SuggestionsPanel 
                  suggestions={resumeData.suggestions}
                />
              </div>
            </>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing your resume...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadView; 