// Home screen component for game mode selection
// Provides an attractive landing page with responsive design and mode selection buttons
import React from 'react';

// Main home screen component - simplified to just Solo vs Multiplayer choice
export default function HomeScreen({ onSelectMode, onSelectMultiplayer }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',                    // Full viewport height
      background: '#183040',              // Dark blue background
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Main title with responsive typography */}
      <h1 style={{ 
        color: 'white', 
        marginBottom: '40px',
        fontSize: window.innerWidth <= 768 ? '2em' : '3em',  // Smaller text on mobile
        textAlign: 'center',
        padding: '0 20px'                 // Horizontal padding for mobile
      }}>
        Mini jeu Géographie
      </h1>
      
      {/* Subtitle */}
      <p style={{
        color: '#ccc',
        fontSize: '1.2em',
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '600px'
      }}>
        Testez vos connaissances géographiques !
      </p>
      
      {/* Game mode selection buttons */}
      <div style={{
        display: 'flex',
        gap: '30px',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
      }}>
        {/* Solo Mode Button */}
        <button
          onClick={() => onSelectMode('solo')}
          style={{
            padding: '20px 40px',
            fontSize: '1.3em',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#4169E1',
            background: 'linear-gradient(45deg, #4169E1, #5a7bff)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '80px',
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(65, 105, 225, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(65, 105, 225, 0.5)';
            e.target.style.filter = 'brightness(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(65, 105, 225, 0.3)';
            e.target.style.filter = 'brightness(1)';
          }}
        >
          <span style={{ marginRight: '12px', fontSize: '1.5em' }}>
            🎯
          </span>
          Mode Solo
        </button>

        {/* Multiplayer Mode Button */}
        <button
          onClick={() => onSelectMultiplayer('multiplayer')}
          style={{
            padding: '20px 40px',
            fontSize: '1.3em',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#28a745',
            background: 'linear-gradient(45deg, #28a745, #32c252)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '80px',
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.5)';
            e.target.style.filter = 'brightness(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
            e.target.style.filter = 'brightness(1)';
          }}
        >
          <span style={{ marginRight: '12px', fontSize: '1.5em' }}>
            🎮
          </span>
          Mode Multijoueur
        </button>
      </div>

      {/* Footer note */}
      <p style={{
        color: '#aaa',
        marginTop: '60px',
        textAlign: 'center',
        fontSize: '1em',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        <strong>Mode Solo :</strong> Jouez seul et améliorez vos connaissances<br/>
        <strong>Mode Multijoueur :</strong> Jouez à 2 avec tours alternés en temps réel !
      </p>
    </div>
  );
} 