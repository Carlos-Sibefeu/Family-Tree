package com.genealogy.back_ro.service;

import com.genealogy.back_ro.model.ERole;
import com.genealogy.back_ro.model.MembershipRequest;
import com.genealogy.back_ro.model.Role;
import com.genealogy.back_ro.model.User;
import com.genealogy.back_ro.repository.MembershipRequestRepository;
import com.genealogy.back_ro.repository.RoleRepository;
import com.genealogy.back_ro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MembershipService {

    @Autowired
    private MembershipRequestRepository membershipRequestRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    /**
     * Crée une nouvelle demande d'adhésion
     */
    public MembershipRequest createMembershipRequest(Long userId, String message) {
        // Vérifier si l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier si l'utilisateur a déjà une demande en attente
        if (membershipRequestRepository.existsByUserAndStatus(user, MembershipRequest.MembershipStatus.PENDING)) {
            throw new RuntimeException("Vous avez déjà une demande d'adhésion en attente");
        }
        
        // Créer la demande
        MembershipRequest request = new MembershipRequest(user, message);
        return membershipRequestRepository.save(request);
    }

    /**
     * Récupère toutes les demandes d'adhésion en attente
     */
    public List<MembershipRequest> getAllPendingRequests() {
        return membershipRequestRepository.findByStatus(MembershipRequest.MembershipStatus.PENDING);
    }

    /**
     * Récupère l'historique des demandes d'un utilisateur
     */
    public List<MembershipRequest> getUserRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return membershipRequestRepository.findByUser(user);
    }

    /**
     * Approuve une demande d'adhésion
     */
    @Transactional
    public MembershipRequest approveMembershipRequest(Long requestId, Long adminId) {
        MembershipRequest request = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        
        // Vérifier si la demande est en attente
        if (request.getStatus() != MembershipRequest.MembershipStatus.PENDING) {
            throw new RuntimeException("Cette demande a déjà été traitée");
        }
        
        // Mettre à jour le statut de la demande
        request.setStatus(MembershipRequest.MembershipStatus.APPROVED);
        request.setResponseDate(LocalDateTime.now());
        request.setReviewedBy(admin);
        
        // Ajouter le rôle d'éditeur à l'utilisateur
        User user = request.getUser();
        Role editorRole = roleRepository.findByName(ERole.ROLE_EDITOR)
                .orElseThrow(() -> new RuntimeException("Rôle d'éditeur non trouvé"));
        
        Set<Role> userRoles = user.getRoles();
        userRoles.add(editorRole);
        user.setRoles(userRoles);
        
        userRepository.save(user);
        return membershipRequestRepository.save(request);
    }

    /**
     * Rejette une demande d'adhésion
     */
    @Transactional
    public MembershipRequest rejectMembershipRequest(Long requestId, Long adminId) {
        MembershipRequest request = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));
        
        // Vérifier si la demande est en attente
        if (request.getStatus() != MembershipRequest.MembershipStatus.PENDING) {
            throw new RuntimeException("Cette demande a déjà été traitée");
        }
        
        // Mettre à jour le statut de la demande
        request.setStatus(MembershipRequest.MembershipStatus.REJECTED);
        request.setResponseDate(LocalDateTime.now());
        request.setReviewedBy(admin);
        
        return membershipRequestRepository.save(request);
    }

    /**
     * Vérifie si un utilisateur a une demande en attente
     */
    public boolean hasPendingRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return membershipRequestRepository.existsByUserAndStatus(user, MembershipRequest.MembershipStatus.PENDING);
    }
    
    /**
     * Vérifie si un utilisateur est éligible pour faire une demande d'adhésion
     */
    public Map<String, Object> checkEligibility(Long userId) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier si l'utilisateur a déjà le rôle d'éditeur
        boolean isEditor = user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_EDITOR);
        
        // Vérifier s'il a une demande en attente
        boolean hasPendingRequest = membershipRequestRepository.existsByUserAndStatus(
                user, MembershipRequest.MembershipStatus.PENDING);
        
        result.put("eligible", !isEditor && !hasPendingRequest);
        result.put("isEditor", isEditor);
        result.put("hasPendingRequest", hasPendingRequest);
        
        return result;
    }
}
