import { Room } from '@colyseus/core';
import { GameState, Player, Country } from '../../src/schemas/GameState.js';
import { GAME_MODE_CONFIGS, validateAnswer } from '../../shared/data/entities.js';

export class GeographyRoom extends Room {
  maxClients = 10;
  
  onCreate(options) {
    console.log("GeographyRoom created!", options);
    
    this.autoDispose = false;
    this.setState(new GameState());
    this.state.gameMode = options.gameMode || "europe";
    
    this.initializeCountries();
    this.turnTimer = null;
    
    this.onMessage("ready", this.onPlayerReady.bind(this));
    this.onMessage("guess", this.onPlayerGuess.bind(this));
    this.onMessage("skip", this.onPlayerSkip.bind(this));
    this.onMessage("restart", this.onRestartGame.bind(this));
    this.onMessage("chat", this.onChatMessage.bind(this));
  }
  
  initializeCountries() {
    this.state.remainingCountries.clear();
    
    const modeData = GAME_MODE_CONFIGS[this.state.gameMode];
    if (!modeData) {
      console.error(`Mode ${this.state.gameMode} not found`);
      return;
    }
    
    const shuffledEntities = this.shuffleArray([...modeData.entities]);
    
    shuffledEntities.forEach(entityData => {
      const entity = new Country();
      entity.name = entityData.name;
      
      // Utiliser la propriété idProperty de la configuration du mode
      const idProperty = modeData.idProperty || 'isoCode';
      entity.isoCode = entityData[idProperty];
      
      this.state.remainingCountries.push(entity);
    });
    
    this.state.totalCountries = modeData.entities.length;
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  onJoin(client, options) {
    console.log(`Player ${client.sessionId} joined!`);
    
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.playerName || `Player ${client.sessionId}`;
    player.score = 0;
    player.isReady = false;
    
    this.state.players.set(client.sessionId, player);
    
    // Send welcome message
    client.send("welcome", {
      message: `Bienvenue ${player.name} ! En attente d'autres joueurs...`,
      roomId: this.roomId,
      gameMode: this.state.gameMode
    });
    
    console.log(`Players in room: ${this.state.players.size}`);
  }
  
  onLeave(client, consented) {
    console.log(`Player ${client.sessionId} left!`);
    
    const player = this.state.players.get(client.sessionId);
    if (player) {
      this.state.players.delete(client.sessionId);
      
      // Notify other players
      this.broadcast("playerLeft", {
        playerName: player.name,
        message: `${player.name} a quitté le jeu`
      });
      
      // If game was in progress, end it
      if (this.state.gameStarted && !this.state.gameEnded) {
        this.endGame(`${player.name} a quitté le jeu`);
      }
    }
  }
  
  onDispose() {
    console.log("Room disposed!");
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
  }
  
  onPlayerReady(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.isReady = true;
      console.log(`${player.name} is ready!`);
      
      // Check if all players are ready
      const allReady = Array.from(this.state.players.values()).every(p => p.isReady);
      if (allReady && this.state.players.size >= 2) {
        this.startGame();
      }
    }
  }
  
  startGame() {
    console.log("Starting game!");
    this.state.gameStarted = true;
    this.state.gameEnded = false;
    this.state.turnNumber = 1;
    
    // Set first player's turn
    const playerIds = Array.from(this.state.players.keys());
    this.state.currentTurn = playerIds[0];
    
    // Get the first player's name
    const firstPlayer = this.state.players.get(this.state.currentTurn);
    
    this.broadcast("gameStarted", {
      message: "Game started!",
      firstTurn: this.state.currentTurn,
      firstPlayer: firstPlayer ? firstPlayer.name : 'Unknown Player'
    });
    
    this.nextCountry();
  }
  
