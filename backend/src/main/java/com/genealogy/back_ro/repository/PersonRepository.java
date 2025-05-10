package com.genealogy.back_ro.repository;

import com.genealogy.back_ro.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    @Query("SELECT p FROM Person p JOIN p.parents parent WHERE parent.id = :parentId")
    List<Person> findChildrenByParentId(@Param("parentId") Long parentId);

    @Query("SELECT p FROM Person p JOIN p.children child WHERE child.id = :childId")
    List<Person> findParentsByChildId(@Param("childId") Long childId);

    @Query("SELECT DISTINCT p FROM Person p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) AND LOWER(p.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    List<Person> findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(@Param("firstName") String firstName, @Param("lastName") String lastName);

    @Query("SELECT DISTINCT p FROM Person p WHERE LOWER(p.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    List<Person> findByLastNameContainingIgnoreCase(@Param("lastName") String lastName);
}
