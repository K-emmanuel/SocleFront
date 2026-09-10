import { pays } from "./data.js";
import { creerCarte } from "./ui.js";

const grille = document.querySelector("#country-grid");
const selectRegion = document.querySelector("#region");
const etatResultats = document.querySelector("#etat-resultats");
const detailPays = document.querySelector("#detail-pays");

const regions = [...new Set(pays.map((pays) => pays.region))];
regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    selectRegion.append(option);
});

function afficherPays(liste) {
    const fragment = document.createDocumentFragment();
    liste.forEach((pays) => fragment.append(creerCarte(pays)));
    grille.replaceChildren(fragment);
    etatResultats.textContent = `${liste.length} résultat${liste.length > 1 ? "s" : ""} affiché${liste.length > 1 ? "s" : ""}.`;
}

selectRegion.addEventListener("change", () => {
    const region = selectRegion.value;
    const paysFiltres = region === "Toutes" ? pays : pays.filter((pays) => pays.region === region);
    afficherPays(paysFiltres);
});

function afficherDetail(carte) {
    const paysSelectionne = pays.find((pays) => pays.code === carte.dataset.code);
    detailPays.replaceChildren();

    const titre = document.createElement("h3");
    titre.textContent = paysSelectionne.nom;
    const texte = document.createElement("p");
    texte.textContent = `${paysSelectionne.nom} a pour capitale ${paysSelectionne.capitale} et se trouve en ${paysSelectionne.region}.`;
    detailPays.append(titre, texte);
}

grille.addEventListener("click", (event) => {
    const carte = event.target.closest(".country-card");
    if (carte) afficherDetail(carte);
});

afficherPays(pays);