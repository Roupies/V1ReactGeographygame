// src/App.jsx
import React, { useState, useEffect } from 'react';
import MapChart from './components/game/MapChart/MapChart';
import './App.css';

// --- Définition des pays européens (sans coordonnées pour les micro-états ici) ---
const EUROPEAN_COUNTRIES = [
    { name: "Allemagne", isoCode: "DEU" },
    { name: "France", isoCode: "FRA" },
    { name: "Italie", isoCode: "ITA" },
    { name: "Espagne", isoCode: "ESP" },
    { name: "Pologne", isoCode: "POL" },
    { name: "Royaume-Uni", isoCode: "GBR" },
    { name: "Suède", isoCode: "SWE" },
    { name: "Norvège", isoCode: "NOR" },
    { name: "Finlande", isoCode: "FIN" },
    { name: "Autriche", isoCode: "AUT" },
    { name: "Belgique", isoCode: "BEL" },
    { name: "Pays-Bas", isoCode: "NLD" },
    { name: "Suisse", isoCode: "CHE" },
    { name: "Irlande", isoCode: "IRL" },
    { name: "Portugal", isoCode: "PRT" },
    { name: "Grèce", isoCode: "GRC" },
    { name: "Danemark", isoCode: "DNK" },
    { name: "Tchéquie", isoCode: "CZE" }, 
    { name: "Hongrie", isoCode: "HUN" },
    { name: "Croatie", isoCode: "HRV" },
    { name: "Slovaquie", isoCode: "SVK" },
    { name: "Slovénie", isoCode: "SVN" },
    { name: "Bosnie-Herzégovine", isoCode: "BIH" },
    { name: "Serbie", isoCode: "SRB" },
    { name: "Albanie", isoCode: "ALB" },
    { name: "Bulgarie", isoCode: "BGR" },
    { name: "Roumanie", isoCode: "ROU" },
    { name: "Ukraine", isoCode: "UKR" },
    { name: "Biélorussie", isoCode: "BLR" },
    { name: "Lituanie", isoCode: "LTU" },
    { name: "Lettonie", isoCode: "LVA" },
    { name: "Estonie", isoCode: "EST" },
    { name: "Islande", isoCode: "ISL" },
    { name: "Luxembourg", isoCode: "LUX" },
    { name: "Chypre", isoCode: "CYP" },
    { name: "Malte", isoCode: "MLT" },
    { name: "Kosovo", isoCode: "XKX" }, 
    { name: "Monténégro", isoCode: "MNE" },
    { name: "Macédoine du Nord", isoCode: "MKD" },
    { name: "Moldavie", isoCode: "MDA" }
];

// Pas de liste MICRO_STATES_ISO définie ici, car la logique est retirée de MapChart.

function App() {
    const [currentCountry, setCurrentCountry] = useState(null); 
    const [guessedCountries, setGuessedCountries] = useState([]); 
    const [guessInput, setGuessInput] = useState(''); 
    const [feedbackMessage, setFeedbackMessage] = useState(''); 

    const selectNewCountry = () => {
        const availableCountries = EUROPEAN_COUNTRIES.filter(
            country => !guessedCountries.some(gc => gc.isoCode === country.isoCode)
        );

        if (availableCountries.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCountries.length);
            setCurrentCountry(availableCountries[randomIndex]);
            setFeedbackMessage(''); 
        } else {
            setCurrentCountry(null); 
            setFeedbackMessage('Félicitations ! Vous avez deviné tous les pays !');
        }
    };

    useEffect(() => {
        selectNewCountry();
    }, []); 

    const handleGuess = () => {
        if (!currentCountry || !guessInput.trim()) {
            setFeedbackMessage("Veuillez saisir un nom de pays.");
            return;
        }

        const normalizedGuess = guessInput.trim().toLowerCase();
        const normalizedCountryName = currentCountry.name.toLowerCase();

        if (normalizedGuess === normalizedCountryName) {
            setFeedbackMessage(`Bonne réponse ! C'était ${currentCountry.name}.`);
            setGuessedCountries([...guessedCountries, currentCountry]); 
            setGuessInput(''); 
            setTimeout(() => {
                selectNewCountry();
            }, 500); 
        } else {
            setFeedbackMessage(`Faux. Ce n'est pas ${guessInput.trim()}.`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    };

    return (
        <div className="App">
            <div className="game-header">
                <h1>Mon Jeu de Cartes Européen (PoC)</h1>
                <div className="debug-info">
                    {currentCountry ? (
                        <p>Pays Actuel à deviner (PoC): {currentCountry.name} ({currentCountry.isoCode})</p>
                    ) : (
                        <p>Chargement du pays...</p>
                    )}
                    <p>Pays déjà devinés (PoC): {guessedCountries.map(c => c.name).join(', ') || 'Aucun'}</p>
                </div>
            </div>

            <div className="map-container">
                <MapChart 
                    currentCountry={currentCountry} 
                    guessedCountries={guessedCountries} 
                    // Les props allEuropeanCountries et microStatesIso ne sont plus passées
                />
            </div>

            <div className="game-controls">
                <input
                    type="text"
                    placeholder="Entrez le nom du pays..."
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyPress={handleKeyPress} 
                    disabled={!currentCountry} 
                />
                <button onClick={handleGuess} disabled={!currentCountry}>Deviner</button>
                {feedbackMessage && <p>{feedbackMessage}</p>}
            </div>
        </div>
    );
}

export default App;
