'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserLayout from '../components/UserLayout';

export default function Search() {
  const [persons, setPersons] = useState<any[]>([]);
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données des personnes
    // Dans un projet réel, vous feriez un appel API ici
    setTimeout(() => {
      setPersons(samplePersons);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    if (!person1 || !person2) {
      alert('Veuillez sélectionner deux personnes');
      return;
    }
    
    setSearchLoading(true);
    setSearchResult(null);
    
    // Simuler une recherche avec l'algorithme de Dijkstra
    // Dans un projet réel, vous feriez un appel API au backend
    setTimeout(() => {
      const p1 = parseInt(person1);
      const p2 = parseInt(person2);
      
      // Exemple de résultat simulé
      const result = {
        found: true,
        path: [
          { id: p1, firstName: persons.find(p => p.id === p1)?.firstName, lastName: persons.find(p => p.id === p1)?.lastName, relationshipType: null },
          { id: 1, firstName: 'Jean', lastName: 'Dupont', relationshipType: 'parent', weight: 1 },
          { id: 2, firstName: 'Marie', lastName: 'Dupont', relationshipType: 'conjoint', weight: 1 },
          { id: p2, firstName: persons.find(p => p.id === p2)?.firstName, lastName: persons.find(p => p.id === p2)?.lastName, relationshipType: 'parent', weight: 1 }
        ],
        totalWeight: 3,
        relationshipType: 'Grand-parent/Petit-enfant'
      };
      
      setSearchResult(result);
      setSearchLoading(false);
    }, 2000);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-xl">Chargement des données...</div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>

        <h2 className="text-2xl font-bold mb-8">Recherche de liens de parenté</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Sélectionnez deux personnes</h3>
          <p className="text-gray-600 mb-6">
            Sélectionnez deux personnes pour découvrir leur lien de parenté. L'algorithme de Dijkstra sera utilisé pour 
            trouver le chemin le plus court entre ces deux personnes dans le graphe familial.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="person1" className="block text-sm font-medium text-gray-700 mb-1">
                Première personne
              </label>
              <select
                id="person1"
                value={person1}
                onChange={(e) => setPerson1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une personne</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="person2" className="block text-sm font-medium text-gray-700 mb-1">
                Deuxième personne
              </label>
              <select
                id="person2"
                value={person2}
                onChange={(e) => setPerson2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une personne</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleSearch}
              disabled={searchLoading || !person1 || !person2}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {searchLoading ? 'Recherche en cours...' : 'Rechercher le lien'}
            </button>
          </div>
        </div>
        
        {searchResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Résultat de la recherche</h3>
            
            {searchResult.found ? (
              <>
                <div className="mb-4">
                  <p className="text-lg font-medium">
                    Type de relation : <span className="text-blue-600">{searchResult.relationshipType}</span>
                  </p>
                  <p className="text-gray-600">
                    Distance (poids total) : {searchResult.totalWeight}
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Chemin de parenté :</h4>
                  <div className="flex flex-wrap items-center">
                    {searchResult.path.map((node: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-green-100 px-3 py-1 rounded-lg">
                          {node.firstName} {node.lastName}
                        </div>
                        
                        {index < searchResult.path.length - 1 && (
                          <div className="flex items-center mx-2">
                            <span className="text-gray-500">{searchResult.path[index + 1].relationshipType}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Explication :</h4>
                  <p>
                    Cette relation a été trouvée en utilisant l'algorithme de Dijkstra pour déterminer le chemin le plus court 
                    dans le graphe familial. Le poids de chaque arête représente le degré de parenté entre les personnes.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">
                  Aucun lien de parenté n'a été trouvé entre ces deux personnes.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Autres types de recherche</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Trouver l'ancêtre commun</h4>
              <p className="text-gray-600 mb-4">
                Recherchez l'ancêtre commun le plus proche entre deux personnes.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors w-full">
                Rechercher un ancêtre commun
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Trouver tous les descendants</h4>
              <p className="text-gray-600 mb-4">
                Recherchez tous les descendants d'une personne jusqu'à une certaine profondeur.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors w-full">
                Rechercher les descendants
              </button>
            </div>
          </div>
        </div>
    </UserLayout>
  );
}

// Données d'exemple pour simuler une liste de personnes
const samplePersons = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', gender: 'male', birthDate: '1950-05-15' },
  { id: 2, firstName: 'Marie', lastName: 'Dupont', gender: 'female', birthDate: '1952-08-22' },
  { id: 3, firstName: 'Pierre', lastName: 'Dupont', gender: 'male', birthDate: '1975-03-10' },
  { id: 4, firstName: 'Sophie', lastName: 'Dupont', gender: 'female', birthDate: '1978-11-05' },
  { id: 5, firstName: 'Luc', lastName: 'Dupont', gender: 'male', birthDate: '1980-07-30' },
  { id: 6, firstName: 'Emma', lastName: 'Martin', gender: 'female', birthDate: '1979-04-18' },
  { id: 7, firstName: 'Thomas', lastName: 'Dupont', gender: 'male', birthDate: '2005-12-03' },
  { id: 8, firstName: 'Léa', lastName: 'Dupont', gender: 'female', birthDate: '2008-09-21' },
];
