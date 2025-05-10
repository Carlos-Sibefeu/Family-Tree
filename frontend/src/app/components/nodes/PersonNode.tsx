import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Person } from '../../models/family-tree.model';

// Styles pour les nœuds selon le genre
const nodeStyles = {
  male: {
    background: 'linear-gradient(to bottom, #DBEAFE, #93C5FD)',
    border: '2px solid #3B82F6',
    color: '#1E40AF',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  },
  female: {
    background: 'linear-gradient(to bottom, #FCE7F3, #F9A8D4)',
    border: '2px solid #EC4899',
    color: '#9D174D',
    boxShadow: '0 4px 6px -1px rgba(236, 72, 153, 0.3)',
  },
  other: {
    background: 'linear-gradient(to bottom, #E9D5FF, #C4B5FD)',
    border: '2px solid #8B5CF6',
    color: '#5B21B6',
    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
  },
};

// Composant pour afficher un nœud de personne
export const PersonNode = memo(({ data, selected }: NodeProps<Person>) => {
  const gender = data.gender || 'other';
  const style = nodeStyles[gender as keyof typeof nodeStyles];
  
  return (
    <div
      className={`relative p-3 rounded-lg w-44 ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        transition: 'all 0.2s ease',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Connecteur d'entrée (en haut) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#94A3B8', width: '8px', height: '8px' }}
      />
      
      {/* Contenu du nœud */}
      <div className="text-center">
        {data.imageUrl && (
          <div className="flex justify-center mb-2">
            <img
              src={data.imageUrl}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          </div>
        )}
        
        <div className="font-semibold text-sm">
          {data.firstName} {data.lastName}
        </div>
        
        {data.birthDate && (
          <div className="text-xs mt-1 opacity-80">
            {data.birthDate} {data.deathDate ? `- ${data.deathDate}` : ''}
          </div>
        )}
      </div>
      
      {/* Connecteur de sortie (en bas) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#94A3B8', width: '8px', height: '8px' }}
      />
    </div>
  );
});

PersonNode.displayName = 'PersonNode';
