import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Router>
      <div className="p-4">
        <h1 className="text-blue-500">{t('welcome')}</h1>
        <button onClick={() => switchLanguage('en')}>English</button>
        <button onClick={() => switchLanguage('ar')}>العربية</button>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
