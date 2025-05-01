# Arbre Généalogique Backend (Spring Boot)

Ce projet implémente le backend d'une application d'arbre généalogique utilisant des algorithmes de graphes.

## Fonctionnalités

- Modélisation de l'arbre généalogique sous forme de graphe
- Gestion des utilisateurs et des droits d'accès
- Algorithmes de recherche dans le graphe (Dijkstra, Prim, Kruskal)
- API REST pour l'interaction avec le frontend
- Base de données SQLite

## Prérequis

- Java 17 ou supérieur
- Maven 3.8 ou supérieur
- SQLite 3

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <url-du-dépôt>
   cd projet_RO/backend
   ```

2. Compiler le projet avec Maven :
   ```bash
   mvn clean install
   ```

3. Exécuter l'application :
   ```bash
   mvn spring-boot:run
   ```

   L'application sera accessible à l'adresse : http://localhost:8080

## Configuration

La configuration de l'application se trouve dans le fichier `src/main/resources/application.properties`. Vous pouvez y modifier :

- Le port du serveur
- La configuration de la base de données
- Les paramètres de sécurité JWT

## Structure du projet

- `model/` : Entités et modèles de données
- `repository/` : Interfaces d'accès aux données
- `service/` : Logique métier et implémentation des algorithmes
- `controller/` : Points d'entrée de l'API REST
- `security/` : Configuration de sécurité et authentification
- `util/` : Classes utilitaires

## API REST

### Authentification

- `POST /api/auth/signin` : Connexion utilisateur
- `POST /api/auth/signup` : Inscription utilisateur

### Gestion des personnes

- `GET /api/persons` : Liste de toutes les personnes
- `GET /api/persons/{id}` : Détails d'une personne
- `POST /api/persons` : Création d'une personne
- `PUT /api/persons/{id}` : Mise à jour d'une personne
- `DELETE /api/persons/{id}` : Suppression d'une personne

### Relations

- `GET /api/persons/{id}/parents` : Parents d'une personne
- `GET /api/persons/{id}/children` : Enfants d'une personne
- `POST /api/persons/{childId}/parents/{parentId}` : Ajouter un parent
- `DELETE /api/persons/{childId}/parents/{parentId}` : Supprimer un parent

### Algorithmes de graphe

- `GET /api/graph/relationship` : Trouver le lien de parenté entre deux personnes (Dijkstra)
- `GET /api/graph/mst/{algorithm}` : Calculer l'arbre couvrant minimal (Prim ou Kruskal)
- `GET /api/graph/family-groups` : Trouver les groupes familiaux (composantes connexes)

## Algorithmes implémentés

1. Recherche de chemin le plus court (Dijkstra) pour trouver les liens de parenté
2. Arbre couvrant minimal (Prim/Kruskal) pour analyser la structure familiale
3. Recherche de composantes connexes pour identifier les sous-groupes familiaux
4. Recherche en profondeur (DFS) pour explorer l'arbre généalogique
5. Recherche en largeur (BFS) pour trouver les relations par niveau

## Tests

Exécuter les tests unitaires :
```bash
mvn test
```

## Sécurité

L'application utilise JWT (JSON Web Token) pour l'authentification. Les tokens ont une durée de validité de 24 heures par défaut.
