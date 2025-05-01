package com.genealogy.back_ro.util;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.Relationship;

import java.util.*;

/**
 * Classe utilitaire pour représenter l'arbre généalogique sous forme de graphe
 * et implémenter les algorithmes de graphe mentionnés dans le TP.
 */
public class FamilyGraph {
    // Représentation du graphe sous forme de liste d'adjacence
    private Map<Long, List<Edge>> adjacencyList;
    // Mapping des IDs vers les personnes
    private Map<Long, Person> persons;

    /**
     * Classe interne pour représenter une arête du graphe
     */
    public static class Edge {
        private Long targetId;
        private int weight;
        private String relationshipType;

        public Edge(Long targetId, int weight, String relationshipType) {
            this.targetId = targetId;
            this.weight = weight;
            this.relationshipType = relationshipType;
        }

        public Long getTargetId() {
            return targetId;
        }

        public int getWeight() {
            return weight;
        }

        public String getRelationshipType() {
            return relationshipType;
        }
    }

    /**
     * Classe interne pour représenter un chemin dans le graphe
     */
    public static class Path {
        private List<Long> nodes;
        private List<Edge> edges;
        private int totalWeight;

        public Path() {
            this.nodes = new ArrayList<>();
            this.edges = new ArrayList<>();
            this.totalWeight = 0;
        }

        public void addNode(Long nodeId) {
            nodes.add(nodeId);
        }

        public void addEdge(Edge edge) {
            edges.add(edge);
            totalWeight += edge.getWeight();
        }

        public List<Long> getNodes() {
            return nodes;
        }

        public List<Edge> getEdges() {
            return edges;
        }

        public int getTotalWeight() {
            return totalWeight;
        }
    }

    public FamilyGraph() {
        this.adjacencyList = new HashMap<>();
        this.persons = new HashMap<>();
    }

    /**
     * Construit le graphe à partir d'une liste de personnes et de relations
     */
    public void buildGraph(List<Person> personList, List<Relationship> relationships) {
        // Réinitialiser le graphe
        adjacencyList.clear();
        persons.clear();

        // Ajouter tous les nœuds (personnes)
        for (Person person : personList) {
            adjacencyList.put(person.getId(), new ArrayList<>());
            persons.put(person.getId(), person);
        }

        // Ajouter toutes les arêtes (relations)
        for (Relationship relationship : relationships) {
            Long person1Id = relationship.getPerson1().getId();
            Long person2Id = relationship.getPerson2().getId();
            int weight = relationship.getWeight();
            String type = relationship.getType().name();

            // Ajouter l'arête dans les deux sens (graphe non orienté)
            adjacencyList.get(person1Id).add(new Edge(person2Id, weight, type));
            adjacencyList.get(person2Id).add(new Edge(person1Id, weight, type));
        }
    }

    /**
     * Algorithme de Dijkstra pour trouver le chemin le plus court entre deux personnes
     */
    public Path findShortestPath(Long sourceId, Long targetId) {
        // Vérifier si les nœuds existent
        if (!adjacencyList.containsKey(sourceId) || !adjacencyList.containsKey(targetId)) {
            return null;
        }

        // Initialisation
        Map<Long, Integer> distances = new HashMap<>();
        Map<Long, Long> previousNodes = new HashMap<>();
        Map<Long, Edge> previousEdges = new HashMap<>();
        PriorityQueue<Long> queue = new PriorityQueue<>(Comparator.comparing(distances::get));

        // Initialiser les distances
        for (Long nodeId : adjacencyList.keySet()) {
            distances.put(nodeId, Integer.MAX_VALUE);
        }
        distances.put(sourceId, 0);
        queue.add(sourceId);

        // Algorithme de Dijkstra
        while (!queue.isEmpty()) {
            Long currentId = queue.poll();

            // Si on a atteint la cible, on peut s'arrêter
            if (currentId.equals(targetId)) {
                break;
            }

            // Parcourir les voisins
            for (Edge edge : adjacencyList.get(currentId)) {
                Long neighborId = edge.getTargetId();
                int newDistance = distances.get(currentId) + edge.getWeight();

                // Si on a trouvé un chemin plus court
                if (newDistance < distances.get(neighborId)) {
                    distances.put(neighborId, newDistance);
                    previousNodes.put(neighborId, currentId);
                    previousEdges.put(neighborId, edge);

                    // Mettre à jour la file de priorité
                    queue.remove(neighborId);
                    queue.add(neighborId);
                }
            }
        }

        // Reconstruire le chemin
        if (!previousNodes.containsKey(targetId)) {
            return null; // Pas de chemin trouvé
        }

        Path path = new Path();
        Long currentId = targetId;
        path.addNode(currentId);

        while (previousNodes.containsKey(currentId)) {
            Long previousId = previousNodes.get(currentId);
            Edge edge = previousEdges.get(currentId);
            path.addEdge(edge);
            path.addNode(previousId);
            currentId = previousId;
        }

        // Inverser le chemin (de la source à la cible)
        Collections.reverse(path.getNodes());
        Collections.reverse(path.getEdges());

        return path;
    }

