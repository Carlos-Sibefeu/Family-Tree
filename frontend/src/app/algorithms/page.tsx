'use client';

import { useState } from 'react';
import UserLayout from '../components/UserLayout';
import Link from 'next/link';

export default function Algorithms() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dijkstra');
  const [algorithmDescription, setAlgorithmDescription] = useState<string>(algorithms.dijkstra.description);
  const [algorithmComplexity, setAlgorithmComplexity] = useState<string>(algorithms.dijkstra.complexity);
  const [algorithmUseCase, setAlgorithmUseCase] = useState<string>(algorithms.dijkstra.useCase);
  const [algorithmPseudoCode, setAlgorithmPseudoCode] = useState<string>(algorithms.dijkstra.pseudoCode);

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    setAlgorithmDescription(algorithms[algorithm].description);
    setAlgorithmComplexity(algorithms[algorithm].complexity);
    setAlgorithmUseCase(algorithms[algorithm].useCase);
    setAlgorithmPseudoCode(algorithms[algorithm].pseudoCode);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Algorithmes de graphe</h2>
          <div className="space-x-2">
            <Link 
              href="/family-tree"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Retour à l'arbre généalogique
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Sélectionnez un algorithme</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              className={`p-4 rounded-lg border ${selectedAlgorithm === 'dijkstra' ? 'bg-green-50 border-green-500' : 'border-gray-300 hover:border-green-300'}`}
              onClick={() => handleAlgorithmChange('dijkstra')}
            >
              <h4 className="font-medium">Dijkstra</h4>
              <p className="text-sm text-gray-600">Plus court chemin</p>
            </button>
            
            <button
              className={`p-4 rounded-lg border ${selectedAlgorithm === 'bellmanFord' ? 'bg-green-50 border-green-500' : 'border-gray-300 hover:border-green-300'}`}
              onClick={() => handleAlgorithmChange('bellmanFord')}
            >
              <h4 className="font-medium">Bellman-Ford</h4>
              <p className="text-sm text-gray-600">Plus court chemin avec poids négatifs</p>
            </button>
            
            <button
              className={`p-4 rounded-lg border ${selectedAlgorithm === 'prim' ? 'bg-green-50 border-green-500' : 'border-gray-300 hover:border-green-300'}`}
              onClick={() => handleAlgorithmChange('prim')}
            >
              <h4 className="font-medium">Prim</h4>
              <p className="text-sm text-gray-600">Arbre couvrant minimal</p>
            </button>
            
            <button
              className={`p-4 rounded-lg border ${selectedAlgorithm === 'kruskal' ? 'bg-green-50 border-green-500' : 'border-gray-300 hover:border-green-300'}`}
              onClick={() => handleAlgorithmChange('kruskal')}
            >
              <h4 className="font-medium">Kruskal</h4>
              <p className="text-sm text-gray-600">Arbre couvrant minimal</p>
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4">Algorithme de {algorithms[selectedAlgorithm].name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Description</h4>
                <p className="text-gray-700 mb-4">{algorithmDescription}</p>
                
                <h4 className="font-medium text-green-700 mb-2">Complexité</h4>
                <p className="text-gray-700 mb-4">{algorithmComplexity}</p>
                
                <h4 className="font-medium text-green-700 mb-2">Cas d'utilisation</h4>
                <p className="text-gray-700">{algorithmUseCase}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-green-700 mb-2">Pseudo-code</h4>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {algorithmPseudoCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Applications dans l'arbre généalogique</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium mb-2">Dijkstra et Bellman-Ford</h4>
              <p className="text-gray-700">
                Ces algorithmes sont utilisés pour trouver le chemin le plus court entre deux personnes dans l'arbre généalogique, 
                ce qui permet de déterminer le lien de parenté le plus direct. Dans notre application, ils sont implémentés dans 
                la fonctionnalité de recherche de liens de parenté.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium mb-2">Prim et Kruskal</h4>
              <p className="text-gray-700">
                Ces algorithmes sont utilisés pour analyser la structure de l'arbre généalogique en identifiant l'arbre couvrant minimal. 
                Cela permet de visualiser les relations essentielles qui connectent tous les membres de la famille avec un minimum de liens.
                Dans notre application, ils sont implémentés dans la fonctionnalité d'analyse de structure.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <Link 
              href="/search"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Rechercher des liens de parenté
            </Link>
            <Link 
              href="/family-tree/analysis"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Analyser la structure
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

