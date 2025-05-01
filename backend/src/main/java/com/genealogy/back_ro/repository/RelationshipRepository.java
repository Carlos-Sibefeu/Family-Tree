package com.genealogy.back_ro.repository;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.Relationship;
import com.genealogy.back_ro.model.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findByPerson1(Person person1);
    
    List<Relationship> findByPerson2(Person person2);
    
    List<Relationship> findByPerson1AndType(Person person1, RelationshipType type);
    
    List<Relationship> findByPerson2AndType(Person person2, RelationshipType type);
    
    Optional<Relationship> findByPerson1AndPerson2AndType(Person person1, Person person2, RelationshipType type);
    
    @Query("SELECT r FROM Relationship r WHERE (r.person1.id = :personId OR r.person2.id = :personId)")
    List<Relationship> findAllRelationshipsForPerson(@Param("personId") Long personId);
    
    @Query("SELECT r FROM Relationship r WHERE (r.person1.id = :person1Id AND r.person2.id = :person2Id) OR (r.person1.id = :person2Id AND r.person2.id = :person1Id)")
    List<Relationship> findRelationshipsBetweenPersons(@Param("person1Id") Long person1Id, @Param("person2Id") Long person2Id);
}
