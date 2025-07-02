import React from 'react';
import { GAME_MODES } from '../data/gameModes';

export default function HomeScreen({ onSelectMode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#183040',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ 
        color: 'white', 
        marginBottom: '40px',
        fontSize: window.innerWidth <= 768 ? '2em' : '3em',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        Choisissez un mode de jeu
      </h1>
      <div style={{ 
        display: 'flex', 
        gap: window.innerWidth <= 768 ? '16px' : '32px',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
        width: '100%',
        maxWidth: window.innerWidth <= 480 ? '300px' : '800px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {Object.entries(GAME_MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onSelectMode(key)}
            style={{
              padding: window.innerWidth <= 480 ? '20px 30px' : 
                      window.innerWidth <= 768 ? '25px 35px' : '30px 40px',
              fontSize: window.innerWidth <= 480 ? '1.2em' : 
                       window.innerWidth <= 768 ? '1.3em' : '1.5em',
              borderRadius: '25px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'background 0.2s, transform 0.1s',
              width: window.innerWidth <= 480 ? '100%' : 'auto',
              minWidth: window.innerWidth <= 768 ? '200px' : '250px',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#0056b3';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
} 