    /**
     * Algorithme de Prim pour trouver l'arbre couvrant minimal
     */
    public List<Edge> findMinimumSpanningTree() {
        if (adjacencyList.isEmpty()) {
            return Collections.emptyList();
        }

        // Initialisation
        Set<Long> visited = new HashSet<>();
        List<Edge> mst = new ArrayList<>();
        PriorityQueue<EdgeEntry> pq = new PriorityQueue<>(Comparator.comparing(e -> e.edge.getWeight()));

        // Commencer par le premier nœud
        Long startNodeId = adjacencyList.keySet().iterator().next();
        visited.add(startNodeId);

        // Ajouter toutes les arêtes du nœud de départ
        for (Edge edge : adjacencyList.get(startNodeId)) {
            pq.add(new EdgeEntry(startNodeId, edge));
        }

        // Algorithme de Prim
        while (!pq.isEmpty() && visited.size() < adjacencyList.size()) {
            EdgeEntry entry = pq.poll();
            Long sourceId = entry.sourceId;
            Edge edge = entry.edge;
            Long targetId = edge.getTargetId();

            // Si le nœud cible a déjà été visité, ignorer cette arête
            if (visited.contains(targetId)) {
                continue;
            }

            // Ajouter l'arête à l'arbre couvrant minimal
            mst.add(edge);
            visited.add(targetId);

            // Ajouter toutes les arêtes du nœud cible
            for (Edge nextEdge : adjacencyList.get(targetId)) {
                if (!visited.contains(nextEdge.getTargetId())) {
                    pq.add(new EdgeEntry(targetId, nextEdge));
                }
            }
        }

        return mst;
    }

    /**
     * Classe utilitaire pour l'algorithme de Prim
     */
    private static class EdgeEntry {
        private Long sourceId;
        private Edge edge;

        public EdgeEntry(Long sourceId, Edge edge) {
            this.sourceId = sourceId;
            this.edge = edge;
        }
    }

    /**
     * Algorithme de recherche en largeur (BFS) pour trouver tous les chemins entre deux personnes
     */
    public List<Path> findAllPaths(Long sourceId, Long targetId, int maxDepth) {
        List<Path> paths = new ArrayList<>();
        Set<Long> visited = new HashSet<>();
        Path currentPath = new Path();
        currentPath.addNode(sourceId);
        
        dfs(sourceId, targetId, visited, currentPath, paths, maxDepth);
        
        return paths;
    }
    
    /**
     * Recherche en profondeur (DFS) pour trouver tous les chemins
     */
    private void dfs(Long currentId, Long targetId, Set<Long> visited, Path currentPath, List<Path> paths, int maxDepth) {
        // Si on a atteint la profondeur maximale, on s'arrête
        if (currentPath.getNodes().size() > maxDepth) {
            return;
        }
        
        // Si on a atteint la cible, on ajoute le chemin à la liste
        if (currentId.equals(targetId)) {
            paths.add(new Path());
            for (Long nodeId : currentPath.getNodes()) {
                paths.get(paths.size() - 1).addNode(nodeId);
            }
            for (Edge edge : currentPath.getEdges()) {
                paths.get(paths.size() - 1).addEdge(edge);
            }
            return;
        }
        
        // Marquer le nœud comme visité
        visited.add(currentId);
        
        // Parcourir les voisins
        for (Edge edge : adjacencyList.get(currentId)) {
            Long neighborId = edge.getTargetId();
            
            // Si le voisin n'a pas été visité
            if (!visited.contains(neighborId)) {
                // Ajouter le voisin au chemin
                currentPath.addNode(neighborId);
                currentPath.addEdge(edge);
                
                // Continuer la recherche
                dfs(neighborId, targetId, visited, currentPath, paths, maxDepth);
                
                // Retirer le voisin du chemin (backtracking)
                currentPath.getNodes().remove(currentPath.getNodes().size() - 1);
                currentPath.getEdges().remove(currentPath.getEdges().size() - 1);
            }
        }
        
        // Démarquer le nœud
        visited.remove(currentId);
    }

