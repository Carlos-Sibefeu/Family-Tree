package com.genealogy.back_ro.controller;

import com.genealogy.back_ro.model.Person;
import com.genealogy.back_ro.service.GenealogySearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genealogy")
@CrossOrigin(origins = "*")
public class GenealogySearchController {

    @Autowired
    private GenealogySearchService genealogySearchService;

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
}
