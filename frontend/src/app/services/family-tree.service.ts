import { ApiService } from './api.service';

// generation arbre 
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
  static async createPerson(personData: Record<string, unknown>) {
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
  static async updatePerson(id: number, personData: Record<string, unknown>) {
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
   * Retourne le chemin le plus court entre les deux personnes
   */
  static findRelationship(person1Id: number, person2Id: number) {
    try {
      // Utiliser les données simulées pour l'implémentation locale
      const familyData = this.getSimulatedFamilyData();
      
      // Vérifier que les personnes existent
      const person1 = familyData.persons.find((p: { id: number }) => p.id === person1Id);
      const person2 = familyData.persons.find((p: { id: number }) => p.id === person2Id);
      
      if (!person1 || !person2) {
        throw new Error('Une ou plusieurs personnes spécifiées n\'existent pas.');
      }
      
      // Si c'est la même personne, retourner un chemin vide
      if (person1Id === person2Id) {
        return {
          path: [],
          relationship: 'Même personne',
          distance: 0,
          algorithm: 'Dijkstra'
        };
      }
      
      // Créer un graphe à partir des relations
      const graph: Record<number, Array<{target: number; type: string; weight: number; direction: string}>> = {};
      
      // Initialiser le graphe
      familyData.persons.forEach((person: { id: number }) => {
        graph[person.id] = [];
      });
      
      // Remplir le graphe avec les relations directionnelles
      familyData.relationships.forEach((rel: { source: number; target: number; type: string }) => {
        // Pour les relations parent-enfant, nous devons conserver la direction
        if (rel.type === 'PARENT_CHILD') {
          // Direction descendante (parent -> enfant)
          graph[rel.source].push({ 
            target: rel.target, 
            type: rel.type, 
            weight: 1, 
            direction: 'down' 
          });
          
          // Direction ascendante (enfant -> parent)
          graph[rel.target].push({ 
            target: rel.source, 
            type: rel.type, 
            weight: 1, 
            direction: 'up' 
          });
        } else {
          // Pour les autres types de relations (comme SPOUSE)
          graph[rel.source].push({ 
            target: rel.target, 
            type: rel.type, 
            weight: 1, 
            direction: 'same' 
          });
          graph[rel.target].push({ 
            target: rel.source, 
            type: rel.type, 
            weight: 1, 
            direction: 'same' 
          });
        }
      });
      
      // Implémentation de l'algorithme de Dijkstra
      const distances: Record<number, number> = {};
      const previous: Record<number, { id: number; type: string; direction: string } | null> = {};
      const unvisited = new Set<number>();
      
      // Initialiser les distances
      familyData.persons.forEach((person: { id: number }) => {
        distances[person.id] = Infinity;
        previous[person.id] = null;
        unvisited.add(person.id);
      });
      
      // La distance de la personne de départ à elle-même est 0
      distances[person1Id] = 0;
      
      // Tant qu'il reste des nœuds non visités
      while (unvisited.size > 0) {
        // Trouver le nœud non visité avec la plus petite distance
        let current: number | null = null;
        let smallestDistance = Infinity;
        
        unvisited.forEach(id => {
          if (distances[id] < smallestDistance) {
            smallestDistance = distances[id];
            current = id;
          }
        });
        
        // Si aucun nœud n'est accessible ou si nous avons atteint la destination
        if (current === null || distances[current] === Infinity) {
          break;
        }
        
        // Si nous avons atteint la destination
        if (current === person2Id) {
          break;
        }
        
        // Marquer le nœud comme visité
        unvisited.delete(current);
        
        // Pour chaque voisin du nœud courant
        for (const neighbor of graph[current]) {
          // Si le voisin a déjà été visité, passer au suivant
          if (!unvisited.has(neighbor.target)) {
            continue;
          }
          
          // Calculer la nouvelle distance
          const newDistance = distances[current] + neighbor.weight;
          
          // Si la nouvelle distance est plus petite que la distance actuelle
          if (newDistance < distances[neighbor.target]) {
            // Mettre à jour la distance
            distances[neighbor.target] = newDistance;
            // Mettre à jour le prédécesseur avec la direction
            previous[neighbor.target] = { 
              id: current, 
              type: neighbor.type,
              direction: neighbor.direction
            };
          }
        }
      }
      
      // Si aucun chemin n'a été trouvé
      if (distances[person2Id] === Infinity) {
        return {
          path: [],
          relationship: 'Aucun lien de parenté trouvé',
          distance: Infinity,
          algorithm: 'Dijkstra'
        };
      }
      
      // Reconstruire le chemin
      const path: Array<{ source: number; target: number; type: string; direction: string }> = [];
      let current = person2Id;
      
      while (current !== person1Id) {
        const prev = previous[current];
        if (!prev) break;
        
        const source = prev.id;
        const target = current;
        const type = prev.type;
        const direction = prev.direction;
        
        path.unshift({ source, target, type, direction });
        current = source;
      }
      
      // Déterminer le lien de parenté en fonction du chemin
      const relationship = this.determineRelationship(path, person1Id, person2Id, person1, person2);
      
      return {
        path,
        relationship,
        distance: distances[person2Id],
        algorithm: 'Dijkstra'
      };
    } catch (error) {
      console.error(`Error finding relationship between ${person1Id} and ${person2Id}:`, error);
      throw error;
    }
  }

  /**
   * Trouve le lien de parenté entre deux personnes en utilisant l'algorithme de Bellman-Ford
   * @param person1Id ID de la première personne
   * @param person2Id ID de la deuxième personne
   * @returns Le résultat de la recherche de lien de parenté
   */
  static findRelationshipBellmanFord(person1Id: number, person2Id: number) {
    try {
      // Utiliser les données simulées pour l'implémentation locale
      const familyData = this.getSimulatedFamilyData();
      
      // Vérifier que les personnes existent
      const person1 = familyData.persons.find((p: { id: number }) => p.id === person1Id);
      const person2 = familyData.persons.find((p: { id: number }) => p.id === person2Id);
      
      if (!person1 || !person2) {
        throw new Error('Une ou plusieurs personnes spécifiées n\'existent pas.');
      }
      
      // Si c'est la même personne, retourner un chemin vide
      if (person1Id === person2Id) {
        return {
          path: [],
          relationship: 'Même personne',
          distance: 0
        };
      }
      
      // Construire le graphe à partir des relations
      const graph = this.buildGraph();
      
      // Initialisation
      const distances: Record<number, number> = {};
      const previous: Record<number, { id: number; type: string } | null> = {};
      const vertices = Object.keys(graph).map(Number);
      
      // Initialiser les distances à l'infini et les prédécesseurs à null
      for (const vertex of vertices) {
        distances[vertex] = Infinity;
        previous[vertex] = null;
      }
      
      // La distance de la source à elle-même est 0
      distances[person1Id] = 0;
      
      // Détecter les cycles
      const cyclesDetected: Array<{ cycle: Array<number>; type: 'negative' | 'normal' }> = [];
      // Relaxation des arêtes |V| - 1 fois
      for (let i = 0; i < vertices.length - 1; i++) {
        for (const u of vertices) {
          if (distances[u] === Infinity) continue;
          
          for (const edge of graph[u] || []) {
            const v = edge.target;
            const weight = edge.weight;
            
            if (distances[u] + weight < distances[v]) {
              distances[v] = distances[u] + weight;
              previous[v] = { id: u, type: edge.type };
            }
          }
        }
      }
      
      // Vérifier s'il y a des cycles de poids négatif
      for (const u of vertices) {
        if (distances[u] === Infinity) continue;
        
        for (const edge of graph[u] || []) {
          const v = edge.target;
          const weight = edge.weight;
          
          if (distances[u] + weight < distances[v]) {
            const cycleVertices = this.findCycle(u, graph, distances);
            if (cycleVertices.length > 0) {
              cyclesDetected.push({
                cycle: cycleVertices,
                type: 'negative'
              });
            }
            console.warn('Cycle négatif détecté dans le graphe familial:', cycleVertices);
          }
        }
      }
      
      // Rechercher également des cycles normaux (non négatifs)
      const normalCycles = this.findNormalCycles(graph, vertices);
      normalCycles.forEach(cycle => {
        if (cycle.length > 2) { // Ignorer les cycles trop courts
          cyclesDetected.push({
            cycle,
            type: 'normal'
          });
        }
      });
    
      // Construire le chemin à partir des prédécesseurs
      const path: Array<{ source: number; target: number; type: string; direction: string }> = [];
      let current = person2Id;
      
      while (current !== person1Id && previous[current]) {
        const prev = previous[current];
        if (!prev) break;
        
        path.unshift({
          source: prev.id,
          target: current,
          type: prev.type,
          direction: 'forward'
        });
        
        current = prev.id;
      }
      
      // Déterminer la relation en fonction du chemin
      const relationship = this.determineRelationship(path, person1Id, person2Id, person1, person2);
      
      return {
        path,
        relationship,
        distance: distances[person2Id],
        algorithm: 'Bellman-Ford',
        cyclesDetected: cyclesDetected.length > 0 ? cyclesDetected : undefined
      };
    } catch (error) {
      console.error(`Error finding relationship between ${person1Id} and ${person2Id} using Bellman-Ford:`, error);
      throw error;
    }
  }
  
  // Construire un graphe à partir des relations familiales
  private static buildGraph(): Record<number, Array<{target: number; type: string; weight: number}>> {
    const familyData = this.getSimulatedFamilyData();
    const graph: Record<number, Array<{target: number; type: string; weight: number}>> = {};
    
    // Initialiser le graphe
    familyData.persons.forEach((person: {id: number}) => {
      graph[person.id] = [];
    });
    
    // Ajouter les arêtes
    familyData.relationships.forEach((rel: {source: number; target: number; type: string}) => {
      // Pour les relations parent-enfant
      if (rel.type === 'PARENT_CHILD') {
        // Parent -> Enfant
        graph[rel.source].push({
          target: rel.target,
          type: rel.type,
          weight: 1
        });
        
        // Enfant -> Parent
        graph[rel.target].push({
          target: rel.source,
          type: rel.type,
          weight: 1
        });
      } else {
        // Pour les autres types de relations (comme SPOUSE)
        graph[rel.source].push({
          target: rel.target,
          type: rel.type,
          weight: 1
        });
        
        graph[rel.target].push({
          target: rel.source,
          type: rel.type,
          weight: 1
        });
      }
    });
    
    return graph;
  }
  
  // Trouver un cycle à partir d'un sommet donné (pour les cycles négatifs)
  private static findCycle(startVertex: number, graph: Record<number, Array<{target: number; type: string; weight: number}>>, distances: Record<number, number>): number[] {
    const visited: Record<number, boolean> = {};
    const cycle: number[] = [];
    
    const dfs = (vertex: number, path: number[]) => {
      if (visited[vertex]) {
        const cycleStart = path.indexOf(vertex);
        if (cycleStart !== -1) {
          cycle.push(...path.slice(cycleStart));
          cycle.push(vertex); // Fermer le cycle
        }
        return;
      }
      
      visited[vertex] = true;
      path.push(vertex);
      
      for (const edge of graph[vertex] || []) {
        if (distances[vertex] + edge.weight < distances[edge.target]) {
          dfs(edge.target, path);
          if (cycle.length > 0) return;
        }
      }
      
      path.pop();
    };
    
    dfs(startVertex, []);
    return cycle;
  }
  
  // Trouver des cycles normaux dans le graphe
  private static findNormalCycles(graph: Record<number, Array<{target: number; type: string; weight: number}>>, vertices: number[]): number[][] {
    const cycles: number[][] = [];
    const visited: Record<number, boolean> = {};
    const recStack: Record<number, boolean> = {};
    
    const dfs = (vertex: number, parent: number, path: number[]) => {
      if (recStack[vertex]) {
        // Cycle trouvé
        const cycleStart = path.indexOf(vertex);
        if (cycleStart !== -1) {
          const cycle = [...path.slice(cycleStart), vertex];
          // Vérifier si ce cycle n'a pas déjà été trouvé (en tenant compte des rotations)
          if (!this.isCycleAlreadyFound(cycles, cycle)) {
            cycles.push(cycle);
          }
        }
        return;
      }
      
      if (visited[vertex]) return;
      
      visited[vertex] = true;
      recStack[vertex] = true;
      path.push(vertex);
      
      for (const edge of graph[vertex] || []) {
        // Ignorer l'arête qui revient au parent
        if (edge.target !== parent) {
          dfs(edge.target, vertex, path);
        }
      }
      
      path.pop();
      recStack[vertex] = false;
    };
    
    // Lancer DFS à partir de chaque sommet non visité
    for (const vertex of vertices) {
      if (!visited[vertex]) {
        dfs(vertex, -1, []);
      }
    }
    
    return cycles;
  }

  /**
   * Détermine le lien de parenté en fonction du chemin trouvé
   */
  private static determineRelationship(
    path: Array<{ source: number; target: number; type: string; direction: string }>,
    person1Id: number,
    person2Id: number,
    person1: { gender: string; firstName?: string; lastName?: string },
    person2: { gender: string; firstName?: string; lastName?: string }
  ): string {
    if (path.length === 0) {
      return 'Aucun lien';
    }
    
    if (!person1 || !person2) {
      return 'Personnes non trouvées';
    }
    
    // Cas simple: relation directe
    if (path.length === 1) {
      const relation = path[0];
      
      if (relation.type === 'PARENT_CHILD') {
        if (relation.direction === 'down') {
          // Person1 est parent de Person2
          return person1.gender === 'male' ? 'Père' : 'Mère';
        } else if (relation.direction === 'up') {
          // Person1 est enfant de Person2
          return person1.gender === 'male' ? 'Fils' : 'Fille';
        }
      } else if (relation.type === 'SPOUSE') {
        // Époux/épouse
        if (person1.gender === 'male') {
          return person2.gender === 'male' ? 'Conjoint' : 'Mari';
        } else {
          return person2.gender === 'male' ? 'Épouse' : 'Conjointe';
        }
      } else if (relation.type === 'SIBLING') {
        // Frère/sœur direct
        return person2.gender === 'male' ? 'Frère' : 'Sœur';
      }
    }
    
    // Cas complexes: relations indirectes
    // Analyser le chemin pour déterminer la relation
    const directions = path.map(rel => rel.direction);
    const types = path.map(rel => rel.type);
    
    // Frères et sœurs (mêmes parents)
    if (path.length === 2 && 
        types[0] === 'PARENT_CHILD' && 
        types[1] === 'PARENT_CHILD' &&
        directions[0] === 'up' && 
        directions[1] === 'down') {
      return person2.gender === 'male' ? 'Frère' : 'Sœur';
    }
    
    // Demi-frères et demi-sœurs
    if (path.length === 3 && 
        types[0] === 'PARENT_CHILD' && 
        types[1] === 'SPOUSE' && 
        types[2] === 'PARENT_CHILD') {
      return person2.gender === 'male' ? 'Demi-frère' : 'Demi-sœur';
    }
    
    // Grand-parents / Petits-enfants
    if (path.length === 2 && 
        types[0] === 'PARENT_CHILD' && 
        types[1] === 'PARENT_CHILD') {
      if (directions[0] === 'up' && directions[1] === 'up') {
        // Person1 est petit-enfant de Person2
        return person1.gender === 'male' ? 'Petit-fils' : 'Petite-fille';
      } else if (directions[0] === 'down' && directions[1] === 'down') {
        // Person1 est grand-parent de Person2
        return person1.gender === 'male' ? 'Grand-père' : 'Grand-mère';
      }
    }
    
    // Oncles, tantes / Neveux, nièces
    if (path.length === 3 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if (directions[0] === 'up' && directions[1] === 'up' && directions[2] === 'down') {
        // Person2 est oncle/tante de Person1
        return person1.gender === 'male' ? 'Neveu' : 'Nièce';
      } else if (directions[0] === 'down' && directions[1] === 'down' && directions[2] === 'up') {
        // Person1 est oncle/tante de Person2
        return person2.gender === 'male' ? 'Neveu' : 'Nièce';
      } else if (directions[0] === 'up' && directions[1] === 'down' && directions[2] === 'down') {
        // Person1 est neveu/nièce de Person2
        return person2.gender === 'male' ? 'Oncle' : 'Tante';
      } else if (directions[0] === 'down' && directions[1] === 'up' && directions[2] === 'up') {
        // Person2 est neveu/nièce de Person1
        return person1.gender === 'male' ? 'Oncle' : 'Tante';
      }
    }
    
    // Cousins et cousines
    if (path.length === 4 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if ((directions[0] === 'up' && directions[1] === 'up' && 
          directions[2] === 'down' && directions[3] === 'down') ||
          (directions[0] === 'down' && directions[1] === 'up' && 
          directions[2] === 'up' && directions[3] === 'down')) {
        return person2.gender === 'male' ? 'Cousin' : 'Cousine';
      }
    }
    
    // Cousins au second degré
    if (path.length === 6 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if (directions[0] === 'up' && directions[1] === 'up' && directions[2] === 'up' && 
          directions[3] === 'down' && directions[4] === 'down' && directions[5] === 'down') {
        return person2.gender === 'male' ? 'Cousin au second degré' : 'Cousine au second degré';
      }
    }
    
    // Beaux-parents / Beaux-enfants (par mariage)
    if (path.length === 2 && 
        ((types[0] === 'SPOUSE' && types[1] === 'PARENT_CHILD') ||
         (types[0] === 'PARENT_CHILD' && types[1] === 'SPOUSE'))) {
      
      // Déterminer si c'est un beau-parent ou un beau-enfant
      const isInLaw = 
        (types[0] === 'SPOUSE' && directions[1] === 'up') ||
        (directions[0] === 'up' && types[1] === 'SPOUSE');
      
      if (isInLaw) {
        // Beau-parent (belle-mère/beau-père)
        return person2.gender === 'male' ? 'Beau-père' : 'Belle-mère';
      } else {
        // Beau-enfant (beau-fils/belle-fille)
        return person2.gender === 'male' ? 'Beau-fils' : 'Belle-fille';
      }
    }
    
    // Beaux-frères et belles-sœurs (par mariage du frère/sœur)
    if (path.length === 3 && 
        ((types[0] === 'PARENT_CHILD' && types[1] === 'PARENT_CHILD' && types[2] === 'SPOUSE') ||
         (types[0] === 'SPOUSE' && types[1] === 'PARENT_CHILD' && types[2] === 'PARENT_CHILD'))) {
      return person2.gender === 'male' ? 'Beau-frère' : 'Belle-sœur';
    }
    
    // Beaux-frères et belles-sœurs (par mariage direct)
    if (path.length === 2 && 
        types[0] === 'SPOUSE' && 
        types[1] === 'SIBLING') {
      return person2.gender === 'male' ? 'Beau-frère' : 'Belle-sœur';
    }
    
    // Grands-oncles, grandes-tantes / Petits-neveux, petites-nièces
    if (path.length === 4 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if (directions[0] === 'up' && directions[1] === 'up' && 
          directions[2] === 'up' && directions[3] === 'down') {
        return person2.gender === 'male' ? 'Grand-oncle' : 'Grande-tante';
      } else if (directions[0] === 'down' && directions[1] === 'down' && 
                directions[2] === 'down' && directions[3] === 'up') {
        return person2.gender === 'male' ? 'Petit-neveu' : 'Petite-nièce';
      }
    }
    
    // Arrière-grands-parents / Arrière-petits-enfants
    if (path.length === 3 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if (directions[0] === 'down' && directions[1] === 'down' && directions[2] === 'down') {
        return person1.gender === 'male' ? 'Arrière-grand-père' : 'Arrière-grand-mère';
      } else if (directions[0] === 'up' && directions[1] === 'up' && directions[2] === 'up') {
        return person1.gender === 'male' ? 'Arrière-petit-fils' : 'Arrière-petite-fille';
      }
    }
    
    // Arrière-arrière-grands-parents / Arrière-arrière-petits-enfants
    if (path.length === 4 && 
        path.every(p => p.type === 'PARENT_CHILD')) {
      if (directions[0] === 'down' && directions[1] === 'down' && 
          directions[2] === 'down' && directions[3] === 'down') {
        return person1.gender === 'male' ? 'Arrière-arrière-grand-père' : 'Arrière-arrière-grand-mère';
      } else if (directions[0] === 'up' && directions[1] === 'up' && 
                directions[2] === 'up' && directions[3] === 'up') {
        return person1.gender === 'male' ? 'Arrière-arrière-petit-fils' : 'Arrière-arrière-petite-fille';
      }
    }
    
    // Si aucune relation spécifique n'est identifiée
    return `Relation familiale (${path.length} liens)`;
  }

  /**
   * Vérifie si un cycle est déjà dans la liste (en tenant compte des rotations)
   */
  private static isCycleAlreadyFound(cycles: number[][], newCycle: number[]): boolean {
    for (const cycle of cycles) {
      if (cycle.length !== newCycle.length) continue;
      
      // Vérifier toutes les rotations possibles
      for (let i = 0; i < cycle.length; i++) {
        const rotated = [...cycle.slice(i), ...cycle.slice(0, i)];
        if (this.arraysEqual(rotated, newCycle) || this.arraysEqual(rotated.reverse(), newCycle)) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
   * Compare deux tableaux pour vérifier s'ils sont égaux
   */
  private static arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

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

  // Données par défaut pour l'initialisation
  private static defaultData = {
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
  
  // Stockage des données simulées en mémoire (pour le développement sans backend)
  private static simulatedData = FamilyTreeService.loadDataFromStorage();

  /**
   * Charge les données depuis le localStorage ou utilise les données par défaut
   */
  private static loadDataFromStorage() {
    if (typeof window === 'undefined') {
      return this.defaultData;
    }
    
    try {
      const storedData = localStorage.getItem('familyTreeData');
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      // Si aucune donnée n'est trouvée, utiliser les données par défaut
      this.saveDataToStorage(this.defaultData);
      return this.defaultData;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return this.defaultData;
    }
  }
  
  /**
   * Sauvegarde les données dans le localStorage
   */
  private static saveDataToStorage(data: any) {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('familyTreeData', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  }
  
  /**
   * Réinitialise les données simulées aux valeurs par défaut
   */
  static resetSimulatedData() {
    this.simulatedData = JSON.parse(JSON.stringify(this.defaultData));
    this.saveDataToStorage(this.simulatedData);
    return this.simulatedData;
  }

  /**
   * Simule des données d'arbre généalogique (pour le développement sans backend)
   */
  static getSimulatedFamilyData() {
    return this.simulatedData;
  }

  /**
   * Vérifie si deux personnes sont frères et sœurs (ont au moins un parent en commun)
   */
  static areSiblings(person1Id: number, person2Id: number): boolean {
    try {
      // Trouver tous les parents de la personne 1
      const parents1 = this.simulatedData.relationships
        .filter(rel => rel.type === 'PARENT_CHILD' && rel.target === person1Id)
        .map(rel => rel.source);
      
      // Trouver tous les parents de la personne 2
      const parents2 = this.simulatedData.relationships
        .filter(rel => rel.type === 'PARENT_CHILD' && rel.target === person2Id)
        .map(rel => rel.source);
      
      // Vérifier s'il y a au moins un parent en commun
      return parents1.some(parent => parents2.includes(parent));
    } catch (error) {
      console.error('Erreur lors de la vérification des relations fraternelles:', error);
      return false;
    }
  }

  /**
   * Vérifie si deux personnes peuvent être parents ensemble (pas frères et sœurs)
   */
  static canBeParentsTogether(motherId: number, fatherId: number): boolean {
    // Vérifier qu'ils ne sont pas frères et sœurs
    return !this.areSiblings(motherId, fatherId);
  }

  /**
   * Ajoute une personne aux données simulées (pour le développement sans backend)
   */
  static addSimulatedPerson(personData: {
    firstName: string;
    lastName: string;
    gender: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    occupation?: string;
    notes?: string;
    imageUrl?: string;
    mother?: string | number;
    father?: string | number;
  }) {
    try {
      // Vérifier que les parents ne sont pas frères et sœurs (pour éviter l'inceste)
      if (personData.mother && personData.father) {
        const motherId = typeof personData.mother === 'string' ? parseInt(personData.mother) : personData.mother;
        const fatherId = typeof personData.father === 'string' ? parseInt(personData.father) : personData.father;
        
        if (!isNaN(motherId) && !isNaN(fatherId)) {
          if (!this.canBeParentsTogether(motherId, fatherId)) {
            throw new Error('Les parents sélectionnés sont frères et sœurs. Cette relation n\'est pas autorisée.');
          }
        }
      }
      
      // Générer un nouvel ID (le plus grand ID existant + 1)
      const newId = Math.max(...this.simulatedData.persons.map(p => p.id)) + 1;
      
      // Créer la nouvelle personne
      const newPerson = {
        id: newId,
        firstName: personData.firstName,
        lastName: personData.lastName,
        gender: personData.gender,
        birthDate: personData.birthDate || '',
        birthPlace: personData.birthPlace || '',
        deathDate: personData.deathDate || '',
        deathPlace: personData.deathPlace || '',
        occupation: personData.occupation || '',
        notes: personData.notes || '',
        imageUrl: personData.gender === 'male' ? '/images/avatars/male-avatar.svg' : '/images/avatars/female-avatar.svg'
      };
      
      // Ajouter la personne aux données simulées
      this.simulatedData.persons.push(newPerson);
      
      // Ajouter les relations parent-enfant si spécifiées
      if (personData.father) {
        const fatherId = typeof personData.father === 'string' ? parseInt(personData.father) : personData.father;
        if (!isNaN(fatherId)) {
          this.simulatedData.relationships.push({
            source: fatherId,
            target: newId,
            type: 'PARENT_CHILD',
            weight: 1
          });
        }
      }
      
      if (personData.mother) {
        const motherId = typeof personData.mother === 'string' ? parseInt(personData.mother) : personData.mother;
        if (!isNaN(motherId)) {
          this.simulatedData.relationships.push({
            source: motherId,
            target: newId,
            type: 'PARENT_CHILD',
            weight: 1
          });
        }
      }
      
      // Sauvegarder les données mises à jour dans le localStorage
      this.saveDataToStorage(this.simulatedData);
      
      return newPerson;
    } catch (error) {
      console.error('Error adding simulated person:', error);
      throw error;
    }
  }
}
