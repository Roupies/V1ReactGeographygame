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
    
    // Get mode configuration to determine game type
    const modeConfig = GAME_MODE_CONFIGS[this.state.gameMode];
    this.isRaceMode = modeConfig?.gameType === 'race';
    this.scoreThreshold = modeConfig?.scoreThreshold || 50;
    this.pointsPerCorrect = modeConfig?.pointsPerCorrect || 10;
    this.pointsPerWrong = modeConfig?.pointsPerWrong || 0;
    
    // ✅ NOUVEAU : Configuration timer centralisée depuis GameManager
    this.timerConfig = {
      type: modeConfig?.timerType || 'countdown',
      seconds: modeConfig?.timerSeconds || 240,
      display: modeConfig?.timerDisplay !== false,
      autoStart: modeConfig?.timerAutoStart !== false,
      syncServer: modeConfig?.timerSyncServer === true
    };
    
    this.initializeCountries();
    this.turnTimer = null;
    this.gameTimer = null; // Timer global du jeu
    
    this.onMessage("ready", this.onPlayerReady.bind(this));
    this.onMessage("guess", this.onPlayerGuess.bind(this));
    this.onMessage("skip", this.onPlayerSkip.bind(this));
    this.onMessage("hint", this.onPlayerHint.bind(this)); // ✅ NOUVEAU : Gestionnaire pour les indices
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
    
    // ✅ CORRECTION : Reset explicite de l'état de fin de partie
    this.state.gameEnded = false;
    this.state.gameTimeLeft = this.timerConfig.seconds;
    this.state.gameStarted = true;
    this.state.turnNumber = 1;
    
    if (this.isRaceMode) {
      // Race mode: no turns, everyone can play simultaneously
      this.state.currentTurn = ""; // No specific turn in race mode
      
      this.broadcast("gameStarted", {
        message: "Course commencée ! Premier à 100 points !",
        gameType: "race",
        scoreThreshold: this.scoreThreshold,
        timerSeconds: this.timerConfig.seconds
      });
    } else {
      // Turn-based mode: set first player's turn
      const playerIds = Array.from(this.state.players.keys());
      this.state.currentTurn = playerIds[0];
      
      // Get the first player's name
      const firstPlayer = this.state.players.get(this.state.currentTurn);
      
      this.broadcast("gameStarted", {
        message: "Game started!",
        firstTurn: this.state.currentTurn,
        firstPlayer: firstPlayer ? firstPlayer.name : 'Unknown Player'
      });
    }
    
    this.nextCountry();
    
    // ✅ CORRECTION : Timer démarre SEULEMENT quand configuré ET que la partie est vraiment prête
    if (this.timerConfig.autoStart && this.state.gameStarted) {
      console.log(`🕐 Démarrage timer global: ${this.timerConfig.seconds}s (mode: ${this.state.gameMode})`);
      this.startGameTimer();
    }
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
      // ❌ SUPPRIMÉ : countryName révèle la réponse
    });
    
    // Only start turn timer in turn-based mode
    if (!this.isRaceMode) {
      this.startTurnTimer();
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
    const player = this.state.players.get(client.sessionId);
    if (!player) {
      return;
    }
    
    // In race mode, anyone can guess. In turn mode, only current player can guess
    if (!this.isRaceMode && client.sessionId !== this.state.currentTurn) {
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
      player.score += this.pointsPerCorrect;
      player.correctAnswers++;
      
      // Move country from remaining to guessed
      const country = this.state.remainingCountries.shift();
      this.state.guessedCountries.push(country);
      
      this.broadcast("correctAnswer", {
        playerName: player.name,
        countryName: correctAnswer,
        score: player.score,
        message: `${player.name} a trouvé ${correctAnswer}!`
      });
      
      console.log(`${player.name} found ${correctAnswer}! Score: ${player.score}`);
      
      // Check for victory in race mode
      if (this.isRaceMode && player.score >= this.scoreThreshold) {
        this.endGame(`${player.name} a gagné la course avec ${player.score} points !`);
        return;
      }
      
      // Continue to next country
      this.nextCountry();
      
      // In turn-based mode, switch turn after correct answer
      if (!this.isRaceMode) {
        this.switchTurn();
      }
    } else {
      // Wrong answer
      player.totalAttempts++;
      
      // In race mode, deduct points for wrong answers
      if (this.isRaceMode && this.pointsPerWrong < 0) {
        player.score = Math.max(0, player.score + this.pointsPerWrong); // Ensure score doesn't go below 0
      }
      
      this.broadcast("wrongAnswer", {
        playerName: player.name,
        guess: guess,
        score: player.score,
        message: `${player.name} a deviné "${guess}" - incorrect !`
      });
      
      console.log(`${player.name} guessed wrong: ${guess}`);
      
      // In turn-based mode, switch turn after wrong answer
      if (!this.isRaceMode) {
        this.switchTurn();
      }
    }
  }
  
  onPlayerSkip(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player) {
      return;
    }
    
    // Skip is not allowed in race mode
    if (this.isRaceMode) {
      console.log(`${player.name} tried to skip in race mode - rejected`);
      return;
    }
    
    // In turn mode, only current player can skip
    if (client.sessionId !== this.state.currentTurn) {
      return;
    }
    
    console.log(`${player.name} skipped their turn`);
    
    this.broadcast("playerSkipped", {
      playerName: player.name,
      message: `${player.name} a passé son tour`
    });
    
    // Remove the current country from remaining countries
    if (this.state.remainingCountries.length > 0) {
      this.state.remainingCountries.shift();
    }
    
    // Move to next country
    this.nextCountry();
    
    // Switch turn after skip
    this.switchTurn();
  }
  
  // ✅ NOUVEAU : Gestionnaire pour les indices
  onPlayerHint(client, message) {
    const player = this.state.players.get(client.sessionId);
    if (!player) {
      return;
    }
    
    // Vérifier s'il y a un pays actuel
    if (!this.state.currentCountryName) {
      return;
    }
    
    // Générer l'indice (première lettre du pays)
    const hint = this.state.currentCountryName.charAt(0).toUpperCase();
    
    // Diffuser l'indice à tous les joueurs
    this.broadcast("hintGiven", {
      playerName: player.name,
      hint: hint,
      message: `${player.name} a demandé un indice : ${hint}...`
    });
    
    console.log(`${player.name} asked for hint: ${hint}...`);
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

  // ✅ NOUVEAU : Méthodes de gestion du timer global basées sur configuration
  startGameTimer() {
    if (!this.timerConfig.display || !this.timerConfig.syncServer) {
      return; // Ne pas démarrer si pas configuré pour affichage ou sync serveur
    }

    console.log(`🕐 Démarrage timer global: ${this.timerConfig.seconds}s (mode: ${this.state.gameMode})`);
    
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    
    this.gameTimer = setInterval(() => {
      if (this.state.gameTimeLeft > 0) {
        this.state.gameTimeLeft--;
        
        // Diffuser la mise à jour du timer si synchronisé
        this.broadcast("gameTimeUpdate", {
          timeLeft: this.state.gameTimeLeft
        });
        
        if (this.state.gameTimeLeft <= 0) {
          this.onGameTimeout();
        }
      }
    }, 1000);
  }

  onGameTimeout() {
    console.log("⏰ Timer global expiré ! Fin de partie.");
    
    if (this.isRaceMode) {
      // Mode course : déterminer le gagnant par score
      let winner = null;
      let highestScore = -1;
      
      this.state.players.forEach(player => {
        if (player.score > highestScore) {
          highestScore = player.score;
          winner = player;
        }
      });
      
      if (winner) {
        this.endGame(`⏰ Temps écoulé ! ${winner.name} gagne avec ${winner.score} points !`);
      } else {
        this.endGame("⏰ Temps écoulé ! Match nul !");
      }
    } else {
      // Mode tour par tour : fin de partie par temps
      this.endGame("⏰ Temps écoulé ! Partie terminée.");
    }
  }

  // Nettoyage des timers
  onDispose() {
    console.log("GeographyRoom disposing...");
    
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
    
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }
}
