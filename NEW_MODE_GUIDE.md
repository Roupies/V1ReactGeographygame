# Guide : Ajouter un nouveau mode de jeu avec GameManager

## Architecture refactorisée 🚀

La nouvelle architecture utilise **GameManager** pour centraliser toute la logique de jeu, rendant l'ajout de nouveaux modes extrêmement simple et modulaire.

## Avantages de la refactorisation

### Avant (architecture couplée)
- Logique dispersée dans plusieurs fichiers
- Hooks dépendants des modes spécifiques
- Ajout de nouveaux modes = modifications multiples
- Code non réutilisable

### Après (architecture avec GameManager)
- ✅ **Logique centralisée** dans GameManager
- ✅ **Hooks agnostiques** aux modes de jeu
- ✅ **Ajout de modes en 1 seul endroit**
- ✅ **Code entièrement réutilisable**

## Comment ajouter un nouveau mode en 3 étapes

### 1. Créer les données du mode (fichier unique)

Dans `src/data/gameModes.js`, ajoutez simplement :

```javascript
// Exemple : Mode Capitales Européennes
europeCapitals: {
  label: "Capitales d'Europe",
  entities: EUROPEAN_CAPITALS, // Vos données
  geoJsonFile: 'europe.json',
  geoIdProperty: 'ISO_A3',
  unitLabel: 'capitales',
  projectionConfig: { 
    rotate: [-8, -50, 0],
    scale: 550
  },
  victoryCondition: 'all_entities',
  feedbackMessages: {
    victory: 'Bravo ! Vous connaissez toutes les capitales !',
    hint: 'Cette capitale commence par la lettre',
    correctAnswer: 'Exact ! C\'était'
  },
  showHint: true,
  showSkip: true,
  scoreType: 'stars',
  timerType: 'countdown'
}
```

### 2. C'est tout ! 🎉

Seriously. Votre nouveau mode apparaît automatiquement :
- ✅ Dans le menu de sélection
- ✅ Avec toute la logique de jeu
- ✅ Avec les statistiques
- ✅ Avec les feedbacks personnalisés
- ✅ Compatible multijoueur (si désiré)

### 3. Mode avancé : Dual Map (optionnel)

Pour des modes avec plusieurs cartes (comme France + DOM-TOM) :

```javascript
franceAdvanced: {
  label: "France Avancée",
  entities: FRENCH_DATA,
  unitLabel: 'régions',
  geoIdProperty: 'code',
  zones: [
    {
      name: "Métropole",
      geoJsonFile: 'france-metro.geojson',
      projectionConfig: { rotate: [-2, -46, 0], scale: 1800 },
      regionCodes: ['11', '24', '27', ...]
    },
    {
      name: "Outre-mer", 
      geoJsonFile: 'outre-mer.geojson',
      projectionConfig: { rotate: [55, 5, 0], scale: 800 },
      regionCodes: ['01', '02', '03', ...]
    }
  ],
  layout: { type: 'dual', orientation: 'horizontal' },
  // ... reste de la config
}
```

## GameManager : API complète

```javascript
// Récupérer un mode
const mode = gameManager.getMode('europe', false);

// Récupérer les entités d'un mode
const entities = gameManager.getEntities('europe', false);

// Valider une réponse
const isCorrect = gameManager.validateAnswer('France', entity);

// Récupérer un message de feedback
const message = gameManager.getFeedbackMessage('europe', 'hint', false, {firstLetter: 'F'});

// Récupérer le chemin GeoJSON
const path = gameManager.getGeoJsonPath('europe', false);

// Vérifier les conditions de victoire
const victory = gameManager.checkVictoryCondition('europe', gameState, false);

// Options d'UI
const uiOptions = gameManager.getUIOptions('europe', false);
```

## Exemples de nouveaux modes possibles

### Mode Départements Français
```javascript
franceDepartments: {
  label: "Départements français",
  entities: FRENCH_DEPARTMENTS,
  geoJsonFile: 'france-departments.json',
  geoIdProperty: 'code_dept',
  // ... config
}
```

### Mode Fastest (course contre la montre)
```javascript
fastest: {
  label: "Mode Rapide (30s)",
  entities: EUROPEAN_COUNTRIES.slice(0, 10),
  victoryCondition: 'time_based',
  scoreType: 'points',
  timerType: 'countdown',
  timeLimit: 30,
  // ... config
}
```

### Mode Difficile (sans indices)
```javascript
hardMode: {
  label: "Mode Expert",
  entities: EUROPEAN_COUNTRIES,
  showHint: false,
  showSkip: false,
  feedbackMessages: {
    victory: 'Incroyable ! Vous êtes un expert !',
    correctAnswer: 'Parfait !'
  },
  // ... config
}
```

## Hooks agnostiques

Tous les hooks sont maintenant **complètement agnostiques** :

- `useGameState` → Gère n'importe quelles entités
- `useGameActions` → Utilise GameManager pour validation
- `useGameLogic` → Orchestre tout via GameManager
- `useGameStatistics` → Calculs génériques

## Bénéfices pour l'équipe

1. **Développement rapide** : Nouveaux modes en quelques minutes
2. **Moins d'erreurs** : Logique centralisée et testée
3. **Code maintenable** : Séparation claire des responsabilités
4. **Scalabilité** : Architecture prête pour de nombreux modes
5. **Réutilisabilité** : Hooks utilisables pour d'autres projets

## Mode Test inclus

Un mode `test` avec seulement 5 pays européens est inclus pour tester rapidement les nouvelles fonctionnalités !

---

**TL;DR** : Ajoutez un objet dans `gameModes.js` et votre nouveau mode fonctionne automatiquement dans toute l'application ! 🚀 