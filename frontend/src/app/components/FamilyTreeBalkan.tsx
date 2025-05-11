'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import FamilyTree from '@balkangraph/familytree.js';
import './FamilyTreeBalkan.css';
import { FamilyTreeService } from '../services/family-tree.service';

// Types personnalisés pour l'arbre généalogique
type FamilyTreeNode = {
  id: string;
  pids?: string[];
  mid?: string;
  fid?: string;
  name: string;
  gender: string;
  role?: string;
  img?: string;
  tags?: string[];
};

type FamilyData = {
  persons: Array<{
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate?: string;
    imageUrl?: string;
    [key: string]: unknown;
  }>;
  relationships: Array<{
    source: number;
    target: number;
    type: string;
    weight?: number;
  }>;
};

interface FamilyTreeBalkanProps {
  selectedPersonId?: number;
  onPersonSelect?: (personId: number) => void;
  useSimulatedData?: boolean;
}

interface PersonData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  occupation?: string;
  notes?: string;
  role?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface PersonDetailsProps {
  person: PersonData | null;
  onClose: () => void;
  onSave: (updatedPerson: PersonData) => void;
  onDelete: (personId: number) => void;
}

// Composant pour afficher et modifier les détails d'une personne
const PersonDetails: React.FC<PersonDetailsProps> = ({ person, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState(person);
  const [isEditing, setIsEditing] = useState(false);

  // Mettre à jour les données du formulaire lorsque la personne sélectionnée change
  useEffect(() => {
    setFormData(person);
    setIsEditing(false);
  }, [person]);

  if (!person) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = (e: React.MouseEvent) => {
    // Empêcher le comportement par défaut qui pourrait causer une navigation
    e.preventDefault();
    e.stopPropagation();
    
    if (formData) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    // Empêcher la propagation de l'événement si fourni
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${person.firstName} ${person.lastName} ?`)) {
      onDelete(person.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">
            {isEditing ? 'Modifier les informations' : `${person.firstName} ${person.lastName}`}
          </h3>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Prénom</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData?.firstName || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Nom</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData?.lastName || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Rôle</label>
              <input 
                type="text" 
                name="role" 
                value={formData?.role || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date de naissance</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={formData?.birthDate || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Lieu de naissance</label>
                <input 
                  type="text" 
                  name="birthPlace" 
                  value={formData?.birthPlace || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date de décès</label>
                <input 
                  type="date" 
                  name="deathDate" 
                  value={formData?.deathDate || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Lieu de décès</label>
                <input 
                  type="text" 
                  name="deathPlace" 
                  value={formData?.deathPlace || ''} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Profession</label>
              <input 
                type="text" 
                name="occupation" 
                value={formData?.occupation || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Notes</label>
              <textarea 
                name="notes" 
                value={formData?.notes || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded h-24"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
                <Image 
                  src={person.imageUrl || (person.gender === 'male' ? '/images/avatars/male-avatar.svg' : '/images/avatars/female-avatar.svg')} 
                  alt={`${person.firstName} ${person.lastName}`}
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Rôle</p>
              <p>{person.role || 'Non renseigné'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Genre</p>
              <p>{person.gender === 'male' ? 'Homme' : 'Femme'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p>{person.birthDate || 'Non renseignée'}</p>
            </div>
            
            {person.birthPlace && (
              <div>
                <p className="text-sm text-gray-500">Lieu de naissance</p>
                <p>{person.birthPlace}</p>
              </div>
            )}
            
            {person.deathDate && (
              <div>
                <p className="text-sm text-gray-500">Date de décès</p>
                <p>{person.deathDate}</p>
              </div>
            )}
            
            {person.deathPlace && (
              <div>
                <p className="text-sm text-gray-500">Lieu de décès</p>
                <p>{person.deathPlace}</p>
              </div>
            )}
            
            {person.occupation && (
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p>{person.occupation}</p>
              </div>
            )}
            
            {person.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p>{person.notes}</p>
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Modifier
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FamilyTreeBalkan: React.FC<FamilyTreeBalkanProps> = ({
  selectedPersonId,
  onPersonSelect,
  useSimulatedData = true // Forcer l'utilisation des données simulées
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const familyTreeRef = useRef<FamilyTree | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Transformer les données pour BALKAN FamilyTree
  const transformDataForBalkanFamilyTree = (familyData: FamilyData): FamilyTreeNode[] => {
    // Vérifier que les données sont valides
    if (!familyData || !familyData.persons || !Array.isArray(familyData.persons) || familyData.persons.length === 0) {
      console.error('Données invalides pour la transformation');
      return [];
    }

    const { persons, relationships = [] } = familyData;
    
    // Créer un dictionnaire des relations parent-enfant et conjoint
    const parentChildRelations: Record<string, string[]> = {};
    const childParentRelations: Record<string, string[]> = {}; // Relation inverse pour faciliter la recherche
    const spouseRelations: Record<string, string[]> = {};
    
    // Initialiser les tableaux
    persons.forEach((person: { id: number }) => {
      if (person && person.id) {
        const id = person.id.toString();
        parentChildRelations[id] = [];
        childParentRelations[id] = [];
        spouseRelations[id] = [];
      }
    });
    
    // Remplir les relations si elles existent
    if (Array.isArray(relationships)) {
      relationships.forEach((rel: { source: number; target: number; type: string; weight?: number }) => {
        if (rel && rel.source && rel.target) {
          const source = rel.source.toString();
          const target = rel.target.toString();
          
          // Vérifier que les tableaux existent avant de les manipuler
          if (rel.type === 'PARENT_CHILD') {
            // Ajouter la relation parent -> enfant
            if (parentChildRelations[source]) {
              parentChildRelations[source].push(target);
            }
            
            // Ajouter la relation inverse enfant -> parent
            if (childParentRelations[target]) {
              childParentRelations[target].push(source);
            }
          } else if (rel.type === 'SPOUSE') {
            // Vérifier que les tableaux existent
            if (spouseRelations[source]) {
              spouseRelations[source].push(target);
            }
            if (spouseRelations[target]) {
              spouseRelations[target].push(source);
            }
          }
        }
      });
    }
    
    // Créer les relations de mariage implicites pour les parents d'un même enfant
    persons.forEach((person: { id: number }) => {
      if (person && person.id) {
        const personId = person.id.toString();
        const parents = childParentRelations[personId] || [];
        
        // Si une personne a deux parents ou plus, créer des relations de mariage entre eux
        if (parents.length >= 2) {
          // Pour chaque paire de parents
          for (let i = 0; i < parents.length; i++) {
            for (let j = i + 1; j < parents.length; j++) {
              const parent1 = parents[i];
              const parent2 = parents[j];
              
              // Vérifier si les parents sont de sexes différents
              const parent1Data = persons.find(p => p.id.toString() === parent1);
              const parent2Data = persons.find(p => p.id.toString() === parent2);
              
              if (parent1Data && parent2Data && parent1Data.gender !== parent2Data.gender) {
                // Ajouter la relation de mariage si elle n'existe pas déjà
                if (!spouseRelations[parent1].includes(parent2)) {
                  spouseRelations[parent1].push(parent2);
                }
                if (!spouseRelations[parent2].includes(parent1)) {
                  spouseRelations[parent2].push(parent1);
                }
              }
            }
          }
        }
      }
    });

    // Créer les nœuds pour BALKAN FamilyTree
    return persons.map((person: { id: number; firstName: string; lastName: string; gender: string; imageUrl?: string }): FamilyTreeNode => {
      if (!person || !person.id) {
        console.error('Personne invalide dans les données');
        // Retourner un nœud vide pour éviter les erreurs
        return {
          id: 'unknown',
          name: 'Inconnu',
          gender: 'male',
          role: '',
          img: '/images/avatars/male-avatar.svg',
          pids: [],
          tags: ['male']
        };
      }

      // Déterminer le rôle familial pour l'affichage
      let role = '';
      // Utiliser une approche plus dynamique pour déterminer le rôle
      const personId = person.id.toString();
      const hasChildren = parentChildRelations[personId] && parentChildRelations[personId].length > 0;
      const hasParents = childParentRelations[personId] && childParentRelations[personId].length > 0;
      
      if (person.gender === 'male') {
        if (!hasParents && hasChildren) {
          role = 'Grand-père';
        } else if (hasChildren) {
          role = 'Père';
        } else {
          role = 'Fils';
        }
      } else if (person.gender === 'female') {
        if (!hasParents && hasChildren) {
          role = 'Grand-mère';
        } else if (hasChildren) {
          role = 'Mère';
        } else {
          role = 'Fille';
        }
      }

      // S'assurer que l'ID existe dans les relations
      const personSpouses = spouseRelations[personId] || [];

      // Trouver les parents en utilisant la relation inverse enfant -> parent
      const parents = childParentRelations[personId] || [];

      // Trouver les parents de manière sécurisée
      const findParentByGender = (gender: string) => {
        for (const parentId of parents) {
          const parent = persons.find(p => p.id.toString() === parentId);
          if (parent && parent.gender === gender) {
            return parentId;
          }
        }
        return undefined;
      };

      // Créer le nœud
      return {
        id: personId,
        name: `${person.firstName} ${person.lastName}`,
        gender: person.gender || 'unknown',
        role: role,
        img: person.imageUrl || (person.gender === 'male' ? '/images/avatars/male-avatar.svg' : '/images/avatars/female-avatar.svg'),
        pids: personSpouses,
        mid: findParentByGender('female'),
        fid: findParentByGender('male'),
        tags: [person.gender || 'unknown']
      };
    });
  };

  // Fonction pour charger les données de l'arbre généalogique
  const loadFamilyTreeData = useCallback(async () => {
    try {
      // S'assurer que le conteneur existe
      if (!containerRef.current) {
        console.error('Le conteneur n\'est pas disponible');
        return;
      }

      // Toujours utiliser les données simulées
      const familyData = FamilyTreeService.getSimulatedFamilyData() as FamilyData;
      console.log('Chargement des données de l\'arbre généalogique:', familyData);

      // Vérifier que les données sont valides
      if (!familyData || !familyData.persons || !Array.isArray(familyData.persons) || familyData.persons.length === 0) {
        console.error('Données invalides pour l\'arbre généalogique');
        return;
      }

      // Transformer les données pour BALKAN FamilyTree
      const nodes = transformDataForBalkanFamilyTree(familyData);

      // Vérifier que les nœuds sont valides
      if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
        console.error('Transformation des nœuds invalide');
        return;
      }

      // Configurer l'arbre généalogique
      // Utiliser un type générique pour éviter les erreurs de typage avec la bibliothèque externe
      const options: Record<string, unknown> = {
        nodes: nodes,
        nodeBinding: {
          field_0: 'name',
          field_1: 'role',
          img_0: 'img'
        },
        enableSearch: true,
        enablePan: true,
        enableZoom: true,
        miniMap: true,
        nodeMouseClick: FamilyTree.action.details, // Utiliser 'details' au lieu de 'edit' pour éviter les erreurs
        mouseScrool: FamilyTree.action.zoom,
      };
      
      // Détruire l'instance existante si elle existe
      if (familyTreeRef.current) {
        try {
          familyTreeRef.current.destroy();
        } catch (e) {
          console.error('Erreur lors de la destruction de l\'arbre existant:', e);
        }
      }
      
      // Créer une nouvelle instance de FamilyTree
      if (containerRef.current) {
        familyTreeRef.current = new FamilyTree(containerRef.current, options);

        // Définir une interface pour les arguments de l'événement
        interface FamilyTreeClickArgs {
          node?: { id?: string };
          event?: MouseEvent;
          [key: string]: unknown;
        }
        
        // Gérer la sélection d'une personne
        familyTreeRef.current.on('click', (_sender: unknown, args: FamilyTreeClickArgs) => {
          // Empêcher la navigation par défaut
          if (args && args.event) {
            try {
              const event = args.event as MouseEvent;
              event.preventDefault();
              event.stopPropagation();
            } catch (error) {
              console.error('Erreur lors de la gestion de l\'événement:', error);
            }
          }
          
          if (args && args.node && args.node.id) {
            const personId = parseInt(args.node.id);
            if (isNaN(personId)) {
              console.error('ID de personne invalide');
              return;
            }
            
            // Toujours utiliser les données simulées
            const simulatedData = FamilyTreeService.getSimulatedFamilyData();
            const personData = simulatedData.persons.find((p: { id: number }) => p.id === personId);
            if (personData) {
              setSelectedPerson(personData);
              setShowDetails(true);
              
              // Appeler le callback de sélection si fourni
              if (onPersonSelect) {
                onPersonSelect(personId);
              }
            }
          }
        });

        // Sélectionner la personne si selectedPersonId est défini
        if (selectedPersonId && familyTreeRef.current) {
          try {
            familyTreeRef.current.center(selectedPersonId.toString());
          } catch (error) {
            console.error('Erreur lors de la sélection de la personne:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de l\'arbre généalogique:', error);
    }
  }, [selectedPersonId, onPersonSelect]);

  // Charger les données de l'arbre généalogique
  useEffect(() => {
    // Capturer la référence au conteneur pour l'utiliser dans la fonction de nettoyage
    const containerElement = containerRef.current;
    
    // Charger les données après un court délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      loadFamilyTreeData();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      try {
        if (familyTreeRef.current) {
          // Nettoyer les événements et les ressources
          try {
            familyTreeRef.current.destroy();
          } catch (e) {
            console.error('Erreur lors de la destruction de l\'arbre:', e);
          }
          
          // Utiliser une approche plus sécurisée pour éviter les erreurs lors du nettoyage
          if (containerElement) {
            // Supprimer tous les enfants du conteneur
            while (containerElement.firstChild) {
              containerElement.removeChild(containerElement.firstChild);
            }
          }
          
          // Réinitialiser la référence
          familyTreeRef.current = null;
        }
      } catch (error) {
        console.error('Erreur lors du nettoyage du composant FamilyTreeBalkan:', error);
      }
    };
  }, [selectedPersonId, onPersonSelect, useSimulatedData, loadFamilyTreeData]);

  // Mettre à jour la sélection lorsque selectedPersonId change
  useEffect(() => {
    if (familyTreeRef.current && selectedPersonId) {
      try {
        familyTreeRef.current.center(selectedPersonId.toString());
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la sélection:', error);
      }
    }
  }, [selectedPersonId]);

  // Gérer la fermeture du panneau de détails
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPerson(null);
  };

  // Gérer la mise à jour d'une personne
  const handleUpdatePerson = (updatedPerson: PersonData) => {
    try {
      // Toujours utiliser les données simulées
      const familyData = FamilyTreeService.getSimulatedFamilyData() as FamilyData;
      
      // Mise à jour manuelle des données simulées
      const personIndex = familyData.persons.findIndex(p => p.id === updatedPerson.id);
      if (personIndex !== -1) {
        // Remplacer la personne par la version mise à jour
        familyData.persons[personIndex] = updatedPerson;
      }

      // Mettre à jour l'arbre généalogique
      const nodes = transformDataForBalkanFamilyTree(familyData);
      if (familyTreeRef.current) {
        familyTreeRef.current.load(nodes);
      }

      // Notifier l'utilisateur
      console.log('Mise à jour de la personne:', updatedPerson);
      alert('Les informations ont été mises à jour avec succès.');
      
      // Fermer le panneau de détails
      handleCloseDetails();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      alert('Une erreur est survenue lors de la mise à jour des données.');
      handleCloseDetails();
    }
  };

  // Gérer la suppression d'une personne
  const handleDeletePerson = (personId: number) => {
    try {
      // Toujours utiliser les données simulées
      const familyData = FamilyTreeService.getSimulatedFamilyData() as FamilyData;
      
      // Suppression manuelle de la personne des données simulées
      familyData.persons = familyData.persons.filter(p => p.id !== personId);
      
      // Suppression des relations impliquant cette personne
      familyData.relationships = familyData.relationships.filter(
        r => r.source !== personId && r.target !== personId
      );

      // Mettre à jour l'arbre généalogique
      const nodes = transformDataForBalkanFamilyTree(familyData);
      if (familyTreeRef.current) {
        familyTreeRef.current.load(nodes);
      }

      // Notifier l'utilisateur
      console.log('Suppression de la personne avec l\'ID:', personId);
      alert('La personne a été supprimée avec succès.');
      
      // Fermer le panneau de détails
      handleCloseDetails();
    } catch (error) {
      console.error('Erreur lors de la suppression de la personne:', error);
      alert('Une erreur est survenue lors de la suppression de la personne.');
      handleCloseDetails();
    }
  };

  return (
    <div className="h-[700px] w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div 
        ref={containerRef} 
        className="family-tree-container"
      />
      
      {/* Panneau de détails de la personne sélectionnée */}
      {showDetails && selectedPerson && (
        <PersonDetails
          person={selectedPerson}
          onClose={handleCloseDetails}
          onSave={handleUpdatePerson}
          onDelete={handleDeletePerson}
        />
      )}
    </div>
  );
};

export default FamilyTreeBalkan;