    /**
     * Algorithme de Kruskal pour trouver l'arbre couvrant minimal
     */
    public List<Edge> findMinimumSpanningTreeKruskal() {
        if (adjacencyList.isEmpty()) {
            return Collections.emptyList();
        }

        // Initialisation
        List<Edge> mst = new ArrayList<>();
        List<EdgeEntry> allEdges = new ArrayList<>();
        DisjointSet disjointSet = new DisjointSet(adjacencyList.keySet());

        // Collecter toutes les arêtes
        for (Long sourceId : adjacencyList.keySet()) {
            for (Edge edge : adjacencyList.get(sourceId)) {
                allEdges.add(new EdgeEntry(sourceId, edge));
            }
        }

        // Trier les arêtes par poids
        allEdges.sort(Comparator.comparing(e -> e.edge.getWeight()));

        // Algorithme de Kruskal
        for (EdgeEntry entry : allEdges) {
            Long sourceId = entry.sourceId;
            Long targetId = entry.edge.getTargetId();

            // Si les nœuds ne sont pas dans le même ensemble, ajouter l'arête
            if (disjointSet.find(sourceId) != disjointSet.find(targetId)) {
                mst.add(entry.edge);
                disjointSet.union(sourceId, targetId);
            }

            // Si on a ajouté n-1 arêtes, on a terminé
            if (mst.size() == adjacencyList.size() - 1) {
                break;
            }
        }

        return mst;
    }

    /**
     * Classe utilitaire pour l'algorithme de Kruskal (Union-Find)
     */
    private static class DisjointSet {
        private Map<Long, Long> parent;

        public DisjointSet(Set<Long> elements) {
            parent = new HashMap<>();
            for (Long element : elements) {
                parent.put(element, element);
            }
        }

        public Long find(Long element) {
            if (!parent.get(element).equals(element)) {
                parent.put(element, find(parent.get(element)));
            }
            return parent.get(element);
        }

        public void union(Long element1, Long element2) {
            Long root1 = find(element1);
            Long root2 = find(element2);
            if (!root1.equals(root2)) {
                parent.put(root1, root2);
            }
        }
    }

    /**
     * Trouver les composantes connexes du graphe
     */
    public List<Set<Long>> findConnectedComponents() {
        List<Set<Long>> components = new ArrayList<>();
        Set<Long> visited = new HashSet<>();

        // Parcourir tous les nœuds
        for (Long nodeId : adjacencyList.keySet()) {
            if (!visited.contains(nodeId)) {
                // Nouvelle composante connexe
                Set<Long> component = new HashSet<>();
                bfs(nodeId, visited, component);
                components.add(component);
            }
        }

        return components;
    }

    /**
     * Recherche en largeur (BFS) pour trouver une composante connexe
     */
    private void bfs(Long startId, Set<Long> visited, Set<Long> component) {
        Queue<Long> queue = new LinkedList<>();
        queue.add(startId);
        visited.add(startId);
        component.add(startId);

        while (!queue.isEmpty()) {
            Long currentId = queue.poll();

            // Parcourir les voisins
            for (Edge edge : adjacencyList.get(currentId)) {
                Long neighborId = edge.getTargetId();

                // Si le voisin n'a pas été visité
                if (!visited.contains(neighborId)) {
                    visited.add(neighborId);
                    component.add(neighborId);
                    queue.add(neighborId);
                }
            }
        }
    }

    /**
     * Récupérer une personne par son ID
     */
    public Person getPersonById(Long id) {
        return persons.get(id);
    }

    /**
     * Récupérer la liste d'adjacence
     */
    public Map<Long, List<Edge>> getAdjacencyList() {
        return adjacencyList;
    }

    /**
     * Récupérer la liste des personnes
     */
    public Map<Long, Person> getPersons() {
        return persons;
    }
}
