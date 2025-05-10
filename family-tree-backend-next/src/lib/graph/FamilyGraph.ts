import { Person, Relationship, RelationshipType } from '@prisma/client';

/**
 * Interface pour représenter une arête dans le graphe
 */
interface Edge {
  targetId: number;
  relationshipType: RelationshipType;
  weight: number;
}

/**
 * Interface pour représenter un nœud avec sa distance (pour Dijkstra)
 */
interface NodeDistance {
  nodeId: number;
  distance: number;
}

/**
 * Interface pour représenter une arête avec son nœud source
 */
interface EdgeWithSource {
  sourceId: number;
  edge: Edge;
  getWeight(): number;
}

/**
 * Interface pour représenter un chemin dans le graphe
 */
export interface Path {
  nodes: number[];
  edges: Edge[];
  totalWeight: number;
}

/**
 * Classe utilitaire pour représenter l'arbre généalogique sous forme de graphe
 * et appliquer des algorithmes de théorie des graphes
 */
export class FamilyGraph {
  private persons: Map<number, Person> = new Map();
  private adjacencyList: Map<number, Edge[]> = new Map();

  /**
   * Construit le graphe à partir des personnes et des relations
   * @param personList liste des personnes
   * @param relationships liste des relations (si applicable)
   */
  public buildGraph(personList: Person[], relationships: Relationship[]): void {
    // Ajouter toutes les personnes au graphe
    for (const person of personList) {
      this.persons.set(person.id, person);
      this.adjacencyList.set(person.id, []);
    }

    // Si des relations explicites sont fournies, les utiliser
    if (relationships && relationships.length > 0) {
      for (const rel of relationships) {
        this.addEdge(rel.sourceId, rel.targetId, rel.type, rel.weight);
      }
    }
  }

  /**
   * Ajoute une arête au graphe
   * @param sourceId ID de la source
   * @param targetId ID de la cible
   * @param relationshipType type de relation
   * @param weight poids de l'arête
   */
  private addEdge(sourceId: number, targetId: number, relationshipType: RelationshipType, weight: number): void {
    const edge: Edge = {
      targetId,
      relationshipType,
      weight
    };
    this.adjacencyList.get(sourceId)?.push(edge);
  }

  /**
   * Trouve le chemin le plus court entre deux personnes (Dijkstra)
   * @param sourceId ID de la source
   * @param targetId ID de la cible
   * @returns le chemin trouvé ou null si aucun chemin n'existe
   */
  public findShortestPath(sourceId: number, targetId: number): Path | null {
    // Vérifier que les deux personnes existent
    if (!this.persons.has(sourceId) || !this.persons.has(targetId)) {
      return null;
    }

    // Initialisation
    const distances = new Map<number, number>();
    const previousNodes = new Map<number, number | null>();
    const queue: NodeDistance[] = [];
    const visited = new Set<number>();

    // Initialiser les distances à l'infini
    for (const id of this.persons.keys()) {
      distances.set(id, Infinity);
    }

    // Distance de la source à elle-même est 0
    distances.set(sourceId, 0);
    queue.push({ nodeId: sourceId, distance: 0 });

    // Algorithme de Dijkstra
    while (queue.length > 0) {
      // Trouver le nœud avec la distance minimale
      queue.sort((a, b) => a.distance - b.distance);
      const current = queue.shift()!;
      const currentId = current.nodeId;

      // Si on a atteint la cible, on peut s'arrêter
      if (currentId === targetId) {
        break;
      }

      // Ignorer les nœuds déjà visités
      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      // Explorer les voisins
      const edges = this.adjacencyList.get(currentId) || [];
      for (const edge of edges) {
        const neighborId = edge.targetId;
        const newDistance = distances.get(currentId)! + edge.weight;

        // Si on a trouvé un chemin plus court
        if (newDistance < distances.get(neighborId)!) {
          distances.set(neighborId, newDistance);
          previousNodes.set(neighborId, currentId);
          queue.push({ nodeId: neighborId, distance: newDistance });
        }
      }
    }

    // Si aucun chemin n'a été trouvé
    if (!previousNodes.has(targetId)) {
      return null;
    }

    // Reconstruire le chemin
    const pathNodes: number[] = [];
    const pathEdges: Edge[] = [];
    let current: number | null = targetId;

    while (current !== null) {
      pathNodes.unshift(current);
      const previous = previousNodes.get(current);

      if (previous !== null && previous !== undefined) {
        // Trouver l'arête entre previous et current
        const edges = this.adjacencyList.get(previous) || [];
        for (const edge of edges) {
          if (edge.targetId === current) {
            pathEdges.unshift(edge);
            break;
          }
        }
      }

      current = previous !== undefined ? previous : null;
    }

    return {
      nodes: pathNodes,
      edges: pathEdges,
      totalWeight: distances.get(targetId)!
    };
  }

