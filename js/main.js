/* =================================================================
   PROJET GÉNOME RÉUNION — SCRIPT D'INTERFACE
   JavaScript vanilla, sans dépendance externe.
   Deux comportements :
     1. Menu de navigation repliable sur mobile
     2. Onglets de scénarios de génotypage
   ================================================================= */

(function () {
    "use strict";

    /* -------------------------------------------------------------
       1. MENU DE NAVIGATION MOBILE
       Le bouton hamburger affiche/masque la liste des liens et
       met à jour l'attribut ARIA d'accessibilité.
       ------------------------------------------------------------- */
    function initNavToggle() {
        var toggleButton = document.querySelector(".navToggle");
        var navMenu = document.querySelector(".navMenu");

        // Sécurité : on n'agit que si les deux éléments existent.
        if (!toggleButton || !navMenu) {
            return;
        }

        // Ouverture / fermeture au clic sur le bouton.
        toggleButton.addEventListener("click", function () {
            var isOpen = navMenu.classList.toggle("navMenuOpen");
            toggleButton.setAttribute("aria-expanded", String(isOpen));
        });

        // Fermeture automatique après le choix d'un lien (mobile).
        var navLinks = navMenu.querySelectorAll(".navLink");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("navMenuOpen");
                toggleButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* -------------------------------------------------------------
       2. ONGLETS DE SCÉNARIOS
       Chaque onglet porte un attribut data-scenario. Au clic, on
       active l'onglet et son panneau correspondant, et on masque
       les autres.
       ------------------------------------------------------------- */
    function initScenarioTabs() {
        var tabs = document.querySelectorAll(".scenarioTab");
        var panels = document.querySelectorAll(".scenarioPanel");

        if (tabs.length === 0) {
            return;
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var target = tab.getAttribute("data-scenario");

                // Réinitialise l'état de tous les onglets.
                tabs.forEach(function (otherTab) {
                    otherTab.classList.remove("scenarioTabActive");
                    otherTab.setAttribute("aria-selected", "false");
                });

                // Active l'onglet cliqué.
                tab.classList.add("scenarioTabActive");
                tab.setAttribute("aria-selected", "true");

                // Affiche le panneau correspondant, masque les autres.
                panels.forEach(function (panel) {
                    var isMatch = panel.getAttribute("data-scenario") === target;
                    panel.classList.toggle("scenarioPanelActive", isMatch);
                    panel.hidden = !isMatch;
                });
            });
        });
    }

    /* -------------------------------------------------------------
       INITIALISATION
       On attend que le DOM soit prêt avant d'attacher les écouteurs.
       ------------------------------------------------------------- */
    document.addEventListener("DOMContentLoaded", function () {
        initNavToggle();
        initScenarioTabs();
    });

})();
