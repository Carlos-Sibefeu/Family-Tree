'use client';

import { useState, useEffect } from 'react';
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
  
  // États pour la recherche de lien de parenté
  const [person1Id, setPerson1Id] = useState<string>('');
  const [person2Id, setPerson2Id] = useState<string>('');
  const [relationshipResult, setRelationshipResult] = useState<{
    path: Array<{ source: number; target: number; type: string; direction: string }>;
    relationship: string;
    distance: number;
    algorithm?: string;
    cyclesDetected?: Array<{ cycle: Array<number>; type: 'negative' | 'normal' }>;
  } | null>(null);
  const [showRelationshipResult, setShowRelationshipResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: number; firstName: string; lastName: string; gender: string }>>([]);
  
  // États pour le mode de recherche
  const [searchMode, setSearchMode] = useState<'select' | 'manual'>('select');
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'bellman-ford'>('dijkstra');
  const [manualPerson1, setManualPerson1] = useState<{ firstName: string; lastName: string; gender: string }>({ 
    firstName: '', 
    lastName: '', 
    gender: '' 
  });
  const [manualPerson2, setManualPerson2] = useState<{ firstName: string; lastName: string; gender: string }>({ 
    firstName: '', 
    lastName: '', 
    gender: '' 
  });

  // Charger les membres de la famille au chargement de la page
  useEffect(() => {
    try {
      const simulatedData = FamilyTreeService.getSimulatedFamilyData();
      setFamilyMembers(simulatedData.persons.map((person: { id: number; firstName: string; lastName: string; gender: string }) => ({
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        gender: person.gender
      })));
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  }, []);
  
  // Vérifier si la sélection est valide
  const isValidSelection = () => {
    return searchMode === 'select' && person1Id !== '' && person2Id !== '';
  };
  
  // Vérifier si la saisie manuelle est valide
  const isValidManualInput = () => {
    return searchMode === 'manual' && 
           manualPerson1.firstName.trim() !== '' && 
           manualPerson1.lastName.trim() !== '' && 
           manualPerson1.gender !== '' &&
           manualPerson2.firstName.trim() !== '' && 
           manualPerson2.lastName.trim() !== '' && 
           manualPerson2.gender !== '';
  };
  
  // Variable pour stocker les données de la famille
  const [familyData, setFamilyData] = useState<any>(null);
  
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
  
  // Rechercher le lien de parenté entre deux personnes
  const findRelationship = () => {
    if (searchMode === 'select') {
      if (!person1Id || !person2Id) {
        alert('Veuillez sélectionner deux personnes');
        return;
      }
      
      setIsSearching(true);
      
      try {
        let result;
        
        if (algorithm === 'dijkstra') {
          result = FamilyTreeService.findRelationship(
            parseInt(person1Id),
            parseInt(person2Id)
          );
        } else {
          result = FamilyTreeService.findRelationshipBellmanFord(
            parseInt(person1Id),
            parseInt(person2Id)
          );
        }
        
        setRelationshipResult(result);
        setShowRelationshipResult(true);
      } catch (error) {
        console.error('Error finding relationship:', error);
        alert('Une erreur est survenue lors de la recherche du lien de parenté.');
      } finally {
        setIsSearching(false);
      }
    } else {
      // Mode saisie manuelle
      if (!isValidManualInput()) {
        alert('Veuillez remplir tous les champs pour les deux personnes');
        return;
      }
      
      setIsSearching(true);
      
      try {
        // Créer des personnes temporaires pour l'algorithme
        const result = FamilyTreeService.findRelationshipByNames(
          manualPerson1.firstName,
          manualPerson1.lastName,
          manualPerson1.gender,
          manualPerson2.firstName,
          manualPerson2.lastName,
          manualPerson2.gender
        );
        
        setRelationshipResult(result);
        setShowRelationshipResult(true);
      } catch (error) {
        console.error('Error finding relationship:', error);
        alert('Une erreur est survenue lors de la recherche du lien de parenté.');
      } finally {
        setIsSearching(false);
      }
    }
  };
  
  // Fermer le résultat de la recherche
  const closeRelationshipResult = () => {
    setShowRelationshipResult(false);
    setRelationshipResult(null);
  };
  
  // Formater le chemin pour l'affichage
  const formatPath = (path: Array<{ source: number; target: number; type: string }>) => {
    if (!path || path.length === 0) return 'Aucun chemin';
    
    return path.map((step, index) => {
      const sourceData = familyMembers.find(p => p.id === step.source);
      const targetData = familyMembers.find(p => p.id === step.target);
      
      if (!sourceData || !targetData) return 'Relation inconnue';
      
      const sourceName = `${sourceData.firstName} ${sourceData.lastName}`;
      const targetName = `${targetData.firstName} ${targetData.lastName}`;
      
      const relationText = step.type === 'PARENT_CHILD' 
        ? `est parent de` 
        : step.type === 'SPOUSE' 
          ? `est marié à` 
          : `est lié à`;
      
      return (
        <div key={index} className="mb-2">
          <span className="font-semibold">{sourceName}</span>
          <span className="mx-2">{relationText}</span>
          <span className="font-semibold">{targetName}</span>
        </div>
      );
    });
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
      
      {/* Interface de recherche de lien de parenté */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Rechercher un lien de parenté</h3>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Mode de recherche:</span>
            <div className="ml-4 flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  className="form-radio h-4 w-4 text-green-600" 
                  name="searchMode" 
                  value="select" 
                  checked={searchMode === 'select'}
                  onChange={() => setSearchMode('select')} 
                />
                <span className="ml-2">Sélectionner dans la liste</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  className="form-radio h-4 w-4 text-green-600" 
                  name="searchMode" 
                  value="manual" 
                  checked={searchMode === 'manual'}
                  onChange={() => setSearchMode('manual')} 
                />
                <span className="ml-2">Saisie manuelle</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Algorithme:</span>
            <div className="ml-4 flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  className="form-radio h-4 w-4 text-blue-600" 
                  name="algorithm" 
                  value="dijkstra" 
                  checked={algorithm === 'dijkstra'}
                  onChange={() => setAlgorithm('dijkstra')} 
                />
                <span className="ml-2">Dijkstra</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  className="form-radio h-4 w-4 text-blue-600" 
                  name="algorithm" 
                  value="bellman-ford" 
                  checked={algorithm === 'bellman-ford'}
                  onChange={() => setAlgorithm('bellman-ford')} 
                />
                <span className="ml-2">Bellman-Ford</span>
              </label>
            </div>
          </div>
        </div>
        
        {searchMode === 'select' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="person1" className="block text-sm font-medium text-gray-700 mb-1">
                Personne 1
              </label>
              <select
                id="person1"
                value={person1Id}
                onChange={(e) => setPerson1Id(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sélectionner une personne</option>
                {familyMembers.map((person) => (
                  <option key={`p1-${person.id}`} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="person2" className="block text-sm font-medium text-gray-700 mb-1">
                Personne 2
              </label>
              <select
                id="person2"
                value={person2Id}
                onChange={(e) => setPerson2Id(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sélectionner une personne</option>
                {familyMembers.map((person) => (
                  <option key={`p2-${person.id}`} value={person.id}>
                    {person.firstName} {person.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="manualPerson1" className="block text-sm font-medium text-gray-700 mb-1">
                Personne 1
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  id="manualPerson1FirstName"
                  placeholder="Prénom"
                  value={manualPerson1.firstName}
                  onChange={(e) => setManualPerson1({...manualPerson1, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  id="manualPerson1LastName"
                  placeholder="Nom"
                  value={manualPerson1.lastName}
                  onChange={(e) => setManualPerson1({...manualPerson1, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mt-2">
                <select
                  id="manualPerson1Gender"
                  value={manualPerson1.gender}
                  onChange={(e) => setManualPerson1({...manualPerson1, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner le genre</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="manualPerson2" className="block text-sm font-medium text-gray-700 mb-1">
                Personne 2
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  id="manualPerson2FirstName"
                  placeholder="Prénom"
                  value={manualPerson2.firstName}
                  onChange={(e) => setManualPerson2({...manualPerson2, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="text"
                  id="manualPerson2LastName"
                  placeholder="Nom"
                  value={manualPerson2.lastName}
                  onChange={(e) => setManualPerson2({...manualPerson2, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="mt-2">
                <select
                  id="manualPerson2Gender"
                  value={manualPerson2.gender}
                  onChange={(e) => setManualPerson2({...manualPerson2, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner le genre</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={findRelationship}
            disabled={isSearching || (!isValidSelection() && !isValidManualInput())}
            className={`${isSearching || (!isValidSelection() && !isValidManualInput()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-2 px-6 rounded transition-colors flex items-center`}
          >
            {isSearching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recherche en cours...
              </>
            ) : 'Rechercher le lien de parenté'}
          </button>
        </div>
      </div>
      
      {/* Résultat de la recherche de lien de parenté */}
      {showRelationshipResult && relationshipResult && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">Résultat de la recherche</h3>
            <button 
              onClick={closeRelationshipResult}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Personnes concernées */}
          <div className="mb-4 bg-blue-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <div className="text-center">
                <span className="font-semibold">
                  {searchMode === 'select' ? 
                    `${familyMembers.find((p: {id: number}) => p.id.toString() === person1Id)?.firstName} ${familyMembers.find((p: {id: number}) => p.id.toString() === person1Id)?.lastName}` : 
                    `${manualPerson1.firstName} ${manualPerson1.lastName}`}
                </span>
              </div>
              <div className="text-center">
                <span className="text-lg text-green-700 font-bold">
                  est {relationshipResult.relationship} de
                </span>
              </div>
              <div className="text-center">
                <span className="font-semibold">
                  {searchMode === 'select' ? 
                    `${familyMembers.find((p: {id: number}) => p.id.toString() === person2Id)?.firstName} ${familyMembers.find((p: {id: number}) => p.id.toString() === person2Id)?.lastName}` : 
                    `${manualPerson2.firstName} ${manualPerson2.lastName}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="font-bold mr-2">Distance généalogique:</span>
              <span>{relationshipResult.distance === Infinity ? 'Aucun lien' : `${relationshipResult.distance} degré${relationshipResult.distance > 1 ? 's' : ''}`}</span>
            </div>
            {relationshipResult.algorithm && (
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">Algorithme utilisé:</span>
                <span className="text-blue-600">{relationshipResult.algorithm}</span>
              </div>
            )}
            
            {/* Affichage des cycles détectés */}
            {relationshipResult.cyclesDetected && relationshipResult.cyclesDetected.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Cycles détectés dans l&apos;arbre généalogique:</h4>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  {relationshipResult.cyclesDetected.map((cycleInfo, cycleIndex) => (
                    <div key={cycleIndex} className={`mb-2 p-2 rounded ${cycleInfo.type === 'negative' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Cycle {cycleInfo.type === 'negative' ? 'de poids négatif' : 'normal'}:</span>
                        <span>
                          {cycleInfo.cycle.map(nodeId => {
                            const person = familyMembers.find(p => p.id === nodeId);
                            return person ? `${person.firstName} ${person.lastName}` : `Personne ${nodeId}`;
                          }).join(' → ')}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {cycleInfo.type === 'negative' 
                          ? "Ce cycle peut indiquer une incohérence dans les données de l'arbre généalogique." 
                          : "Ce cycle représente une relation complexe comme un mariage entre cousins ou une autre relation croisée."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {relationshipResult.path.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Chemin détaillé:</h4>
              <div className="bg-gray-50 p-3 rounded border">
                {formatPath(relationshipResult.path)}
              </div>
            </div>
          )}
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
              <p className="text-xl font-semibold">{familyMembers.length}</p>
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
