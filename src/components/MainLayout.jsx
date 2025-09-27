import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <div>
      <header style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
        <nav>
          <Link to="/" style={{ marginRight: '1rem' }}>{t('homeLink')}</Link>
          <Link to="/history" style={{ marginRight: '1rem' }}>{t('historyLink', 'History')}</Link> 
          <Link to="/login">{t('loginLink')}</Link>
          <Link to="/register" style={{ marginLeft: '1rem' }}>{t('registerLink')}</Link>
        </nav>
        <LanguageSwitcher />
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
      <footer style={{ padding: '1rem', background: '#f0f0f0', textAlign: 'center' }}>
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
};

export default MainLayout;