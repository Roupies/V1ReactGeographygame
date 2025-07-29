# Guide des Modes de Jeu - Mode Course 🏁

## Nouveau Mode : Course Europe - Premier à 100 pts

### 🎯 Objectif
Le premier joueur à atteindre **100 points** gagne la partie !

### 🎮 Caractéristiques du Mode Course

#### Pas de Tours
- **Tous les joueurs peuvent jouer simultanément**
- Pas d'attente de tour
- Action en temps réel

#### Système de Points
- **+10 points** pour chaque bonne réponse
- **-2 points** pour chaque mauvaise réponse
- Le score ne peut pas descendre en dessous de 0

#### Conditions de Victoire
- Premier à atteindre **100 points** gagne immédiatement
- La partie se termine dès qu'un joueur atteint l'objectif

### 🛠️ Architecture Technique

#### Configuration Serveur (`shared/data/entities.js`)
```javascript
europeRace: {
    entities: EUROPEAN_COUNTRIES,
    name: 'europeRace',
    idProperty: 'isoCode',
    gameType: 'race',
    scoreThreshold: 100,
    pointsPerCorrect: 10,
    pointsPerWrong: -2
}
```

#### Configuration Client (`src/data/gameModes.js`)
```javascript
europeRace: {
    ...MODE_CONFIGS.europe,
    label: "Course Europe - Premier à 100 pts",
    scoreType: 'points',
    victoryCondition: 'score_threshold',
    scoreThreshold: 100,
    gameType: 'race',
    pointsPerCorrect: 10,
    pointsPerWrong: -2,
    // UI personnalisée avec couleurs orange/rouge pour le thème course
    primaryColor: '#ff6b35',
    secondaryColor: '#ff8c42',
    icon: '🏁'
}
```

### 🔧 Modifications Techniques

#### Serveur (`server/rooms/GeographyRoom.js`)
1. **Détection du mode** : `this.isRaceMode = modeConfig?.gameType === 'race'`
2. **Pas de tours** : `this.state.currentTurn = ""` en mode course
3. **Validation élargie** : Tous les joueurs peuvent deviner
4. **Condition de victoire** : Vérification automatique à 100 points

#### Client (`src/hooks/useMultiplayer.js`)
1. **Détection du mode** : `const isRaceMode = gameState.gameMode === 'europeRace'`
2. **Permissions étendues** : `isMyTurn = isRaceMode ? gameStarted && !gameEnded : playerId === currentTurn`
3. **Messages adaptés** : Affichage des scores dans le chat

#### Interface (`src/components/game/MultiplayerUI.jsx`)
1. **TurnIndicator modifié** : Affiche "🏁 Mode Course" au lieu des tours
2. **Messages de score** : Affichage des points gagnés/perdus

### 🎨 Éléments Visuels

#### Couleurs du Mode Course
- **Primaire** : `#ff6b35` (Orange vif)
- **Secondaire** : `#ff8c42` (Orange clair)
- **Dégradé** : `linear-gradient(45deg, #ff6b35, #ff8c42)`
- **Icône** : 🏁 (Drapeau à damier)

#### Interface Spécifique
- Indicateur de tour remplacé par "Mode Course"
- Animation pulse continue
- Messages avec scores affichés
- Objectif visible : "Premier à 100 pts !"

### 🚀 Comment Ajouter un Nouveau Mode Course

1. **Ajouter la configuration serveur** dans `shared/data/entities.js`
2. **Ajouter la configuration client** dans `src/data/gameModes.js`
3. **Spécifier `gameType: 'race'`** dans les deux configurations
4. **Définir `scoreThreshold`**, `pointsPerCorrect`, `pointsPerWrong`
5. **Personnaliser l'UI** avec couleurs et icône appropriées

### 📊 Comparaison des Modes

| Aspect | Mode Tour par Tour | Mode Course |
|--------|------------------|-------------|
| **Tours** | Alternés, 30s max | Simultanés, illimités |
| **Points** | +10 par bonne réponse | +10/-2 selon réponse |
| **Victoire** | Tous pays trouvés | Premier à 100 pts |
| **Rythme** | Réfléchi | Frénétique |
| **Stratégie** | Précision | Vitesse + Précision |

Le mode course apporte une dimension compétitive et rapide au jeu, parfait pour des parties plus courtes et intenses ! 🎮 