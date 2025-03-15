"use strict";

const VIDE = ' ';

const CT2D = [
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9,  10, 11, VIDE],
    [13, 14, 15, 12]
];
const NbLignes = CT2D.length;
const NbColonnes = NbLignes;
let Gagnant = false;
let NbDéplacements = 0;
let Meilleur = 0;
let Pire = 0;

function générerNombreRnd(max) {
    return Math.floor(Math.random() * max);
}

function créerTabNombresSeq(nbNombres) {
    return Array.from({ length: nbNombres }, (_, i) => i + 1);
}

function permuterCasesCT2D(l1, c1, l2, c2) {
    const temp = CT2D[l1][c1];
    CT2D[l1][c1] = CT2D[l2][c2];
    CT2D[l2][c2] = temp;
}

function adjacentEstVideCT2D(ligne, colonne) {
    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];

    for (const [dl, dc] of directions) {
        const newLigne = ligne + dl;
        const newColonne = colonne + dc;
        if (newLigne >= 0 && newLigne < NbLignes && newColonne >= 0 && newColonne < NbColonnes) {
            if (CT2D[newLigne][newColonne] === VIDE) {
                return [newLigne, newColonne];
            }
        }
    }
   
    return null;
}

function brasserCT2D() {
    let tabNombres = créerTabNombresSeq(NbLignes * NbColonnes - 1);
    tabNombres.push(VIDE); 

    for (let i = tabNombres.length - 1; i > 0; i--) {
        const j = générerNombreRnd(i + 1);
        [tabNombres[i], tabNombres[j]] = [tabNombres[j], tabNombres[i]];
    }

    for (let i = 0; i < NbLignes; i++) {
        for (let j = 0; j < NbColonnes; j++) {
            CT2D[i][j] = tabNombres[i * NbColonnes + j];
        }
    }
}

function estGagnant() {
    let count = 1;
    for (let i = 0; i < NbLignes; i++) {
        for (let j = 0; j < NbColonnes; j++) {
            if (i === NbLignes - 1 && j === NbColonnes - 1) {
                return CT2D[i][j] === VIDE;
            }
            if (CT2D[i][j] !== count++) {
                return false;
            }
        }
    }
    return true;
}

function créerHTMLCT2D() {
    const conteneur = document.createElement("div");
    conteneur.className = "casse_tete";

    for (let i = 0; i < NbLignes; i++) {
        const ligne = document.createElement("div");
        ligne.className = "ligne"; // Corrigé ici
        for (let j = 0; j < NbColonnes; j++) {
            const caseBtn = document.createElement("button"); // Corrigé ici
            caseBtn.className = "case";
            caseBtn.textContent = CT2D[i][j] === VIDE ? "" : CT2D[i][j];
            ligne.appendChild(caseBtn);
        }
        conteneur.appendChild(ligne);
    }
    return conteneur;
}

function initCaseOnClick() {
    const cases = document.querySelectorAll(".case");
    let index = 0;
    for (let l = 0; l < NbLignes; l++) {
        for (let c = 0; c < NbColonnes; c++) {
            cases[index].onclick = function() {
                déplacerCase(l, c);
            };
            index++;
        }
    }
}

function rafraichirHTMLCT2D() {
    const cases = document.querySelectorAll(".case");
    let index = 0;
    for (let l = 0; l < NbLignes; l++) {
        for (let c = 0; c < NbColonnes; c++) { // Corrigé ici
            cases[index].textContent = CT2D[l][c] === VIDE ? "" : CT2D[l][c];
            index++;
        }
    }
}

function rafraichirAffichage() {
    rafraichirHTMLCT2D();

    if (estGagnant()) {
        Gagnant = true;
        document.querySelector("#statut").textContent = "Bravo";
        if (NbDéplacements > Pire) Pire = NbDéplacements;
        if (NbDéplacements < Meilleur || Meilleur === 0) Meilleur = NbDéplacements;
    }
    
    document.querySelector("#courant").textContent = NbDéplacements;
    document.querySelector("#pire").textContent = Pire;
    document.querySelector("#meilleur").textContent = Meilleur;
}

function déplacerCase(l, c) {
    if (Gagnant) return;
    let estVide = adjacentEstVideCT2D(l, c);
    if (estVide !== null) {
        permuterCasesCT2D(l, c, estVide[0], estVide[1]);
        NbDéplacements += 1;
        rafraichirAffichage();
    }
}

function nouveau() {
    brasserCT2D();
    Gagnant = false;
    NbDéplacements = 0;
    document.querySelector("#statut").textContent = "";
    rafraichirAffichage();
}

// ajout au DOM de la représentation HTML du casse-tête
document.querySelector("#ct_conteneur").prepend(créerHTMLCT2D());
// installation des fonctions de rappel sur les cases du casse-tête
initCaseOnClick();
// installation de la fonction de rappel sur le bouton nouveau
document.querySelector("#nouveau").onclick = nouveau;
// Affichage initial du casse-tête
rafraichirHTMLCT2D();