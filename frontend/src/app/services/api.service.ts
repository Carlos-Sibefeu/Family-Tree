/**
 * Service pour gérer les appels API au backend Spring Boot
 */

const API_URL = 'http://localhost:8080/api';

/**
 * Classe pour gérer les appels API
 */
export class ApiService {
  /**
   * Effectue une requête HTTP avec les options spécifiées
   */
  private static async request(url: string, options: RequestInit = {}) {
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('token');
    
    // Ajouter le token d'authentification aux en-têtes si disponible
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    
    try {
      const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
      });
      
      // Vérifier si la réponse est OK (statut 2xx)
      if (!response.ok) {
        // Si le statut est 401 (non autorisé), déconnecter l'utilisateur
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        // Essayer de récupérer le message d'erreur du serveur
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
      }
      
      // Vérifier si la réponse est vide
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Méthodes pour les appels API d'authentification
   */
  static auth = {
    login: async (username: string, password: string) => {
      return await ApiService.request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    },
    
    register: async (username: string, email: string, password: string) => {
      return await ApiService.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, roles: ['user'] })
      });
    }
  };
  
  /**
   * Méthodes pour les appels API de gestion des personnes
   */
  static persons = {
    getAll: async () => {
      return await ApiService.request('/persons');
    },
    
    getById: async (id: number) => {
      return await ApiService.request(`/persons/${id}`);
    },
    
    search: async (firstName?: string, lastName?: string) => {
      const params = new URLSearchParams();
      if (firstName) params.append('firstName', firstName);
      if (lastName) params.append('lastName', lastName);
      
      return await ApiService.request(`/persons/search?${params.toString()}`);
    },
    
    create: async (personData: any) => {
      return await ApiService.request('/persons', {
        method: 'POST',
        body: JSON.stringify(personData)
      });
    },
    
    update: async (id: number, personData: any) => {
      return await ApiService.request(`/persons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(personData)
      });
    },
    
    delete: async (id: number) => {
      return await ApiService.request(`/persons/${id}`, {
        method: 'DELETE'
      });
    },
    
    addParent: async (childId: number, parentId: number) => {
      return await ApiService.request(`/persons/${childId}/parents/${parentId}`, {
        method: 'POST'
      });
    },
    
    removeParent: async (childId: number, parentId: number) => {
      return await ApiService.request(`/persons/${childId}/parents/${parentId}`, {
        method: 'DELETE'
      });
    },
    
    getChildren: async (parentId: number) => {
      return await ApiService.request(`/persons/${parentId}/children`);
    },
    
    getParents: async (childId: number) => {
      return await ApiService.request(`/persons/${childId}/parents`);
    },
    
    uploadPhoto: async (id: number, photoFile: File) => {
      const formData = new FormData();
      formData.append('file', photoFile);
      
      return await fetch(`${API_URL}/persons/${id}/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      });
    }
  };
  
  /**
   * Méthodes pour les appels API des algorithmes de graphe
   */
  static graph = {
    findRelationship: async (person1Id: number, person2Id: number) => {
      return await ApiService.request(`/graph/relationship?person1Id=${person1Id}&person2Id=${person2Id}`);
    },
    
    findAllRelationships: async (person1Id: number, person2Id: number, maxDepth: number = 10) => {
      return await ApiService.request(`/graph/relationships/all?person1Id=${person1Id}&person2Id=${person2Id}&maxDepth=${maxDepth}`);
    },
    
    findMinimumSpanningTree: async (algorithm: 'prim' | 'kruskal' = 'prim') => {
      return await ApiService.request(`/graph/mst/${algorithm}`);
    },
    
    findFamilyGroups: async () => {
      return await ApiService.request('/graph/family-groups');
    },
    
    findCommonAncestor: async (person1Id: number, person2Id: number) => {
      return await ApiService.request(`/graph/common-ancestor?person1Id=${person1Id}&person2Id=${person2Id}`);
    },
    
    findDescendants: async (personId: number, maxDepth: number = 5) => {
      return await ApiService.request(`/graph/descendants?personId=${personId}&maxDepth=${maxDepth}`);
    },
    
    findClosestCousin: async (personId: number) => {
      return await ApiService.request(`/graph/closest-cousin?personId=${personId}`);
    }
  };
}
