package com.genealogy.back_ro.controller;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.service.GenealogySearchService;
import com.genealogy.back_ro.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genealogy")
@CrossOrigin(origins = "*")
public class GenealogyController {

    @Autowired
    private GenealogySearchService genealogySearchService;

    @Autowired
    private PersonService personService;

    @GetMapping("/relationship")
    public ResponseEntity<List<Person>> findRelationship(
            @RequestParam Long person1Id,
            @RequestParam Long person2Id) {
        List<Person> path = genealogySearchService.findRelationshipPath(person1Id, person2Id);
        return ResponseEntity.ok(path);
    }

    @GetMapping("/common-ancestor")
    public ResponseEntity<Person> findCommonAncestor(
            @RequestParam Long person1Id,
            @RequestParam Long person2Id) {
        Person ancestor = genealogySearchService.findCommonAncestor(person1Id, person2Id);
        if (ancestor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ancestor);
    }

    @GetMapping("/descendants")
    public ResponseEntity<List<Person>> findDescendants(
            @RequestParam Long personId,
            @RequestParam(defaultValue = "3") int maxDepth) {
        List<Person> descendants = genealogySearchService.findDescendants(personId, maxDepth);
        return ResponseEntity.ok(descendants);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Person>> searchPersons(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        List<Person> persons = personService.searchPersonsByName(firstName, lastName);
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/children/{parentId}")
    public ResponseEntity<List<Person>> getChildren(@PathVariable Long parentId) {
        List<Person> children = personService.getChildrenByParentId(parentId);
        return ResponseEntity.ok(children);
    }

    @GetMapping("/parents/{childId}")
    public ResponseEntity<List<Person>> getParents(@PathVariable Long childId) {
        List<Person> parents = personService.getParentsByChildId(childId);
        return ResponseEntity.ok(parents);
    }

    @PostMapping("/parent")
    public ResponseEntity<Person> addParent(
            @RequestParam Long childId,
            @RequestParam Long parentId) {
        Person updatedPerson = personService.addParent(childId, parentId);
        if (updatedPerson == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPerson);
    }

    @DeleteMapping("/parent")
    public ResponseEntity<Person> removeParent(
            @RequestParam Long childId,
            @RequestParam Long parentId) {
        Person updatedPerson = personService.removeParent(childId, parentId);
        if (updatedPerson == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPerson);
    }
}
