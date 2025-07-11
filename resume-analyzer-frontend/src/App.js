// App.jsx

import React, { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';

import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import UploadView from './views/UploadView';
import ResultView from './views/ResultView';

const PrivateRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>
    );
  }

  return authUser ? children : <Navigate to="/login" replace />;
};

function App() {
  const { checkAuth } = useAuthStore();

useEffect(() => {
  checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/upload" element={
          <PrivateRoute>
            <UploadView />
          </PrivateRoute>
        } />
        <Route path="/results" element={
          <PrivateRoute>
            <ResultView />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/upload" />} />
      </Routes>
    </Router>
  );
}

export default App;
