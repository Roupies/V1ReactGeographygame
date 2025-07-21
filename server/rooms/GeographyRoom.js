import { Room } from '@colyseus/core';
import { GameState, Player, Country } from '../../src/schemas/GameState.js';

// Schema types are now defined in the shared GameState.js file

// European countries data for server-side validation
const EUROPEAN_COUNTRIES = [
  { name: "Allemagne", isoCode: "DEU", altNames: [] },
  { name: "France", isoCode: "FRA", altNames: [] },
  { name: "Royaume-Uni", isoCode: "GBR", altNames: ["angleterre", "grande-bretagne"] },
  { name: "Pays-Bas", isoCode: "NLD", altNames: ["hollande"] },
  { name: "Belgique", isoCode: "BEL", altNames: [] },
  { name: "Irlande", isoCode: "IRL", altNames: [] },
  { name: "Luxembourg", isoCode: "LUX", altNames: [] },
  { name: "Monaco", isoCode: "MCO", altNames: [] },
  { name: "Andorre", isoCode: "AND", altNames: [] },
  { name: "Liechtenstein", isoCode: "LIE", altNames: [] },
  { name: "Suède", isoCode: "SWE", altNames: [] },
  { name: "Norvège", isoCode: "NOR", altNames: [] },
  { name: "Finlande", isoCode: "FIN", altNames: [] },
  { name: "Danemark", isoCode: "DNK", altNames: [] },
  { name: "Islande", isoCode: "ISL", altNames: [] },
  { name: "Lituanie", isoCode: "LTU", altNames: [] },
  { name: "Lettonie", isoCode: "LVA", altNames: [] },
  { name: "Estonie", isoCode: "EST", altNames: [] },
  { name: "Pologne", isoCode: "POL", altNames: [] },
  { name: "Ukraine", isoCode: "UKR", altNames: [] },
  { name: "Biélorussie", isoCode: "BLR", altNames: [] },
  { name: "Tchéquie", isoCode: "CZE", altNames: ["république tchèque"] },
  { name: "Slovaquie", isoCode: "SVK", altNames: [] },
  { name: "Hongrie", isoCode: "HUN", altNames: [] },
  { name: "Roumanie", isoCode: "ROU", altNames: [] },
  { name: "Bulgarie", isoCode: "BGR", altNames: [] },
  { name: "Moldavie", isoCode: "MDA", altNames: [] },
  { name: "Italie", isoCode: "ITA", altNames: [] },
  { name: "Espagne", isoCode: "ESP", altNames: [] },
  { name: "Portugal", isoCode: "PRT", altNames: [] },
  { name: "Grèce", isoCode: "GRC", altNames: [] },
  { name: "Croatie", isoCode: "HRV", altNames: [] },
  { name: "Slovénie", isoCode: "SVN", altNames: [] },
  { name: "Bosnie-Herzégovine", isoCode: "BIH", altNames: ["bosnie"] },
  { name: "Serbie", isoCode: "SRB", altNames: [] },
  { name: "Albanie", isoCode: "ALB", altNames: [] },
  { name: "Kosovo", isoCode: "XKX", altNames: [] },
  { name: "Monténégro", isoCode: "MNE", altNames: [] },
  { name: "Macédoine du Nord", isoCode: "MKD", altNames: ["macédoine"] },
  { name: "Chypre", isoCode: "CYP", altNames: [] },
  { name: "Malte", isoCode: "MLT", altNames: [] },
  { name: "Saint-Marin", isoCode: "SMR", altNames: [] },
  { name: "Vatican", isoCode: "VAT", altNames: [] },
  { name: "Suisse", isoCode: "CHE", altNames: [] },
  { name: "Autriche", isoCode: "AUT", altNames: [] }
];

