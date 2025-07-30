# 🕐 Guide de Test - Synchronisation Timer

## ✅ **Corrections Appliquées**

### **1. Suppression Doublon Timer**
- ❌ `useTimer.js` → **SUPPRIMÉ** (obsolète)
- ✅ `useGameTimer.js` → **RENOMMÉ** pour clarté
- ✅ Un seul hook timer maintenant

### **2. Synchronisation Timer Multiplayer**
- ✅ **Gestionnaire `gameTimeUpdate`** ajouté dans `useMultiplayer.js`
- ✅ **`gameTimeLeft`** ajouté dans l'état initial (240s)
- ✅ **Timer serveur** synchronisé avec clients

### **3. Configuration Timer Mode Race**
- ✅ `timerSyncServer: true` pour mode europeRace
- ✅ Timer global de 4 minutes (240s)
- ✅ Diffusion automatique des updates timer

## 🧪 **Test de Synchronisation**

### **Étape 1 : Ouvrir Deux Onglets**
```
Onglet A: http://localhost:5173
Onglet B: http://localhost:5173
```

### **Étape 2 : Rejoindre Mode Race**
1. Dans chaque onglet : **Multijoueur** → **Europe Race**
2. Créer/Rejoindre la même room
3. Les deux joueurs appuient sur **"Prêt"**

### **Étape 3 : Vérifier Synchronisation**
- ✅ **Timer démarre** : 04:00 → 03:59 → 03:58...
- ✅ **Même temps** dans les deux onglets (max 1s de différence)
- ✅ **Pas de +5s** de décalage entre joueurs

### **Étape 4 : Test Pendant Partie**
- Jouer quelques pays
- Vérifier que le timer reste synchronisé
- Observer les messages serveur dans la console

## 🔍 **Logs à Observer**

### **Console Serveur**
```bash
🕐 Démarrage timer global: 240s (mode: europeRace)
Starting game!
Current country: Monaco
Maxime found Monaco! Score: 10
# Timer updates toutes les secondes
```

### **Console Client**
```javascript
// Messages reçus du serveur
gameTimeUpdate: { timeLeft: 239 }
gameTimeUpdate: { timeLeft: 238 }
gameTimeUpdate: { timeLeft: 237 }
```

### **Debug Timer**
Dans la console browser :
```javascript
// Vérifier l'état du timer
console.log('Timer state:', timer);
console.log('Game time left:', gameState.gameTimeLeft);
```

## ❌ **Problèmes Potentiels**

### **Si Timer Pas Synchronisé**
1. Vérifier que le serveur envoie `gameTimeUpdate`
2. Vérifier que le client reçoit les messages
3. Redémarrer serveur + client

### **Si Erreurs Import**
```javascript
// Erreur possible
import { useTimer } from './useTimer'; // ❌ N'existe plus

// Correction
import { useGameTimer } from './useGameTimer'; // ✅ Correct
```

### **Si gameTimeLeft Undefined**
Vérifier que l'état initial dans `useMultiplayer.js` contient :
```javascript
gameTimeLeft: 240
```

## 🎯 **Résultat Attendu**

**Après corrections :**
- ✅ **Pas de doublons** timer hooks
- ✅ **Synchronisation parfaite** (±1s max)
- ✅ **Mode race** avec timer global
- ✅ **Timer affiché** identique pour tous

**Avant vs Après :**
```
Avant: Joueur A: 03:45 | Joueur B: 03:40 (+5s décalage) ❌
Après: Joueur A: 03:45 | Joueur B: 03:45 (synchronisé) ✅
```

## 🚀 **Test Final**

1. **Lance** deux onglets
2. **Rejoins** Europe Race
3. **Vérifie** que les timers sont identiques
4. **Confirme** la synchronisation parfaite

**Si ça marche : Timer synchronisé résolu ! 🎉** 