import React from "react";
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadView from './views/UploadView';
import CompareView from './views/CompareView';
import VersionsView from './views/VersionsView';
import AuthView from './views/AuthView';
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileView from './views/ProfileView';
import Home from "./components/Home/Home";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";

const AppContent = () => {
  const [currentView, setCurrentView] = React.useState('home');
  const { isAuthenticated, loading } = useAuth();

  const renderView = () => {
    // Show auth view if not authenticated and trying to access protected routes
    if (!isAuthenticated && currentView !== 'home' && currentView !== 'auth') {
      return <AuthView onAuthSuccess={() => setCurrentView('home')} />;
    }

    switch (currentView) {
      case 'auth':
        return <AuthView onAuthSuccess={() => setCurrentView('home')} />;
      case 'profile':
        return isAuthenticated ? <ProfileView /> : <AuthView onAuthSuccess={() => setCurrentView('home')} />;
      case 'upload':
        return <UploadView />;
      case 'compare':
        return <CompareView />;
      case 'versions':
        return <VersionsView />;
      default:
        return (
          <main className="flex-1 pt-16 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to ResumeChecker
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your resume and get instant feedback to improve your chances of landing your dream job.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => setCurrentView('upload')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Upload Resume
                </button>
                <button 
                  onClick={() => setCurrentView('compare')}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium text-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Compare Versions
                </button>
                <button 
                  onClick={() => setCurrentView('versions')}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium text-lg hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  View All Versions
                </button>
              </div>
            </div>
          </main>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col">
      <Navbar onNavigate={setCurrentView} currentView={currentView} />
        <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<LoginForm />}/>
        <Route path='/signup' element={<SignupForm />}/>
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
