package com.genealogy.back_ro.service;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.Relationship;
import com.genealogy.back_ro.repository.PersonRepository;
import com.genealogy.back_ro.repository.RelationshipRepository;
import com.genealogy.back_ro.util.FamilyGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GraphAlgorithmService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RelationshipRepository relationshipRepository;

    /**
     * Construit le graphe familial à partir des données en base
     */
    private FamilyGraph buildFamilyGraph() {
        List<Person> persons = personRepository.findAll();
        List<Relationship> relationships = relationshipRepository.findAll();
        
        FamilyGraph graph = new FamilyGraph();
        graph.buildGraph(persons, relationships);
        
        return graph;
    }

    /**
     * Trouve le lien de parenté le plus court entre deux personnes (Dijkstra)
     */
    public Map<String, Object> findRelationshipPath(Long person1Id, Long person2Id) {
        FamilyGraph graph = buildFamilyGraph();
        FamilyGraph.Path path = graph.findShortestPath(person1Id, person2Id);
        
        if (path == null) {
            return Map.of("found", false, "message", "Aucun lien de parenté trouvé entre ces personnes");
        }
        
        List<Map<String, Object>> pathDetails = new ArrayList<>();
        List<Long> nodes = path.getNodes();
        List<FamilyGraph.Edge> edges = path.getEdges();
        
        for (int i = 0; i < nodes.size(); i++) {
            Person person = graph.getPersonById(nodes.get(i));
            Map<String, Object> nodeInfo = new HashMap<>();
            nodeInfo.put("id", person.getId());
            nodeInfo.put("firstName", person.getFirstName());
            nodeInfo.put("lastName", person.getLastName());
            
            if (i < nodes.size() - 1) {
                FamilyGraph.Edge edge = edges.get(i);
                nodeInfo.put("relationshipType", edge.getRelationshipType());
                nodeInfo.put("weight", edge.getWeight());
            }
            
            pathDetails.add(nodeInfo);
        }
        
        // Déterminer le type de relation global
        String relationshipType = determineRelationshipType(path);
        
        return Map.of(
            "found", true,
            "path", pathDetails,
            "totalWeight", path.getTotalWeight(),
            "relationshipType", relationshipType
        );
    }

    /**
     * Détermine le type de relation global entre deux personnes
     */
    private String determineRelationshipType(FamilyGraph.Path path) {
        int totalWeight = path.getTotalWeight();
        List<FamilyGraph.Edge> edges = path.getEdges();
        
        // Analyse des types de relations dans le chemin
        boolean hasParentChild = edges.stream()
            .anyMatch(e -> e.getRelationshipType().equals("PARENT_CHILD"));
        boolean hasSibling = edges.stream()
            .anyMatch(e -> e.getRelationshipType().equals("SIBLING"));
        
        // Détermination du type de relation en fonction du poids et des types d'arêtes
        if (totalWeight == 1 && hasParentChild) {
            return "Parent/Enfant";
        } else if (totalWeight == 2 && hasParentChild) {
            return "Grand-parent/Petit-enfant";
        } else if (totalWeight == 2 && hasSibling) {
            return "Frère/Sœur";
        } else if (totalWeight == 3) {
            return "Oncle/Tante ou Neveu/Nièce";
        } else if (totalWeight == 4) {
            return "Cousin";
        } else if (totalWeight > 4) {
            return "Parent éloigné (degré " + totalWeight + ")";
        } else {
            return "Relation indéterminée";
        }
    }

    /**
     * Trouve tous les chemins possibles entre deux personnes
     */
    public List<Map<String, Object>> findAllRelationshipPaths(Long person1Id, Long person2Id, int maxDepth) {
        FamilyGraph graph = buildFamilyGraph();
        List<FamilyGraph.Path> paths = graph.findAllPaths(person1Id, person2Id, maxDepth);
        
        return paths.stream().map(path -> {
            List<Map<String, Object>> pathDetails = new ArrayList<>();
            List<Long> nodes = path.getNodes();
            List<FamilyGraph.Edge> edges = path.getEdges();
            
            for (int i = 0; i < nodes.size(); i++) {
                Person person = graph.getPersonById(nodes.get(i));
                Map<String, Object> nodeInfo = new HashMap<>();
                nodeInfo.put("id", person.getId());
                nodeInfo.put("firstName", person.getFirstName());
                nodeInfo.put("lastName", person.getLastName());
                
                if (i < nodes.size() - 1) {
                    FamilyGraph.Edge edge = edges.get(i);
                    nodeInfo.put("relationshipType", edge.getRelationshipType());
                    nodeInfo.put("weight", edge.getWeight());
                }
                
                pathDetails.add(nodeInfo);
            }
            
            String relationshipType = determineRelationshipType(path);
            
            return Map.of(
                "path", pathDetails,
                "totalWeight", path.getTotalWeight(),
                "relationshipType", relationshipType
            );
        }).collect(Collectors.toList());
    }

    /**
     * Trouve l'arbre couvrant minimal (Prim)
     */
    public Map<String, Object> findMinimumSpanningTree() {
        FamilyGraph graph = buildFamilyGraph();
        List<FamilyGraph.Edge> mst = graph.findMinimumSpanningTree();
        
        List<Map<String, Object>> edgeDetails = new ArrayList<>();
        for (FamilyGraph.Edge edge : mst) {
            Map<String, Object> edgeInfo = new HashMap<>();
            Person source = null;
            Person target = graph.getPersonById(edge.getTargetId());
            
            // Trouver la source en parcourant la liste d'adjacence
            for (Map.Entry<Long, List<FamilyGraph.Edge>> entry : graph.getAdjacencyList().entrySet()) {
                if (entry.getValue().stream().anyMatch(e -> e.getTargetId().equals(edge.getTargetId()) && e.getWeight() == edge.getWeight())) {
                    source = graph.getPersonById(entry.getKey());
                    break;
                }
            }
            
            if (source != null && target != null) {
                edgeInfo.put("source", Map.of("id", source.getId(), "name", source.getFirstName() + " " + source.getLastName()));
                edgeInfo.put("target", Map.of("id", target.getId(), "name", target.getFirstName() + " " + target.getLastName()));
                edgeInfo.put("relationshipType", edge.getRelationshipType());
                edgeInfo.put("weight", edge.getWeight());
                edgeDetails.add(edgeInfo);
            }
        }
        
        return Map.of(
            "edges", edgeDetails,
            "totalWeight", mst.stream().mapToInt(FamilyGraph.Edge::getWeight).sum()
        );
    }

    /**
     * Trouve l'arbre couvrant minimal avec l'algorithme de Kruskal
     */
    public Map<String, Object> findMinimumSpanningTreeKruskal() {
        FamilyGraph graph = buildFamilyGraph();
        List<FamilyGraph.Edge> mst = graph.findMinimumSpanningTreeKruskal();
        
        List<Map<String, Object>> edgeDetails = new ArrayList<>();
        for (FamilyGraph.Edge edge : mst) {
            Map<String, Object> edgeInfo = new HashMap<>();
            Person source = null;
            Person target = graph.getPersonById(edge.getTargetId());
            
            // Trouver la source en parcourant la liste d'adjacence
            for (Map.Entry<Long, List<FamilyGraph.Edge>> entry : graph.getAdjacencyList().entrySet()) {
                if (entry.getValue().stream().anyMatch(e -> e.getTargetId().equals(edge.getTargetId()) && e.getWeight() == edge.getWeight())) {
                    source = graph.getPersonById(entry.getKey());
                    break;
                }
            }
            
            if (source != null && target != null) {
                edgeInfo.put("source", Map.of("id", source.getId(), "name", source.getFirstName() + " " + source.getLastName()));
                edgeInfo.put("target", Map.of("id", target.getId(), "name", target.getFirstName() + " " + target.getLastName()));
                edgeInfo.put("relationshipType", edge.getRelationshipType());
                edgeInfo.put("weight", edge.getWeight());
                edgeDetails.add(edgeInfo);
            }
        }
        
        return Map.of(
            "edges", edgeDetails,
            "totalWeight", mst.stream().mapToInt(FamilyGraph.Edge::getWeight).sum()
        );
    }

    /**
     * Trouve les composantes connexes du graphe familial
     */
    public List<Map<String, Object>> findFamilyGroups() {
        FamilyGraph graph = buildFamilyGraph();
        List<Set<Long>> components = graph.findConnectedComponents();
        
        List<Map<String, Object>> groupDetails = new ArrayList<>();
        for (int i = 0; i < components.size(); i++) {
            Set<Long> component = components.get(i);
            List<Map<String, Object>> members = component.stream()
                .map(id -> {
                    Person person = graph.getPersonById(id);
                    return Map.of(
                        "id", person.getId(),
                        "firstName", person.getFirstName(),
                        "lastName", person.getLastName()
                    );
                })
                .collect(Collectors.toList());
            
            groupDetails.add(Map.of(
                "groupId", i + 1,
                "size", component.size(),
                "members", members
            ));
        }
        
        return groupDetails;
    }

    /**
     * Trouve le parent commun le plus proche entre deux personnes
     */
    public Map<String, Object> findClosestCommonAncestor(Long person1Id, Long person2Id) {
        // Récupérer les personnes
        Person person1 = personRepository.findById(person1Id).orElse(null);
        Person person2 = personRepository.findById(person2Id).orElse(null);
        
        if (person1 == null || person2 == null) {
            return Map.of("found", false, "message", "Une ou plusieurs personnes n'existent pas");
        }
        
        // BFS pour trouver l'ancêtre commun le plus proche
        Set<Long> visited1 = new HashSet<>();
        Set<Long> visited2 = new HashSet<>();
        Queue<Long> queue1 = new LinkedList<>();
        Queue<Long> queue2 = new LinkedList<>();
        Map<Long, Long> parent1 = new HashMap<>();
        Map<Long, Long> parent2 = new HashMap<>();
        
        queue1.add(person1Id);
        queue2.add(person2Id);
        visited1.add(person1Id);
        visited2.add(person2Id);
        
        Long commonAncestor = null;
        
        while (!queue1.isEmpty() || !queue2.isEmpty()) {
            // BFS à partir de la personne 1
            if (!queue1.isEmpty()) {
                Long current = queue1.poll();
                List<Person> parents = personRepository.findParentsByChildId(current);
                
                for (Person parent : parents) {
                    Long parentId = parent.getId();
                    if (!visited1.contains(parentId)) {
                        visited1.add(parentId);
                        parent1.put(parentId, current);
                        queue1.add(parentId);
                        
                        // Vérifier si c'est un ancêtre commun
                        if (visited2.contains(parentId)) {
                            commonAncestor = parentId;
                            break;
                        }
                    }
                }
                
                if (commonAncestor != null) {
                    break;
                }
            }
            
            // BFS à partir de la personne 2
            if (!queue2.isEmpty()) {
                Long current = queue2.poll();
                List<Person> parents = personRepository.findParentsByChildId(current);
                
                for (Person parent : parents) {
                    Long parentId = parent.getId();
                    if (!visited2.contains(parentId)) {
                        visited2.add(parentId);
                        parent2.put(parentId, current);
                        queue2.add(parentId);
                        
                        // Vérifier si c'est un ancêtre commun
                        if (visited1.contains(parentId)) {
                            commonAncestor = parentId;
                            break;
                        }
                    }
                }
                
                if (commonAncestor != null) {
                    break;
                }
            }
        }
        
        if (commonAncestor == null) {
            return Map.of("found", false, "message", "Aucun ancêtre commun trouvé");
        }
        
        Person ancestor = personRepository.findById(commonAncestor).orElse(null);
        
        return Map.of(
            "found", true,
            "ancestor", Map.of(
                "id", ancestor.getId(),
                "firstName", ancestor.getFirstName(),
                "lastName", ancestor.getLastName()
            )
        );
    }

    /**
     * Trouve tous les descendants d'une personne jusqu'à une profondeur donnée
     */
    public Map<String, Object> findAllDescendants(Long personId, int maxDepth) {
        Person person = personRepository.findById(personId).orElse(null);
        
        if (person == null) {
            return Map.of("found", false, "message", "La personne n'existe pas");
        }
        
        Set<Long> visited = new HashSet<>();
        Map<Long, Integer> depths = new HashMap<>();
        Queue<Long> queue = new LinkedList<>();
        
        queue.add(personId);
        visited.add(personId);
        depths.put(personId, 0);
        
        Map<Integer, List<Map<String, Object>>> descendantsByDepth = new HashMap<>();
        
        while (!queue.isEmpty()) {
            Long current = queue.poll();
            int currentDepth = depths.get(current);
            
            if (currentDepth >= maxDepth) {
                continue;
            }
            
            List<Person> children = personRepository.findChildrenByParentId(current);
            
            for (Person child : children) {
                Long childId = child.getId();
                if (!visited.contains(childId)) {
                    visited.add(childId);
                    depths.put(childId, currentDepth + 1);
                    queue.add(childId);
                    
                    // Ajouter à la liste des descendants par profondeur
                    descendantsByDepth.computeIfAbsent(currentDepth + 1, k -> new ArrayList<>())
                        .add(Map.of(
                            "id", child.getId(),
                            "firstName", child.getFirstName(),
                            "lastName", child.getLastName()
                        ));
                }
            }
        }
        
        return Map.of(
            "found", true,
            "person", Map.of(
                "id", person.getId(),
                "firstName", person.getFirstName(),
                "lastName", person.getLastName()
            ),
            "descendants", descendantsByDepth
        );
    }

    /**
     * Trouve le cousin le plus proche d'une personne
     */
    public Map<String, Object> findClosestCousin(Long personId) {
        FamilyGraph graph = buildFamilyGraph();
        Person person = personRepository.findById(personId).orElse(null);
        
        if (person == null) {
            return Map.of("found", false, "message", "La personne n'existe pas");
        }
        
        // Trouver les parents
        List<Person> parents = personRepository.findParentsByChildId(personId);
        
        if (parents.isEmpty()) {
            return Map.of("found", false, "message", "La personne n'a pas de parents enregistrés");
        }
        
        // Trouver les grands-parents
        Set<Long> grandParentIds = new HashSet<>();
        for (Person parent : parents) {
            List<Person> grandParents = personRepository.findParentsByChildId(parent.getId());
            for (Person grandParent : grandParents) {
                grandParentIds.add(grandParent.getId());
            }
        }
        
        if (grandParentIds.isEmpty()) {
            return Map.of("found", false, "message", "La personne n'a pas de grands-parents enregistrés");
        }
        
        // Trouver les oncles/tantes (frères/sœurs des parents)
        Set<Long> uncleAuntIds = new HashSet<>();
        for (Person parent : parents) {
            List<Person> parentSiblings = new ArrayList<>();
            
            // Pour chaque grand-parent, trouver ses enfants (frères/sœurs du parent)
            for (Long grandParentId : grandParentIds) {
                List<Person> grandParentChildren = personRepository.findChildrenByParentId(grandParentId);
                for (Person child : grandParentChildren) {
                    if (!child.getId().equals(parent.getId())) {
                        parentSiblings.add(child);
                    }
                }
            }
            
            for (Person sibling : parentSiblings) {
                uncleAuntIds.add(sibling.getId());
            }
        }
        
        if (uncleAuntIds.isEmpty()) {
            return Map.of("found", false, "message", "La personne n'a pas d'oncles ou tantes enregistrés");
        }
        
        // Trouver les cousins (enfants des oncles/tantes)
        List<Person> cousins = new ArrayList<>();
        for (Long uncleAuntId : uncleAuntIds) {
            List<Person> cousinList = personRepository.findChildrenByParentId(uncleAuntId);
            cousins.addAll(cousinList);
        }
        
        // Filtrer pour ne pas inclure la personne elle-même
        cousins = cousins.stream()
            .filter(c -> !c.getId().equals(personId))
            .collect(Collectors.toList());
        
        if (cousins.isEmpty()) {
            return Map.of("found", false, "message", "La personne n'a pas de cousins enregistrés");
        }
        
        // Trouver le cousin le plus proche (par l'âge, ou par défaut le premier)
        Person closestCousin = cousins.get(0);
        
        return Map.of(
            "found", true,
            "person", Map.of(
                "id", person.getId(),
                "firstName", person.getFirstName(),
                "lastName", person.getLastName()
            ),
            "cousin", Map.of(
                "id", closestCousin.getId(),
                "firstName", closestCousin.getFirstName(),
                "lastName", closestCousin.getLastName()
            ),
            "relationship", "Cousin"
        );
    }
}
