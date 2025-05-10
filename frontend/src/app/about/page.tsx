'use client';

import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">À propos du projet</h1>
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Arbre Généalogique avec des Algorithmes de Graphes</h2>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Ce projet a été développé dans le cadre d'un TP de Recherche Opérationnelle. L'objectif est de créer une application 
              web permettant de modéliser un arbre généalogique sous forme de graphe et d'appliquer différents algorithmes 
              de théorie des graphes pour analyser les relations familiales.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Contexte</h3>
            <p className="mb-4">
              L'arbre généalogique est bien plus qu'un simple outil de traçabilité des liens familiaux. Il constitue une véritable 
              mémoire vivante, un pont entre les générations passées, présentes et futures. En permettant aux individus de documenter 
              leur histoire, cette application joue un rôle essentiel dans la préservation de l'identité culturelle et historique des familles.
            </p>
            
            <p className="mb-4">
              Dans de nombreuses cultures, la transmission orale des récits familiaux est une pratique ancienne. Cependant, cette mémoire 
              peut se perdre au fil du temps en raison de l'oubli ou du manque de documentation. Une application numérique permet de centraliser 
              ces informations, d'enrichir les récits avec des images et de structurer les relations de manière intuitive et accessible.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Modélisation de l'arbre généalogique</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Chaque nœud représente une personne.</li>
              <li>Chaque arête représente une relation parent-enfant.</li>
              <li>Les poids des arêtes peuvent être le degré de parenté (1 pour parent/enfant, 2 pour grand-parent, etc.)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Algorithmes implémentés</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Dijkstra</strong> : Pour trouver le chemin le plus court entre deux personnes, 
                ce qui permet de déterminer le lien de parenté le plus direct.
              </li>
              <li>
                <strong>Prim et Kruskal</strong> : Pour analyser la structure familiale et identifier 
                les connexions minimales entre tous les membres.
              </li>
              <li>
                <strong>Recherche en profondeur (DFS)</strong> : Pour explorer les branches familiales 
                et trouver tous les chemins possibles entre deux personnes.
              </li>
              <li>
                <strong>Recherche en largeur (BFS)</strong> : Pour trouver les ancêtres communs les plus proches 
                ou les descendants à un certain niveau.
              </li>
              <li>
                <strong>Détection de composantes connexes</strong> : Pour identifier les sous-groupes familiaux distincts.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Technologies utilisées</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Frontend</strong> : Next.js avec TypeScript et Tailwind CSS</li>
              <li><strong>Backend</strong> : Spring Boot (Java)</li>
              <li><strong>Base de données</strong> : SQLite</li>
              <li><strong>Authentification</strong> : JWT (JSON Web Tokens)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Fonctionnalités</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Création et gestion de l'arbre généalogique</li>
              <li>Recherche de liens de parenté entre membres</li>
              <li>Visualisation interactive de l'arbre</li>
              <li>Analyse de la structure familiale</li>
              <li>Gestion des droits d'accès (administrateur, lecture, écriture)</li>
              <li>Ajout de photos et d'informations biographiques</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
