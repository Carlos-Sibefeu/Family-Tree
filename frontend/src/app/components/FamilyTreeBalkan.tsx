'use client';

import React, { useEffect, useRef } from 'react';
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

const FamilyTreeBalkan: React.FC<FamilyTreeBalkanProps> = ({
  selectedPersonId,
  onPersonSelect,
  useSimulatedData = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const familyTreeRef = useRef<FamilyTree | null>(null);

  useEffect(() => {
    // Capturer la référence au conteneur pour l'utiliser dans la fonction de nettoyage
    const containerElement = containerRef.current;
    
    const loadFamilyTreeData = async () => {
      try {
        // Obtenir les données de l'arbre généalogique
        let familyData: FamilyData;
        if (useSimulatedData) {
          familyData = FamilyTreeService.getSimulatedFamilyData() as FamilyData;
        } else {
          const persons = await FamilyTreeService.getAllPersons();
          familyData = {
            persons,
            relationships: [], // À remplacer par les vraies relations
          };
        }

        // Transformer les données pour BALKAN FamilyTree
        const nodes = transformDataForBalkanFamilyTree(familyData);

        if (containerRef.current) {
          // Configurer l'arbre généalogique
          // Configurer l'arbre généalogique avec des options de base
          // Utiliser any pour éviter les erreurs de typage avec la bibliothèque externe
          const options: any = {
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
            nodeMouseClick: FamilyTree.action.details,
            mouseScrool: FamilyTree.action.zoom,
          };
          
          familyTreeRef.current = new FamilyTree(containerRef.current, options);

          // Gérer la sélection d'une personne
          if (onPersonSelect) {
            familyTreeRef.current.on('click', (_sender: unknown, args: { node?: { id: string } }) => {
              if (args.node) {
                onPersonSelect(parseInt(args.node.id));
              }
            });
          }

          // Sélectionner la personne si selectedPersonId est défini
          if (selectedPersonId) {
            familyTreeRef.current.center(selectedPersonId.toString());
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de l\'arbre généalogique:', error);
      }
    };

    loadFamilyTreeData();

    // Cleanup
    return () => {
      try {
        if (familyTreeRef.current) {
          // Nettoyer les événements et les ressources
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
  }, [selectedPersonId, onPersonSelect, useSimulatedData]);

  // Mettre à jour la sélection lorsque selectedPersonId change
  useEffect(() => {
    if (familyTreeRef.current && selectedPersonId) {
      familyTreeRef.current.center(selectedPersonId.toString());
    }
  }, [selectedPersonId]);

  // Transformer les données pour BALKAN FamilyTree
  const transformDataForBalkanFamilyTree = (familyData: FamilyData) => {
    const { persons, relationships } = familyData;
    
    // Créer un dictionnaire des relations parent-enfant et conjoint
    const parentChildRelations: Record<string, string[]> = {};
    const spouseRelations: Record<string, string[]> = {};
    
    // Initialiser les tableaux
    persons.forEach((person: { id: number }) => {
      const id = person.id.toString();
      parentChildRelations[id] = [];
      spouseRelations[id] = [];
    });
    
    // Remplir les relations
    relationships.forEach((rel: { source: number; target: number; type: string; weight?: number }) => {
      const source = rel.source.toString();
      const target = rel.target.toString();
      
      if (rel.type === 'PARENT_CHILD') {
        parentChildRelations[source].push(target);
      } else if (rel.type === 'SPOUSE') {
        spouseRelations[source].push(target);
        spouseRelations[target].push(source);
      }
    });

    // Créer les nœuds pour BALKAN FamilyTree
    return persons.map((person: { id: number; firstName: string; lastName: string; gender: string; imageUrl?: string }): FamilyTreeNode => {
      // Déterminer le rôle familial pour l'affichage
      let role = '';
      switch (person.id) {
        case 1:
          role = 'Grand-père';
          break;
        case 2:
          role = 'Grand-mère';
          break;
        case 3:
        case 5:
          role = 'Père';
          break;
        case 4:
          role = 'Mère';
          break;
        case 6:
          role = 'Tante';
          break;
        case 7:
          role = 'Fils';
          break;
        case 8:
          role = 'Fille';
          break;
        default:
          role = '';
      }

      // Trouver les parents
      const parents: string[] = [];
      Object.entries(parentChildRelations).forEach(([parentId, children]) => {
        if (children.includes(person.id.toString())) {
          parents.push(parentId);
        }
      });

      // Trouver le conjoint
      const spouses = spouseRelations[person.id.toString()] || [];

      return {
        id: person.id.toString(),
        pids: spouses, // IDs des conjoints
        mid: parents.length > 0 ? parents[0] : '', // ID de la mère (si disponible)
        fid: parents.length > 1 ? parents[1] : '', // ID du père (si disponible)
        name: `${person.firstName} ${person.lastName}`,
        gender: person.gender,
        role: role,
        img: person.imageUrl || (person.gender === 'male' 
          ? '/images/avatars/male-avatar.png' 
          : '/images/avatars/female-avatar.png'),
        tags: [person.gender] // Ajouter un tag pour le genre pour permettre un style différent
      };
    });
  };

  return (
    <div className="h-[700px] w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div 
        ref={containerRef} 
        className="family-tree-container"
      />
    </div>
  );
};

export default FamilyTreeBalkan;