// Utility function to normalize strings for comparison
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export class GeographyRoom extends Room {
  maxClients = 10; // Augmenter pour permettre plus de joueurs
  
  onCreate(options) {
    console.log("GeographyRoom created!", options);
    
    // Configurer la salle pour éviter la suppression automatique
    this.autoDispose = false;
    
    // Initialiser le state AVANT tout
    this.setState(new GameState());
    
    // Puis configurer
    this.state.gameMode = options.gameMode || "europe";
    
    // Initialize countries based on mode
    this.initializeCountries();
    
    // Setup turn timer
    this.turnTimer = null;
    
    // Message handlers
    this.onMessage("ready", this.onPlayerReady.bind(this));
    this.onMessage("guess", this.onPlayerGuess.bind(this));
    this.onMessage("skip", this.onPlayerSkip.bind(this));
    this.onMessage("restart", this.onRestartGame.bind(this));
    this.onMessage("chat", this.onChatMessage.bind(this));
  }
  
  onJoin(client, options) {
    console.log(`Player ${client.sessionId} joined`);
    
    // Create new player
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.playerName || `Player ${this.clients.length}`;
    
    this.state.players.set(client.sessionId, player);
    
    console.log(`Player added to state. Total players: ${this.state.players.size}`);
    console.log(`State players:`, this.state.players);
    
    // Send welcome message
    client.send("joined", { 
      playerId: client.sessionId,
      playerName: player.name 
    });
    
    // If room is full, notify players
    if (this.clients.length === 2) {
      this.broadcast("room_full", { message: "Room is full. Players can ready up!" });
    }
  }
  
  onLeave(client, consented) {
    console.log(`Player ${client.sessionId} left (consented: ${consented})`);
    
    // Remove player
    this.state.players.delete(client.sessionId);
    
    // Notify remaining players
    this.broadcast("player_left", {
      playerId: client.sessionId,
      remainingPlayers: this.state.players.size
    });
    
    // If game was in progress and no players left, pause the game
    if (this.state.gameStarted && !this.state.gameEnded && this.state.players.size === 0) {
      this.state.gameStarted = false;
      this.broadcast("game_paused", { message: "All players left. Game paused." });
    }
    
    // If game was in progress and only one player left, end it
    if (this.state.gameStarted && !this.state.gameEnded && this.state.players.size === 1) {
      this.endGame("Not enough players to continue");
    }
    
    // Clear timer if no players left
    if (this.state.players.size === 0 && this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
    
    // Don't dispose the room automatically
    console.log(`Room has ${this.state.players.size} players remaining`);
  }
  
  onDispose() {
    console.log("GeographyRoom disposed");
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
  }
  
  initializeCountries() {
    // Vider d'abord
    this.state.remainingCountries.clear();
    
    // For now, only support Europe mode
    if (this.state.gameMode === "europe") {
      const shuffledCountries = this.shuffleArray([...EUROPEAN_COUNTRIES]);
      
      shuffledCountries.forEach(countryData => {
        const country = new Country();
        country.name = countryData.name;
        country.isoCode = countryData.isoCode;
        this.state.remainingCountries.push(country);
      });
      
      this.state.totalCountries = EUROPEAN_COUNTRIES.length;
    }
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  onPlayerReady(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    
    player.isReady = true;
    
    // Check if both players are ready
    const allReady = Array.from(this.state.players.values()).every(p => p.isReady);
    const hasEnoughPlayers = this.state.players.size === 2;
    
    if (allReady && hasEnoughPlayers && !this.state.gameStarted) {
      this.startGame();
    }
  }
  
  startGame() {
    console.log("Starting game!");
    
    this.state.gameStarted = true;
    this.state.gameEnded = false;
    this.state.turnNumber = 1;
    
    // Choose first player randomly
    const playerIds = Array.from(this.state.players.keys());
    this.state.currentTurn = playerIds[Math.floor(Math.random() * playerIds.length)];
    
    // Set first country
    this.nextCountry();
    
    // Start turn timer
    this.startTurnTimer();
    
    this.broadcast("game_started", {
      currentTurn: this.state.currentTurn,
      currentCountry: this.state.currentCountryName
    });
  }
  
  nextCountry() {
    if (this.state.remainingCountries.length > 0) {
      const country = this.state.remainingCountries.shift();
      
      this.state.currentCountryName = country.name;
      this.state.currentCountryCode = country.isoCode;
    } else {
      this.endGame("All countries guessed!");
    }
  }
  
  startTurnTimer() {
    this.state.turnTimeLeft = 30;
    
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
    
    this.turnTimer = setInterval(() => {
      this.state.turnTimeLeft--;
      
      if (this.state.turnTimeLeft <= 0) {
        this.onTurnTimeout();
      }
    }, 1000);
  }
  
  onTurnTimeout() {
    console.log("Turn timeout!");
    this.switchTurn();
  }
  
  onPlayerGuess(client, message) {
    console.log(`Guess received from ${client.sessionId}:`, message);
    // Only allow guesses from current player
    if (client.sessionId !== this.state.currentTurn) {
      console.log(`Wrong turn - current: ${this.state.currentTurn}, player: ${client.sessionId}`);
      client.send("error", { message: "It's not your turn!" });
      return;
    }
    
    if (this.state.gameEnded) {
      return;
    }
    
    const player = this.state.players.get(client.sessionId);
    const guess = message.guess;
    
    player.totalAttempts++;
    player.lastAnswer = guess;
    
    // Validate answer
    const isCorrect = this.validateAnswer(guess, this.state.currentCountryName);
    
    if (isCorrect) {
      player.score += 10;
      player.correctAnswers++;
      
      // Create a copy of the current country for guessed countries
      const guessedCountry = new Country();
      guessedCountry.name = this.state.currentCountryName;
      guessedCountry.isoCode = this.state.currentCountryCode;
      guessedCountry.discovered = true;
      this.state.guessedCountries.push(guessedCountry);
      
      this.broadcast("correct_answer", {
        player: player.name,
        country: this.state.currentCountryName,
        score: player.score
      });
      
      // Move to next country
      this.nextCountry();
      this.startTurnTimer();
    } else {
      this.broadcast("wrong_answer", {
        player: player.name,
        guess: guess
      });
      
      // Switch turn after wrong answer
      this.switchTurn();
    }
  }
  
  onPlayerSkip(client, message) {
    console.log(`Skip received from ${client.sessionId}:`, message);
    // Only allow skips from current player
    if (client.sessionId !== this.state.currentTurn) {
      console.log(`Wrong turn - current: ${this.state.currentTurn}, player: ${client.sessionId}`);
      client.send("error", { message: "It's not your turn!" });
      return;
    }
    
    if (this.state.gameEnded) {
      return;
    }
    
    this.broadcast("country_skipped", {
      player: this.state.players.get(client.sessionId).name,
      country: this.state.currentCountryName
    });
    
    // Move country to end of queue
    const skippedCountry = new Country();
    skippedCountry.name = this.state.currentCountryName;
    skippedCountry.isoCode = this.state.currentCountryCode;
    this.state.remainingCountries.push(skippedCountry);
    this.nextCountry();
    this.switchTurn();
  }
  
  switchTurn() {
    const playerIds = Array.from(this.state.players.keys());
    const currentIndex = playerIds.indexOf(this.state.currentTurn);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    
    this.state.currentTurn = playerIds[nextIndex];
    this.state.turnNumber++;
    
    // Check if game should end
    if (this.state.turnNumber > this.state.maxTurns) {
      this.endGame("Maximum turns reached!");
      return;
    }
    
    this.startTurnTimer();
    
    this.broadcast("turn_switched", {
      currentTurn: this.state.currentTurn,
      turnNumber: this.state.turnNumber
    });
  }
  
  validateAnswer(guess, correctAnswer) {
    const normalizedGuess = normalizeString(guess);
    
    // Find the country object
    const country = EUROPEAN_COUNTRIES.find(c => c.name === correctAnswer);
    if (!country) return false;
    
    // Check main name
    if (normalizeString(country.name) === normalizedGuess) {
      return true;
    }
    
    // Check alternative names
    return country.altNames.some(altName => 
      normalizeString(altName) === normalizedGuess
    );
  }
  
  endGame(reason) {
    console.log("Game ended:", reason);
    
    this.state.gameEnded = true;
    
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
    
    // Calculate winner
    const players = Array.from(this.state.players.values());
    const winner = players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    
    this.broadcast("game_ended", {
      reason,
      winner: winner.name,
      scores: players.map(p => ({
        name: p.name,
        score: p.score,
        correctAnswers: p.correctAnswers,
        totalAttempts: p.totalAttempts
      }))
    });
  }
  
  onRestartGame(client, message) {
    // Reset game state
    this.state.gameStarted = false;
    this.state.gameEnded = false;
    this.state.turnNumber = 1;
    this.state.guessedCountries = [];
    
    // Reset players
    this.state.players.forEach(player => {
      player.score = 0;
      player.isReady = false;
      player.correctAnswers = 0;
      player.totalAttempts = 0;
      player.lastAnswer = "";
    });
    
    // Reinitialize countries
    this.initializeCountries();
    
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
    
    this.broadcast("game_reset", { message: "Game has been reset. Players can ready up again!" });
  }
  
  onChatMessage(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    
    // Broadcast chat message to all players
    this.broadcast("chat_message", {
      player: player.name,
      message: message.message,
      timestamp: new Date().toLocaleTimeString()
    });
  }
} 