'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserLayout from '../components/UserLayout';
import FamilyTreeBalkan from '../components/FamilyTreeBalkan';
import { FamilyTreeService } from '../services/family-tree.service';

export default function FamilyTree() {
  const [selectedPersonId, setSelectedPersonId] = useState<number | undefined>(undefined);
  const [selectedPerson, setSelectedPerson] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate?: string;
    imageUrl?: string;
  } | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Gérer la sélection d'une personne dans le graphe
  const handlePersonSelect = async (personId: number) => {
    setSelectedPersonId(personId);
    
    try {
      // Dans un environnement de production, nous ferions un appel API ici
      // const personData = await FamilyTreeService.getPersonById(personId);
      
      // Pour le développement, nous utilisons des données simulées
      const simulatedData = FamilyTreeService.getSimulatedFamilyData();
      const personData = simulatedData.persons.find(p => p.id === personId);
      
      if (personData) {
        setSelectedPerson(personData);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching person details:', error);
    }
  };

  // Fermer le panneau de détails
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedPersonId(undefined);
  };

  return (
    <UserLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Visualisation de l'arbre généalogique</h2>
        <div className="space-x-2">
          <Link 
            href="/family-tree/add"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Ajouter un membre
          </Link>
          <Link 
            href="/family-tree/analysis"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Analyse de structure
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <p className="text-gray-600">
            Cliquez sur un membre pour voir ses détails. Utilisez les contrôles pour naviguer dans l&apos;arbre.
          </p>
        </div>
        
        {/* Zone de rendu de l'arbre généalogique avec BALKAN FamilyTree */}
        <FamilyTreeBalkan 
          selectedPersonId={selectedPersonId} 
          onPersonSelect={handlePersonSelect} 
          useSimulatedData={true} 
        />
      </div>
      
      {/* Panneau de détails de la personne sélectionnée */}
      {showDetails && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedPerson.firstName} {selectedPerson.lastName}</h3>
              <button 
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Genre</p>
                <p>{selectedPerson.gender === 'male' ? 'Homme' : 'Femme'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date de naissance</p>
                <p>{selectedPerson.birthDate || "Non renseignée"}</p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Link 
                  href={`/family-tree/edit/${selectedPerson.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1 text-center"
                >
                  Modifier
                </Link>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex-1"
                  onClick={() => {
                    // Dans un environnement de production, nous supprimerions la personne ici
                    alert(`Suppression de ${selectedPerson.firstName} ${selectedPerson.lastName}`);
                    closeDetails();
                  }}
                >
                  Supprimer
                </button>
              </div>
              
              <div className="pt-2">
                <button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => {
                    closeDetails();
                    // Rediriger vers la page de recherche de liens de parenté
                    // router.push(`/search?person1Id=${selectedPerson.id}`);
                  }}
                >
                  Rechercher des liens de parenté
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Légende</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 border border-blue-600 rounded mr-2"></div>
              <span>Homme</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-pink-100 border border-pink-600 rounded mr-2"></div>
              <span>Femme</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 border-2 border-blue-500 shadow-md rounded mr-2"></div>
              <span>Personne sélectionnée</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-0.5 bg-blue-600 mr-2"></div>
              <span>Relation parent-enfant</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-0.5 bg-purple-600 border-dashed mr-2"></div>
              <span>Relation de couple</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre total de membres</p>
              <p className="text-xl font-semibold">8</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de générations</p>
              <p className="text-xl font-semibold">3</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Groupes familiaux</p>
              <p className="text-xl font-semibold">1</p>
            </div>
            <div className="pt-2">
              <Link 
                href="/family-tree/analysis"
                className="inline-block text-green-600 hover:text-green-800 hover:underline"
              >
                Voir l'analyse complète
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

// Données d'exemple pour simuler un arbre généalogique
// Utilisées par le service FamilyTreeService.getSimulatedFamilyData()
/* 
const sampleFamilyData = {
  persons: [
    { id: 1, firstName: 'Jean', lastName: 'Dupont', gender: 'male', birthDate: '1950-05-15', x: 300, y: 50 },
    { id: 2, firstName: 'Marie', lastName: 'Dupont', gender: 'female', birthDate: '1952-08-22', x: 500, y: 50 },
    { id: 3, firstName: 'Pierre', lastName: 'Dupont', gender: 'male', birthDate: '1975-03-10', x: 200, y: 150 },
    { id: 4, firstName: 'Sophie', lastName: 'Dupont', gender: 'female', birthDate: '1978-11-05', x: 400, y: 150 },
    { id: 5, firstName: 'Luc', lastName: 'Dupont', gender: 'male', birthDate: '1980-07-30', x: 600, y: 150 },
    { id: 6, firstName: 'Emma', lastName: 'Martin', gender: 'female', birthDate: '1979-04-18', x: 200, y: 250 },
    { id: 7, firstName: 'Thomas', lastName: 'Dupont', gender: 'male', birthDate: '2005-12-03', x: 100, y: 350 },
    { id: 8, firstName: 'Léa', lastName: 'Dupont', gender: 'female', birthDate: '2008-09-21', x: 300, y: 350 },
  ],
  relationships: [
    { source: 1, target: 3, type: 'parent-child' },
    { source: 1, target: 4, type: 'parent-child' },
    { source: 1, target: 5, type: 'parent-child' },
    { source: 2, target: 3, type: 'parent-child' },
    { source: 2, target: 4, type: 'parent-child' },
    { source: 2, target: 5, type: 'parent-child' },
    { source: 3, target: 7, type: 'parent-child' },
    { source: 3, target: 8, type: 'parent-child' },
    { source: 6, target: 7, type: 'parent-child' },
    { source: 6, target: 8, type: 'parent-child' },
  ]
};
*/
