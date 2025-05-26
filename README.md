# 🌳 TreeGraph - Arbre Généalogique avec Algorithmes de Graphes

Projet académique réalisé dans le cadre du TP 1 de Recherche Opérationnelle.



## 📚 Contexte

L'arbre généalogique est bien plus qu’un simple outil de visualisation des liens familiaux. Il permet de sauvegarder et transmettre l'identité culturelle et historique d'une lignée. Ce projet vise à construire une **application web interactive** permettant :

- De représenter dynamiquement les relations familiales.
- D'explorer les liens de parenté entre individus.
- D’analyser les structures familiales avec des **algorithmes de graphes**.

---

## 🛠️ Technologies utilisées

- **Back-end** : NestJS
- **Base de données** : SQLite / Fichier JSON
- **Front-end** :  NestJS


---

## 🧠 Fonctionnalités principales

### 🔗 Modélisation de l’arbre
- Chaque **nœud** représente une personne.
- Chaque **arête** représente une relation parent-enfant avec un poids correspondant au degré de parenté.

### 📥 Chargement des données
- Format supporté : **JSON**, **CSV**
- Option de construction manuelle via l’interface

### 📊 Algorithmes implémentés

| Algorithme      | Objectif |
|------------------|----------|
| 🔍 Dijkstra       | Trouver le plus court chemin entre deux individus |
| 🔁 Bellman-Ford  | Identifier les relations indirectes, cycles complexes |
| 🌐 Prim          | Générer l’arbre couvrant minimal |
| 🔗 Kruskal        | Segmenter l’arbre en sous-familles |

### 🖥️ Interface Utilisateur
- Recherche par nom
- Affichage graphique des relations familiales
- Requête de parenté dynamique

---

## 🚀 Lancer le projet

### Prérequis
- Node.js >= 18.x
- npm ou yarn

### Installation


# Cloner le dépôt
git clone https://github.com/Carlos-Sibefeu/Family-Tree.git

cd arbre-genealogique-nestjs

# Installer les dépendances
npm install