  /**
   * Trouve tous les chemins entre deux personnes avec une profondeur maximale
   * @param sourceId ID de la source
   * @param targetId ID de la cible
   * @param maxDepth profondeur maximale
   * @returns liste des chemins trouvés
   */
  public findAllPaths(sourceId: number, targetId: number, maxDepth: number): Path[] {
    const paths: Path[] = [];
    const visited = new Set<number>();
    const currentPath: number[] = [];
    const currentEdges: Edge[] = [];

    visited.add(sourceId);
    currentPath.push(sourceId);

    this.findAllPathsDFS(sourceId, targetId, visited, currentPath, currentEdges, paths, maxDepth);

    return paths;
  }

  /**
   * Recherche en profondeur pour trouver tous les chemins
   */
  private findAllPathsDFS(
    currentId: number,
    targetId: number,
    visited: Set<number>,
    currentPath: number[],
    currentEdges: Edge[],
    paths: Path[],
    maxDepth: number
  ): void {
    // Si on a atteint la cible
    if (currentId === targetId) {
      let totalWeight = 0;
      for (const edge of currentEdges) {
        totalWeight += edge.weight;
      }
      paths.push({
        nodes: [...currentPath],
        edges: [...currentEdges],
        totalWeight
      });
      return;
    }

    // Si on a atteint la profondeur maximale
    if (currentPath.length > maxDepth) {
      return;
    }

    // Explorer les voisins
    const edges = this.adjacencyList.get(currentId) || [];
    for (const edge of edges) {
      const neighborId = edge.targetId;

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        currentPath.push(neighborId);
        currentEdges.push(edge);

        this.findAllPathsDFS(neighborId, targetId, visited, currentPath, currentEdges, paths, maxDepth);

        // Backtrack
        visited.delete(neighborId);
        currentPath.pop();
        currentEdges.pop();
      }
    }
  }

  /**
   * Trouve l'arbre couvrant minimal (Algorithme de Prim)
   * @returns l'arbre couvrant minimal
   */
  public findMinimumSpanningTree(): Edge[] {
    const mst: Edge[] = [];
    const visited = new Set<number>();
    const queue: EdgeWithSource[] = [];

    // Commencer par le premier nœud
    const startNode = this.persons.keys().next().value;
    visited.add(startNode);

    // Ajouter toutes les arêtes du nœud de départ
    const startEdges = this.adjacencyList.get(startNode) || [];
    for (const edge of startEdges) {
      queue.push({
        sourceId: startNode,
        edge,
        getWeight: function() { return this.edge.weight; }
      });
    }

    // Algorithme de Prim
    while (queue.length > 0 && visited.size < this.persons.size) {
      // Trouver l'arête de poids minimal
      queue.sort((a, b) => a.getWeight() - b.getWeight());
      const current = queue.shift()!;
      const targetId = current.edge.targetId;

      if (visited.has(targetId)) {
        continue;
      }

      visited.add(targetId);
      mst.push(current.edge);

      // Ajouter toutes les arêtes du nouveau nœud
      const edges = this.adjacencyList.get(targetId) || [];
      for (const edge of edges) {
        if (!visited.has(edge.targetId)) {
          queue.push({
            sourceId: targetId,
            edge,
            getWeight: function() { return this.edge.weight; }
          });
        }
      }
    }

    return mst;
  }

  /**
   * Trouve l'arbre couvrant minimal (Algorithme de Kruskal)
   * @returns l'arbre couvrant minimal
   */
  public findMinimumSpanningTreeKruskal(): Edge[] {
    const mst: Edge[] = [];
    const allEdges: EdgeWithSource[] = [];
    
    // Collecter toutes les arêtes
    for (const [sourceId, edges] of this.adjacencyList.entries()) {
      for (const edge of edges) {
        allEdges.push({
          sourceId,
          edge,
          getWeight: function() { return this.edge.weight; }
        });
      }
    }
    
    // Trier les arêtes par poids
    allEdges.sort((a, b) => a.getWeight() - b.getWeight());
    
    // Structure Union-Find pour détecter les cycles
    const parent = new Map<number, number>();
    for (const id of this.persons.keys()) {
      parent.set(id, id);
    }
    
    // Algorithme de Kruskal
    for (const edgeWithSource of allEdges) {
      const sourceId = edgeWithSource.sourceId;
      const targetId = edgeWithSource.edge.targetId;
      
      const sourceRoot = this.find(parent, sourceId);
      const targetRoot = this.find(parent, targetId);
      
      // Si l'ajout de cette arête ne crée pas de cycle
      if (sourceRoot !== targetRoot) {
        mst.push(edgeWithSource.edge);
        this.union(parent, sourceRoot, targetRoot);
      }
    }
    
    return mst;
  }
  
  /**
   * Trouve le représentant d'un ensemble (pour Union-Find)
   */
  private find(parent: Map<number, number>, id: number): number {
    if (parent.get(id) !== id) {
      parent.set(id, this.find(parent, parent.get(id)!));
    }
    return parent.get(id)!;
  }
  
  /**
   * Fusionne deux ensembles (pour Union-Find)
   */
  private union(parent: Map<number, number>, id1: number, id2: number): void {
    parent.set(id1, id2);
  }

  /**
   * Trouve les composantes connexes du graphe
   * @returns liste des composantes connexes
   */
  public findConnectedComponents(): Set<number>[] {
    const components: Set<number>[] = [];
    const visited = new Set<number>();
    
    for (const id of this.persons.keys()) {
      if (!visited.has(id)) {
        const component = new Set<number>();
        this.dfsComponent(id, visited, component);
        components.push(component);
      }
    }
    
    return components;
  }
  
  /**
   * DFS pour trouver une composante connexe
   */
  private dfsComponent(id: number, visited: Set<number>, component: Set<number>): void {
    visited.add(id);
    component.add(id);
    
    const edges = this.adjacencyList.get(id) || [];
    for (const edge of edges) {
      const neighborId = edge.targetId;
      if (!visited.has(neighborId)) {
        this.dfsComponent(neighborId, visited, component);
      }
    }
  }

  /**
   * Trouve l'ancêtre commun le plus proche entre deux personnes
   * @param person1Id ID de la première personne
   * @param person2Id ID de la deuxième personne
   * @returns l'ancêtre commun ou null si aucun n'existe
   */
  public findClosestCommonAncestor(person1Id: number, person2Id: number): Person | null {
    // Collecter tous les ancêtres de la première personne avec leur distance
    const ancestors1 = new Map<number, number>();
    this.collectAncestors(person1Id, ancestors1, 0, new Set<number>());
    
    // Collecter tous les ancêtres de la deuxième personne avec leur distance
    const ancestors2 = new Map<number, number>();
    this.collectAncestors(person2Id, ancestors2, 0, new Set<number>());
    
    // Trouver l'ancêtre commun le plus proche
    let closestAncestorId: number | null = null;
    let minDistance = Infinity;
    
    for (const [ancestorId, distance1] of ancestors1.entries()) {
      if (ancestors2.has(ancestorId)) {
        const distance2 = ancestors2.get(ancestorId)!;
        const totalDistance = distance1 + distance2;
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          closestAncestorId = ancestorId;
        }
      }
    }
    
    return closestAncestorId !== null ? this.persons.get(closestAncestorId) || null : null;
  }
  
  /**
   * Collecte tous les ancêtres d'une personne avec leur distance
   */
  private collectAncestors(
    personId: number,
    ancestors: Map<number, number>,
    distance: number,
    visited: Set<number>
  ): void {
    if (visited.has(personId)) {
      return;
    }
    
    visited.add(personId);
    
    // Ajouter cette personne comme ancêtre
    if (distance > 0) {
      ancestors.set(personId, distance);
    }
    
    // Explorer les relations de type PARENT_CHILD
    const edges = this.adjacencyList.get(personId) || [];
    for (const edge of edges) {
      if (edge.relationshipType === RelationshipType.PARENT_CHILD) {
        this.collectAncestors(edge.targetId, ancestors, distance + 1, visited);
      }
    }
  }

  /**
   * Applique l'algorithme de Bellman-Ford pour trouver les chemins les plus courts
   * avec la possibilité de poids négatifs
   * @param sourceId ID de la source
   * @returns map des distances les plus courtes
   */
  public bellmanFord(sourceId: number): Map<number, number> {
    // Initialisation
    const distances = new Map<number, number>();
    
    // Initialiser les distances à l'infini
    for (const id of this.persons.keys()) {
      distances.set(id, Infinity);
    }
    
    // Distance de la source à elle-même est 0
    distances.set(sourceId, 0);
    
    // Relaxation des arêtes |V|-1 fois
    const numVertices = this.persons.size;
    for (let i = 0; i < numVertices - 1; i++) {
      for (const [u, edges] of this.adjacencyList.entries()) {
        for (const edge of edges) {
          const v = edge.targetId;
          const weight = edge.weight;
          
          if (distances.get(u)! !== Infinity && 
              distances.get(u)! + weight < distances.get(v)!) {
            distances.set(v, distances.get(u)! + weight);
          }
        }
      }
    }
    
    // Vérifier s'il y a des cycles de poids négatif
    for (const [u, edges] of this.adjacencyList.entries()) {
      for (const edge of edges) {
        const v = edge.targetId;
        const weight = edge.weight;
        
        if (distances.get(u)! !== Infinity && 
            distances.get(u)! + weight < distances.get(v)!) {
          // Il y a un cycle de poids négatif
          distances.set(v, -Infinity);
        }
      }
    }
    
    return distances;
  }

  /**
   * Récupère une personne par son ID
   * @param id l'ID de la personne
   * @returns la personne ou null si non trouvée
   */
  public getPersonById(id: number): Person | null {
    return this.persons.get(id) || null;
  }
}
