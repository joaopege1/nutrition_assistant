import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleToggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <button
      onClick={handleToggleLanguage}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontSize: '16px',
        color: isDarkMode ? '#fbbf24' : '#374151',
        backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(55, 65, 81, 0.1)',
        minWidth: '40px',
        minHeight: '40px',
        fontWeight: '600'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(55, 65, 81, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(55, 65, 81, 0.1)';
      }}
      title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      {language === 'pt' ? '🇧🇷' : '🇺🇸'}
    </button>
  );
};

export default LanguageSelector;
