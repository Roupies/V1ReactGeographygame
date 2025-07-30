# 🐛 Guide de Débogage Timer - Erreurs Corrigées

## ❌ **Erreurs Rencontrées**

### **1. SyntaxError: Unexpected identifier 'timerType'**
```
[vite] SyntaxError: Unexpected identifier 'timerType'
```

**Cause** : Problème dans la structure des objets de configuration
**Résolution** : Vérification de la syntaxe des configurations de mode

### **2. useTimer is not defined**
```
ReferenceError: useTimer is not defined at useGameLogic
```

**Cause** : 
- Import manquant ou incorrect de `useUnifiedTimer`
- Confusion avec l'ancien `useTimer.js` qui existe encore
- Cache Vite qui garde les anciens imports

**Résolution** :
1. Renommage `useUnifiedTimer` → `useGameTimer` pour éviter les conflits
2. Nettoyage cache Vite : `rm -rf node_modules/.vite`
3. Redémarrage serveur de développement

### **3. Cannot read properties of undefined (reading 'timeLeft')**
```
TypeError: Cannot read properties of undefined (reading 'timeLeft')
```

**Cause** : `timer` peut être `undefined` pendant le chargement initial
**Résolution** : Ajout de vérifications de sécurité avec `timer?.timeLeft || 0`

### **4. GameManager.getTimerConfig incomplet**
```
timerDisplay, timerAutoStart, timerSyncServer undefined
```

**Cause** : `getTimerConfig` ne retournait que `type` et `seconds`
**Résolution** : Extension de la méthode pour retourner toutes les propriétés timer

## ✅ **Corrections Appliquées**

### **1. Sécurisation des accès timer**
```javascript
// src/hooks/useGameLogic.js
return {
    timeLeft: timer?.timeLeft || 0,
    gameTimeSeconds: timer?.gameTimeSeconds || 240,
    formatTime: timer?.formatTime || (() => '00:00'),
    timer: timer, // Exposer le timer complet
};
```

### **2. Correction GameManager.getTimerConfig**
```javascript
// src/services/GameManager.js
getTimerConfig(modeKey, isMultiplayer = false) {
    const mode = this.getMode(modeKey, isMultiplayer);
    if (!mode) return { 
        type: 'countdown', 
        seconds: 180,
        timerDisplay: true,
        timerAutoStart: true,
        timerSyncServer: false
    };
    
    return {
        type: mode.timerType || 'countdown',
        seconds: mode.timerSeconds || 180,
        timerDisplay: mode.timerDisplay !== false,
        timerAutoStart: mode.timerAutoStart !== false,
        timerSyncServer: mode.timerSyncServer === true
    };
}
```

### **3. Renommage pour éviter conflits**
```javascript
// Avant
import { useUnifiedTimer } from './useUnifiedTimer';
const timer = useUnifiedTimer(...);

// Après  
import { useGameTimer } from './useUnifiedTimer';
const timer = useGameTimer(...);
```

### **4. Nettoyage cache et redémarrage**
```bash
# Nettoyage cache Vite
rm -rf node_modules/.vite && rm -rf dist

# Arrêt processus Vite
pkill -f "vite"

# Redémarrage serveur
npm run dev
```

## 🔧 **Prévention Future**

### **1. Gestion des États Undefined**
```javascript
// Toujours vérifier avant d'accéder aux propriétés
const timeLeft = timer?.timeLeft || 0;
const isRunning = timer?.isRunning || false;
```

### **2. Configuration Complète**
```javascript
// S'assurer que toutes les propriétés sont définies
const defaultConfig = {
    type: 'countdown',
    seconds: 240,
    timerDisplay: true,
    timerAutoStart: true,
    timerSyncServer: false
};
```

### **3. Nommage Explicite**
```javascript
// Éviter les noms génériques qui peuvent créer des conflits
// ❌ useTimer (trop générique)
// ✅ useGameTimer (spécifique au contexte)
```

### **4. Tests de Régression**
```javascript
// Vérifier que les hooks retournent les bonnes propriétés
const timer = useGameTimer('europe', false, false, null);
console.assert(timer.timeLeft !== undefined, 'timeLeft should be defined');
console.assert(timer.config !== undefined, 'config should be defined');
```

## 🎯 **Statut Final**

- ✅ **Serveur de développement** : Fonctionne
- ✅ **Timer unifié** : Opérationnel  
- ✅ **Configuration centralisée** : Active
- ✅ **Gestion erreurs** : Robuste
- ✅ **Cache** : Nettoyé

**La refactorisation timer est maintenant stable et fonctionnelle !** 🚀 