// Lobby screen component for multiplayer room management
// Allows players to create new rooms or join existing ones
import React, { useState } from 'react';

export default function LobbyScreen({ onCreateRoom, onJoinRoom, onBack, isConnecting, connectionError }) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState('create'); // 'create' or 'join'

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('Veuillez entrer votre nom');
      return;
    }

    if (mode === 'create') {
      onCreateRoom(playerName.trim());
    } else {
      if (!roomId.trim()) {
        alert('Veuillez entrer l\'ID de la room');
        return;
      }
      onJoinRoom(roomId.trim(), playerName.trim());
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
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Player name input */}
        <div>
          <label style={{ 
            color: 'white', 
            marginBottom: '8px', 
            display: 'block',
            fontSize: '1.1em'
          }}>
            Votre nom :
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Entrez votre nom"
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1em',
              outline: 'none'
            }}
            maxLength={20}
            disabled={isConnecting}
          />
        </div>

        {/* Room ID input (only for join mode) */}
        {mode === 'join' && (
          <div>
            <label style={{ 
              color: 'white', 
              marginBottom: '8px', 
              display: 'block',
              fontSize: '1.1em'
            }}>
              ID de la room :
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Entrez l'ID de la room"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1em',
                outline: 'none'
              }}
              disabled={isConnecting}
            />
          </div>
        )}

        {/* Error message */}
        {connectionError && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255, 107, 107, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '1em'
          }}>
            {connectionError}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isConnecting || !playerName.trim() || (mode === 'join' && !roomId.trim())}
          style={{
            padding: '15px',
            borderRadius: '10px',
            border: 'none',
            background: isConnecting ? '#6c757d' : '#28a745',
            color: 'white',
            fontSize: '1.2em',
            fontWeight: 'bold',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            opacity: isConnecting ? 0.7 : 1
          }}
        >
          {isConnecting ? 'Connexion...' : 
           mode === 'create' ? 'Créer la partie' : 'Rejoindre la partie'}
        </button>
      </form>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          Comment jouer :
        </h3>
        <ul style={{ 
          color: '#ccc', 
          textAlign: 'left', 
          lineHeight: '1.6',
          fontSize: '0.95em' 
        }}>
          <li>Partie à 2 joueurs avec tours alternés</li>
          <li>Chaque joueur a 30 secondes par tour</li>
          <li>Devinez le pays/région qui apparaît en rouge</li>
          <li>Points bonus pour les bonnes réponses</li>
          <li>Utilisez "Passer" si vous ne savez pas</li>
        </ul>
      </div>
    </div>
  );
} 