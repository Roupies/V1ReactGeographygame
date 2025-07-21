// Home screen component for game mode selection
// Provides an attractive landing page with responsive design and mode selection buttons
import React from 'react';
import { GAME_MODES } from '../data/gameModes';

// Main home screen component - renders mode selection interface
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
        Choisissez un mode de jeu
      </h1>
      
      {/* Game mode type selection */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          fontSize: '1.5em',
          textAlign: 'center',
          margin: 0
        }}>
          Solo
        </h2>
        <h2 style={{ 
          color: '#28a745', 
          fontSize: '1.5em',
          textAlign: 'center',
          margin: 0
        }}>
          Multijoueur
        </h2>
      </div>
      
      {/* Mode selection buttons container with responsive layout */}
      <div style={{ 
        display: 'flex', 
        gap: window.innerWidth <= 768 ? '16px' : '32px',     // Smaller gap on mobile
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row', // Stack vertically on phones
        width: '100%',
        maxWidth: window.innerWidth <= 480 ? '300px' : '800px',     // Constrain width
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Dynamic button generation from game modes configuration */}
        {Object.entries(GAME_MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onSelectMode(key)}           // Call parent function with mode key
            style={{
              // Responsive padding based on screen size
              padding: window.innerWidth <= 480 ? '20px 30px' : 
                      window.innerWidth <= 768 ? '25px 35px' : '30px 40px',
              // Responsive font size
              fontSize: window.innerWidth <= 480 ? '1.2em' : 
                       window.innerWidth <= 768 ? '1.3em' : '1.5em',
              borderRadius: '25px',               // Rounded corners
              border: 'none',
              background: '#007bff',              // Bootstrap primary blue
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)', // Subtle shadow
              transition: 'background 0.2s, transform 0.1s', // Smooth animations
              // Responsive width: full width on mobile, auto on larger screens
              width: window.innerWidth <= 480 ? '100%' : 'auto',
              minWidth: window.innerWidth <= 768 ? '200px' : '250px',
              textAlign: 'center'
            }}
            // Hover effects for better user interaction feedback
            onMouseOver={(e) => {
              e.target.style.background = '#0056b3';     // Darker blue on hover
              e.target.style.transform = 'translateY(-2px)'; // Slight lift effect
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#007bff';     // Return to original color
              e.target.style.transform = 'translateY(0)'; // Return to original position
            }}
          >
            {config.label}                        {/* Display mode name from configuration */}
          </button>
        ))}
      </div>
      
      {/* Multiplayer section */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={onSelectMultiplayer}
          style={{
            padding: window.innerWidth <= 480 ? '20px 40px' : '25px 50px',
            fontSize: window.innerWidth <= 480 ? '1.3em' : '1.6em',
            borderRadius: '25px',
            border: 'none',
            background: '#28a745',              // Green for multiplayer
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'background 0.2s, transform 0.1s',
            width: window.innerWidth <= 480 ? '100%' : 'auto',
            maxWidth: '300px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#1e7e34';     // Darker green on hover
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#28a745';     // Return to original green
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🎮 Multijoueur (2 joueurs)
        </button>
      </div>
    </div>
  );
} 