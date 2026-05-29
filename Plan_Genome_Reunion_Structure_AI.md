# PROJET GÉNOME RÉUNION
## Plan de mise en place économique
**Évaluation des besoins en matériels et personnels** | *Mai 2026*

---

## Table des matières

1. [Contexte et périmètre](#1-contexte-et-périmètre)
2. [Architecture de la solution](#2-architecture-de-la-solution)
3. [Phases de mise en place](#3-phases-de-mise-en-place)
4. [Besoins matériels par phase](#4-besoins-matériels-par-phase)
5. [Besoins en ressources humaines](#5-besoins-en-ressources-humaines)
6. [Intégration de l'IA](#6-intégration-de-lia)
7. [Chronogramme et budget](#7-chronogramme-et-budget)

---

## 1. Contexte et périmètre

Le projet Génome Réunion crée un **référentiel génomique local de première génération** spécifique à la population réunionnaise. Il répond à la sous-représentation des populations non-européennes dans les bases internationales (gnomAD, 1000 Genomes).

### Architecture du référentiel (extrait des fichiers de référence)

La méthodologie repose sur **trois couches complémentaires** :

```
2500 individus génotypés sur puce GDA-8 (1,9M SNP)
        +
100 familles nucléaires SNP (~300 individus supplémentaires)
        ↓
PCA / ADMIXTURE / IBD / ROH → sélection hybride géo-ancestrale
        ↓
350 WGS sélectionnés → séquençage par le consortium POPgen (GRATUIT)
        ↓
Référentiel variants + imputation + phasage réunionnais
```

> ⚠️ **Point crucial** : Le séquençage WGS (350 individus) est **pris en charge par POPgen**. Le coût du projet côté laboratoire porte essentiellement sur le **génotypage iScan** des 2500 + ~300 familles, auquel s'ajoutent l'extraction d'ADN et la conservation des échantillons au CRB.

### Chiffres clés du projet

| Paramètre | Valeur | Source |
|-----------|--------|--------|
| Cohorte populationnelle | **2500 individus** | METHODOLOGY_selection_V3_5 |
| Module familial | **100 familles nucléaires** (~300 individus) | METHODOLOGY_selection_V3_5 |
| Sélection WGS | **350 individus** (parmi les 2500) | METHODOLOGY_selection_V3_5 |
| Séquençage WGS | **POPgen (coût = 0€)** | Projet Génome PMU |
| Puce SNP | **GDA-8, ~1,9M SNP** (Illumina) | Projet Génome PMU |
| Total génotypages | **~2800 puces** (2500 + familles) | Calculé |

---

## 2. Architecture de la solution

### Composantes de la plateforme

| Composante | Description | Technologie |
|------------|-------------|-------------|
| **Génotypage** | Puce GDA-8 via iScan | Illumina iScan + GDA-8 |
| **Analyse génomique** | PCA, ADMIXTURE, IBD, ROH | PLINK2, KING, SHAPEIT |
| **Sélection WGS** | Score hybride géo-ancestral S_div | Pipeline Python maison |
| **Pipelines bioinformatiques** | QC, alignement, calling | Nextflow / Snakemake |
| **Base de données** | Variants, métadonnées, fréquences | PostgreSQL + MongoDB |
| **Interface clinique** | Portail web, API | Django (full Python) |
| **Modules IA** | Pathogénicité, PGx, admixture, risque | PyTorch + TensorFlow |

---

## 3. Phases de mise en place

### Vue d'ensemble des phases

```
PHASE 0 (semaines 1-12, parallèle)
└─ Accès et harmonisation panels témoins (1000G, EGA, MGUA...)

PHASE 1 (semaines 1-10)
└─ Validation externe + simulation (1000G high-coverage)

PHASE 2 (semaines 11-20)
└─ Cohorte Réunion SNP : QC 2500 + PCA/ADMIXTURE + sélection 350

PHASE 3 (parallèle à Phase 2)
└─ Module familial 100 familles + phasage

PHASE 4 (mois 8-22)
└─ WGS POPgen + traitement + base de données variants

PHASE 5 (mois 17-30)
└─ Modules IA (pathogénicité, PGx, admixture, PRS)

PHASE 6 (mois 27-36)
└─ Portail web Django + validation clinique
```

### Phase 0 : Panels témoins (S1-S12, parallèle)

| Semaine | Tâche | Livrable |
|---------|-------|---------|
| 1 | Inventaire 1000G / EGA, priorisation | `reference_panel_inventory.tsv` |
| 1-2 | Demandes accès DAC/EGA (MGUA, MAGE, GenomeAsia...) | `reference_panel_access_status.tsv` |
| 2-6 | Téléchargement + contrôle formats | Dossiers versionnés |
| 3-8 | Harmonisation build/strand + intersection SNP 1,9M | `reference_panel_intersection_SNP_report` |
| 6-12 | PCA de sensibilité + contrôle batch effect | `reference_panel_QC_report` |

### Phase 1 : Validation externe (S1-S10)

| Semaine | Tâche | Livrable |
|---------|-------|---------|
| 1 | Préparation 1000G + panels EGA disponibles | Datasets QC |
| 2-3 | Simulation tri-ancestrale + puce 1,9M | Jeu dégradé puce |
| 4 | PCA/ADMIX/IBD/ROH | Scores initiaux |
| 5-6 | Sélections comparatives strict vs hybride géo-ancestral | Métriques comparées |
| 7-8 | Sensibilité poids + LOCO | Rapport robustesse |
| 9-10 | Synthèse → paramètres V3.5 finalisés | Paramètres gelés |

### Phase 2 : Cohorte Réunion SNP (S11-S20)

| Semaine | Tâche | Livrable |
|---------|-------|---------|
| 1-2 | QC 2500 SNP + secteurs géographiques | Données propres |
| 3 | PCA + ADMIXTURE avec panels témoins | Structure géo-ancestrale |
| 4 | Cellules géo-ancestrales + IBD + ROH + S_div | Quotas et scores |
| 5 | Sélection stricte 350 + hybride 322+28 | Listes 350 WGS |
| 6 | Audit bras découverte | Justification individuelle |
| 7-8 | Préparation envoi WGS → POPgen | Échantillons prêts |
| 9-10 | Premiers VCF/BAM retournés par POPgen | Données WGS |

### Phase 3 : Module familial (parallèle)

| Étape | Tâche | Livrable |
|-------|-------|---------|
| F1 | Recrutement 100 familles nucléaires | Familles diversifiées géographiquement |
| F2 | Génotypage SNP GDA-8 (~300 individus) | Données familiales SNP |
| F3 | QC familial + erreurs de Mendel | Rapport transmission |
| F4 | Phasage 2500 + familles | Haplotypes réunionnais SNP |
| F5 | Intégration WGS | Panel d'imputation local |
| F6 | Évaluation imputation/LAI | Rapport performance |

---

## 4. Besoins matériels par phase

### 4.1 Génotypage iScan (Phase 0-2 — budget principal)

> **Puce :** Infinium Global Diversity Array-8 (GDA-8), ~1,9M SNP
> **Volume :** 2500 individus + ~300 familles nucléaires = **~2800 puces** (+5% réplicats QC = 2940 au total)
> **WGS 350 individus : pris en charge par POPgen → 0€**

**Deux scénarios** selon la stratégie du CHU, qui **ne dispose pas d'iScan en propre**. **Choisir un seul.**

---

#### 🔵 Scénario 1 — Sous-traitance à une plateforme partenaire

Le prestataire (CNG Évry, GenomEast, CNRGH…) fournit **tout** : puces, réactifs, hybridation, scan, extraction IDAT. Le CHU ne paie qu'à la facture.

| Poste | Quantité | Tarif tout compris (2025) | Total |
|-------|----------|--------------------------|-------|
| Génotypage GDA-8 — cohorte populationnelle | 2500 | ~90€/échantillon | 225 000€ |
| Génotypage GDA-8 — module familial | 300 | ~90€/échantillon | 27 000€ |
| Réplicats QC (+5%) | 140 | ~90€/échantillon | 12 600€ |
| **TOTAL Scénario 1** | **2940** | | **~265 000€** |

> *Le tarif ~90€/échantillon "tout compris" est une estimation de marché pour la GDA-8 en plateforme institutionnelle européenne à volume ≥ 500 (sources : NGI-Uppsala, Iowa Genomics Facility, 2025). Prix à confirmer par devis.*

---

#### 🔴 Scénario 2 — Acquisition iScan + consommables (équipement neuf)

Le CHU souhaite internaliser durablement le génotypage.

| Poste | Coût |
|-------|------|
| iScan System (scanner neuf) | 150 000€ |
| AutoLoader 2.x + ILASS (pipetage automatisé) | 70 000€ |
| Installation + qualification IQ/OQ/PQ | 15 000€ |
| Maintenance 1ère année | 18 000€ |
| **Sous-total équipement** | **253 000€** |
| Consommables (puces GDA-8 + réactifs Infinium) | 226 000€ |
| **TOTAL Scénario 2** | **~479 000€** |

> *L'iScan amortit son coût sur plusieurs années et projets futurs. En coût projet seul, le Scénario 2 est le plus cher, mais il crée un actif durable pour le CHU.*

---

#### Comparaison des deux scénarios

| | Scénario 1 — Sous-traitance | Scénario 2 — iScan à acquérir |
|-|-----------------------------|-------------------------------|
| **Coût génotypage projet** | ~265 000€ | ~479 000€ |
| **Investissement instrument** | 0€ | 253 000€ |
| **Autonomie future** | ❌ | ✅ |
| **Délai de démarrage** | Rapide (devis → lancement) | +3-4 mois (livraison + install.) |
| **Recommandé si…** | Projet ponctuel | Stratégie long terme du CHU |

### 4.2 Infrastructure informatique (Phase 0-6)

| Composant | Quantité | Coût unitaire | Total |
|-----------|----------|---------------|-------|
| Serveurs CPU (analyse QC/PCA) | 2 | 8 000€ | **16 000€** |
| Serveurs HPC GPU (pipelines) | 4 | 25 000€ | **100 000€** |
| Serveurs GPU A100 (IA/ML) | 2 | 40 000€ | **80 000€** |
| Stockage NVMe 100TB (NAS) | 2 | 30 000€ | **60 000€** |
| Réseau 10/25Gbps + switch | 1 | 18 000€ | **18 000€** |
| UPS + climatisation | 1 | 20 000€ | **20 000€** |
| Sécurité + sauvegarde offsite | 1 | 15 000€ | **15 000€** |
| Logiciels + licences | 1 | 25 000€ | **25 000€** |
| **TOTAL Infrastructure IT** | | | **334 000€** |

> 💾 **Stockage requis estimé** :
> - Données brutes génotypage (2800 IDAT) : ~1,4 TB
> - VCF/BAM des 350 WGS (30× coverage) : ~35 TB
> - Données intermédiaires (PCA, imputation, phasing) : ~20 TB
> - Base de données variants + sauvegardes : ~30 TB
> - **Total recommandé : 100-120 TB**

### 4.3 Alternative : infrastructure cloud hybride

L'infrastructure de la §4.2 peut être portée dans le cloud plutôt qu'achetée en propre. Pour un projet manipulant des données génomiques (données de santé), la contrainte structurante n'est pas technique mais réglementaire : l'hébergement doit être assuré par un prestataire **certifié HDS (Hébergeur de Données de Santé)** et les données rester dans l'Union européenne (RGPD + souveraineté). Cela oriente vers un cloud souverain (OVHcloud, Scaleway) ou les offres HDS en région UE des hyperscalers.

Le modèle recommandé est **hybride** : les données brutes sensibles et les résultats sont conservés sur un stockage HDS souverain (en complément du CRB pour le biologique), tandis que la puissance de calcul GPU est mobilisée **à la demande** (burst) pour les entraînements IA et les pipelines, plutôt que d'immobiliser des serveurs souvent inactifs. Un poste local minimal (postes de travail + cache des jeux de données actifs) complète le dispositif.

Ce modèle transforme un investissement (CAPEX) en charges récurrentes (OPEX) : pas d'achat initial lourd, mais un coût mensuel à reconduire à chaque renouvellement, et une vigilance sur les **frais de sortie de données (egress)**, souvent sous-estimés.

> *Estimations en ordre de grandeur, basées sur les tarifs publics de cloud souverain HDS (OVHcloud / Scaleway). À confirmer par devis.*

| Poste | Détail | Coût estimé (36 mois) |
|-------|--------|----------------------|
| Stockage HDS + sauvegarde | ~100-120 TB, souverain certifié HDS | ~90 000 € |
| Compute CPU + base de données managée | VMs permanentes (QC, PCA, portail, BD) | ~55 000 € |
| Compute GPU à la demande | Entraînements IA + pipelines (burst) | ~40 000 € |
| Sécurité, conformité HDS, support managé | — | ~25 000 € |
| Logiciels + licences | — | ~25 000 € |
| Poste local minimal | Postes de travail + cache NAS | ~20 000 € |
| Réseau + egress | Transferts, accès cliniciens | ~15 000 € |
| **TOTAL cloud hybride** | | **~270 000 €** |

**Comparaison on-premise vs cloud hybride**

| Critère | On-premise (§4.2, achat) | Cloud hybride HDS |
|---------|--------------------------|-------------------|
| Coût sur 36 mois | ~334 000 € (CAPEX) | ~270 000 € (OPEX) |
| Investissement initial | Élevé | Quasi nul |
| Actif durable après projet | ✅ Matériel possédé | ❌ Rien à l'issue |
| Élasticité (pics de calcul) | Limitée | ✅ Forte |
| Conformité HDS | À construire et maintenir | Incluse dans l'offre |
| Coût récurrent à reconduire | Maintenance seule | ✅ Intégralité chaque année |

> 💡 **Impact budget :** en retenant le cloud hybride (~270 000 €) à la place de l'infrastructure on-premise (334 000 €), le budget optimal passe d'environ **1 474 000 €** à **~1 410 000 €** (−64 K€). Les tableaux du §7 conservent l'hypothèse on-premise par défaut.

### 4.4 Coûts biologiques (extraction + conservation)

| Poste | Détail | Coût |
|-------|--------|------|
| **Extraction ADN** | Kits + consommables d'extraction (~2800 échantillons) | **~54 000€** |
| **Conservation au CRB** | Stockage biologique des échantillons (Centre de Ressources Biologiques) | **127 676€** |

> *Le temps opérateur (réception, extraction, QC, préparation des envois) est porté par le technicien de laboratoire à 100% listé en partie RH (§5).*

### 4.5 Évolution des besoins matériels — graphique texte

```
BUDGET MATÉRIEL PAR PHASE (K€)
(Scénario 1 — sous-traitance)

Phase 0-2: Génotypage GDA-8 tout compris (~90€/éch.)
  ██████████████████████████  265K€
  (2940 échantillons × 90€ — puces + réactifs + scan inclus)

Phase 0-6: Infrastructure IT
  ██████████████████████████████████  334K€
────────────────────────────────────────────
TOTAL MATÉRIEL Sc.1 (sous-traitance)   ≈ 599K€  (génotypage 265 + IT 334)
TOTAL MATÉRIEL Sc.2 (iScan à acquérir) ≈ 813K€  (génotypage 226 + iScan 253 + IT 334)
```

```
ÉVOLUTION DU STOCKAGE (TB)

  100TB ─────────────────────────────●
   80TB                        ●
   60TB                  ●
   40TB           ●
   20TB ────●
        Phase0  Phase1  Phase2  Phase3  Phase4+
        (2TB)  (10TB) (30TB) (60TB) (100TB)
```

```
MONTÉE EN PUISSANCE CALCUL

Serveurs  8 ────────────────────────────────────●
          6                                ●────
          4                      ●────
          2            ●────
          1  ●────
             Phase0   Phase1   Phase2   Phase4  Phase5
             (CPU)   (CPU+GPU) (HPC×4) (HPC+IA) (max)
```

---

## 5. Besoins en ressources humaines

> **Durée du projet : 36 mois** à partir de la réception du budget.
> **Tous les coûts sont exprimés en coût employeur charges patronales comprises (CC).**
> Charges patronales : **~43% du salaire brut** (secteur hospitalier/CHU public).
> Formule : `Coût employeur = salaire brut × 1,43`

---

### Régimes de charges 2025 — rappel des taux

| Type de contrat | Brut mensuel indicatif | Charges employeur | Coût CC mensuel |
|-----------------|----------------------|-------------------|-----------------|
| Stage (gratification 1 200€/m) | 1 200 € | ~33% sur excédent seuil légal | **~1 590 €/mois** |
| Alternance Epitech (<26 ans) | ~1 200 € | Quasi-exonération totale | **~1 225 €/mois** |
| Technicien de laboratoire CDD 100% | 2 200 € | 43% | **3 146 €/mois** |
| Doctorant contrat doctoral | 2 300 € | 43% | **3 289 €/mois** |
| Doctorant CIFRE (après subv. ANRT 14K€/an) | 2 667 € | 43% → −1 167€ subv. | **~2 648 €/mois** |
| IE1 CDD (junior post-stage) | 2 500 € | 43% | **3 575 €/mois** |
| IR2 CDD (senior) | 3 833 € | 43% | **5 482 €/mois** |

> **Stage :** gratification ≤ seuil légal (~270€/mois) = 0 charges. Au-delà : charges patronales sur l'excédent uniquement.
> **Alternance (<26 ans) :** exonération quasi-totale des charges patronales — seule cotisation accidents du travail (~2%) subsiste.
> **CIFRE :** l'ANRT verse 14 000€/an à l'employeur. Condition : une entreprise privée partenaire est obligatoire (startup, laboratoire privé associé au CHU).

---

### Équipe socle — invariante dans toutes les propositions

Le coordinateur IR2 est **indispensable dans les trois propositions** : il pilote le projet, valide les analyses génomiques et encadre les profils juniors. Un **technicien de laboratoire à 100%** est également indispensable (réception des échantillons, extraction ADN, QC, préparation des envois). Ces deux coûts ne peuvent pas être réduits sans compromettre la qualité scientifique.

| Poste | Contrat | Durée | Salaire brut | Coût CC total |
|-------|---------|-------|-------------|---------------|
| **Coordinateur scientifique** | IR2 CDD 100% | 36 mois | 3 833€/mois | **197 340 €** |
| **Technicien de laboratoire** | CDD 100% | 36 mois | 2 200€/mois | **113 256 €** |

---

### Proposition 1 — Stages + CDD + contrat doctoral

**−17% vs référence · Total : 565 000 € CC**

Montage le plus simple à mettre en place, sans délai administratif particulier. Les stagiaires Epitech (4e ou 5e année) sont pris pour 6 mois, puis convertis en CDD IE1.

| Poste | Contrat | Durée | Brut mensuel | Coût CC total |
|-------|---------|-------|--------------|---------------|
| Coordinateur | IR2 CDD 100% | 36 mois | 3 833€ | **197 340 €** |
| Technicien de laboratoire | CDD 100% | 36 mois | 2 200€ | **113 256 €** |
| Bioinformaticien | Doctorant contrat doctoral | 36 mois | 2 300€ | **118 548 €** |
| Data Engineer | Stage Epitech 6m → CDD IE1 16m | 22 mois | 1 200 puis 2 500€ | **66 740 €** |
| Data Scientist IA | Stage Epitech 6m → CDD IE1 14m | 20 mois | 1 200 puis 2 500€ | **59 590 €** |
| DevOps | Stage Epitech 6m (IT CHU ensuite) | 6 mois | 1 200€ | **9 540 €** |
| **TOTAL PROPOSITION 1** | | | | **565 000 € CC** |

**Points clés :**
- Le doctorant mène sa thèse sur la génomique des populations réunionnaises — PCA, ADMIXTURE, sélection des 350 WGS constituent un sujet de thèse cohérent et valorisable.
- Les stagiaires Epitech intègrent le projet en phase opérationnelle (M5 pour le Data Engineer, M17 pour l'IA), quand les specs techniques sont stabilisées.
- Stage limité à 6 mois par an légalement — le CDD IE1 prend le relais pour la durée restante.
- Délai de mise en place : **rapide** (recrutement stage ~4 semaines, contrat doctoral ~6 semaines).

---

### Proposition 2 — Alternance + CIFRE ⭐ recommandée

**−23% vs référence · Total : 524 000 € CC**

L'alternance (<26 ans) est quasi-exonérée de charges patronales. Le CIFRE réduit de moitié le coût du doctorant grâce à la subvention ANRT de 14 000€/an. C'est le meilleur équilibre coût/risque.

| Poste | Contrat | Durée | Coût CC mensuel | Coût CC total |
|-------|---------|-------|-----------------|---------------|
| Coordinateur | IR2 CDD 100% | 36 mois | 5 482€ | **197 340 €** |
| Technicien de laboratoire | CDD 100% | 36 mois | 3 146€ | **113 256 €** |
| Bioinformaticien | Doctorant CIFRE | 36 mois | 2 648€ | **95 292 €** |
| Data Engineer | Alternance Epitech 2 ans → CDD IE1 10m | 34 mois | 1 225€ puis 3 575€ | **65 150 €** |
| Data Scientist IA | Alternance Epitech 1 an → CDD IE1 8m | 20 mois | 1 225€ puis 3 575€ | **43 300 €** |
| DevOps | Stage Epitech 6m (IT CHU ensuite) | 6 mois | 1 590€ | **9 540 €** |
| **TOTAL PROPOSITION 2** | | | | **524 000 € CC** |

**Points clés :**
- L'alternant Data Engineer travaille **4 jours/semaine au labo** dès M5, 1 jour à Epitech. Deux ans de présence quasi-continue pour ~30 000€ — soit moins qu'un CDD de 10 mois.
- Le CIFRE nécessite un **partenaire privé** (startup genomique, laboratoire d'analyses, éditeur de logiciel médical). Sans partenaire disponible, remplacer par un contrat doctoral classique (+23 000€ sur 3 ans).
- L'alternant IA entre en M17 quand les données WGS commencent à arriver, puis est converti en CDD IE1 pour la phase de déploiement.
- Délai de mise en place : **2-3 mois** pour le CIFRE (dossier ANRT), recrutement alternance possible en continu.

---

### Proposition 3 — Maximum alternance

**−29% vs référence · Total : 485 000 € CC**

Trois alternants Epitech simultanés + CIFRE + coordinateur à 80% ETP. Budget minimal, mais supervision intensive requise.

| Poste | Contrat | Durée | Coût CC mensuel | Coût CC total |
|-------|---------|-------|-----------------|---------------|
| Coordinateur | IR2 CDD **80% ETP** | 36 mois | 4 386€ | **157 896 €** |
| Technicien de laboratoire | CDD 100% | 36 mois | 3 146€ | **113 256 €** |
| Bioinformaticien | Doctorant CIFRE | 36 mois | 2 648€ | **95 292 €** |
| Data Engineer | Alternance Epitech 2 ans → CDD IE1 10m | 34 mois | 1 225€ puis 3 575€ | **65 150 €** |
| Data Scientist IA | Alternance Epitech 2 ans | 24 mois | 1 225€ | **29 400 €** |
| Frontend / Backend | Alternance Epitech 1 an | 12 mois | 1 225€ | **14 700 €** |
| DevOps | Stage Epitech 6m | 6 mois | 1 590€ | **9 540 €** |
| **TOTAL PROPOSITION 3** | | | | **485 000 € CC** |

**Points clés :**
- Le coordinateur à 80% fonctionne si le **PI du laboratoire CHU co-pilote scientifiquement** le projet 20% de son temps (souvent possible dans le cadre d'un projet de recherche labellisé).
- Trois alternants ne sont jamais seuls : ils travaillent en binôme avec le coordinateur ou le doctorant. Le coordinateur consacre environ 30% de son temps à l'encadrement.
- L'alternant IA reste 2 ans — il sera opérationnel sur les modules 3 et 4 en autonomie partielle dès M24.
- Délai de mise en place : **3-4 mois** (CIFRE + recrutement alternance simultané, rentrée Epitech en septembre ou février).

---

### Comparaison des trois propositions

| | Référence | Prop. 1 | Prop. 2 ⭐ | Prop. 3 |
|--|-----------|---------|-----------|---------|
| **Coût total CC** | **680 000 €** | **565 000 €** | **524 000 €** | **485 000 €** |
| Économie vs référence | — | 115 000 € | 156 000 € | 195 000 € |
| Réduction | — | −17% | −23% | −29% |
| Nb personnes max simultanées | 6 | 6 | 6 | 7 |
| Complexité administrative | Faible | Faible | Modérée | Élevée |
| Condition bloquante | Aucune | Aucune | Partenaire CIFRE | Partenaire CIFRE + PI 20% |
| Risque supervision | Faible | Modéré | Modéré | Élevé |
| Délai de démarrage | 1-2 mois | 1-2 mois | 2-3 mois | 3-4 mois |

> *Référence, Prop. 1, Prop. 2 et Prop. 3 incluent désormais le technicien de laboratoire à 100% (113 256 € CC).*

---

### Montée en charge de l'équipe (Proposition 2, recommandée)

```
EFFECTIF PAR MOIS — PROPOSITION 2

  5,5 │                             ●──────────────
  5,0 │                       ●────────────●───────
  4,5 │           ●───────────
  4,0 │
  3,5 ──●──────────
      │  ↑M1        ↑M5       ↑M17      ↑M19      ↑M36
      └──────────────────────────────────────────────────

  M1  : Coordinateur IR2 (1) + Technicien labo (1) + Doctorant CIFRE (1) + Stage DevOps 0,5 = 3,5 ETP
  M5  : + Alternant Data Engineer (1)                                                        = 4,5 ETP
  M17 : + Alternant Data Scientist IA (1)                                                    = 5,5 ETP
  M19 : Fin du stage DevOps                                                                  = 5,0 ETP
  M29 : Alternant DE → CDD IE1 (fin alternance 2 ans)                                        = 5,0 ETP
  M36 : Livraison finale
```

---

### Répartition du budget RH — Proposition 2 (524 000 € CC)

```
Coordinateur IR2 (36m)      ███████████████████████████████████  197 340€  (38%)
Doctorant CIFRE (36m)       █████████████████                     95 292€  (18%)
Technicien labo (36m)       ████████████████████                 113 256€  (22%)
Alternant Data Eng (34m)    ███████████                           65 150€  (12%)
Alternant IA (20m)          ████████                              43 300€   (8%)
Stage DevOps (6m)           ██                                     9 540€   (2%)
```

```
BRUT TOTAL VERSÉ AUX PERSONNES  ~366 000 €  (70%)
CHARGES PATRONALES              ~158 000 €  (30%)
─────────────────────────────────────────────────
COÛT EMPLOYEUR TOTAL             524 000 €  (100%)
```


## 6. Intégration de l'IA

### Modules IA — 4 piliers

#### Module 1 : Prédiction de pathogénicité des variants

| Paramètre | Détail |
|-----------|--------|
| **Modèle** | Graph Neural Networks (GNN) + Neural Networks |
| **Données d'entraînement** | ClinVar, COSMIC, variants population Réunion |
| **Features** | Contexte séquence, conservation, scores fonctionnels |
| **Output** | Score pathogénicité 0-1 + intervalle de confiance |
| **Cible métier** | Diagnostic moléculaire des variants réunionnais |
| **Métrique cible** | AUC ≥ 0,85 sur jeu de validation local |

#### Module 2 : Pharmacogénétique × admixture

| Paramètre | Détail |
|-----------|--------|
| **Modèle** | Random Forest + XGBoost (interactions gène-médicament) |
| **Focus** | Interaction entre profils d'admixture et métabolisme des médicaments |
| **Gènes cibles** | CYP2C19, CYP2D6, CYP3A4/5, SLCO1B1 (CPIC level A) |
| **Output** | Recommandation thérapeutique personnalisée + niveau de preuve |
| **Cible métier** | Pharmacorésistances spécifiques à La Réunion |

#### Module 3 : Analyse d'admixture

| Paramètre | Détail |
|-----------|--------|
| **Modèle** | Autoencoders deep learning + K-means / HDBSCAN |
| **Input** | Scores ADMIXTURE, PCA, segments IBD, profils ROH |
| **Output** | Profils d'admixture par individu + strate géo-ancestrale |
| **Cible métier** | Caractérisation de la diversité génétique réunionnaise |
| **Lien pipeline** | Recalibrage des fréquences sur les 2500 individus |

#### Module 4 : Polygenic Risk Score (PRS) population-spécifique

| Paramètre | Détail |
|-----------|--------|
| **Modèle** | PRS pondérés localement + ensemble learning |
| **Pathologies cibles** | Diabète T2, HTA, cardiopathies, maladies à effet fondateur |
| **Spécificité** | Recalibration sur fréquences réunionnaises vs fréquences européennes |
| **Output** | Score de risque stratifié × population × secteur géo |
| **Cible métier** | Prévention personnalisée et stratification du risque |

### Architecture technique IA

```
Stack IA / MLOps
═══════════════════════════════════════════════════

Frameworks    : PyTorch 2.x + TensorFlow 2.x
ML classique  : scikit-learn, XGBoost, LightGBM
Data science  : Pandas, NumPy, SciPy, statsmodels
Bioinf. IA    : PLINK2, REGENIE, PRSice2

MLOps
──────
Tracking     : MLflow (expériences, modèles, métriques)
Orchestration: Kubeflow (pipelines ML sur Kubernetes)
Registre     : MLflow Model Registry (versioning modèles)
Inférence    : TensorRT + ONNX Runtime (optimisation GPU)
Monitoring   : Prometheus + Grafana + Weights & Biases

Déploiement
─────────────
Conteneurs   : Docker + Kubernetes
CI/CD        : GitLab CI/CD
API & portail: Django (inférence + portail web, full Python)
Logs         : ELK Stack (Elasticsearch + Logstash + Kibana)
```

### Timeline développement IA

```
Mois  1-4  : Collecte et labellisation données d'entraînement
             ├─ Feature engineering variants
             ├─ Dataset splits train/val/test
             └─ Benchmarks baseline (CADD, SIFT, PolyPhen)

Mois  5-8  : Module 1 — Pathogénicité (GNN)
             ├─ Architecture GNN sur graphe de variants
             ├─ Entraînement sur ClinVar + variants locaux
             └─ Validation AUC cible ≥ 0,85

Mois  6-10 : Module 2 — Pharmacogénétique (XGBoost)
             ├─ Feature interactions PGx × admixture
             ├─ Comparaison avec CPIC recommandations génériques
             └─ Validation sur cas cliniques CHU

Mois  8-12 : Modules 3 & 4 — Admixture + PRS
             ├─ Autoencoder calibré sur 2500 SNP réunionnais
             ├─ PRS recalibrés sur fréquences locales
             └─ Comparaison vs PRS européens (biais attendu)

Mois 13-18 : Validation clinique + déploiement
             ├─ Tests cliniciens CHU + retours utilisateurs
             ├─ Optimisation latence <500ms API
             ├─ Documentation modèles (MLMD)
             └─ Publication des performances
```

---

## 7. Chronogramme et budget

### Budget récapitulatif

Les totaux ci-dessous combinent le scénario génotypage (Sc. 1/2) avec la proposition RH retenue. Tous intègrent l'extraction d'ADN (54 000 €) et la conservation des échantillons au CRB (127 676 €).

#### Budget avec Proposition RH 1 — Stages + CDD + contrat doctoral (565 000 € CC)

| Catégorie | Sc. 1 — Sous-traité | Sc. 2 — iScan à acquérir |
|-----------|---------------------|--------------------------|
| Génotypage GDA-8 | 265 000 € | 226 000 € |
| Système iScan | 0 € | 253 000 € |
| Infrastructure IT | 334 000 € | 334 000 € |
| WGS POPgen | **0 €** | **0 €** |
| Extraction ADN | 54 000 € | 54 000 € |
| Stockage biologique (CRB) | 127 676 € | 127 676 € |
| **RH Prop. 1 (CC)** | **565 000 €** | **565 000 €** |
| Prestation web + formation | 35 000 € | 35 000 € |
| Contingence (10%) | 138 068 € | 159 468 € |
| **TOTAL** | **~1 519 000 €** | **~1 754 000 €** |

#### Budget avec Proposition RH 2 — Alternance + CIFRE ⭐ (524 000 € CC)

| Catégorie | Sc. 1 — Sous-traité | Sc. 2 — iScan à acquérir |
|-----------|---------------------|--------------------------|
| Génotypage GDA-8 | 265 000 € | 226 000 € |
| Système iScan | 0 € | 253 000 € |
| Infrastructure IT | 334 000 € | 334 000 € |
| WGS POPgen | **0 €** | **0 €** |
| Extraction ADN | 54 000 € | 54 000 € |
| Stockage biologique (CRB) | 127 676 € | 127 676 € |
| **RH Prop. 2 (CC)** | **524 000 €** | **524 000 €** |
| Prestation web + formation | 35 000 € | 35 000 € |
| Contingence (10%) | 133 968 € | 155 368 € |
| **TOTAL** | **~1 474 000 €** | **~1 709 000 €** |

#### Budget avec Proposition RH 3 — Maximum alternance (485 000 € CC)

| Catégorie | Sc. 1 — Sous-traité | Sc. 2 — iScan à acquérir |
|-----------|---------------------|--------------------------|
| Génotypage GDA-8 | 265 000 € | 226 000 € |
| Système iScan | 0 € | 253 000 € |
| Infrastructure IT | 334 000 € | 334 000 € |
| WGS POPgen | **0 €** | **0 €** |
| Extraction ADN | 54 000 € | 54 000 € |
| Stockage biologique (CRB) | 127 676 € | 127 676 € |
| **RH Prop. 3 (CC)** | **485 000 €** | **485 000 €** |
| Prestation web + formation | 35 000 € | 35 000 € |
| Contingence (10%) | 130 068 € | 151 468 € |
| **TOTAL** | **~1 431 000 €** | **~1 666 000 €** |

> ✅ **WGS (350 individus) pris en charge par POPgen → 0 €**
> ✅ **Tous les coûts RH sont charges patronales comprises (43% du brut), technicien de laboratoire 100% inclus**
> ✅ **Combinaison optimale : Sc. génotypage 1 (sous-traitance) + RH Prop. 2 → ~1 474 000 €**

### Chronogramme détaillé

```
MOIS  1   3   6   9   12  15  18  21  24  27  30  33  36
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ph.0  ████████                                 Panels témoins (M1-3)
Ph.1  ████████████                             Validation externe (M1-5)
Ph.2          ████████████                     Cohorte Réunion SNP 2500 (M4-9)
Ph.3          ████████████████████             Module familial 100 familles (M4-14)
Ph.4                  ████████████████         WGS POPgen + traitement (M8-22)
Ph.5                          ██████████████   IA modules (M17-30)
Ph.6                                  ████████ Portail web + validation (M27-36)

ÉQUIPE
 M1  : Coordinateur + Technicien labo + Bioinformaticien + DevOps 50%  = 3,5 ETP
 M5  : + Data Engineer                                                  = 4,5 ETP
 M17 : + Data Scientist IA                                              = 5,5 ETP
 M19 : Fin DevOps                                                       = 5,0 ETP
 M27 : Fin Data Engineer                                                = 4,0 ETP
 M36 : Fin de projet

JALONS
 M3  : ▶ Infrastructure IT opérationnelle
 M5  : ▶ Génotypage 2500 individus lancé (→ plateforme ou iScan CHU)
 M9  : ▶ Liste 350 WGS gelée → envoi POPgen
 M14 : ▶ Module familial phasé + haplotypes réunionnais
 M22 : ▶ Premiers VCF/BAM retournés + BD variants v1
 M26 : ▶ Modules IA 1+2 validés (AUC ≥ 0,85)
 M30 : ▶ Modules IA 3+4 opérationnels
 M34 : ▶ Portail web clinique en production
 M36 : ▶ Validation clinique + publication + livraison finale
```

### Métriques de succès

| Métrique | Cible | Description |
|----------|-------|-------------|
| Collecte | ≥ 2500 individus | Représentativité géo-ancestrale validée |
| Sélection WGS | 350 WGS (hybride géo-ancestral) | Sélection stricte ou hybride 322+28 |
| Couverture variants | MAF ≥ 1% fiable | Seuil opérationnel première génération |
| AUC pathogénicité | ≥ 0,85 | Module 1 sur jeu de validation local |
| Latence API | < 500ms | Requêtes cliniques en production |
| Publications | ≥ 3 articles | Peer-reviewed, année 2 |
| Adoption clinique | ≥ 5 centres | Intégration diagnostique CHU + partenaires |

### Analyse des risques

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Délai accès panels EGA (DAC) | **Élevée** | 4-12 semaines de retard Ph.0 | Socle 1000G public en solution de repli |
| Biais représentativité EFS | **Modérée** | Résultats biaisés | Audit EFS préalable (distribution vs INSEE) |
| Défaillance iScan / plateforme | Faible-Mod. | Downtime 1-2 semaines | SLA contrat Illumina, plateforme partenaire de secours |
| Qualité ADN dégradée | Modérée | Taux d'échec génotypage ↑ | +5% réplicats, QC post-extraction |
| Datadrift modèles IA | Modérée | Perte précision avec le temps | Monitoring continu + réentraînement semestriel |
| Recrutement bioinformaticiens | Élevée | Délai M2-M3 | Partenariats INSERM / université, annonces M1 |

---

## Conclusion

Le projet Génome Réunion constitue la **première base de données génomiques locale** adaptée à la population réunionnaise.

**Points structurants du budget :**
- Le poste **génotypage iScan** (~226-265K€ selon scénario) est le principal coût biologique, complété par l'**extraction d'ADN** (54 000 €) et la **conservation des échantillons au CRB** (127 676 €)
- Le **WGS (POPgen) est gratuit** pour le projet
- Les **ressources humaines** (485-565K€ CC selon proposition, technicien de laboratoire 100% inclus) représentent ~30 à 37% du budget total
- La combinaison optimale est : sous-traitance du génotypage + Proposition RH 2 → **~1 474 000 €** sur 36 mois

**Architecture en trois couches complémentaires :**
1. **2500 génotypages** → structure populationnelle, PCA, admixture
2. **100 familles** → phasage haplotypique réunionnais
3. **350 WGS (POPgen)** → référentiel de variants, imputation, discoveries

**L'IA** vient en surcouche pour valoriser cliniquement ce référentiel : pathogénicité, pharmacogénétique, risque polygénique.

---
*Document généré : Mai 2026 | Basé sur METHODOLOGY_selection_V3_5.md + Projet Génome PMU*
