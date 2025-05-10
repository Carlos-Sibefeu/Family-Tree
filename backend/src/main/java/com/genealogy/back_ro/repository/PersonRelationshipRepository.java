package com.genealogy.back_ro.repository;

import com.genealogy.back_ro.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRelationshipRepository extends JpaRepository<Person, Long> {
    List<Person> findByRelatedPersons(Person person);
    List<Person> findByRelationshipTypesContaining(String relationshipType);
    List<Person> findByRelationshipWeightsContainingKey(Long personId);
}
