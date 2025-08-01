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
      background: 'repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(107, 144, 128, 0.08) 30px, rgba(107, 144, 128, 0.08) 31px), repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(107, 144, 128, 0.08) 30px, rgba(107, 144, 128, 0.08) 31px)',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Main title with responsive typography */}
      <h1 style={{ 
        color: '#495057',                 // Dark gray text - new charte
        marginBottom: '40px',
        fontSize: window.innerWidth <= 768 ? '2em' : '3em',  // Smaller text on mobile
        textAlign: 'center',
        padding: '0 20px',                // Horizontal padding for mobile
        fontWeight: '600',                // Semi-bold for better hierarchy
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <span style={{ fontSize: '1.2em' }}>🌍</span>
        Mini jeu Géographie
        <span style={{ fontSize: '1.2em' }}>🗺️</span>
      </h1>
      
      {/* Subtitle */}
      <p style={{
        color: '#6C757D',                 // Medium gray - new charte
        fontSize: '1.2em',
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '600px',
        lineHeight: '1.6'
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
            borderRadius: '16px',         // More rounded corners - new charte
            backgroundColor: '#E9ECEF',   // Light gray background - new charte
            color: '#495057',             // Dark gray text - new charte
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  // Subtle shadow - new charte
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            e.target.style.backgroundColor = '#DEE2E6';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            e.target.style.backgroundColor = '#E9ECEF';
          }}
        >
          <span style={{ marginRight: '12px', fontSize: '1.5em', pointerEvents: 'none' }}>
            🧭
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
            borderRadius: '16px',         // More rounded corners - new charte
            backgroundColor: '#6B9080',   // Sage green - new charte (primary button)
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
            boxShadow: '0 2px 8px rgba(107, 144, 128, 0.2)',  // Subtle shadow - new charte
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 16px rgba(107, 144, 128, 0.3)';
            e.target.style.backgroundColor = '#5A7A6B';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(107, 144, 128, 0.2)';
            e.target.style.backgroundColor = '#6B9080';
          }}
        >
          <span style={{ marginRight: '12px', fontSize: '1.5em', pointerEvents: 'none' }}>
            🌐
          </span>
          Mode Multijoueur
        </button>
      </div>

      {/* Footer note */}
      <p style={{
        color: '#6C757D',                 // Medium gray - new charte
        marginTop: '60px',
        textAlign: 'center',
        fontSize: '1em',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        <strong style={{ color: '#495057' }}>Mode Solo :</strong> Jouez seul et améliorez vos connaissances<br/>
        <strong style={{ color: '#495057' }}>Mode Multijoueur :</strong> Jouez à 2 avec tours alternés en temps réel !
      </p>

      {/* Footer géographique */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        display: 'flex',
        gap: '20px',
        fontSize: '1.2em',
        opacity: '0.6',
        color: '#6C757D'
      }}>
        <span>🏛️</span>
        <span>🗼</span>
        <span>🌍</span>
        <span>🗺️</span>
        <span>🏁</span>
      </div>
    </div>
  );
} 