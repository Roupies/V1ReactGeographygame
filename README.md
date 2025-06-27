# Europe Geography Game

Un jeu interactif de géographie pour deviner les pays d'Europe sur une carte.

## Fonctionnalités

- Carte interactive de l'Europe (données GeoJSON)
- Devinez les pays à partir de leur position sur la carte
- Système de score et de timer
- Indices et possibilité de passer un pays
- Interface moderne et responsive

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd V1ReactGeographygame
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le projet en développement :
   ```bash
   npm run dev
   ```

4. Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Structure du projet

- `src/components/` : Composants React (dont la carte)
- `src/hooks/` : Hooks personnalisés pour la logique de jeu et le timer
- `src/data/` : Données statiques (liste des pays)
- `src/services/` : Services pour la gestion des pays
- `public/geojson/` : Fichiers GeoJSON pour la carte

## Dépendances principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-simple-maps](https://www.react-simple-maps.io/)

## Améliorations possibles

- Ajouter des tests unitaires
- Ajouter la traduction (i18n)
- Améliorer l'accessibilité (a11y)
- Ajouter d'autres régions du monde

---

**Auteur** : Maxime