// Définitions des algorithmes
const algorithms: Record<string, {
  name: string;
  description: string;
  complexity: string;
  useCase: string;
  pseudoCode: string;
}> = {
  dijkstra: {
    name: 'Dijkstra',
    description: "L'algorithme de Dijkstra est un algorithme de recherche de chemin qui trouve le plus court chemin entre un nœud source et tous les autres nœuds dans un graphe pondéré avec des poids positifs.",
    complexity: "Temps : O((V + E) log V) avec une file de priorité, où V est le nombre de nœuds et E le nombre d'arêtes.",
    useCase: "Dans notre arbre généalogique, Dijkstra est utilisé pour trouver le lien de parenté le plus direct entre deux personnes lorsque toutes les relations ont des poids positifs.",
    pseudoCode: `function Dijkstra(Graphe, Source):
    // Initialisation
    pour chaque sommet v du Graphe:
        distance[v] = infini
        précédent[v] = indéfini
        visité[v] = faux
    distance[Source] = 0
    
    // File de priorité avec tous les sommets
    Q = tous les sommets du graphe
    
    tant que Q n'est pas vide:
        u = sommet de Q avec la plus petite distance
        retirer u de Q
        
        si distance[u] = infini:
            break // Tous les sommets restants sont inaccessibles
            
        pour chaque voisin v de u:
            si v n'est pas visité:
                alt = distance[u] + poids(u, v)
                si alt < distance[v]:
                    distance[v] = alt
                    précédent[v] = u
    
    retourner distance[], précédent[]`
  },
  bellmanFord: {
    name: 'Bellman-Ford',
    description: "L'algorithme de Bellman-Ford est un algorithme de recherche de chemin qui trouve le plus court chemin entre un nœud source et tous les autres nœuds dans un graphe pondéré, même avec des poids négatifs.",
    complexity: "Temps : O(V * E) où V est le nombre de nœuds et E le nombre d'arêtes.",
    useCase: "Dans notre arbre généalogique, Bellman-Ford pourrait être utilisé pour trouver des liens de parenté dans des cas où certaines relations pourraient avoir des poids négatifs (par exemple, pour modéliser des relations complexes).",
    pseudoCode: `function BellmanFord(Graphe, Source):
    // Initialisation
    pour chaque sommet v du Graphe:
        distance[v] = infini
        précédent[v] = indéfini
    distance[Source] = 0
    
    // Relaxation des arêtes
    pour i de 1 à |V|-1:
        pour chaque arête (u, v) du Graphe:
            si distance[u] + poids(u, v) < distance[v]:
                distance[v] = distance[u] + poids(u, v)
                précédent[v] = u
    
    // Vérification des cycles négatifs
    pour chaque arête (u, v) du Graphe:
        si distance[u] + poids(u, v) < distance[v]:
            retourner "Le graphe contient un cycle de poids négatif"
    
    retourner distance[], précédent[]`
  },
  prim: {
    name: 'Prim',
    description: "L'algorithme de Prim est un algorithme glouton qui trouve un arbre couvrant minimal pour un graphe connexe pondéré non orienté.",
    complexity: "Temps : O(E log V) avec une file de priorité, où V est le nombre de nœuds et E le nombre d'arêtes.",
    useCase: "Dans notre arbre généalogique, Prim est utilisé pour analyser la structure familiale en identifiant les relations essentielles qui connectent tous les membres avec un minimum de liens.",
    pseudoCode: `function Prim(Graphe, Racine):
    // Initialisation
    pour chaque sommet v du Graphe:
        clé[v] = infini
        parent[v] = indéfini
        dans_ACM[v] = faux
    clé[Racine] = 0
    
    // File de priorité avec tous les sommets
    Q = tous les sommets du graphe
    
    tant que Q n'est pas vide:
        u = sommet de Q avec la plus petite clé
        retirer u de Q
        dans_ACM[u] = vrai
        
        pour chaque voisin v de u:
            si v est dans Q et poids(u, v) < clé[v]:
                parent[v] = u
                clé[v] = poids(u, v)
    
    retourner parent[]`
  },
  kruskal: {
    name: 'Kruskal',
    description: "L'algorithme de Kruskal est un algorithme glouton qui trouve un arbre couvrant minimal pour un graphe connexe pondéré non orienté.",
    complexity: "Temps : O(E log E) ou O(E log V), où V est le nombre de nœuds et E le nombre d'arêtes.",
    useCase: "Dans notre arbre généalogique, Kruskal est utilisé, comme Prim, pour analyser la structure familiale, mais avec une approche différente qui peut être plus efficace dans certains cas.",
    pseudoCode: `function Kruskal(Graphe):
    // Initialisation
    A = ensemble vide
    pour chaque sommet v du Graphe:
        Créer un ensemble contenant uniquement v
    
    // Trier les arêtes par poids croissant
    Trier les arêtes du Graphe par poids croissant
    
    pour chaque arête (u, v) du Graphe (par poids croissant):
        si u et v ne sont pas dans le même ensemble:
            Ajouter l'arête (u, v) à A
            Fusionner les ensembles contenant u et v
    
    retourner A`
  }
};
