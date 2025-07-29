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
      background: '#183040',
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
          borderRadius: '20px',
          border: 'none',
          background: '#6c757d',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1em'
        }}
      >
        ← Retour
      </button>

      {/* Title */}
      <h1 style={{ 
        color: 'white', 
        marginBottom: '30px',
        fontSize: window.innerWidth <= 768 ? '2em' : '2.5em',
        textAlign: 'center'
      }}>
        Multijoueur
      </h1>

      {/* Selected mode indicator */}
      <div style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '20px',
        marginBottom: '30px',
        fontSize: '1.1em',
        fontWeight: 'bold'
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
            borderRadius: '20px',
            border: 'none',
            background: mode === 'create' ? '#28a745' : '#6c757d',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          Créer une partie
        </button>
        <button
          onClick={() => setMode('join')}
          style={{
            padding: '15px 30px',
            borderRadius: '20px',
            border: 'none',
            background: mode === 'join' ? '#28a745' : '#6c757d',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
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
            color: 'white', 
            fontSize: '1.1em',
            marginBottom: '10px',
            display: 'block'
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
              borderRadius: '8px',
              border: 'none',
              fontSize: '1em'
            }}
          />
        </div>

        {mode === 'join' && (
          <div>
            <label style={{ 
              color: 'white', 
              fontSize: '1.1em',
              marginBottom: '10px',
              display: 'block'
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
                borderRadius: '8px',
                border: 'none',
                fontSize: '1em'
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isConnecting}
          style={{
            padding: '15px',
            borderRadius: '8px',
            border: 'none',
            background: isConnecting ? '#6c757d' : '#28a745',
            color: 'white',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {isConnecting ? 'Connexion...' : (mode === 'create' ? 'Créer la partie' : 'Rejoindre la partie')}
        </button>

        {connectionError && (
      <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '5px',
        textAlign: 'center'
      }}>
            Erreur : {connectionError}
      </div>
        )}
      </form>
    </div>
  );
} 