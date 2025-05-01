import { ApiService } from './api.service';

/**
 * Service pour gérer les fonctionnalités liées à l'arbre généalogique
 */
export class FamilyTreeService {
  /**
   * Récupère toutes les personnes de l'arbre généalogique
   */
  static async getAllPersons() {
    try {
      return await ApiService.persons.getAll();
    } catch (error) {
      console.error('Error fetching persons:', error);
      throw error;
    }
  }

  /**
   * Récupère une personne par son ID
   */
  static async getPersonById(id: number) {
    try {
      return await ApiService.persons.getById(id);
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des personnes par nom et/ou prénom
   */
  static async searchPersons(firstName?: string, lastName?: string) {
    try {
      return await ApiService.persons.search(firstName, lastName);
    } catch (error) {
      console.error('Error searching persons:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle personne dans l'arbre généalogique
   */
  static async createPerson(personData: any) {
    try {
      return await ApiService.persons.create(personData);
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  }

  /**
   * Met à jour les informations d'une personne
   */
  static async updatePerson(id: number, personData: any) {
    try {
      return await ApiService.persons.update(id, personData);
    } catch (error) {
      console.error(`Error updating person with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une personne de l'arbre généalogique
   */
  static async deletePerson(id: number) {
    try {
      return await ApiService.persons.delete(id);
    } catch (error) {
      console.error(`Error deleting person with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Ajoute un parent à une personne
   */
  static async addParent(childId: number, parentId: number) {
    try {
      return await ApiService.persons.addParent(childId, parentId);
    } catch (error) {
      console.error(`Error adding parent ${parentId} to child ${childId}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un parent d'une personne
   */
  static async removeParent(childId: number, parentId: number) {
    try {
      return await ApiService.persons.removeParent(childId, parentId);
    } catch (error) {
      console.error(`Error removing parent ${parentId} from child ${childId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les enfants d'une personne
   */
  static async getChildren(parentId: number) {
    try {
      return await ApiService.persons.getChildren(parentId);
    } catch (error) {
      console.error(`Error fetching children of parent ${parentId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les parents d'une personne
   */
  static async getParents(childId: number) {
    try {
      return await ApiService.persons.getParents(childId);
    } catch (error) {
      console.error(`Error fetching parents of child ${childId}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge une photo pour une personne
   */
  static async uploadPhoto(id: number, photoFile: File) {
    try {
      return await ApiService.persons.uploadPhoto(id, photoFile);
    } catch (error) {
      console.error(`Error uploading photo for person ${id}:`, error);
      throw error;
    }
  }

  /**
   * Trouve le lien de parenté entre deux personnes (Dijkstra)
   */
  static async findRelationship(person1Id: number, person2Id: number) {
    try {
      return await ApiService.graph.findRelationship(person1Id, person2Id);
    } catch (error) {
      console.error(`Error finding relationship between ${person1Id} and ${person2Id}:`, error);
      throw error;
    }
  }

  /**
   * Trouve tous les chemins possibles entre deux personnes
   */
  static async findAllRelationships(person1Id: number, person2Id: number, maxDepth: number = 10) {
    try {
      return await ApiService.graph.findAllRelationships(person1Id, person2Id, maxDepth);
    } catch (error) {
      console.error(`Error finding all relationships between ${person1Id} and ${person2Id}:`, error);
      throw error;
    }
  }

  /**
   * Trouve l'arbre couvrant minimal (Prim ou Kruskal)
   */
  static async findMinimumSpanningTree(algorithm: 'prim' | 'kruskal' = 'prim') {
    try {
      return await ApiService.graph.findMinimumSpanningTree(algorithm);
    } catch (error) {
      console.error(`Error finding minimum spanning tree with ${algorithm}:`, error);
      throw error;
    }
  }

  /**
   * Trouve les groupes familiaux (composantes connexes)
   */
  static async findFamilyGroups() {
    try {
      return await ApiService.graph.findFamilyGroups();
    } catch (error) {
      console.error('Error finding family groups:', error);
      throw error;
    }
  }

  /**
   * Trouve l'ancêtre commun le plus proche entre deux personnes
   */
  static async findCommonAncestor(person1Id: number, person2Id: number) {
    try {
      return await ApiService.graph.findCommonAncestor(person1Id, person2Id);
    } catch (error) {
      console.error(`Error finding common ancestor between ${person1Id} and ${person2Id}:`, error);
      throw error;
    }
  }

  /**
   * Trouve tous les descendants d'une personne
   */
  static async findDescendants(personId: number, maxDepth: number = 5) {
    try {
      return await ApiService.graph.findDescendants(personId, maxDepth);
    } catch (error) {
      console.error(`Error finding descendants of ${personId}:`, error);
      throw error;
    }
  }

  /**
   * Trouve le cousin le plus proche d'une personne
   */
  static async findClosestCousin(personId: number) {
    try {
      return await ApiService.graph.findClosestCousin(personId);
    } catch (error) {
      console.error(`Error finding closest cousin of ${personId}:`, error);
      throw error;
    }
  }

  /**
   * Simule des données d'arbre généalogique (pour le développement sans backend)
   */
  static getSimulatedFamilyData() {
    return {
      persons: [
        { id: 1, firstName: 'Jean', lastName: 'Dupont', gender: 'male', birthDate: '1950-05-15' },
        { id: 2, firstName: 'Marie', lastName: 'Dupont', gender: 'female', birthDate: '1952-08-22' },
        { id: 3, firstName: 'Pierre', lastName: 'Dupont', gender: 'male', birthDate: '1975-03-10' },
        { id: 4, firstName: 'Sophie', lastName: 'Dupont', gender: 'female', birthDate: '1978-11-05' },
        { id: 5, firstName: 'Luc', lastName: 'Dupont', gender: 'male', birthDate: '1980-07-30' },
        { id: 6, firstName: 'Emma', lastName: 'Martin', gender: 'female', birthDate: '1979-04-18' },
        { id: 7, firstName: 'Thomas', lastName: 'Dupont', gender: 'male', birthDate: '2005-12-03' },
        { id: 8, firstName: 'Léa', lastName: 'Dupont', gender: 'female', birthDate: '2008-09-21' },
      ],
      relationships: [
        { source: 1, target: 2, type: 'SPOUSE', weight: 1 },
        { source: 1, target: 3, type: 'PARENT_CHILD', weight: 1 },
        { source: 1, target: 4, type: 'PARENT_CHILD', weight: 1 },
        { source: 1, target: 5, type: 'PARENT_CHILD', weight: 1 },
        { source: 2, target: 3, type: 'PARENT_CHILD', weight: 1 },
        { source: 2, target: 4, type: 'PARENT_CHILD', weight: 1 },
        { source: 2, target: 5, type: 'PARENT_CHILD', weight: 1 },
        { source: 3, target: 6, type: 'SPOUSE', weight: 1 },
        { source: 3, target: 7, type: 'PARENT_CHILD', weight: 1 },
        { source: 3, target: 8, type: 'PARENT_CHILD', weight: 1 },
        { source: 6, target: 7, type: 'PARENT_CHILD', weight: 1 },
        { source: 6, target: 8, type: 'PARENT_CHILD', weight: 1 },
      ]
    };
  }
}
