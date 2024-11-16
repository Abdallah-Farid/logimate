import './App.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-4">
      <h1 className="text-blue-500">{t('welcome')}</h1>
      <button onClick={() => switchLanguage('en')}>English</button>
      <button onClick={() => switchLanguage('ar')}>العربية</button>
    </div>
  );
}

export default App;
