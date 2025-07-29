// Hook for multiplayer functionality using Colyseus
// Handles room connection, game state synchronization, and turn-based gameplay
import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from 'colyseus.js';
import { GameState } from '../schemas/GameState.js';

const SERVER_URL = 'ws://localhost:2567';

export const useMultiplayer = () => {
    // Connection state - create client with better error handling
    const [client] = useState(() => {
        const c = new Client(SERVER_URL);
        
        // Enhanced error handling for schema issues
        c.onError = (error) => {
            console.error('Client error:', error);
            if (error.message && error.message.includes('rootType')) {
                console.warn('Schema error detected - this may be due to HMR. Try refreshing the page.');
            }
        };
        
        c.onOpen = () => {
            console.log('Client connected successfully to', SERVER_URL);
        };
        
        c.onClose = (code, reason) => {
            console.log('Client disconnected:', code, reason);
        };
        
        return c;
    });
    const [room, setRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    
    // Player state
    const [playerId, setPlayerId] = useState(null);
    const [playerName, setPlayerName] = useState('');
    
    // Game state
    const [gameState, setGameState] = useState({
        players: {},
        gameStarted: false,
        gameEnded: false,
        currentTurn: '',
        currentCountry: null,
        remainingCountries: [],
        guessedCountries: [],
        turnTimeLeft: 30,
        gameMode: 'europe',
        totalCountries: 0,
        turnNumber: 1,
        maxTurns: 20
    });
    
    // Game messages and feedback
    const [gameMessages, setGameMessages] = useState([]);
    const [lastAction, setLastAction] = useState(null);
    
    // Ref to track if cleanup has been called
    const cleanupRef = useRef(false);
    
    // Ref to track message ID counter
    const messageIdCounter = useRef(0);
    
    // Add a message to the game log
    const addMessage = useCallback((message, type = 'info', sender = null) => {
        const timestamp = new Date().toLocaleTimeString();
        messageIdCounter.current += 1;
        setGameMessages(prev => [...prev.slice(-9), { 
            text: message, 
            type, 
            timestamp,
            id: messageIdCounter.current,
            sender: sender || 'system'
        }]);
    }, []);
    
    // Send chat message
    const sendChatMessage = useCallback((message) => {
        if (room && message.trim()) {
            room.send('chat', { text: message.trim() });
        }
    }, [room]);
    
    // Setup room event handlers
    const setupRoomHandlers = useCallback((room) => {
        // Handle state changes with better error handling
        room.onStateChange((state) => {
            try {

                
                // Convert ArraySchema to regular array for guessedCountries
                const newGuessedCountries = (() => {
                    try {
                        if (!state.guessedCountries) return [];
                        if (Array.isArray(state.guessedCountries)) return [...state.guessedCountries];
                        
                        // Convert ArraySchema to regular array and deep clone objects
                        const arr = [];
                        if (typeof state.guessedCountries.forEach === 'function') {
                            state.guessedCountries.forEach(item => {
                                // Deep clone the Colyseus object to a plain JS object
                                // For French regions, use 'code', for Europe use 'isoCode'
                                const plainObject = {
                                    name: item.name,
                                    code: item.code || item.isoCode, // Use code for French regions, isoCode for Europe
                                    isoCode: item.isoCode || item.code // Fallback
                                };
                                arr.push(plainObject);
                            });
                        }
                        return arr;
                    } catch (e) {
                        console.error('Error processing guessedCountries:', e);
                        return [];
                    }
                })();

                // Convert MapSchema to regular object for players
                const newPlayers = (() => {
                    try {
                        if (!state.players) return {};
                        if (typeof state.players === 'object' && !state.players.forEach) return { ...state.players };
                        
                        // Convert MapSchema to regular object
                        const playersObj = {};
                        if (typeof state.players.forEach === 'function') {
                            state.players.forEach((player, key) => {
                                if (player && player.id) {
                                    playersObj[key] = {
                                        id: player.id,
                                        name: player.name,
                                        isReady: player.isReady,
                                        score: player.score
                                    };
                                }
                            });
                        }
                        return playersObj;
                    } catch (e) {
                        console.error('Error processing players:', e);
                        return {};
                    }
                })();
                
                // Convert ArraySchema to regular array for remainingCountries  
                const newRemainingCountries = (() => {
                    try {
                        if (!state.remainingCountries) return [];
                        if (Array.isArray(state.remainingCountries)) return [...state.remainingCountries];
                        
                        const arr = [];
                        if (typeof state.remainingCountries.forEach === 'function') {
                            state.remainingCountries.forEach(item => arr.push(item));
                        }
                        return arr;
                    } catch (e) {
                        console.error('Error processing remainingCountries:', e);
                        return [];
                    }
                })();
                
                setGameState(prev => ({
                    ...prev,
                    players: newPlayers,
                    currentTurn: state.currentTurn,
                    turnTimeLeft: state.turnTimeLeft || 30,
                    turnNumber: state.turnNumber || 1,
                    gameStarted: state.gameStarted || false,
                    gameEnded: state.gameEnded || false,
                    remainingCountries: newRemainingCountries,
                    guessedCountries: newGuessedCountries,
                    currentCountry: state.currentCountryName ? {
                        name: state.currentCountryName,
                        code: state.currentCountryCode,
                        isoCode: state.currentCountryCode
                    } : null,
                    gameMode: state.gameMode
                }));

                // Force reset gameEnded if game is actually running
                if (state.gameStarted && !state.gameEnded) {
                    setGameState(prev => ({
                        ...prev,
                        gameEnded: false
                    }));
                }
                
            } catch (error) {
                console.error('Error in onStateChange:', error);
            }
        });
        
        // Handle player joining
        room.onMessage('joined', (message) => {
            setPlayerId(message.playerId);
            addMessage(`Vous avez rejoint en tant que ${message.playerName}`, 'success');
        });
        
        // Handle welcome message
        room.onMessage('welcome', (message) => {
            setPlayerId(room.sessionId);
            setPlayerName(message.playerName || 'Player');
            addMessage(message.message, 'success');
        });
        
        // Handle room full
        room.onMessage('room_full', (message) => {
            addMessage(message.message, 'info');
        });
        
        // Set player ID immediately when connected
        setPlayerId(room.sessionId);
        
        // Handle game started
        room.onMessage('game_started', (message) => {
            addMessage('Jeu commencé !', 'success');
            addMessage(`Tour de ${message.firstPlayer || 'Quelqu\'un'}`, 'info');
            // Reset gameEnded when game starts
            setGameState(prev => ({
                ...prev,
                gameEnded: false
            }));
        });
        
        // Handle gameStarted message (alternative name)
        room.onMessage('gameStarted', (message) => {
            if (message.gameType === 'race') {
                addMessage('🏁 Course commencée ! Premier à 100 points !', 'success');
                addMessage(`🎯 Objectif: ${message.scoreThreshold} points`, 'info');
            } else {
                addMessage('Jeu commencé !', 'success');
                addMessage(`Tour de ${message.firstPlayer || 'Quelqu\'un'}`, 'info');
            }
            // Reset gameEnded when game starts
            setGameState(prev => ({
                ...prev,
                gameEnded: false
            }));
        });
        
        // Handle newCountry message
        room.onMessage('newCountry', (message) => {
            // Update current country with new data from server
            setGameState(prev => ({
                ...prev,
                currentCountry: message.countryName ? {
                    name: message.countryName,
                    code: message.countryCode,
                    isoCode: message.countryCode
                } : null
            }));
        });
        
        // Handle turnChanged message
        room.onMessage('turnChanged', (message) => {
            addMessage(`Tour de ${message.nextPlayer}`, 'info');
        });
        
        // Handle playerLeft message
        room.onMessage('playerLeft', (message) => {
            addMessage(message.message, 'warning');
        });
        
        // Handle correctAnswer message
        room.onMessage('correctAnswer', (message) => {
            if (message.score !== undefined) {
                addMessage(`${message.playerName} a trouvé ${message.countryName} ! (${message.score} pts)`, 'success');
            } else {
                addMessage(`${message.playerName} a trouvé ${message.countryName} !`, 'success');
            }
        });
        
        // Handle wrongAnswer message
        room.onMessage('wrongAnswer', (message) => {
            if (message.score !== undefined) {
                addMessage(`${message.playerName} s'est trompé : ${message.guess} (${message.score} pts)`, 'error');
            } else {
                addMessage(`${message.playerName} s'est trompé : ${message.guess}`, 'error');
            }
            setLastAction({ type: 'wrong', player: message.player, guess: message.guess });
        });
        
        // Handle playerSkipped message
        room.onMessage('playerSkipped', (message) => {
            addMessage(`${message.playerName} a passé son tour`, 'info');
        });
        
        // Handle gameEnded message
        room.onMessage('gameEnded', (message) => {
            console.log('Game ended message received:', message);
            addMessage(`Jeu terminé : ${message.reason}`, 'info');
            // Update game state to show end modal
            setGameState(prev => ({
                ...prev,
                gameEnded: true
            }));
        });
        
        // Handle gameRestarted message
        room.onMessage('gameRestarted', (message) => {
            addMessage('Jeu relancé !', 'success');
            // Reset gameEnded when game restarts
            setGameState(prev => ({
                ...prev,
                gameEnded: false
            }));
        });
        
        // Handle chatMessage message
        room.onMessage('chatMessage', (message) => {
            addMessage(`${message.playerName}: ${message.message}`, 'chat');
        });
        
        // Handle correct answer
        room.onMessage('correct_answer', (message) => {
            addMessage(`${message.player} correctly guessed ${message.country}! (+10 points)`, 'success');
            setLastAction({ type: 'correct', player: message.player, country: message.country });
        });
        
        // Handle wrong answer
        room.onMessage('wrong_answer', (message) => {
            addMessage(`${message.player} guessed "${message.guess}" - Wrong answer!`, 'error');
            setLastAction({ type: 'wrong', player: message.player, guess: message.guess });
        });
        
        // Handle country skipped
        room.onMessage('country_skipped', (message) => {
            addMessage(`${message.player} skipped ${message.country}`, 'warning');
            setLastAction({ type: 'skip', player: message.player, country: message.country });
        });
        
        // Handle turn switch
        room.onMessage('turn_switched', (message) => {
            const playerName = gameState.players[message.currentTurn]?.name || 'Someone';
            addMessage(`Turn ${message.turnNumber}: ${playerName}'s turn`, 'info');
        });
        
        // Handle game ended
        room.onMessage('game_ended', (message) => {
            addMessage(`Game ended: ${message.reason}`, 'info');
            addMessage(`Winner: ${message.winner}!`, 'success');
            setLastAction({ type: 'gameEnd', winner: message.winner, scores: message.scores });
        });
        
        // Handle game reset
        room.onMessage('game_reset', (message) => {
            addMessage(message.message, 'info');
            setLastAction(null);
        });
        
        // Handle errors
        room.onMessage('error', (message) => {
            addMessage(message.message, 'error');
        });
        
        // Handle chat messages
        room.onMessage('chat_message', (message) => {
            addMessage(`${message.player}: ${message.message}`, 'chat', message.player);
        });
        
        // Handle room leave
        room.onLeave((code) => {
            setIsConnected(false);
            setRoom(null);
            setGameState({
                players: {},
                currentTurn: null,
                gameStarted: false,
                gameEnded: false,
                turnTimeLeft: 30,
                turnNumber: 1,
                remainingCountries: [],
                guessedCountries: [],
                currentCountry: null,
                gameMode: 'europe'
            });
            setLastAction(null);
        });
        
        // Handle room errors
        room.onError((code, message) => {
            console.error('Room error:', code, message);
            setConnectionError(`Room error: ${message}`);
        });
        
    }, [gameState.players, addMessage]);
    
    // Create or join a room
    const createRoom = useCallback(async (playerName, gameMode = 'europe') => {
        if (isConnecting) return;
        
        setIsConnecting(true);
        setConnectionError(null);
        cleanupRef.current = false;
        
        try {

            
            // Add timeout and better error handling
            const newRoom = await Promise.race([
                client.create('geography_room', { 
                    playerName,
                    gameMode 
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection timeout - try refreshing if schema errors persist')), 15000)
                )
            ]);
            
            if (cleanupRef.current) {
                await newRoom.leave();
                return;
            }
            
            // Add error handler for the room itself
            newRoom.onError((code, message) => {
                console.error('Room error:', code, message);
                setConnectionError(`Room error: ${message}`);
            });
            
            setRoom(newRoom);
            setPlayerName(playerName);
            setIsConnected(true);
            addMessage(`Room created! Room ID: ${newRoom.id}`, 'success');
            
            setupRoomHandlers(newRoom);
            
        } catch (error) {
            console.error('Failed to create room:', error);
            if (error.message.includes('rootType')) {
                // Specific handling for schema errors
                setConnectionError('Schema error: Please refresh the page and try again');
                addMessage('Schema error detected. Please refresh the page.', 'error');
            } else {
                setConnectionError(`Failed to create room: ${error.message}`);
                addMessage(`Failed to create room: ${error.message}`, 'error');
            }
        } finally {
            setIsConnecting(false);
        }
    }, [client, isConnecting, addMessage]);
    
    const joinRoom = useCallback(async (roomId, playerName) => {
        if (isConnecting) return;
        
        setIsConnecting(true);
        setConnectionError(null);
        cleanupRef.current = false;
        
        try {

            
            const newRoom = await Promise.race([
                client.joinById(roomId, { playerName }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection timeout')), 10000)
                )
            ]);
            
            if (cleanupRef.current) {
                await newRoom.leave();
                return;
            }
            
            // Add error handler for the room itself
            newRoom.onError((code, message) => {
                console.error('Room error:', code, message);
                setConnectionError(`Room error: ${message}`);
            });
            
            setRoom(newRoom);
            setPlayerName(playerName);
            setIsConnected(true);
            addMessage(`Joined room ${roomId}!`, 'success');
            
            setupRoomHandlers(newRoom);
            
        } catch (error) {
            console.error('Failed to join room:', error);
            if (error.message.includes('rootType')) {
                // Specific handling for schema errors
                setConnectionError('Schema error: Please refresh the page and try again');
                addMessage('Schema error detected. Please refresh the page.', 'error');
            } else {
                setConnectionError(`Failed to join room: ${error.message}`);
                addMessage(`Failed to join room: ${error.message}`, 'error');
            }
        } finally {
            setIsConnecting(false);
        }
    }, [client, isConnecting, addMessage]);
    
    // Game actions
    const readyUp = useCallback(() => {
        if (room) {
            room.send('ready');
        }
    }, [room]);
    
    const makeGuess = useCallback((guess) => {
        if (room && guess.trim()) {
            room.send('guess', { guess: guess.trim() });
        }
    }, [room]);
    
    const skipCountry = useCallback(() => {
        if (room) {
            room.send('skip');
        }
    }, [room]);
    
    const restartGame = useCallback(() => {
        if (room) {
            room.send('restart');
        }
    }, [room]);
    
    // Leave room
    const leaveRoom = useCallback(async () => {
        cleanupRef.current = true;
        
        if (room) {
            try {
                await room.leave();
            } catch (error) {
                console.error('Error leaving room:', error);
            }
        }
        
        setRoom(null);
        setIsConnected(false);
        setPlayerId(null);
        setPlayerName('');
        setGameState({
            players: {},
            gameStarted: false,
            gameEnded: false,
            currentTurn: '',
            currentCountry: null,
            remainingCountries: [],
            guessedCountries: [],
            turnTimeLeft: 30,
            gameMode: 'europe',
            totalCountries: 0,
            turnNumber: 1,
            maxTurns: 20
        });
        setGameMessages([]);
        setLastAction(null);
        setConnectionError(null);
        
        addMessage('Left the room', 'info');
    }, [room, addMessage]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupRef.current = true;
            if (room) {
                room.leave().catch(console.error);
            }
        };
    }, [room]);
    
    // Computed properties
    const isRaceMode = gameState.gameMode === 'europeRace';
    const isMyTurn = isRaceMode ? gameState.gameStarted && !gameState.gameEnded : (playerId === gameState.currentTurn);
    const currentPlayer = playerId ? gameState.players[playerId] : null;
    const otherPlayers = Object.values(gameState.players).filter(p => p && p.id !== playerId);
    const canStartGame = Object.keys(gameState.players).length === 2 && 
                        Object.values(gameState.players).every(p => p && p.isReady) && 
                        !gameState.gameStarted;
    
    return {
        // Connection state
        isConnected,
        isConnecting,
        connectionError,
        room: room ? { id: room.id } : null,
        
        // Player state
        playerId,
        playerName,
        currentPlayer,
        otherPlayers,
        
        // Game state
        gameState,
        isMyTurn,
        isRaceMode,
        canStartGame,
        
        // Messages and actions
        gameMessages,
        lastAction,
        
        // Actions
        createRoom,
        joinRoom,
        leaveRoom,
        readyUp,
        makeGuess,
        skipCountry,
        restartGame,
        sendChatMessage
    };
}; 