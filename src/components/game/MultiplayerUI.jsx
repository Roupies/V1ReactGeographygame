// Multiplayer-specific UI components
// Handles turn indicators, player scores, waiting room, and game messages
import React, { useState, useEffect, useRef } from 'react';

// Waiting room component - shows while waiting for players to ready up
export function WaitingRoom({ gameState, currentPlayer, onReady, onLeave, roomId }) {
  const allPlayers = Object.values(gameState.players || {});
  const players = allPlayers.filter(player => player && player.id); // Only valid players with IDs
  
  const canStart = players.length === 2 && 
                   players.every(p => p.isReady);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#183040',
      padding: '20px',
      color: 'white'
    }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2.5em' }}>
        Salle d'attente
      </h1>

      {/* Room ID */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        textAlign: 'center',
        minWidth: '400px'
      }}>
        <h3 style={{ marginBottom: '10px', color: '#28a745' }}>
          🏠 ID de la Room
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '15px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '1.2em',
          fontWeight: 'bold',
          color: '#fff',
          userSelect: 'all'
        }}>
          {roomId || 'Chargement...'}
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#ccc' }}>
          {roomId ? 'Partagez cet ID avec votre adversaire' : 'Connexion en cours...'}
        </p>
      </div>

      {/* Players list */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        minWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          Joueurs ({players.length}/2)
        </h2>
        {players.map(player => (
          <div key={player.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            background: player.id === currentPlayer?.id ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            marginBottom: '10px',
            border: player.id === currentPlayer?.id ? '2px solid #28a745' : 'none'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
              {player.name} {player.id === currentPlayer?.id && '(Vous)'}
            </span>
            <span style={{
              color: player.isReady ? '#28a745' : '#ffc107',
              fontWeight: 'bold'
            }}>
              {player.isReady ? '✅ Prêt' : '⏳ En attente'}
            </span>
          </div>
        ))}
      </div>

      {/* Ready button */}
      {currentPlayer && !currentPlayer.isReady && (
        <button
          onClick={onReady}
          style={{
            padding: '15px 30px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            borderRadius: '15px',
            border: 'none',
            background: '#28a745',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Prêt !
        </button>
      )}

      {/* Status message */}
      {canStart && (
        <div style={{
          color: '#28a745',
          fontSize: '1.2em',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          🎮 La partie va commencer !
        </div>
      )}

      {players.length < 2 && (
        <div style={{
          color: '#ffc107',
          fontSize: '1.1em',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          En attente d'un autre joueur...
        </div>
      )}

      {/* Leave button */}
      <button
        onClick={onLeave}
        style={{
          padding: '12px 25px',
          fontSize: '1em',
          borderRadius: '12px',
          border: 'none',
          background: '#dc3545',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Quitter la partie
      </button>
    </div>
  );
}

// Turn indicator component - shows whose turn it is
export function TurnIndicator({ gameState, isMyTurn, currentPlayer }) {
  const currentTurnPlayer = gameState.players[gameState.currentTurn];
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: isMyTurn ? '#28a745' : '#ffc107',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '15px',
      fontWeight: 'bold',
      fontSize: '1.1em',
      zIndex: 1000,
      animation: isMyTurn ? 'pulse 1.5s infinite' : 'none'
    }}>
      {isMyTurn ? 
        `🎯 Votre tour (${gameState.turnTimeLeft}s)` : 
        `⏳ Tour de ${currentTurnPlayer?.name || 'Adversaire'} (${gameState.turnTimeLeft}s)`
      }
    </div>
  );
}

// Player scores component - shows current scores and stats
export function PlayerScores({ gameState, currentPlayer }) {
  const players = Object.values(gameState.players);
  
  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '15px',
      minWidth: '200px',
      zIndex: 999
    }}>
      <h3 style={{ 
        color: 'white', 
        margin: '0 0 15px 0', 
        textAlign: 'center',
        fontSize: '1.1em'
      }}>
        Scores
      </h3>
      {players.map(player => (
        <div key={player.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: player.id === currentPlayer?.id ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '8px',
          border: player.id === currentPlayer?.id ? '1px solid #28a745' : 'none'
        }}>
          <span style={{ 
            color: 'white', 
            fontWeight: player.id === currentPlayer?.id ? 'bold' : 'normal',
            fontSize: '0.95em'
          }}>
            {player.name} {player.id === currentPlayer?.id && '(Vous)'}
          </span>
          <span style={{ 
            color: '#ffd700', 
            fontWeight: 'bold',
            fontSize: '1em'
          }}>
            {player.score}
          </span>
        </div>
      ))}
      
      {/* Game progress */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ccc', fontSize: '0.9em' }}>
          Tour {gameState.turnNumber} / {gameState.maxTurns}
        </div>
        <div style={{ color: '#ccc', fontSize: '0.9em' }}>
          {gameState.guessedCountries.length} / {gameState.totalCountries} trouvés
        </div>
      </div>
    </div>
  );
}

// Game messages component - shows real-time game events and chat
export function GameMessages({ messages, style = {}, onSendMessage, currentPlayer }) {
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Messages pré-enregistrés
  const predefinedMessages = [
    "On recommence ?",
    "Tu y es presque !",
    "Bien joué!",
    "Pas cette fois..."
  ];

  const handleSendMessage = () => {
    if (chatInput.trim() && onSendMessage) {
      onSendMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handlePredefinedMessage = (message) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      maxWidth: '350px',
      maxHeight: showChat ? '400px' : '200px',
      background: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '15px',
      padding: '15px',
      zIndex: 999,
      transition: 'all 0.3s ease',
      ...style
    }}>
      {/* Header avec toggle pour le chat */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #444',
        paddingBottom: '10px'
      }}>
        <h4 style={{ 
          color: 'white', 
          margin: '0', 
          fontSize: '1em'
      }}>
        Messages
      </h4>
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            background: showChat ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '5px 10px',
            fontSize: '0.8em',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {showChat ? 'Fermer' : 'Chat'}
        </button>
      </div>

      {/* Messages pré-enregistrés - toujours visibles */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {predefinedMessages.map((message, index) => (
          <button
            key={index}
            onClick={() => handlePredefinedMessage(message)}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '6px 12px',
              fontSize: '0.8em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0056b3'}
            onMouseLeave={(e) => e.target.style.background = '#007bff'}
          >
            {message}
          </button>
        ))}
      </div>

      {/* Zone de chat - visible quand showChat est true */}
      {showChat && (
        <div style={{
          borderTop: '1px solid #444',
          paddingTop: '10px',
          marginTop: '10px'
        }}>
          {/* Input pour le chat libre */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #555',
                background: '#333',
                color: 'white',
                fontSize: '0.9em'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              style={{
                background: chatInput.trim() ? '#28a745' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 15px',
                fontSize: '0.9em',
                cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* Liste des messages */}
      <div style={{ 
        maxHeight: showChat ? '200px' : '100px', 
        overflowY: 'auto',
        fontSize: '0.9em'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            Aucun message
          </div>
        ) : (
          messages.slice(-10).map((message, index) => (
            <div key={`${index}-${message.timestamp}`} style={{
              color: getMessageColor(message.type),
              marginBottom: '5px',
              lineHeight: '1.3',
              padding: '3px 0'
            }}>
              <span style={{ color: '#888', fontSize: '0.8em' }}>
                {message.timestamp}
              </span>{' '}
              {message.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// Room info component - shows room ID and connection status
export function RoomInfo({ room, onLeave }) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      padding: '10px 15px',
      color: 'white',
      fontSize: '0.9em',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '5px' }}>
        🏠 Room: <strong>{room?.id}</strong>
      </div>
      <button
        onClick={onLeave}
        style={{
          padding: '5px 10px',
          fontSize: '0.8em',
          borderRadius: '5px',
          border: 'none',
          background: '#dc3545',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Quitter
      </button>
    </div>
  );
}

// Utility function to get message color based on type
function getMessageColor(type) {
  switch (type) {
    case 'success': return '#28a745';
    case 'error': return '#dc3545';
    case 'warning': return '#ffc107';
    case 'chat': return '#ffffff';
    case 'info': 
    default: return '#17a2b8';
  }
}

// Game end modal for multiplayer
export function MultiplayerEndModal({ lastAction, gameState, onRestart, onLeave }) {
  if (!gameState.gameEnded) return null;

  const players = Object.values(gameState.players);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  // Déterminer le vainqueur (le joueur avec le plus de points)
  const winner = sortedPlayers.length > 0 ? sortedPlayers[0] : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          🎉 Partie terminée !
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
            🏆 Vainqueur : {winner ? winner.name : 'Aucun vainqueur'}
          </h3>
          
          <div style={{ textAlign: 'left' }}>
            {sortedPlayers.map((player, index) => (
              <div key={player.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                background: index === 0 ? '#fff3cd' : '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '8px',
                border: index === 0 ? '2px solid #ffc107' : '1px solid #dee2e6'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {index + 1}. {player.name}
                </span>
                <span>
                  {player.score} points ({player.correctAnswers}/{player.totalAttempts})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onRestart}
            style={{
              padding: '12px 25px',
              fontSize: '1.1em',
              borderRadius: '10px',
              border: 'none',
              background: '#28a745',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Rejouer
          </button>
          <button
            onClick={onLeave}
            style={{
              padding: '12px 25px',
              fontSize: '1.1em',
              borderRadius: '10px',
              border: 'none',
              background: '#6c757d',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
} 