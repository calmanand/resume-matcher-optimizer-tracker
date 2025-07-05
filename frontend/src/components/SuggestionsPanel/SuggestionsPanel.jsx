import React, { useState } from 'react';

const SuggestionsPanel = ({ suggestions }) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  const suggestionCategories = [
    {
      category: 'Content & Keywords',
      icon: '📝',
      color: 'blue',
      suggestions: suggestions.filter(s => 
        s.toLowerCase().includes('keyword') || 
        s.toLowerCase().includes('content') ||
        s.toLowerCase().includes('achievement')
      )
    },
    {
      category: 'Formatting & Structure',
      icon: '🎨',
      color: 'green',
      suggestions: suggestions.filter(s => 
        s.toLowerCase().includes('format') || 
        s.toLowerCase().includes('structure') ||
        s.toLowerCase().includes('spacing')
      )
    },
    {
      category: 'Professional Impact',
      icon: '💼',
      color: 'purple',
      suggestions: suggestions.filter(s => 
        s.toLowerCase().includes('professional') || 
        s.toLowerCase().includes('summary') ||
        s.toLowerCase().includes('action')
      )
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          icon: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const toggleSuggestion = (index) => {
    setExpandedSuggestion(expandedSuggestion === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Improvement Suggestions
      </h2>

      <div className="space-y-6">
        {suggestionCategories.map((category, categoryIndex) => {
          const colors = getColorClasses(category.color);
          
          return (
            <div key={category.category} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{category.icon}</span>
                <h3 className={`font-semibold ${colors.text}`}>
                  {category.category}
                </h3>
              </div>
              
              <div className="space-y-3">
                {category.suggestions.length > 0 ? (
                  category.suggestions.map((suggestion, suggestionIndex) => {
                    const globalIndex = categoryIndex * 10 + suggestionIndex;
                    const isExpanded = expandedSuggestion === globalIndex;
                    
                    return (
                      <div key={suggestionIndex} className="bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => toggleSuggestion(globalIndex)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="text-sm font-medium text-gray-900 line-clamp-2">
                            {suggestion}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-4 pb-3 border-t border-gray-100">
                            <div className="pt-3">
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${colors.icon.replace('text-', 'bg-')}`}></div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 mb-2">
                                    {suggestion}
                                  </p>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="text-xs font-semibold text-gray-600 mb-1">
                                      Why this matters:
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      {getSuggestionExplanation(suggestion)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      No suggestions in this category
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
          Download Detailed Report
        </button>
        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
          Share Analysis Results
        </button>
      </div>
    </div>
  );
};

// Helper function to provide explanations for suggestions
const getSuggestionExplanation = (suggestion) => {
  const explanations = {
    'Add more quantifiable achievements': 'Recruiters and ATS systems look for specific metrics and results. Quantified achievements demonstrate your impact and value.',
    'Include industry-specific keywords': 'ATS systems scan for relevant keywords. Including industry-specific terms increases your resume\'s visibility.',
    'Improve action verb usage': 'Strong action verbs at the beginning of bullet points make your accomplishments more impactful and engaging.',
    'Add a professional summary': 'A compelling summary at the top helps recruiters quickly understand your value proposition and career goals.',
    'Good structure, could improve spacing': 'Proper spacing and formatting improve readability and create a professional appearance.',
    'Well-organized skills section': 'A well-structured skills section helps recruiters quickly identify your key competencies.',
    'Strong experience descriptions': 'Detailed experience descriptions with specific examples demonstrate your capabilities and achievements.'
  };
  
  return explanations[suggestion] || 'This improvement will help make your resume more effective and increase your chances of getting interviews.';
};

export default SuggestionsPanel; 