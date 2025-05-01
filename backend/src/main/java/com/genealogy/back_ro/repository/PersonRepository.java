package com.genealogy.back_ro.repository;

import com.genealogy.back_ro.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByLastNameContainingIgnoreCase(String lastName);
    
    List<Person> findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(String firstName, String lastName);
    
    @Query("SELECT p FROM Person p WHERE p.id IN (SELECT r.person2.id FROM Relationship r WHERE r.person1.id = :personId)")
    List<Person> findRelatedPersons(@Param("personId") Long personId);
    
    @Query("SELECT p FROM Person p JOIN p.parents parent WHERE parent.id = :parentId")
    List<Person> findChildrenByParentId(@Param("parentId") Long parentId);
    
    @Query("SELECT p FROM Person p WHERE p.id IN (SELECT parent.id FROM Person child JOIN child.parents parent WHERE child.id = :childId)")
    List<Person> findParentsByChildId(@Param("childId") Long childId);
}
