import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
  constructor() {
    super();
    this.id = "";
    this.name = "";
    this.score = 0;
    this.isReady = false;
    this.hasAnswered = false;
    this.lastAnswer = "";
    this.correctAnswers = 0;
    this.totalAttempts = 0;
  }
}

// Définir les types après la classe
type("string")(Player.prototype, "id");
type("string")(Player.prototype, "name");
type("number")(Player.prototype, "score");
type("boolean")(Player.prototype, "isReady");
type("boolean")(Player.prototype, "hasAnswered");
type("string")(Player.prototype, "lastAnswer");
type("number")(Player.prototype, "correctAnswers");
type("number")(Player.prototype, "totalAttempts");

export class Country extends Schema {
  constructor() {
    super();
    this.name = "";
    this.isoCode = "";
    this.discovered = false;
  }
}

type("string")(Country.prototype, "name");
type("string")(Country.prototype, "isoCode");
type("boolean")(Country.prototype, "discovered");

export class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
    this.gameStarted = false;
    this.gameEnded = false;
    this.currentTurn = "";
    this.currentCountryName = "";
    this.currentCountryCode = "";
    this.remainingCountries = new ArraySchema();
    this.guessedCountries = new ArraySchema();
    this.turnTimeLeft = 30;
    this.gameMode = "europe";
    this.totalCountries = 0;
    this.turnNumber = 1;
    this.maxTurns = 20;
  }
}

type({ map: Player })(GameState.prototype, "players");
type("boolean")(GameState.prototype, "gameStarted");
type("boolean")(GameState.prototype, "gameEnded");
type("string")(GameState.prototype, "currentTurn");
type("string")(GameState.prototype, "currentCountryName");
type("string")(GameState.prototype, "currentCountryCode");
type([Country])(GameState.prototype, "remainingCountries");
type([Country])(GameState.prototype, "guessedCountries");
type("number")(GameState.prototype, "turnTimeLeft");
type("string")(GameState.prototype, "gameMode");
type("number")(GameState.prototype, "totalCountries");
type("number")(GameState.prototype, "turnNumber");
type("number")(GameState.prototype, "maxTurns"); 