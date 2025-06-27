import { EUROPEAN_COUNTRIES } from './countries';
import { FRENCH_REGIONS } from './regions';
// import { FRENCH_REGIONS } from './regions'; // À créer plus tard

export const GAME_MODES = {
  europe: {
    label: "Pays d'Europe",
    entities: EUROPEAN_COUNTRIES,
    geoJson: '/geojson/europe.json',
    getName: entity => entity.name,
    getAltNames: entity => entity.altNames || [],
    unitLabel: 'pays',
    geoIdProperty: 'ISO_A3',
    projectionConfig: { rotate: [-5, -35, 0], scale: 350 },
  },
  franceRegions: {
    label: "Régions de France",
    entities: FRENCH_REGIONS,
    geoJson: '/geojson/regions.geojson',
    getName: entity => entity.name,
    getAltNames: entity => entity.altNames || [],
    unitLabel: 'régions',
    geoIdProperty: 'code',
    projectionConfig: { rotate: [-2, -44, 0], scale: 1800 },
  },
  // Tu pourras ajouter d'autres modes ici plus tard
}; 