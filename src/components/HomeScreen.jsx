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
    }}>
      <h1 style={{ color: 'white', marginBottom: 40 }}>Choisissez un mode de jeu</h1>
      <div style={{ display: 'flex', gap: 32 }}>
        {Object.entries(GAME_MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onSelectMode(key)}
            style={{
              padding: '30px 40px',
              fontSize: '1.5em',
              borderRadius: '25px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'background 0.2s',
            }}
          >
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
} 