# Guide de Personnalisation UI avec GameManager 🎨

## UI Automatique et Personnalisable

Avec la nouvelle architecture GameManager, l'UI s'adapte **automatiquement** et peut être **entièrement personnalisée** pour chaque mode !

## 🚀 UI Automatique (Sans Configuration)

### Ce qui se met à jour automatiquement :

1. **Menu Principal** - Nouveaux boutons générés automatiquement
2. **Placeholders** - Texte d'input adapté au `unitLabel` du mode
3. **Messages de Feedback** - Personnalisés selon `feedbackMessages`
4. **Titre de Mode** - Utilise automatiquement le `label`
5. **Compteurs** - Adapte "pays/régions/capitales" selon `unitLabel`

### Exemple Minimal (UI Auto)
```javascript
// Dans gameModes.js - UI automatique
monNouveauMode: {
  label: "Départements Français",
  entities: FRENCH_DEPARTMENTS,
  unitLabel: 'départements',  // → "Entrez le nom du département"
  // ... rest of config
}
```

**Résultat :** Mode fonctionnel avec UI adaptée automatiquement ! ✨

## 🎨 Personnalisation Avancée de l'UI

### Toutes les Options Disponibles

```javascript
monModePersonnalise: {
  label: "Mon Mode Stylé",
  entities: MES_DONNEES,
  unitLabel: 'entités',
  
  // === PERSONNALISATIONS UI ===
  
  // Couleurs
  primaryColor: '#FF6B6B',        // Couleur principale des boutons
  secondaryColor: '#FF8E8E',      // Couleur au survol
  
  // Icônes et visuels  
  icon: '🎯',                     // Icône dans le bouton du menu
  headerTitle: '🎯 Mon Quiz Stylé', // Titre personnalisé
  
  // Textes personnalisés
  customPlaceholder: 'Devinez cette entité mystère !',
  
  // Effets visuels
  uiCustomization: {
    buttonGradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    hoverEffect: 'glow',          // 'glow' ou 'standard'
    theme: 'custom',
    backgroundImage: '/images/mon-background.jpg',
    successSound: '/sounds/success.mp3'
  },
  
  // Messages personnalisés avec emojis
  feedbackMessages: {
    victory: '🎉 Incroyable ! Vous avez tout trouvé !',
    hint: '💡 Indice : Cette entité commence par',
    correctAnswer: '✨ Parfait ! C\'était bien'
  }
}
```

## 🎭 Exemples de Thèmes Prêts

### 1. Mode Capitales (Style Gouvernemental)
```javascript
capitalesEurope: {
  label: "Capitales d'Europe",
  icon: '🏛️',
  primaryColor: '#8B4513',
  secondaryColor: '#CD853F',
  headerTitle: '🏛️ Quiz des Capitales Européennes',
  customPlaceholder: 'Quelle est cette capitale européenne ?',
  uiCustomization: {
    buttonGradient: 'linear-gradient(45deg, #8B4513, #CD853F)',
    hoverEffect: 'glow',
    theme: 'governmental'
  }
}
```

### 2. Mode Océans (Style Aquatique)
```javascript
oceans: {
  label: "Océans et Mers",
  icon: '🌊',
  primaryColor: '#0077BE',
  secondaryColor: '#87CEEB',
  headerTitle: '🌊 Explorez les Océans du Monde',
  customPlaceholder: 'Quel est le nom de cette étendue d\'eau ?',
  uiCustomization: {
    buttonGradient: 'linear-gradient(45deg, #0077BE, #87CEEB)',
    hoverEffect: 'glow',
    theme: 'aquatic'
  },
  feedbackMessages: {
    victory: '🐋 Félicitations ! Vous naviguez comme un expert !',
    hint: '🧭 Cette étendue d\'eau commence par',
    correctAnswer: '⚓ Exact ! C\'était bien'
  }
}
```

### 3. Mode Montagne (Style Aventure)
```javascript
montagnes: {
  label: "Sommets Européens",
  icon: '🏔️',
  primaryColor: '#8B7355',
  secondaryColor: '#A0522D',
  headerTitle: '🏔️ Conquérez les Sommets d\'Europe',
  customPlaceholder: 'Quel est le nom de ce sommet ?',
  uiCustomization: {
    buttonGradient: 'linear-gradient(45deg, #8B7355, #DEB887)',
    hoverEffect: 'glow',
    theme: 'mountain'
  },
  feedbackMessages: {
    victory: '🎯 Sommet atteint ! Vous êtes un alpiniste des connaissances !',
    hint: '🧗 Ce sommet commence par',
    correctAnswer: '⛰️ Bravo ! C\'était effectivement'
  }
}
```

## 🔧 API UI de GameManager

```javascript
// Récupérer les options UI basiques
const uiOptions = gameManager.getUIOptions('monMode', false);
// → { showHint: true, showSkip: true, scoreType: 'stars', timerType: 'countdown' }

// Récupérer les personnalisations UI complètes
const uiCustomization = gameManager.getUICustomization('monMode', false);
// → { primaryColor: '#FF6B6B', icon: '🎯', headerTitle: '...', ... }
```

## 📱 Composants qui s'Adaptent Automatiquement

### 1. HomeScreen
- ✅ **Boutons colorés** selon `primaryColor`
- ✅ **Icônes** selon `icon`
- ✅ **Effets de survol** selon `hoverEffect`
- ✅ **Dégradés** selon `buttonGradient`

### 2. GameControls  
- ✅ **Placeholder intelligent** avec `customPlaceholder` ou auto-généré
- ✅ **Couleurs** adaptées au thème du mode

### 3. Messages de Feedback
- ✅ **Messages personnalisés** avec emojis
- ✅ **Contexte automatique** (nom du pays, première lettre)

### 4. GameHeader (Futur)
- ✅ **Titre personnalisé** avec `headerTitle`
- ✅ **Icône** dans le header

## 🎯 Workflow de Création d'un Mode avec UI

### Étape 1 : Mode Basique (UI Auto)
```javascript
monMode: {
  label: "Mon Mode",
  entities: MES_DONNEES,
  unitLabel: 'entités',
  // ... config basique
}
```
→ Mode fonctionnel avec UI générique

### Étape 2 : Ajout de Couleurs
```javascript
monMode: {
  // ... config basique
  primaryColor: '#FF6B6B',
  secondaryColor: '#FF8E8E',
  icon: '🎯'
}
```
→ Mode avec couleurs et icône personnalisées

### Étape 3 : Personnalisation Complète
```javascript
monMode: {
  // ... config précédente  
  headerTitle: '🎯 Mon Quiz Personnalisé',
  customPlaceholder: 'Votre question personnalisée ?',
  uiCustomization: {
    buttonGradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    hoverEffect: 'glow'
  },
  feedbackMessages: {
    victory: '🎉 Message de victoire personnalisé !',
    // ...
  }
}
```
→ Mode entièrement personnalisé

## 🌟 Résultat

**Avant :** Ajouter un mode = coder l'UI manuellement  
**Après :** Ajouter un mode = configuration simple, UI automatique + personnalisable ! 

```javascript
// Un seul objet dans gameModes.js et vous obtenez :
// ✅ Bouton dans le menu avec couleurs/icône
// ✅ Placeholder adapté
// ✅ Messages personnalisés  
// ✅ Toute la logique de jeu
// ✅ Statistiques
// ✅ Multijoueur compatible
```

**L'UI suit automatiquement vos modes !** 🚀 