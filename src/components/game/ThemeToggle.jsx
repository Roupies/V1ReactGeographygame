// Theme toggle button component
import React from 'react';

const ThemeToggle = ({ isDarkMode, onToggle, theme }) => {
    return (
        <button
            onClick={onToggle}
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: `2px solid ${theme?.colors?.themeToggleBorder || '#e0e0e0'}`,
                backgroundColor: theme?.colors?.themeToggleBg || '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                zIndex: 1000
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
        >
            {isDarkMode ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle; 