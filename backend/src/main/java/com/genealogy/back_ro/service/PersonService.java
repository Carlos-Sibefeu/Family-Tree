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
    private PersonRepository personRepository;

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
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

    @Transactional
    public Person updatePerson(Long id, Person personDetails) {
        return personRepository.findById(id)
                .map(person -> {
                    person.setFirstName(personDetails.getFirstName());
                    person.setLastName(personDetails.getLastName());
                    person.setBirthDate(personDetails.getBirthDate());
                    person.setDeathDate(personDetails.getDeathDate());
                    person.setBirthPlace(personDetails.getBirthPlace());
                    person.setBiography(personDetails.getBiography());
                    if (personDetails.getPhoto() != null) {
                        person.setPhoto(personDetails.getPhoto());
                    }
                    return personRepository.save(person);
                })
                .orElse(null);
    }

    @Transactional
    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    @Transactional
    public Person addParent(Long childId, Long parentId) {
        Person child = personRepository.findById(childId).orElse(null);
        Person parent = personRepository.findById(parentId).orElse(null);
        
        if (child != null && parent != null) {
            child.addParent(parent);
            return personRepository.save(child);
        }
        
        return null;
    }

    @Transactional
    public Person removeParent(Long childId, Long parentId) {
        Person child = personRepository.findById(childId).orElse(null);
        Person parent = personRepository.findById(parentId).orElse(null);
        
        if (child != null && parent != null) {
            child.removeParent(parent);
            return personRepository.save(child);
        }
        
        return null;
    }

    public List<Person> getChildrenByParentId(Long parentId) {
        return personRepository.findChildrenByParentId(parentId);
    }

    public List<Person> getParentsByChildId(Long childId) {
        return personRepository.findParentsByChildId(childId);
    }
}
