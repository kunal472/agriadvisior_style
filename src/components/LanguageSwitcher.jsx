import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div>
      <select onChange={handleLanguageChange} value={i18n.language}>
        <option value="en">English</option>
        <option value="mr">मराठी (Marathi)</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;