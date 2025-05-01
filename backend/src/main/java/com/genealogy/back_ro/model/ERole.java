package com.genealogy.back_ro.model;

public enum ERole {
    ROLE_USER,       // Accès en lecture seule
    ROLE_EDITOR,     // Accès en lecture et écriture
    ROLE_ADMIN       // Accès complet avec gestion des utilisateurs
}
