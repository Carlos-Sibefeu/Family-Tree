'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FamilyTreeService } from '../services/family-tree.service';

// Définition des types pour les personnes et les relations
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  [key: string]: any;
}

interface Relationship {
  source: number;
  target: number;
  type: string;
  weight: number;
}

// Définition des types pour les données de l'arbre familial
interface FamilyData {
  persons: Person[];
  relationships: Relationship[];
}

// Styles personnalisés pour les nœuds
const nodeStyles = {
  male: {
    background: '#D6E4FF',
    border: '1px solid #3B82F6',
  },
  female: {
    background: '#FFE4E6',
    border: '1px solid #F43F5E',
  },
  default: {
    background: '#F3F4F6',
    border: '1px solid #9CA3AF',
  },
};

// Composant personnalisé pour les nœuds de personnes
const PersonNode = ({ data }: { data: any }) => {
  const style = data.gender === 'male' 
    ? nodeStyles.male 
    : data.gender === 'female' 
      ? nodeStyles.female 
      : nodeStyles.default;

  return (
    <div
      className="px-4 py-2 rounded-md shadow-md"
      style={style}
    >
      <div className="font-bold">{data.firstName} {data.lastName}</div>
      <div className="text-sm">{data.birthDate}</div>
    </div>
  );
};

// Types de nœuds personnalisés
const nodeTypes = {
  person: PersonNode,
};

interface FamilyTreeGraphProps {
  selectedPersonId?: number;
  onPersonSelect?: (personId: number) => void;
  useSimulatedData?: boolean;
}

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

  // Fonction pour convertir les données de personnes en nœuds pour ReactFlow
  const createNodesFromPersons = (persons: Person[], centerX = 0, centerY = 0) => {
    return persons.map((person, index) => {
      // Position en cercle pour le layout force
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
      const edgeType = rel.type === 'SPOUSE' ? 'straight' : 'step';
      const style = rel.type === 'SPOUSE' 
        ? { stroke: '#9333EA', strokeWidth: 2, strokeDasharray: '5,5' } 
        : { stroke: '#3B82F6', strokeWidth: 2 };

      return {
        id: `e${index}`,
        source: rel.source.toString(),
        target: rel.target.toString(),
        type: edgeType,
        animated: false,
        style,
        label: rel.type === 'SPOUSE' ? 'Conjoint' : 'Parent-Enfant',
      };
    });
  };

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
    } catch (err) {
      console.error('Error loading family tree data:', err);
      setError('Erreur lors du chargement des données de l\'arbre généalogique');
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges, useSimulatedData]);

  // Charger les données au chargement du composant
  useEffect(() => {
    loadFamilyTreeData();
  }, [loadFamilyTreeData]);

  // Mettre en évidence le nœud sélectionné
  useEffect(() => {
    if (selectedPersonId && nodes.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedPersonId.toString()) {
            node.style = { ...node.style, boxShadow: '0 0 10px 5px rgba(59, 130, 246, 0.5)' };
          } else {
            // Réinitialiser le style des autres nœuds
            const { boxShadow, ...restStyle } = node.style || {};
            node.style = restStyle;
          }
          return node;
        })
      );
    }
  }, [selectedPersonId, nodes, setNodes]);

  // Gérer le clic sur un nœud
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onPersonSelect) {
        onPersonSelect(parseInt(node.id));
      }
    },
    [onPersonSelect]
  );

  // Changer le layout du graphe
  const changeLayout = useCallback(() => {
    setLayout((prevLayout) => {
      const newLayout = prevLayout === 'tree' ? 'force' : 'tree';
      
      // Réorganiser les nœuds selon le layout choisi
      if (newLayout === 'tree') {
        // Layout en arbre (hiérarchique)
        setNodes((nds) => {
          return nds.map((node, index) => {
            // Calculer la position en arbre
            const level = Math.floor(index / 3); // 3 nœuds par niveau
            const position = index % 3;
            const x = position * 300;
            const y = level * 150;
            
            return {
              ...node,
              position: { x, y },
            };
          });
        });
      } else {
        // Layout en force (circulaire)
        const centerX = 500;
        const centerY = 300;
        setNodes((nds) => {
          return nds.map((node, index) => {
            const angle = (index / nds.length) * 2 * Math.PI;
            const radius = 300;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return {
              ...node,
              position: { x, y },
            };
          });
        });
      }
      
      return newLayout;
    });
  }, [setNodes]);

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
    <div className="h-[600px] w-full border border-gray-300 rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-right">
          <button
            onClick={changeLayout}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Changer de layout ({layout === 'tree' ? 'Arbre' : 'Force'})
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
