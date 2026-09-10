export function creerCarte(pays) {
    const carte = document.createElement("article");
    carte.className = "country-card";
    carte.dataset.code = pays.code;
    carte.tabIndex = 0;

    const nom = document.createElement("h3");
    nom.textContent = pays.nom;

    const capitale = document.createElement("p");
    capitale.textContent = `Capitale : ${pays.capitale}`;

    const region = document.createElement("p");
    region.textContent = `Région : ${pays.region}`;

    const population = document.createElement("p");
    population.textContent = `Population : ${pays.population}`;

    carte.append(nom, capitale, region, population);
    return carte;
}