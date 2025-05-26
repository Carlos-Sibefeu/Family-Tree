# Arbre Généalogique - Frontend (Next.js)

Ce projet est le frontend de l'application d'arbre généalogique développée dans le cadre d'un TP de Recherche Opérationnelle. Il permet de visualiser et manipuler un arbre généalogique familial en utilisant des algorithmes de graphes.

## Fonctionnalités

- Visualisation interactive de l'arbre généalogique
- Recherche de liens de parenté entre membres (Dijkstra)
- Analyse de la structure familiale (Prim, Kruskal)
- Gestion des utilisateurs et des droits d'accès
- Interfaces responsives et intuitives


## Technologies utilisées

- **Frontend**: Next.js avec TypeScript et Tailwind CSS
- **Backend**: Spring Boot (Java)
- **Base de données**: SQLite
- **Authentification**: JWT (JSON Web Tokens)

## Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :

```bash
npm install
# ou
yarn install
```

## Démarrage

Pour lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Structure du projet

- `src/app/` - Pages de l'application (Next.js App Router)
  - `page.tsx` - Page d'accueil
  - `login/` - Authentification
  - `register/` - Inscription
  - `dashboard/` - Tableau de bord
  - `family-tree/` - Visualisation de l'arbre généalogique
  - `search/` - Recherche de liens de parenté
  - `profile/` - Gestion du profil utilisateur
  - `about/` - À propos du projet

## Connexion avec le backend

L'application frontend se connecte au backend Spring Boot via des API REST. Assurez-vous que le backend est en cours d'exécution sur `http://localhost:8080` avant d'utiliser les fonctionnalités qui nécessitent des données du serveur.

## Algorithmes implémentés

- **Dijkstra** : Pour trouver le chemin le plus court entre deux personnes (liens de parenté)
- **Prim et Kruskal** : Pour analyser la structure familiale (arbre couvrant minimal)
- **Recherche en profondeur (DFS)** : Pour explorer les branches familiales
- **Recherche en largeur (BFS)** : Pour trouver les ancêtres communs
- **Détection de composantes connexes** : Pour identifier les sous-groupes familiaux

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
# ou
yarn build
```

Les fichiers générés se trouveront dans le dossier `.next`.

## Projet de Recherche Opérationnelle

Ce projet a été développé dans le cadre d'un TP de Recherche Opérationnelle, avec pour objectif de modéliser un arbre généalogique sous forme de graphe et d'appliquer différents algorithmes pour analyser les relations familiales.
