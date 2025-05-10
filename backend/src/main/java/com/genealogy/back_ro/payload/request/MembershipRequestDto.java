package com.genealogy.back_ro.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MembershipRequestDto {
    
    @NotBlank
    @Size(max = 500)
    private String message;
    
    // Constructeur par défaut
    public MembershipRequestDto() {
    }
    
    // Constructeur avec paramètres
    public MembershipRequestDto(String message) {
        this.message = message;
    }
    
    // Getters et Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
