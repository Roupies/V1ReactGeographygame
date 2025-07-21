# 🎮 Multijoueur - React Geography Game

Ce document explique comment utiliser le mode multijoueur à 2 joueurs avec tours alternés.

## 🚀 Démarrage

### 1. Démarrer le serveur Colyseus

```bash
# Aller dans le dossier serveur
cd server

# Installer les dépendances (première fois seulement)
npm install

# Démarrer le serveur
npm run dev
```

Le serveur se lance sur `http://localhost:2567`

### 2. Démarrer le client React

```bash
# Depuis la racine du projet
npm run dev
```

Le client se lance sur `http://localhost:5173`

## 🎯 Comment jouer

### Créer une partie
1. Cliquez sur "🎮 Multijoueur (2 joueurs)"
2. Choisissez "Créer une partie"
3. Entrez votre nom
4. Partagez l'ID de la room avec votre adversaire

### Rejoindre une partie
1. Cliquez sur "🎮 Multijoueur (2 joueurs)"
2. Choisissez "Rejoindre une partie"
3. Entrez votre nom et l'ID de la room
4. Attendez que la partie commence

### Règles du jeu
- **2 joueurs maximum** par partie
- **Tours alternés** : chaque joueur joue à son tour
- **30 secondes par tour** : temps limité pour répondre
- **10 points** pour chaque bonne réponse
- **Système de skip** : passez votre tour si vous ne savez pas
- **Mode Europe uniquement** en multijoueur (pour l'instant)

## 🎮 Interface multijoueur

### Indicateurs visuels
- **Indicateur de tour** (en haut à droite) : indique à qui le tour
  - 🎯 Vert avec animation = votre tour
  - ⏳ Jaune = tour de l'adversaire
- **Scores en temps réel** : voir les points de chaque joueur
- **Messages de jeu** : actions des joueurs en temps réel
- **Informations de room** : ID de la room et bouton quitter

### Contrôles
- **Input désactivé** quand ce n'est pas votre tour
- **Boutons skip/deviner** : seulement actifs pendant votre tour
- **Indices désactivés** en mode multijoueur
- **Enter** pour valider votre réponse

## 🏗️ Architecture technique

### Serveur Colyseus (`/server`)
- **GeographyRoom.js** : Logique de jeu multijoueur
- **index.js** : Configuration du serveur Express + Colyseus
- **Port 2567** : Port par défaut de Colyseus

### Client React (`/src`)
- **useMultiplayer.js** : Hook pour la communication client-serveur
- **MultiplayerUI.jsx** : Composants UI spécifiques au multijoueur
- **LobbyScreen.jsx** : Écran de création/jonction de room
- **App.jsx** : Orchestration entre solo et multijoueur

### Communication
- **WebSocket** : Communication temps réel via Colyseus
- **État synchronisé** : Tous les joueurs voient le même état
- **Validation serveur** : Toutes les réponses validées côté serveur

## 🔧 Développement

### Ajouter un nouveau mode de jeu
1. Modifier `EUROPEAN_COUNTRIES` dans `server/rooms/GeographyRoom.js`
2. Ajouter le mode dans `GAME_MODES` côté client
3. Mettre à jour la logique de validation serveur

### Personnaliser les règles
- **Temps par tour** : Modifier `turnTimeLeft` dans GeographyRoom
- **Points par réponse** : Modifier `player.score += 10`
- **Nombre de tours max** : Modifier `maxTurns`

### Debug
- **Console serveur** : Logs détaillés des actions de jeu
- **Console navigateur** : État des rooms et messages
- **Health check** : `GET http://localhost:2567/health`

## ⚠️ Limitations actuelles

- **Mode Europe uniquement** : Autres modes à implémenter
- **2 joueurs maximum** : Pas de support pour plus de joueurs
- **Pas d'indices** : Feature désactivée en multijoueur
- **Pas de reconnexion** : Les joueurs doivent recréer une room

## 🎯 Fonctionnalités futures

- [ ] Support des autres modes (Régions France, etc.)
- [ ] Système d'indices adapté au multijoueur
- [ ] Reconnexion automatique
- [ ] Spectateurs
- [ ] Parties privées avec mot de passe
- [ ] Statistiques persistantes
- [ ] Chat intégré

## 🐛 Résolution de problèmes

### Le serveur ne démarre pas
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur de connexion WebSocket
- Vérifiez que le serveur tourne sur le port 2567
- Vérifiez l'URL dans `src/hooks/useMultiplayer.js`

### Interface bloquée
- Rafraîchir la page
- Quitter et recréer la room

---

**🎮 Amusez-vous bien avec le mode multijoueur !** 