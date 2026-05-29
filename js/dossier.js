/* =================================================================
   PROJET GÉNOME RÉUNION — DOSSIER COMPLET (script d'interface)
   JavaScript vanilla, sans dépendance externe.
   Un seul comportement : le bouton « Imprimer / Exporter en PDF »
   déclenche la boîte de dialogue d'impression du navigateur. Le
   contenu étant déjà entièrement déplié (pas d'accordéon ici), la
   feuille @media print suffit à produire un PDF propre.
   ================================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var printButton = document.getElementById("printButton");

        if (!printButton) {
            return;
        }

        printButton.addEventListener("click", function () {
            window.print();
        });
    });

})();
