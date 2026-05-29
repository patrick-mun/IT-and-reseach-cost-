/* =================================================================
   PROJET GÉNOME RÉUNION — SCRIPT D'INTERFACE
   JavaScript vanilla, sans dépendance externe.
   Quatre comportements :
     1. Menu de navigation repliable sur mobile
     2. Onglets de scénarios de génotypage
     3. Bouton « Réduire » en bas des sections repliables
     4. Ouverture auto d'une section ciblée par un lien d'ancrage
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
       3. BOUTON « RÉDUIRE » EN BAS DES SECTIONS REPLIABLES
       Quand une section est longue, on évite de remonter jusqu'au
       titre : un bouton ajouté en bas referme la section et ramène
       l'utilisateur à son en-tête.
       ------------------------------------------------------------- */
    function initSectionCollapse() {
        var folds = document.querySelectorAll(".sectionFold");

        folds.forEach(function (fold) {
            var body = fold.querySelector(".sectionFoldBody");
            var summary = fold.querySelector(".sectionFoldSummary");

            if (!body || !summary) {
                return;
            }

            // Bouton de repli généré dynamiquement (pas de HTML dupliqué).
            var collapseButton = document.createElement("button");
            collapseButton.type = "button";
            collapseButton.className = "sectionCollapseButton";
            collapseButton.innerHTML =
                "Réduire la section <span aria-hidden=\"true\">↑</span>";

            collapseButton.addEventListener("click", function () {
                fold.removeAttribute("open");
                // Ramène l'en-tête en haut de la fenêtre.
                summary.scrollIntoView({ behavior: "smooth", block: "start" });
            });

            body.appendChild(collapseButton);
        });
    }

    /* -------------------------------------------------------------
       4. OUVERTURE AUTOMATIQUE D'UNE SECTION CIBLÉE PAR UN LIEN
       Les sections étant repliées par défaut, un lien d'ancrage
       (#architecture, #budget…) doit déplier la section visée pour
       que l'utilisateur arrive sur du contenu, pas sur un titre seul.
       ------------------------------------------------------------- */
    function openTargetSection(hash) {
        if (!hash || hash.charAt(0) !== "#") {
            return;
        }

        var target = document.getElementById(hash.slice(1));
        if (!target) {
            return;
        }

        // La cible est soit une section contenant un <details>, soit
        // directement repérable à l'intérieur.
        var fold = target.querySelector(".sectionFold");
        if (fold) {
            fold.setAttribute("open", "");
        }
    }

    function initAnchorAutoOpen() {
        var anchors = document.querySelectorAll('a[href^="#"]');

        anchors.forEach(function (anchor) {
            anchor.addEventListener("click", function () {
                openTargetSection(anchor.getAttribute("href"));
            });
        });

        // Volontairement, on n'ouvre PAS la section au chargement même si
        // l'URL contient une ancre : la page doit toujours s'afficher
        // entièrement repliée.
    }

    /* -------------------------------------------------------------
       INITIALISATION
       On attend que le DOM soit prêt avant d'attacher les écouteurs.
       ------------------------------------------------------------- */
    document.addEventListener("DOMContentLoaded", function () {
        initNavToggle();
        initScenarioTabs();
        initSectionCollapse();
        initAnchorAutoOpen();
    });

})();
