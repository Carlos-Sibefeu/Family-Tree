package com.genealogy.back_ro.service;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GenealogySearchService {

    @Autowired
    private PersonRepository personRepository;

    /**
     * Recherche le lien de parenté entre deux personnes
     */
    public List<Person> findRelationshipPath(Long person1Id, Long person2Id) {
        Person person1 = personRepository.findById(person1Id).orElse(null);
        Person person2 = personRepository.findById(person2Id).orElse(null);

        if (person1 == null || person2 == null) {
            return Collections.emptyList();
        }

        // Utilisation de l'algorithme de Dijkstra pour trouver le chemin le plus court
        Map<Long, Long> parentMap = new HashMap<>();
        Map<Long, Integer> distances = new HashMap<>();
        PriorityQueue<PersonDistance> queue = new PriorityQueue<>();
        Set<Long> visited = new HashSet<>();

        // Initialisation
        distances.put(person1.getId(), 0);
        queue.add(new PersonDistance(person1.getId(), 0));

        while (!queue.isEmpty()) {
            PersonDistance current = queue.poll();
            Long currentId = current.personId;

            if (currentId.equals(person2.getId())) {
                break;
            }

            if (visited.contains(currentId)) {
                continue;
            }

            visited.add(currentId);

            // Récupérer la personne courante
            Person currentPerson = personRepository.findById(currentId).orElse(null);
            if (currentPerson == null) continue;

            // Explorer les parents
            for (Person parent : currentPerson.getParents()) {
                processNeighbor(parent.getId(), currentId, 1, distances, parentMap, queue);
            }

            // Explorer les enfants
            for (Person child : currentPerson.getChildren()) {
                processNeighbor(child.getId(), currentId, 1, distances, parentMap, queue);
            }
        }

        // Reconstruire le chemin
        return reconstructPath(person1.getId(), person2.getId(), parentMap);
    }

    /**
     * Trouve l'ancêtre commun le plus proche entre deux personnes
     */
    public Person findCommonAncestor(Long person1Id, Long person2Id) {
        Person person1 = personRepository.findById(person1Id).orElse(null);
        Person person2 = personRepository.findById(person2Id).orElse(null);

        if (person1 == null || person2 == null) {
            return null;
        }

        Set<Long> ancestors1 = new HashSet<>();
        Queue<Person> queue = new LinkedList<>();
        queue.add(person1);

        // Collecter tous les ancêtres de la première personne
        while (!queue.isEmpty()) {
            Person current = queue.poll();
            ancestors1.add(current.getId());
            queue.addAll(current.getParents());
        }

        // Rechercher parmi les ancêtres de la deuxième personne
        queue.clear();
        queue.add(person2);

        while (!queue.isEmpty()) {
            Person current = queue.poll();
            if (ancestors1.contains(current.getId())) {
                return current;
            }
            queue.addAll(current.getParents());
        }

        return null;
    }

    /**
     * Trouve tous les descendants d'une personne jusqu'à une certaine profondeur
     */
    public List<Person> findDescendants(Long personId, int maxDepth) {
        Person person = personRepository.findById(personId).orElse(null);
        if (person == null) {
            return Collections.emptyList();
        }

        List<Person> descendants = new ArrayList<>();
        Queue<PersonDepth> queue = new LinkedList<>();
        Set<Long> visited = new HashSet<>();

        queue.add(new PersonDepth(person, 0));
        visited.add(person.getId());

        while (!queue.isEmpty()) {
            PersonDepth current = queue.poll();

            if (current.depth < maxDepth) {
                for (Person child : current.person.getChildren()) {
                    if (!visited.contains(child.getId())) {
                        descendants.add(child);
                        queue.add(new PersonDepth(child, current.depth + 1));
                        visited.add(child.getId());
                    }
                }
            }
        }

        return descendants;
    }

    private void processNeighbor(Long neighborId, Long currentId, int weight,
                               Map<Long, Integer> distances,
                               Map<Long, Long> parentMap,
                               PriorityQueue<PersonDistance> queue) {
        int newDistance = distances.get(currentId) + weight;
        if (!distances.containsKey(neighborId) || newDistance < distances.get(neighborId)) {
            distances.put(neighborId, newDistance);
            parentMap.put(neighborId, currentId);
            queue.add(new PersonDistance(neighborId, newDistance));
        }
    }

    private List<Person> reconstructPath(Long startId, Long endId, Map<Long, Long> parentMap) {
        List<Person> path = new ArrayList<>();
        Long currentId = endId;

        while (currentId != null) {
            Person person = personRepository.findById(currentId).orElse(null);
            if (person != null) {
                path.add(0, person);
            }
            currentId = parentMap.get(currentId);
            if (currentId != null && currentId.equals(startId)) {
                person = personRepository.findById(startId).orElse(null);
                if (person != null) {
                    path.add(0, person);
                }
                break;
            }
        }

        return path;
    }

    private static class PersonDistance implements Comparable<PersonDistance> {
        Long personId;
        int distance;

        PersonDistance(Long personId, int distance) {
            this.personId = personId;
            this.distance = distance;
        }

        @Override
        public int compareTo(PersonDistance other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    private static class PersonDepth {
        Person person;
        int depth;

        PersonDepth(Person person, int depth) {
            this.person = person;
            this.depth = depth;
        }
    }
}
