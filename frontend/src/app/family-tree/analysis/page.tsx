'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserLayout from '../../components/UserLayout';
import { FamilyTreeService } from '../../services/family-tree.service';

export default function FamilyTreeAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [algorithm, setAlgorithm] = useState('prim');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      // Dans un environnement de production, nous ferions un appel API au backend
      let result;
      
      if (algorithm === 'prim' || algorithm === 'kruskal') {
        // result = await FamilyTreeService.findMinimumSpanningTree(algorithm);
        // Pour le développement, nous utilisons des données simulées
        result = algorithm === 'prim' ? primAnalysisResult : kruskalAnalysisResult;
      } else if (algorithm === 'components') {
        // result = await FamilyTreeService.findFamilyGroups();
        // Pour le développement, nous utilisons des données simulées
        result = componentsAnalysisResult;
      }
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error performing analysis:', error);
      alert('Une erreur est survenue lors de l\'analyse');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <UserLayout>
      <h2 className="text-3xl font-bold mb-8">Analyse de la structure familiale</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Sélectionnez un algorithme d'analyse</h3>
        <p className="text-gray-600 mb-6">
          Ces algorithmes vous permettent d'analyser la structure de votre arbre généalogique 
          et de découvrir des informations intéressantes sur les relations familiales.
        </p>
            
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${algorithm === 'prim' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}
            onClick={() => setAlgorithm('prim')}
          >
            <h4 className="font-medium mb-2">Algorithme de Prim</h4>
            <p className="text-sm text-gray-600">
              Trouve l'arbre couvrant minimal qui relie tous les membres de la famille avec le coût total minimal.
            </p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${algorithm === 'kruskal' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}
            onClick={() => setAlgorithm('kruskal')}
          >
            <h4 className="font-medium mb-2">Algorithme de Kruskal</h4>
            <p className="text-sm text-gray-600">
              Alternative à Prim, trouve également l'arbre couvrant minimal mais avec une approche différente.
            </p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${algorithm === 'components' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}
            onClick={() => setAlgorithm('components')}
          >
            <h4 className="font-medium mb-2">Composantes connexes</h4>
            <p className="text-sm text-gray-600">
              Identifie les sous-groupes familiaux distincts dans l'arbre généalogique.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors disabled:opacity-50"
          >
            {analyzing ? 'Analyse en cours...' : 'Lancer l\'analyse'}
          </button>
        </div>
      </div>
          
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Résultats de l'analyse avec l'algorithme de {algorithm === 'prim' ? 'Prim' : algorithm === 'kruskal' ? 'Kruskal' : 'détection de composantes connexes'}
          </h3>
          
          {(algorithm === 'prim' || algorithm === 'kruskal') && (
            <>
              <div className="mb-4">
                <p className="text-lg">
                  <span className="font-medium">Poids total de l'arbre couvrant minimal :</span> {analysisResult.totalWeight}
                </p>
                <p className="text-gray-600">
                  Ce poids représente la somme des degrés de parenté dans l'arbre couvrant minimal.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">Arêtes de l'arbre couvrant minimal :</h4>
                <div className="space-y-2">
                  {analysisResult.edges.map((edge: any, index: number) => (
                    <div key={index} className="flex items-center border-b border-gray-100 pb-2">
                      <div className="bg-blue-100 px-3 py-1 rounded-lg">
                        {edge.source.name}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <div className="bg-green-100 px-3 py-1 rounded-lg">
                        {edge.target.name}
                      </div>
                      <span className="ml-4 text-sm text-gray-500">
                        Relation: {edge.relationshipType.toLowerCase()}, Poids: {edge.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Interprétation :</h4>
                <p className="text-sm">
                  L'arbre couvrant minimal représente la structure familiale la plus simple qui connecte tous les membres 
                  avec le minimum de relations. Cela peut aider à identifier les relations clés dans la famille et à 
                  comprendre la structure fondamentale de l'arbre généalogique.
                </p>
              </div>
            </>
          )}
          
          {algorithm === 'components' && (
            <>
              <div className="mb-4">
                <p className="text-lg">
                  <span className="font-medium">Nombre de groupes familiaux distincts :</span> {analysisResult.groups.length}
                </p>
                <p className="text-gray-600">
                  Ces groupes représentent des sous-ensembles de la famille qui n'ont pas de liens de parenté entre eux.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                {analysisResult.groups.map((group: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Groupe familial #{index + 1} ({group.members.length} membres)</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member: any, memberIndex: number) => (
                        <div key={memberIndex} className="bg-blue-100 px-3 py-1 rounded-lg text-sm">
                          {member.firstName} {member.lastName}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Interprétation :</h4>
                <p className="text-sm">
                  La détection de composantes connexes permet d'identifier des sous-groupes familiaux qui n'ont pas de 
                  liens de parenté entre eux. Cela peut être utile pour découvrir des branches distinctes de la famille 
                  ou pour identifier des données manquantes dans l'arbre généalogique.
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Comprendre les algorithmes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Algorithme de Prim</h4>
            <p className="text-sm text-gray-600 mb-2">
              L'algorithme de Prim est un algorithme glouton qui trouve un arbre couvrant minimal 
              pour un graphe connexe pondéré non orienté.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fonctionnement :</strong> Il commence par un nœud arbitraire et ajoute progressivement 
              l'arête de poids minimal qui connecte un nœud dans l'arbre à un nœud hors de l'arbre.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Algorithme de Kruskal</h4>
            <p className="text-sm text-gray-600 mb-2">
              L'algorithme de Kruskal est également un algorithme glouton qui trouve un arbre couvrant minimal, 
              mais avec une approche différente de Prim.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fonctionnement :</strong> Il trie toutes les arêtes du graphe par poids croissant, puis 
              ajoute les arêtes une par une, en évitant celles qui formeraient un cycle.
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

// Données d'exemple pour simuler les résultats d'analyse
const primAnalysisResult = {
  totalWeight: 12,
  edges: [
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 2, name: 'Marie Dupont' }, relationshipType: 'SPOUSE', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 3, name: 'Pierre Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 4, name: 'Sophie Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 5, name: 'Luc Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 6, name: 'Emma Martin' }, relationshipType: 'SPOUSE', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 7, name: 'Thomas Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 8, name: 'Léa Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
  ]
};

const kruskalAnalysisResult = {
  totalWeight: 12,
  edges: [
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 2, name: 'Marie Dupont' }, relationshipType: 'SPOUSE', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 3, name: 'Pierre Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 4, name: 'Sophie Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 1, name: 'Jean Dupont' }, target: { id: 5, name: 'Luc Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 6, name: 'Emma Martin' }, relationshipType: 'SPOUSE', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 7, name: 'Thomas Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
    { source: { id: 3, name: 'Pierre Dupont' }, target: { id: 8, name: 'Léa Dupont' }, relationshipType: 'PARENT_CHILD', weight: 1 },
  ]
};

const componentsAnalysisResult = {
  groups: [
    {
      id: 1,
      members: [
        { id: 1, firstName: 'Jean', lastName: 'Dupont' },
        { id: 2, firstName: 'Marie', lastName: 'Dupont' },
        { id: 3, firstName: 'Pierre', lastName: 'Dupont' },
        { id: 4, firstName: 'Sophie', lastName: 'Dupont' },
        { id: 5, firstName: 'Luc', lastName: 'Dupont' },
        { id: 6, firstName: 'Emma', lastName: 'Martin' },
        { id: 7, firstName: 'Thomas', lastName: 'Dupont' },
        { id: 8, firstName: 'Léa', lastName: 'Dupont' },
      ]
    },
    {
      id: 2,
      members: [
        { id: 9, firstName: 'Robert', lastName: 'Martin' },
        { id: 10, firstName: 'Jeanne', lastName: 'Martin' },
      ]
    }
  ]
};
