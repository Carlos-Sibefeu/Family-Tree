package com.genealogy.back_ro.service;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.Relationship;
import com.genealogy.back_ro.model.RelationshipType;
import com.genealogy.back_ro.repository.PersonRepository;
import com.genealogy.back_ro.repository.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RelationshipService {
    @Autowired
    private RelationshipRepository relationshipRepository;

    @Autowired
    private PersonRepository personRepository;

    public List<Relationship> getAllRelationships() {
        return relationshipRepository.findAll();
    }

    public Optional<Relationship> getRelationshipById(Long id) {
        return relationshipRepository.findById(id);
    }

    public List<Relationship> getRelationshipsForPerson(Long personId) {
        return relationshipRepository.findAllRelationshipsForPerson(personId);
    }

    public List<Relationship> getRelationshipsBetweenPersons(Long person1Id, Long person2Id) {
        return relationshipRepository.findRelationshipsBetweenPersons(person1Id, person2Id);
    }

    @Transactional
    public Relationship createRelationship(Relationship relationship) {
        return relationshipRepository.save(relationship);
    }

    @Transactional
    public Relationship createRelationship(Long person1Id, Long person2Id, RelationshipType type, Integer weight) {
        Person person1 = personRepository.findById(person1Id).orElse(null);
        Person person2 = personRepository.findById(person2Id).orElse(null);
        
        if (person1 != null && person2 != null) {
            // Vérifier si la relation existe déjà
            Optional<Relationship> existingRelationship = 
                relationshipRepository.findByPerson1AndPerson2AndType(person1, person2, type);
            
            if (existingRelationship.isPresent()) {
                // Mettre à jour le poids si nécessaire
                Relationship rel = existingRelationship.get();
                if (weight != null && !weight.equals(rel.getWeight())) {
                    rel.setWeight(weight);
                    return relationshipRepository.save(rel);
                }
                return rel;
            } else {
                // Créer une nouvelle relation
                Relationship newRelationship = new Relationship(person1, person2, type, 
                    weight != null ? weight : type.getDefaultWeight());
                return relationshipRepository.save(newRelationship);
            }
        }
        
        return null;
    }

    @Transactional
    public Relationship updateRelationship(Long id, Relationship relationshipDetails) {
        return relationshipRepository.findById(id)
                .map(relationship -> {
                    relationship.setType(relationshipDetails.getType());
                    relationship.setWeight(relationshipDetails.getWeight());
                    return relationshipRepository.save(relationship);
                })
                .orElse(null);
    }

    @Transactional
    public void deleteRelationship(Long id) {
        relationshipRepository.deleteById(id);
    }

    @Transactional
    public void deleteRelationshipBetweenPersons(Long person1Id, Long person2Id, RelationshipType type) {
        Person person1 = personRepository.findById(person1Id).orElse(null);
        Person person2 = personRepository.findById(person2Id).orElse(null);
        
        if (person1 != null && person2 != null) {
            Optional<Relationship> relationship = 
                relationshipRepository.findByPerson1AndPerson2AndType(person1, person2, type);
            
            relationship.ifPresent(rel -> relationshipRepository.delete(rel));
        }
    }
}
