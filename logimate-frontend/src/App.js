import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import NotificationsPage from './pages/NotificationsPage';
import Navbar from './components/Navbar';

// Simple auth check
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="absolute top-4 right-4 space-x-2">
          <button 
            onClick={() => switchLanguage('en')}
            className="px-3 py-1 text-sm bg-white rounded shadow hover:bg-gray-50"
          >
            English
          </button>
          <button 
            onClick={() => switchLanguage('ar')}
            className="px-3 py-1 text-sm bg-white rounded shadow hover:bg-gray-50"
          >
            العربية
          </button>
        </div>

        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
