# 🎨 Charte Graphique - Mini Jeu Géographie

## 📋 Vue d'ensemble

Cette charte graphique a été conçue pour créer une cohérence visuelle parfaite entre la carte du jeu et les menus, en s'inspirant de l'esthétique claire et moderne de la carte.

## 🎨 Palette de Couleurs

### Couleurs Principales
- **Fond principal** : `#F8F9FA` - Blanc cassé très léger
- **Fond secondaire** : `#E9ECEF` - Gris très clair pour les zones de contenu
- **Couleur d'accent** : `#6B9080` - Vert sage doux (boutons principaux)
- **Texte principal** : `#495057` - Gris foncé doux (pas de noir pur)
- **Texte secondaire** : `#6C757D` - Gris moyen

### Couleurs Complémentaires
- **Bleu pastel** : `#A8DADC` - Pour les modes alternatifs
- **Orange doux** : `#F4A261` - Pour les modes régionaux
- **Gris plus foncé** : `#DEE2E6` - Pour les états hover

### Couleurs d'État
- **Succès** : `#6B9080` (vert sage)
- **Erreur** : `#721C24` (rouge foncé) avec fond `#F8D7DA`
- **Désactivé** : `#E9ECEF` avec texte `#6C757D`

## 🔤 Typographie

### Hiérarchie
- **Titres principaux** : `fontWeight: '600'` (semi-bold)
- **Sous-titres** : `fontWeight: '500'` (medium)
- **Texte courant** : `fontWeight: '400'` (regular)

### Tailles
- **Titre principal** : `2.5em` (desktop) / `2em` (mobile)
- **Sous-titres** : `1.8em` (desktop) / `1.5em` (mobile)
- **Boutons** : `1.1em`
- **Texte courant** : `1em`

## 🎯 Composants

### Boutons
- **Bordure arrondie** : `16px` (boutons principaux) / `12px` (boutons secondaires)
- **Padding** : `20px 40px` (boutons principaux) / `15px 30px` (boutons secondaires)
- **Ombre** : `0 2px 8px rgba(0, 0, 0, 0.1)` (subtile)
- **Transition** : `all 0.3s ease`

### Champs de saisie
- **Bordure** : `1px solid #DEE2E6`
- **Bordure focus** : `1px solid #6B9080` avec `box-shadow: 0 0 0 2px rgba(107, 144, 128, 0.2)`
- **Bordure arrondie** : `12px`
- **Fond** : `white`

### Cartes/Conteneurs
- **Bordure arrondie** : `16px`
- **Ombre** : `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Espacement** : `24px` entre éléments

## 🎮 Modes de Jeu - Couleurs Spécifiques

### Mode Solo
- **Couleur principale** : `#A8DADC` (bleu pastel)
- **Texte** : `#495057` (gris foncé)

### Mode Multijoueur
- **Couleur principale** : `#6B9080` (vert sage)
- **Texte** : `white`

### Modes Spécifiques
- **Europe** : `#6B9080` (vert sage)
- **Course Europe** : `#A8DADC` (bleu pastel)
- **Régions françaises** : `#F4A261` (orange doux)

## 📱 Responsive Design

### Breakpoints
- **Mobile** : `≤ 480px`
- **Tablet** : `≤ 768px`
- **Desktop** : `> 768px`

### Adaptations
- **Boutons** : Passage en colonne sur mobile
- **Titres** : Taille réduite sur mobile
- **Espacement** : Réduit sur mobile

## 🎨 États Interactifs

### Hover
- **Boutons** : `translateY(-2px)` + ombre plus prononcée
- **Couleur** : Version légèrement plus foncée
- **Transition** : `0.3s ease`

### Focus
- **Champs** : Bordure verte + ombre verte
- **Boutons** : Ombre plus prononcée

### Disabled
- **Couleur** : Gris clair
- **Texte** : Gris moyen
- **Cursor** : `not-allowed`

## 🔧 Implémentation

### Variables CSS (recommandé)
```css
:root {
  /* Couleurs principales */
  --color-primary: #6B9080;
  --color-secondary: #A8DADC;
  --color-accent: #F4A261;
  --color-background: #F8F9FA;
  --color-surface: #E9ECEF;
  --color-text: #495057;
  --color-text-secondary: #6C757D;
  
  /* Bordures */
  --border-radius: 16px;
  --border-radius-small: 12px;
  
  /* Ombres */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

### Utilisation
Cette charte est actuellement appliquée aux composants :
- `HomeScreen.jsx`
- `ModeSelectionScreen.jsx`
- `LobbyScreen.jsx`

## 🎯 Objectifs

1. **Cohérence visuelle** avec la carte du jeu
2. **Lisibilité optimale** avec des contrastes doux
3. **Modernité** avec un design épuré
4. **Accessibilité** avec des couleurs respectueuses
5. **Évolutivité** pour de futurs composants

## 📝 Notes

- Éviter les couleurs saturées
- Privilégier les contrastes doux
- Maintenir l'espacement généreux
- Utiliser des transitions fluides
- Respecter la hiérarchie visuelle 