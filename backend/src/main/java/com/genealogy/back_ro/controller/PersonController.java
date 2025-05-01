package com.genealogy.back_ro.controller;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.model.User;
import com.genealogy.back_ro.repository.UserRepository;
import com.genealogy.back_ro.security.services.UserDetailsImpl;
import com.genealogy.back_ro.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/persons")
public class PersonController {
    @Autowired
    private PersonService personService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public List<Person> getAllPersons() {
        return personService.getAllPersons();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        Optional<Person> person = personService.getPersonById(id);
        return person.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public List<Person> searchPersons(@RequestParam(required = false) String firstName,
                                      @RequestParam(required = false) String lastName) {
        return personService.searchPersonsByName(firstName, lastName);
    }

    @PostMapping
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> createPerson(@RequestBody Person person) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);
        
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Person createdPerson = personService.createPerson(person, currentUser);
        return ResponseEntity.ok(createdPerson);
    }

    @PostMapping("/{id}/photo")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Person> personOpt = personService.getPersonById(id);
            if (personOpt.isPresent()) {
                Person person = personOpt.get();
                person.setPhoto(file.getBytes());
                Person updatedPerson = personService.updatePerson(id, person);
                return ResponseEntity.ok(updatedPerson);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> updatePerson(@PathVariable Long id, @RequestBody Person personDetails) {
        Person updatedPerson = personService.updatePerson(id, personDetails);
        return updatedPerson != null ?
                ResponseEntity.ok(updatedPerson) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{childId}/parents/{parentId}")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> addParent(@PathVariable Long childId, @PathVariable Long parentId) {
        Person updatedPerson = personService.addParent(childId, parentId);
        return updatedPerson != null ?
                ResponseEntity.ok(updatedPerson) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{childId}/parents/{parentId}")
    @PreAuthorize("hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Person> removeParent(@PathVariable Long childId, @PathVariable Long parentId) {
        Person updatedPerson = personService.removeParent(childId, parentId);
        return updatedPerson != null ?
                ResponseEntity.ok(updatedPerson) :
                ResponseEntity.notFound().build();
    }

    @GetMapping("/{parentId}/children")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public List<Person> getChildrenByParentId(@PathVariable Long parentId) {
        return personService.getChildrenByParentId(parentId);
    }

    @GetMapping("/{childId}/parents")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public List<Person> getParentsByChildId(@PathVariable Long childId) {
        return personService.getParentsByChildId(childId);
    }
}
