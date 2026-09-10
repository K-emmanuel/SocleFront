const API_URL = "https://restcountries.com/v3.1";
const SECOURS_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const POPULATION_URL = "https://countriesnow.space/api/v0.1/countries/population";

const regions = {
    Europe: "Europe",
    Africa: "Afrique",
    Americas: "Amériques",
    Asia: "Asie",
    Oceania: "Océanie"
};

const capitales = {
    Vienna: "Vienne",
    Brussels: "Bruxelles",
    Nicosia: "Nicosie",
    Copenhagen: "Copenhague",
    Athens: "Athènes",
    Warsaw: "Varsovie",
    Lisbon: "Lisbonne",
    Bucharest: "Bucarest",
    Moscow: "Moscou",
    Bern: "Berne",
    London: "Londres",
    Kyiv: "Kiev"
};

function normaliserPays(pays, populations = {}) {
    const population = pays.population ?? populations[pays.cca3] ?? 0;
    return {
        nom: pays.translations?.fra?.common ?? pays.name?.common ?? "Pays inconnu",
        capitale: capitales[pays.capital?.[0]] ?? pays.capital?.[0] ?? "Capitale inconnue",
        region: regions[pays.region] ?? pays.region ?? "Région inconnue",
        population: new Intl.NumberFormat("fr-FR").format(population),
        code: pays.cca2 ?? pays.cca3
    };
}

async function recupererPays(url) {
    const reponse = await fetch(url);
    if (reponse.status === 404) return [];
    if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`);

    const donnees = await reponse.json();
    if (!Array.isArray(donnees)) throw new Error("API indisponible");
    return donnees.map(normaliserPays);
}

async function recupererAvecSecours(url, filtre) {
    try {
        return await recupererPays(url);
    } catch {
        const reponse = await fetch(SECOURS_URL);
        if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`);
        const donnees = await reponse.json();
        const populationReponse = await fetch(POPULATION_URL);
        const populationDonnees = populationReponse.ok ? await populationReponse.json() : { data: [] };
        const populations = Object.fromEntries(
            populationDonnees.data.map((pays) => [
                pays.iso3,
                pays.populationCounts.at(-1)?.value ?? 0
            ])
        );
        return donnees.filter(filtre).map((pays) => normaliserPays(pays, populations));
    }
}

export function chercherPays(nom) {
    const terme = encodeURIComponent(nom.trim());
    return recupererAvecSecours(
        `${API_URL}/name/${terme}?fields=name,capital,region,population,cca2,cca3,translations`,
        (pays) => {
            const recherche = nom.trim().toLowerCase();
            const nomAnglais = pays.name?.common?.toLowerCase() ?? "";
            const nomFrancais = pays.translations?.fra?.common?.toLowerCase() ?? "";
            return nomAnglais.includes(recherche) || nomFrancais.includes(recherche);
        }
    );
}

export function chargerPaysEurope() {
    return recupererAvecSecours(
        `${API_URL}/region/europe?fields=name,capital,region,population,cca2,cca3,translations`,
        (pays) => pays.region === "Europe"
    );
}
