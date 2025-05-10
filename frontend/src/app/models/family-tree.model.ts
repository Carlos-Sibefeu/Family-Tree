// Modèle pour une personne dans l'arbre généalogique
export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  imageUrl?: string;
  description?: string;
  [key: string]: any;
}

// Modèle pour une relation entre deux personnes
export interface Relationship {
  id?: number;
  source: number; // ID de la première personne
  target: number; // ID de la deuxième personne
  type: 'SPOUSE' | 'PARENT_CHILD' | 'SIBLING'; // Type de relation
  startDate?: string; // Date de début (ex: date de mariage)
  endDate?: string; // Date de fin (ex: date de divorce)
  description?: string;
  weight?: number; // Poids de la relation pour l'affichage du graphe
}
