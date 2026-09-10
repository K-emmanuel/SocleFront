import { chargerPaysEurope, chercherPays } from "./api.js";
import { creerCarte } from "./ui.js";

const grille = document.querySelector("#country-grid");
const recherchePays = document.querySelector("#recherche-pays");
const etatResultats = document.querySelector("#etat-resultats");
const etatInterface = document.querySelector("#etat-interface");
const detailPays = document.querySelector("#detail-pays");
let pays = [];
let paysAffiches = [];

function afficherPays(liste) {
    paysAffiches = liste;
    const fragment = document.createDocumentFragment();
    liste.forEach((pays) => fragment.append(creerCarte(pays)));
    grille.replaceChildren(fragment);
    etatResultats.textContent = `${liste.length} résultat${liste.length > 1 ? "s" : ""} affiché${liste.length > 1 ? "s" : ""}.`;
}

function afficherEtat(type, message) {
    etatInterface.replaceChildren();
    etatInterface.dataset.etat = type;
    const texte = document.createElement("p");
    texte.textContent = message;
    etatInterface.append(texte);
}

function afficherErreur(reessayer = chargerEurope) {
    afficherEtat("erreur", "Impossible de charger les pays.");
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = "Réessayer";
    bouton.addEventListener("click", reessayer);
    etatInterface.append(bouton);
}

async function chargerEurope() {
    afficherEtat("chargement", "Chargement des pays d'Europe…");
    try {
        pays = await chargerPaysEurope();
        afficherPays(pays);
        afficherEtat("succes", "");
    } catch {
        afficherErreur();
    }
}

async function rechercher(terme) {
    if (!terme.trim()) {
        afficherPays(pays);
        afficherEtat("succes", "");
        return;
    }

    afficherEtat("chargement", "Recherche en cours…");
    try {
        const resultats = await chercherPays(terme);
        afficherPays(resultats);
        afficherEtat("vide", resultats.length ? "" : "Aucun pays trouvé.");
    } catch {
        afficherErreur(() => rechercher(terme));
    }
}

let rechercheEnAttente;
recherchePays.addEventListener("input", () => {
    clearTimeout(rechercheEnAttente);
    rechercheEnAttente = setTimeout(() => rechercher(recherchePays.value), 300);
});

function afficherDetail(carte) {
    const paysSelectionne = paysAffiches.find((pays) => pays.code === carte.dataset.code);
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

chargerEurope();