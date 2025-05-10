package com.genealogy.back_ro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "membership_requests")
public class MembershipRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MembershipStatus status;
    
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;
    
    @Column(name = "response_date")
    private LocalDateTime responseDate;
    
    @Column(name = "message", length = 500)
    private String message;
    
    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
    
    // Enum pour le statut de la demande
    public enum MembershipStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
    
    // Constructeur par défaut
    public MembershipRequest() {
    }
    
    // Constructeur avec paramètres essentiels
    public MembershipRequest(User user, String message) {
        this.user = user;
        this.message = message;
        this.status = MembershipStatus.PENDING;
        this.requestDate = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public MembershipStatus getStatus() {
        return status;
    }
    
    public void setStatus(MembershipStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }
    
    public LocalDateTime getResponseDate() {
        return responseDate;
    }
    
    public void setResponseDate(LocalDateTime responseDate) {
        this.responseDate = responseDate;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public User getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}
