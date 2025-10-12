import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
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
                fontSize: '20px',
                color: isDarkMode ? '#fbbf24' : '#374151',
                backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(55, 65, 81, 0.1)',
                minWidth: '40px',
                minHeight: '40px'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(55, 65, 81, 0.2)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(55, 65, 81, 0.1)';
            }}
            title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
