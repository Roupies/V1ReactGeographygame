# 📦 Shared Data Module

Ce module contient toutes les données et utilitaires partagés entre le client et le serveur pour éviter la duplication et garantir la synchronisation.

## 🏗️ Structure

```
shared/
├── data/
│   └── entities.js     # Données des pays, régions et fonctions utilitaires
├── package.json        # Configuration du module ES
└── README.md          # Cette documentation
```

## 📊 Contenu

### Données disponibles :
- **`EUROPEAN_COUNTRIES`** : 46 pays européens avec noms français et codes ISO
- **`FRENCH_REGIONS`** : 18 régions françaises (métropole + DOM-TOM) avec codes
- **`EUROPEAN_SUBREGIONS`** : Classification par sous-régions
- **`GAME_MODE_CONFIGS`** : Configurations serveur pour les modes de jeu

### Fonctions utilitaires :
- **`normalizeString(str)`** : Normalisation NFD + suppression accents pour la validation
- **`validateAnswer(guess, correctAnswer, entities)`** : Validation unifiée client-serveur

## 🔄 Utilisation

### Côté Client (React)
```javascript
import { EUROPEAN_COUNTRIES, FRENCH_REGIONS } from '../../shared/data/entities.js';
```

### Côté Serveur (Node.js)
```javascript
import { GAME_MODE_CONFIGS, validateAnswer } from '../../shared/data/entities.js';
```

## ✅ Avantages

1. **Synchronisation garantie** : Client et serveur utilisent exactement les mêmes données
2. **Maintenance simplifiée** : Une seule source de vérité pour toutes les données
3. **Validation cohérente** : Même logique de normalisation et validation partout
4. **Pas de duplication** : Élimination des doublons entre client/serveur

## 🚀 Évolutions

Pour ajouter de nouveaux pays ou régions, il suffit de modifier `entities.js` et les changements sont automatiquement propagés côté client ET serveur. 