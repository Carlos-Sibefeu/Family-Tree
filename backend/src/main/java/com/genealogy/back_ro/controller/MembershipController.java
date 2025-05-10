package com.genealogy.back_ro.controller;

import com.genealogy.back_ro.model.MembershipRequest;
import com.genealogy.back_ro.payload.request.MembershipRequestDto;
import com.genealogy.back_ro.payload.response.MessageResponse;
import com.genealogy.back_ro.security.services.UserDetailsImpl;
import com.genealogy.back_ro.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    /**
     * Crée une nouvelle demande d'adhésion
     */
    @PostMapping("/request")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createMembershipRequest(@Valid @RequestBody MembershipRequestDto requestDto) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            MembershipRequest request = membershipService.createMembershipRequest(userDetails.getId(), requestDto.getMessage());
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Récupère l'historique des demandes de l'utilisateur connecté
     */
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyRequests() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<MembershipRequest> requests = membershipService.getUserRequests(userDetails.getId());
        return ResponseEntity.ok(requests);
    }

    /**
     * Vérifie l'éligibilité de l'utilisateur pour faire une demande d'adhésion
     */
    @GetMapping("/check-eligibility")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> checkEligibility() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map<String, Object> eligibility = membershipService.checkEligibility(userDetails.getId());
        return ResponseEntity.ok(eligibility);
    }

    /**
     * Récupère toutes les demandes en attente (pour les administrateurs)
     */
    @GetMapping("/pending-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingRequests() {
        List<MembershipRequest> pendingRequests = membershipService.getAllPendingRequests();
        return ResponseEntity.ok(pendingRequests);
    }

    /**
     * Approuve une demande d'adhésion
     */
    @PutMapping("/approve/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveMembershipRequest(@PathVariable Long requestId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            MembershipRequest approvedRequest = membershipService.approveMembershipRequest(requestId, userDetails.getId());
            return ResponseEntity.ok(approvedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Rejette une demande d'adhésion
     */
    @PutMapping("/reject/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectMembershipRequest(@PathVariable Long requestId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            MembershipRequest rejectedRequest = membershipService.rejectMembershipRequest(requestId, userDetails.getId());
            return ResponseEntity.ok(rejectedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
