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
            room.send('chat', { message: message.trim() });
            // Don't add local message - wait for server broadcast to avoid duplication
        }
    }, [room]);
    
    // Create or join a room
    const createRoom = useCallback(async (playerName, gameMode = 'europe') => {
        if (isConnecting) return;
        
        setIsConnecting(true);
        setConnectionError(null);
        cleanupRef.current = false;
        
        try {
            console.log('Creating room...', { playerName, gameMode });
            
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
            console.log('Joining room...', { roomId, playerName });
            
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
    
    // Setup room event handlers
    const setupRoomHandlers = useCallback((room) => {
        // Handle state changes with better error handling
        room.onStateChange((state) => {
            try {
                // Only log on first connection or significant changes
                if (!gameState.gameStarted) {
                    console.log('✔️ Connected and state received!');
                }
                
                // Convert MapSchema to regular object for easier use in React
                const playersObj = {};
                
                // More robust player extraction
                if (state.players) {
                    try {
                        if (typeof state.players.forEach === 'function') {
                            // Method 1: forEach
                            state.players.forEach((player, key) => {
                                // console.log('Processing player (forEach):', key, player);
                                if (player && player.id) {
                                    playersObj[key] = {
                                        id: player.id,
                                        name: player.name || '',
                                        score: player.score || 0,
                                        isReady: player.isReady || false,
                                        hasAnswered: player.hasAnswered || false,
                                        lastAnswer: player.lastAnswer || '',
                                        correctAnswers: player.correctAnswers || 0,
                                        totalAttempts: player.totalAttempts || 0
                                    };
                                }
                            });
                        } else if (state.players.size !== undefined) {
                            // Method 2: Map-like object
                            // console.log('Players size:', state.players.size);
                            for (let [key, player] of state.players.entries()) {
                                // console.log('Processing player (entries):', key, player);
                                if (player && player.id) {
                                    playersObj[key] = {
                                        id: player.id,
                                        name: player.name || '',
                                        score: player.score || 0,
                                        isReady: player.isReady || false,
                                        hasAnswered: player.hasAnswered || false,
                                        lastAnswer: player.lastAnswer || '',
                                        correctAnswers: player.correctAnswers || 0,
                                        totalAttempts: player.totalAttempts || 0
                                    };
                                }
                            }
                        } else if (typeof state.players === 'object') {
                            // Method 3: Plain object
                            // console.log('Players as object:', state.players);
                            Object.keys(state.players).forEach(key => {
                                const player = state.players[key];
                                // console.log('Processing player (object):', key, player);
                                if (player && player.id) {
                                    playersObj[key] = {
                                        id: player.id,
                                        name: player.name || '',
                                        score: player.score || 0,
                                        isReady: player.isReady || false,
                                        hasAnswered: player.hasAnswered || false,
                                        lastAnswer: player.lastAnswer || '',
                                        correctAnswers: player.correctAnswers || 0,
                                        totalAttempts: player.totalAttempts || 0
                                    };
                                }
                            });
                        }
                    } catch (playerError) {
                        console.error('Error processing players:', playerError);
                    }
                }
                // console.log('Final playersObj:', playersObj);
                
                // Safe array handling
                const safeRemainingCountries = (() => {
                    try {
                        if (Array.isArray(state.remainingCountries)) {
                            return [...state.remainingCountries];
                        } else if (state.remainingCountries && typeof state.remainingCountries.forEach === 'function') {
                            const arr = [];
                            state.remainingCountries.forEach(item => arr.push(item));
                            return arr;
                        }
                        return [];
                    } catch (e) {
                        console.error('Error processing remainingCountries:', e);
                        return [];
                    }
                })();
                
                const safeGuessedCountries = (() => {
                    try {
                        if (Array.isArray(state.guessedCountries)) {
                            return [...state.guessedCountries];
                        } else if (state.guessedCountries && typeof state.guessedCountries.forEach === 'function') {
                            const arr = [];
                            state.guessedCountries.forEach(item => arr.push(item));
                            return arr;
                        }
                        return [];
                    } catch (e) {
                        console.error('Error processing guessedCountries:', e);
                        return [];
                    }
                })();
                
                setGameState({
                    players: playersObj,
                    gameStarted: state.gameStarted || false,
                    gameEnded: state.gameEnded || false,
                    currentTurn: state.currentTurn || '',
                    currentCountry: state.currentCountryName ? {
                        name: state.currentCountryName,
                        isoCode: state.currentCountryCode || '',
                        altNames: []
                    } : null,
                    remainingCountries: safeRemainingCountries,
                    guessedCountries: safeGuessedCountries,
                    turnTimeLeft: state.turnTimeLeft || 30,
                    gameMode: state.gameMode || 'europe',
                    totalCountries: state.totalCountries || 0,
                    turnNumber: state.turnNumber || 1,
                    maxTurns: state.maxTurns || 20
                });
            } catch (error) {
                console.error('Error in onStateChange:', error);
            }
        });
        
        // Handle player joining
        room.onMessage('joined', (message) => {
            console.log('Player joined:', message);
            setPlayerId(message.playerId);
            addMessage(`You joined as ${message.playerName}`, 'success');
        });
        
        // Handle room full
        room.onMessage('room_full', (message) => {
            addMessage(message.message, 'info');
        });
        
        // Handle game started
        room.onMessage('game_started', (message) => {
            addMessage('Game started!', 'success');
            addMessage(`${gameState.players[message.currentTurn]?.name || 'Someone'}'s turn`, 'info');
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
        
        // Handle connection loss
        room.onLeave(() => {
            console.log('Left room');
            if (!cleanupRef.current) {
                addMessage('Disconnected from room', 'error');
                setIsConnected(false);
                setRoom(null);
            }
        });
        
        room.onError((code, message) => {
            console.error('Room error:', code, message);
            addMessage(`Room error: ${message}`, 'error');
        });
        
    }, [addMessage, gameState.players]);
    
    // Game actions
    const readyUp = useCallback(() => {
        if (room) {
            room.send('ready');
            addMessage('You are ready!', 'info');
        }
    }, [room, addMessage]);
    
    const makeGuess = useCallback((guess) => {
        console.log('makeGuess called with:', guess);
        if (room && guess.trim()) {
            console.log('Sending guess to server:', guess.trim());
            room.send('guess', { guess: guess.trim() });
        } else {
            console.log('Cannot send guess - room:', !!room, 'guess:', guess);
        }
    }, [room]);
    
    const skipCountry = useCallback(() => {
        console.log('skipCountry called');
        if (room) {
            console.log('Sending skip to server');
            room.send('skip');
        } else {
            console.log('Cannot send skip - no room');
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
    const isMyTurn = playerId === gameState.currentTurn;
    const currentPlayer = playerId ? gameState.players[playerId] : null;
    const otherPlayers = Object.values(gameState.players).filter(p => p.id !== playerId);
    const canStartGame = Object.keys(gameState.players).length === 2 && 
                        Object.values(gameState.players).every(p => p.isReady) && 
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