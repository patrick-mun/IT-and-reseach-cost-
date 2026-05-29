# Projet Génome Réunion — Landing page

Page de présentation statique du **plan de mise en place du projet Génome
Réunion** : évaluation des besoins matériels, humains et de l'intégration de
l'IA pour la création du premier référentiel génomique local de la population
réunionnaise.

## 🔗 Démo en ligne

La page est publiée via GitHub Pages :

**https://patrick-mun.github.io/IT-and-reseach-cost-/**

## Aperçu

La landing page synthétise et met en forme le document
[`Plan_Genome_Reunion_Structure_AI.md`](Plan_Genome_Reunion_Structure_AI.md) :

- **Contexte et architecture** — référentiel en trois couches (2500 génotypages
  SNP, 100 familles, 350 WGS pris en charge gratuitement par POPgen)
- **Phases** — frise des 7 phases sur 36 mois
- **Besoins matériels** — deux scénarios de génotypage (sous-traitance ou
  acquisition d'un iScan), infrastructure informatique, coûts biologiques
- **Ressources humaines** — trois propositions de montage d'équipe (charges
  patronales comprises)
- **Intégration de l'IA** — quatre modules (pathogénicité, pharmacogénétique,
  admixture, PRS) et stack technique
- **Budget** — récapitulatif, jalons, métriques de succès et analyse des risques

## Pile technique

100% **vanilla**, sans dépendance ni lien externe :

- **HTML5** sémantique
- **CSS3** dans une feuille externe (variables, grilles, responsive) — aucun
  style inline
- **JavaScript** vanilla dans un fichier externe (menu mobile, onglets de
  scénarios) — aucun script inline
- **Graphiques en SVG inline** faits main (schéma de flux, barres comparatives,
  courbe de stockage, répartition du budget RH)

## Structure du dépôt

```
.
├── index.html                          Page principale
├── css/
│   └── styles.css                      Feuille de style (sections numérotées)
├── js/
│   └── main.js                         Interactions (nav mobile, onglets)
├── Plan_Genome_Reunion_Structure_AI.md Document source détaillé
├── LICENSE
└── README.md
```

## Lancer en local

Aucune étape de build. Ouvrir directement `index.html` dans un navigateur, ou
servir le dossier avec un serveur statique :

```bash
# Python 3
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Conventions de code

- Classes CSS identifiables en **camelCase** (`heroSection`, `scenarioTabActive`,
  `propositionCardFeatured`…)
- Code indenté et commenté par blocs (table des matières en tête de chaque
  fichier)
- Pas de CSS ni de JS inline

## Licence

Voir le fichier [LICENSE](LICENSE).
