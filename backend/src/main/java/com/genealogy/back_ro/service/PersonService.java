package com.genealogy.back_ro.service;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.User;
import com.genealogy.back_ro.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {

    @Autowired
    private GenealogySearchService genealogySearchService;

    @Autowired
    private PersonRepository personRepository;

    public List<Person> findRelationshipPath(Long person1Id, Long person2Id) {
        return genealogySearchService.findRelationshipPath(person1Id, person2Id);
    }

    public Person findCommonAncestor(Long person1Id, Long person2Id) {
        return genealogySearchService.findCommonAncestor(person1Id, person2Id);
    }

    public List<Person> findDescendants(Long personId, int maxDepth) {
        return genealogySearchService.findDescendants(personId, maxDepth);
    }

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }

    public Person savePerson(Person person) {
        return personRepository.save(person);
    }

    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    @Transactional
    public Person updatePerson(Long id, Person updatedPerson) {
        Person existingPerson = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found"));

        existingPerson.setFirstName(updatedPerson.getFirstName());
        existingPerson.setLastName(updatedPerson.getLastName());
        existingPerson.setBirthDate(updatedPerson.getBirthDate());
        existingPerson.setDeathDate(updatedPerson.getDeathDate());
        existingPerson.setBirthPlace(updatedPerson.getBirthPlace());
        existingPerson.setPhoto(updatedPerson.getPhoto());
        existingPerson.setBiography(updatedPerson.getBiography());

        return personRepository.save(existingPerson);
    }

    @Transactional
    public Person addParent(Long childId, Long parentId) {
        Person child = personRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        Person parent = personRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        child.addParent(parent);
        return personRepository.save(child);
    }

    @Transactional
    public Person removeParent(Long childId, Long parentId) {
        Person child = personRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        Person parent = personRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        child.removeParent(parent);
        return personRepository.save(child);
    }

    public List<Person> getChildrenByParentId(Long parentId) {
        return personRepository.findChildrenByParentId(parentId);
    }

    public List<Person> getParentsByChildId(Long childId) {
        return personRepository.findParentsByChildId(childId);
    }

    public List<Person> searchPersonsByName(String firstName, String lastName) {
        if (firstName != null && !firstName.isEmpty() && lastName != null && !lastName.isEmpty()) {
            return personRepository.findByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase(firstName, lastName);
        } else if (lastName != null && !lastName.isEmpty()) {
            return personRepository.findByLastNameContainingIgnoreCase(lastName);
        } else {
            return List.of();
        }
    }

    @Transactional
    public Person createPerson(Person person, User currentUser) {
        person.setCreatedBy(currentUser);
        return personRepository.save(person);
    }
}
