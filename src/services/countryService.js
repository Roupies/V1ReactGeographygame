// src/services/countryService.js
import { mockEuropeCountries } from '../data/countries';

export const getEuropeCountries = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockEuropeCountries);
        }, 100);
    });
};

export const getCountryByIsoCode = async (isoCode) => {
    const countries = await getEuropeCountries();
    return countries.find(country => country.isoCode === isoCode);
};