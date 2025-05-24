'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  NodeProps,
  Position,
  Handle,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FamilyTreeService } from '../services/family-tree.service';

// Définition des types pour les personnes et les relations
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate?: string;
  deathDate?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface Relationship {
  source: number;
  target: number;
  type: string;
  weight?: number;
}

// Définition des types pour les données de l'arbre familial
interface FamilyData {
  persons: Person[];
  relationships: Relationship[];
}

// Interface pour les propriétés du composant
interface FamilyTreeGraphProps {
  selectedPersonId?: number;
  onPersonSelect?: (personId: number) => void;
  useSimulatedData?: boolean;
}

// Composant pour afficher un nœud de personne
const PersonNode = ({ data, selected }: NodeProps<Person>) => {
  // Styles pour les nœuds selon le genre
  const nodeStyles = {
    male: {
      background: '#1E3A8A',
      color: 'white',
    },
    female: {
      background: '#9D174D',
      color: 'white',
    },
    other: {
      background: '#5B21B6',
      color: 'white',
    },
  };
  
  const gender = data.gender || 'other';
  const style = nodeStyles[gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'other'];
  
  // Déterminer le rôle familial pour l'affichage
  const role = data.role || '';
  
  return (
    <div className="node-container">
      {/* Connecteur d'entrée (en haut) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#94A3B8', width: '10px', height: '10px', border: '2px solid white', zIndex: 20 }}
      />
      
      {/* Contenu du nœud */}
      <div
        className={`relative overflow-hidden ${selected ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
        style={{
          width: '140px',
          borderRadius: '8px',
          boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          transform: selected ? 'scale(1.05)' : 'scale(1)',
          zIndex: 10,
        }}
      >
        {/* Photo de profil */}
        {data.imageUrl && (
          <div
            style={{
              width: '100%',
              height: '140px',
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottom: '2px solid rgba(255,255,255,0.2)',
            }}
            aria-label={`${data.firstName} ${data.lastName}`}
          />
        )} 
        
        {/* Informations de la personne */} 
        <div
          style={{
            ...style,
            padding: '12px',
            textAlign: 'center',
          }}
        >
          <div className="font-bold text-base">
            {data.firstName} {data.lastName}
          </div>
          
          {role && (
            <div className="text-sm mt-1 opacity-90">
              {role}
            </div>
          )}
        </div>
      </div>
      
      {/* Connecteur de sortie (en bas) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#94A3B8', width: '10px', height: '10px', border: '2px solid white', zIndex: 20 }}
      />
    </div>
  );
};

// Définir les types de nœuds personnalisés
const nodeTypes = {
  person: PersonNode,
};

export default function FamilyTreeGraph({ 
  selectedPersonId, 
  onPersonSelect,
  useSimulatedData = false 
}: FamilyTreeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'tree' | 'force'>('tree');
  
  // Références aux fonctions pour éviter les dépendances circulaires
  const organizeNodesHierarchicallyRef = useRef<() => void>(() => {});
  const organizeNodesCircularlyRef = useRef<() => void>(() => {});

  // Fonction pour convertir les données de personnes en nœuds pour ReactFlow
  const createNodesFromPersons = (persons: Person[], centerX = 500, centerY = 300) => {
    // Ajouter des rôles familiaux pour l'affichage
    const personsWithRoles = persons.map(person => {
      // Déterminer le rôle en fonction des relations
      let role = '';
      
      // Attribuer des rôles basés sur l'ID pour la démo (dans une vraie application, cela viendrait des données)
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
          role = 'Oncle';
      }
      
      return {
        ...person,
        role
      };
    });
    
    return personsWithRoles.map((person, index) => {
      const angle = (index / persons.length) * 2 * Math.PI;
      const radius = 300;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return {
        id: person.id.toString(),
        type: 'person',
        position: { x, y },
        data: {
          ...person,
          label: `${person.firstName} ${person.lastName}`,
        },
      };
    });
  };

  // Fonction pour convertir les relations en arêtes pour ReactFlow
  const createEdgesFromRelationships = (relationships: Relationship[]) => {
    return relationships.map((rel, index) => {
      // Définir le type d'arête selon la relation
      const edgeType = rel.type === 'SPOUSE' ? 'straight' : 'step';
      
      // Styles personnalisés selon le type de relation
      const style = rel.type === 'SPOUSE' 
        ? { 
            stroke: '#000000', 
            strokeWidth: 2,
            opacity: 1,
          } 
        : { 
            stroke: '#000000', 
            strokeWidth: 2,
            opacity: 1,
          };

      // Créer l'arête avec des labels plus descriptifs
      return {
        id: `e${index}`,
        source: rel.source.toString(),
        target: rel.target.toString(),
        type: edgeType,
        animated: false,
        style,
        zIndex: 5,
      };
    });
  };

  // Gérer le clic sur un nœud
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onPersonSelect) {
        onPersonSelect(parseInt(node.id));
      }
    },
    [onPersonSelect]
  );

  // Fonction pour charger les données de l'arbre généalogique
  const loadFamilyTreeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let familyData: FamilyData;

      if (useSimulatedData) {
        // Utiliser des données simulées pour le développement
        familyData = FamilyTreeService.getSimulatedFamilyData();
      } else {
        // Charger les données réelles depuis l'API
        const persons = await FamilyTreeService.getAllPersons();
        // Ici, nous devrions charger les relations, mais pour simplifier,
        // nous supposons que les personnes contiennent déjà leurs relations
        familyData = {
          persons,
          relationships: [], // À remplacer par les vraies relations
        };
      }

      // Créer les nœuds et les arêtes
      const graphNodes = createNodesFromPersons(familyData.persons);
      const graphEdges = createEdgesFromRelationships(familyData.relationships);

      setNodes(graphNodes);
      setEdges(graphEdges);
      
      // Appliquer le layout initial
      setTimeout(() => {
        if (layout === 'tree') {
          organizeNodesHierarchicallyRef.current();
        } else {
          organizeNodesCircularlyRef.current();
        }
      }, 100);
    } catch (err) {
      console.error('Error loading family tree data:', err);
      setError("Erreur lors du chargement des données de l&apos;arbre généalogique");
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges, useSimulatedData, layout]);

  // Charger les données au chargement du composant
  useEffect(() => {
    loadFamilyTreeData();
  }, [loadFamilyTreeData]);

  // Mettre à jour le nœud sélectionné lorsque selectedPersonId change
  useEffect(() => {
    if (selectedPersonId) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          selected: node.id === selectedPersonId.toString(),
        }))
      );
    }
  }, [selectedPersonId, setNodes]);

  // Organiser les nœuds en utilisant un algorithme de disposition hiérarchique
  organizeNodesHierarchicallyRef.current = useCallback(() => {
    const familyData = FamilyTreeService.getSimulatedFamilyData();
    const relationships = familyData.relationships;
    
    setNodes((nds) => {
      // Créer un dictionnaire des relations parent-enfant
      const parentChildRelations: Record<string, string[]> = {};
      const spouses: Record<string, string[]> = {};
      
      // Initialiser les tableaux
      nds.forEach(node => {
        parentChildRelations[node.id] = [];
        spouses[node.id] = [];
      });
      
      // Remplir les relations
      relationships.forEach(rel => {
        const source = rel.source.toString();
        const target = rel.target.toString();
        
        if (rel.type === 'PARENT_CHILD') {
          parentChildRelations[source].push(target);
        } else if (rel.type === 'SPOUSE') {
          spouses[source].push(target);
          spouses[target].push(source);
        }
      });
      
      // Trouver les racines (personnes sans parents)
      const hasParent: Set<string> = new Set();
      Object.values(parentChildRelations).forEach(children => {
        children.forEach(child => hasParent.add(child));
      });
      
      const roots = nds
        .map(node => node.id)
        .filter(id => !hasParent.has(id));
      
      // Calculer les positions
      const nodePositions: Record<string, { x: number, y: number }> = {};
      const levelWidth = 350; // Augmenter l'espace horizontal entre les nœuds
      const levelHeight = 280; // Augmenter l'espace vertical entre les niveaux
      const startX = 200;
      const startY = 100;
      
      // Positionner les nœuds par niveau
      const positionChildren = (parentIds: string[], level: number) => {
        const children: string[] = [];
        
        // Gérer les couples (conjoints) ensemble
        const processedParents = new Set<string>();
        
        for (const parentId of parentIds) {
          if (processedParents.has(parentId)) continue;
          
          // Traiter le parent et son conjoint ensemble
          const parentSpouses = spouses[parentId];
          const coupleIds = [parentId, ...parentSpouses];
          processedParents.add(parentId);
          parentSpouses.forEach(id => processedParents.add(id));
          
          // Trouver tous les enfants du couple
          const coupleChildren = new Set<string>();
          coupleIds.forEach(id => {
            parentChildRelations[id].forEach(childId => coupleChildren.add(childId));
          });
          
          // Positionner le couple
          const coupleX = startX + (coupleIds.length > 1 ? levelWidth : 0) * level;
          
          // Positionner le premier parent
          nodePositions[parentId] = {
            x: coupleX,
            y: startY + level * levelHeight
          };
          
          // Positionner le conjoint à côté
          if (parentSpouses.length > 0) {
            nodePositions[parentSpouses[0]] = {
              x: coupleX + 200, // Espacement fixe entre conjoints
              y: startY + level * levelHeight
            };
          }
          
          // Ajouter les enfants à la liste pour traitement
          const childrenArray = Array.from(coupleChildren);
          children.push(...childrenArray);
          
          // Positionner les enfants
          const childrenCount = childrenArray.length;
          const totalWidth = (childrenCount - 1) * levelWidth;
          const startChildX = coupleX + (parentSpouses.length > 0 ? 100 : 0) - totalWidth / 2;
          
          childrenArray.forEach((childId, childIndex) => {
            nodePositions[childId] = {
              x: startChildX + childIndex * levelWidth,
              y: startY + (level + 1) * levelHeight
            };
          });
        }
        
        // Récursion pour les enfants
        if (children.length > 0) {
          positionChildren(children, level + 1);
        }
      };
      
      // Commencer par les racines
      positionChildren(roots, 0);
      
      // Si certains nœuds n'ont pas été positionnés, les positionner en bas
      const maxY = Object.values(nodePositions).reduce((max, pos) => Math.max(max, pos.y), 0);
      let unpositionedX = 0;
      
      return nds.map(node => {
        if (!nodePositions[node.id]) {
          nodePositions[node.id] = {
            x: unpositionedX,
            y: maxY + levelHeight
          };
          unpositionedX += levelWidth;
        }
        
        return {
          ...node,
          position: nodePositions[node.id]
        };
      });
    });
  }, [setNodes]);

  // Organiser les nœuds en cercle
  organizeNodesCircularlyRef.current = useCallback(() => {
    setNodes((nds) => {
      const centerX = 600; // Augmenter le centre pour un meilleur positionnement
      const centerY = 400; // Augmenter le centre pour un meilleur positionnement
      const radius = Math.min(400, nds.length * 40); // Augmenter le rayon pour plus d'espace entre les nœuds
      
      return nds.map((node, index) => {
        // Distribuer les nœuds uniformément sur le cercle
        const angle = (index / nds.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        return {
          ...node,
          position: { x, y },
        };
      });
    });
  }, [setNodes]);

  // Changer le layout du graphe
  const changeLayout = useCallback(() => {
    setLayout((prevLayout) => {
      const newLayout = prevLayout === 'tree' ? 'force' : 'tree';
      
      if (newLayout === 'tree') {
        organizeNodesHierarchicallyRef.current();
      } else {
        organizeNodesCircularlyRef.current();
      }
      
      return newLayout;
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Chargement de l'arbre généalogique...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500">
        {error}
        <button 
          onClick={loadFamilyTreeData}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-[700px] w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }} // Augmenter le padding pour mieux voir tous les nœuds
        attributionPosition="bottom-right"
        connectionLineType={ConnectionLineType.Step}
        defaultEdgeOptions={{
          type: 'step',
          style: { stroke: '#000000', strokeWidth: 2 },
          animated: false,
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-blue-50"
        minZoom={0.2} // Permettre un zoom arrière plus important
        maxZoom={2} // Limiter le zoom avant pour éviter la distorsion
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }} // Vue par défaut plus zoomée arrière
        nodesDraggable={false} // Empêcher le déplacement des nœuds pour maintenir la structure
      >
        <Controls className="bg-white shadow-md rounded-md border border-gray-100" />
        <MiniMap 
          nodeStrokeColor={(n) => {
            return n.data.gender === 'male' ? '#3B82F6' : '#F43F5E';
          }}
          nodeColor={(n) => {
            return n.data.gender === 'male' ? '#D6E4FF' : '#FFE4E6';
          }}
          maskColor="rgba(240, 240, 240, 0.6)"
          className="bg-white shadow-md rounded-md border border-gray-100"
        />
        <Background variant={BackgroundVariant.Dots} size={1} gap={20} color="#CBD5E1" />
        <Panel position="top-right" className="bg-white p-2 rounded-md shadow-md border border-gray-100">
          <button
            onClick={changeLayout}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-md shadow-sm transition-all duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            {layout === 'tree' ? 'Vue hiérarchique' : 'Vue circulaire'}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
