package com.genealogy.back_ro.controller;

import com.genealogy.back_ro.service.GraphAlgorithmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/graph")
public class GraphAlgorithmController {
    @Autowired
    private GraphAlgorithmService graphAlgorithmService;

    @GetMapping("/relationship")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findRelationshipPath(
            @RequestParam Long person1Id,
            @RequestParam Long person2Id) {
        Map<String, Object> result = graphAlgorithmService.findRelationshipPath(person1Id, person2Id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/relationships/all")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> findAllRelationshipPaths(
            @RequestParam Long person1Id,
            @RequestParam Long person2Id,
            @RequestParam(defaultValue = "10") int maxDepth) {
        List<Map<String, Object>> result = graphAlgorithmService.findAllRelationshipPaths(person1Id, person2Id, maxDepth);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/mst/prim")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findMinimumSpanningTree() {
        Map<String, Object> result = graphAlgorithmService.findMinimumSpanningTree();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/mst/kruskal")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findMinimumSpanningTreeKruskal() {
        Map<String, Object> result = graphAlgorithmService.findMinimumSpanningTreeKruskal();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/family-groups")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> findFamilyGroups() {
        List<Map<String, Object>> result = graphAlgorithmService.findFamilyGroups();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/common-ancestor")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findClosestCommonAncestor(
            @RequestParam Long person1Id,
            @RequestParam Long person2Id) {
        Map<String, Object> result = graphAlgorithmService.findClosestCommonAncestor(person1Id, person2Id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/descendants")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findAllDescendants(
            @RequestParam Long personId,
            @RequestParam(defaultValue = "5") int maxDepth) {
        Map<String, Object> result = graphAlgorithmService.findAllDescendants(personId, maxDepth);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/closest-cousin")
    @PreAuthorize("hasRole('USER') or hasRole('EDITOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findClosestCousin(
            @RequestParam Long personId) {
        Map<String, Object> result = graphAlgorithmService.findClosestCousin(personId);
        return ResponseEntity.ok(result);
    }
}
