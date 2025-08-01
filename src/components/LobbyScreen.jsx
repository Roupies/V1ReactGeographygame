// Lobby screen for multiplayer game setup
import React, { useState } from 'react';

export default function LobbyScreen({ onCreateRoom, onJoinRoom, onBack, isConnecting, connectionError, selectedMode }) {
  const [mode, setMode] = useState('create');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName, selectedMode);
    }
  };
  
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      onJoinRoom(roomId, playerName);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(107, 144, 128, 0.08) 30px, rgba(107, 144, 128, 0.08) 31px), repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(107, 144, 128, 0.08) 30px, rgba(107, 144, 128, 0.08) 31px)',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          borderRadius: '16px',            // Rounded corners - new charte
          border: 'none',
          background: '#E9ECEF',           // Light gray - new charte
          color: '#495057',                // Dark gray text - new charte
          cursor: 'pointer',
          fontSize: '1em',
          fontWeight: '500',               // Medium weight - new charte
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#DEE2E6';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#E9ECEF';
        }}
      >
        ← Retour
      </button>

      {/* Title */}
      <h1 style={{ 
        color: '#495057',                  // Dark gray - new charte
        marginBottom: '30px',
        fontSize: window.innerWidth <= 768 ? '2em' : '2.5em',
        textAlign: 'center',
        fontWeight: '600'                  // Semi-bold - new charte
      }}>
        Multijoueur
      </h1>

      {/* Selected mode indicator */}
      <div style={{
        backgroundColor: '#6B9080',        // Sage green - new charte
        color: 'white',
        padding: '8px 20px',
        borderRadius: '20px',
        marginBottom: '30px',
        fontSize: '1.1em',
        fontWeight: '500'                  // Medium weight - new charte
      }}>
        Mode : {selectedMode}
      </div>

      {/* Mode selection */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
      }}>
        <button
          onClick={() => setMode('create')}
          style={{
            padding: '15px 30px',
            borderRadius: '16px',          // Rounded corners - new charte
            border: 'none',
            background: mode === 'create' ? '#6B9080' : '#E9ECEF',  // Sage green when active, light gray when inactive
            color: mode === 'create' ? 'white' : '#495057',         // White when active, dark gray when inactive
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: '500',             // Medium weight - new charte
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (mode !== 'create') {
              e.target.style.backgroundColor = '#DEE2E6';
            }
          }}
          onMouseOut={(e) => {
            if (mode !== 'create') {
              e.target.style.backgroundColor = '#E9ECEF';
            }
          }}
        >
          Créer une partie
        </button>
        <button
          onClick={() => setMode('join')}
          style={{
            padding: '15px 30px',
            borderRadius: '16px',          // Rounded corners - new charte
            border: 'none',
            background: mode === 'join' ? '#6B9080' : '#E9ECEF',    // Sage green when active, light gray when inactive
            color: mode === 'join' ? 'white' : '#495057',           // White when active, dark gray when inactive
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: '500',             // Medium weight - new charte
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (mode !== 'join') {
              e.target.style.backgroundColor = '#DEE2E6';
            }
          }}
          onMouseOut={(e) => {
            if (mode !== 'join') {
              e.target.style.backgroundColor = '#E9ECEF';
            }
          }}
        >
          Rejoindre une partie
        </button>
      </div>

      {/* Form */}
      <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div>
          <label style={{ 
            color: '#495057',              // Dark gray - new charte
            fontSize: '1.1em',
            marginBottom: '10px',
            display: 'block',
            fontWeight: '500'              // Medium weight - new charte
          }}>
            Votre nom :
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Entrez votre nom"
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',        // Rounded corners - new charte
              border: '1px solid #DEE2E6', // Light border - new charte
              fontSize: '1em',
              backgroundColor: 'white',
              color: '#495057',            // Dark gray text - new charte
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6B9080';
              e.target.style.boxShadow = '0 0 0 2px rgba(107, 144, 128, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#DEE2E6';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {mode === 'join' && (
          <div>
            <label style={{ 
              color: '#495057',            // Dark gray - new charte
              fontSize: '1.1em',
              marginBottom: '10px',
              display: 'block',
              fontWeight: '500'            // Medium weight - new charte
            }}>
              ID de la room :
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Entrez l'ID de la room"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',      // Rounded corners - new charte
                border: '1px solid #DEE2E6', // Light border - new charte
                fontSize: '1em',
                backgroundColor: 'white',
                color: '#495057',          // Dark gray text - new charte
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6B9080';
                e.target.style.boxShadow = '0 0 0 2px rgba(107, 144, 128, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#DEE2E6';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isConnecting}
          style={{
            padding: '15px',
            borderRadius: '12px',          // Rounded corners - new charte
            border: 'none',
            background: isConnecting ? '#E9ECEF' : '#6B9080',  // Light gray when connecting, sage green when ready
            color: isConnecting ? '#6C757D' : 'white',         // Medium gray when connecting, white when ready
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: '500',             // Medium weight - new charte
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            if (!isConnecting) {
              e.target.style.backgroundColor = '#5A7A6B';
            }
          }}
          onMouseOut={(e) => {
            if (!isConnecting) {
              e.target.style.backgroundColor = '#6B9080';
            }
          }}
        >
          {isConnecting ? 'Connexion...' : (mode === 'create' ? 'Créer la partie' : 'Rejoindre la partie')}
        </button>

        {connectionError && (
          <div style={{
            color: '#721C24',              // Dark red - new charte
            backgroundColor: '#F8D7DA',    // Light red background - new charte
            padding: '12px',
            borderRadius: '12px',          // Rounded corners - new charte
            textAlign: 'center',
            border: '1px solid #F5C6CB'    // Light red border - new charte
          }}>
            Erreur : {connectionError}
          </div>
        )}
      </form>
    </div>
  );
} 