  nextCountry() {
    if (this.state.remainingCountries.length === 0) {
      this.endGame("all_countries_guessed");
      return;
    }
    
    const country = this.state.remainingCountries[0];
    this.state.currentCountryName = country.name;
    this.state.currentCountryCode = country.isoCode;
    
    console.log(`Current country: ${country.name}`);
    
    this.broadcast("newCountry", {
      countryCode: country.isoCode
    });
    
    this.startTurnTimer();
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
    const player = this.state.players.get(client.sessionId);
    if (!player || client.sessionId !== this.state.currentTurn) {
      return;
    }
    
    const guess = message.guess;
    const correctAnswer = this.state.currentCountryName;
    
    console.log(`${player.name} guessed: ${guess}`);
    
    // Validate answer using shared data
    const modeData = GAME_MODE_CONFIGS[this.state.gameMode];
    const isCorrect = validateAnswer(guess, correctAnswer, modeData.entities);
    
    if (isCorrect) {
      // Correct answer
      player.score += 10;
      player.correctAnswers++;
      
      // Move country from remaining to guessed
      const country = this.state.remainingCountries.shift();
      this.state.guessedCountries.push(country);
      
      this.broadcast("correctAnswer", {
        playerName: player.name,
        countryName: correctAnswer,
        score: player.score,
        message: `${player.name} found ${correctAnswer}!`
      });
      
      console.log(`${player.name} found ${correctAnswer}! Score: ${player.score}`);
      
      // Continue to next country
      this.nextCountry();
    } else {
      // Wrong answer
      player.totalAttempts++;
      
      this.broadcast("wrongAnswer", {
        playerName: player.name,
        guess: guess,
        message: `${player.name} guessed "${guess}" - wrong!`
      });
      
      console.log(`${player.name} guessed wrong: ${guess}`);
      
      // Switch turn after wrong answer
      this.switchTurn();
    }
  }
  
  onPlayerSkip(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player || client.sessionId !== this.state.currentTurn) {
      return;
    }
    
    console.log(`${player.name} skipped their turn`);
    
    this.broadcast("playerSkipped", {
      playerName: player.name,
      message: `${player.name} skipped their turn`
    });
    
    this.switchTurn();
  }
  
  switchTurn() {
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
    
    const playerIds = Array.from(this.state.players.keys());
    const currentIndex = playerIds.indexOf(this.state.currentTurn);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    
    this.state.currentTurn = playerIds[nextIndex];
    this.state.turnNumber++;
    
    console.log(`Switched to ${this.state.currentTurn}'s turn`);
    
    // Get the player name for the message
    const nextPlayer = this.state.players.get(this.state.currentTurn);
    
    this.broadcast("turnChanged", {
      currentTurn: this.state.currentTurn,
      nextPlayer: nextPlayer ? nextPlayer.name : 'Unknown Player',
      turnNumber: this.state.turnNumber
    });
    
    // Start timer for new turn
    this.startTurnTimer();
  }
  
  endGame(reason) {
    console.log(`Game ended: ${reason}`);
    this.state.gameEnded = true;
    
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
    
    // Calculate final scores
    const finalScores = Array.from(this.state.players.values()).map(player => ({
      name: player.name,
      score: player.score,
      correctAnswers: player.correctAnswers,
      totalAttempts: player.totalAttempts
    }));
    
    this.broadcast("gameEnded", {
      reason: reason,
      scores: finalScores,
      message: "Jeu terminé ! Consultez les scores finaux."
    });
  }
  
  onRestartGame(client, message) {
    console.log("Restarting game...");
    
    // Reset all players
    this.state.players.forEach(player => {
      player.score = 0;
      player.isReady = false;
      player.correctAnswers = 0;
      player.totalAttempts = 0;
    });
    
    // Reset game state
    this.state.gameStarted = false;
    this.state.gameEnded = false;
    this.state.turnNumber = 1;
    this.state.turnTimeLeft = 30;
    
    // Reinitialize countries
    this.initializeCountries();
    
    this.broadcast("gameRestarted", {
      message: "Game restarted! Players can ready up again."
    });
  }
  
  onChatMessage(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      this.broadcast("chatMessage", {
        playerName: player.name,
        message: message.text,
        timestamp: new Date().toISOString()
      });
    }
  }
}
