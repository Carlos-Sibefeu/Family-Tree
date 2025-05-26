package com.genealogy.back_ro.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.*;

/**
 * Entité représentant une personne dans l'arbre généalogique.
 * Cette classe modélise les informations personnelles et les relations familiales
 * pour permettre l'application des algorithmes de graphe dans l'analyse des liens de parenté.
 *
 * @author Équipe Family-Tree
 * @version 1.0
 */
@Entity
@Table(name = "persons")
public class Person {
    /**
     * Identifiant unique de la personne
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Prénom de la personne
     * Ne peut pas être vide et limité à 100 caractères
     */
    @NotBlank
    @Size(max = 100)
    private String firstName;

    /**
     * Nom de famille de la personne
     * Ne peut pas être vide et limité à 100 caractères
     */
    @NotBlank
    @Size(max = 100)
    private String lastName;

    /**
     * Date de naissance de la personne
     */
    private LocalDate birthDate;

    /**
     * Date de décès de la personne (null si vivante)
     */
    private LocalDate deathDate;

    /**
     * Lieu de naissance de la personne
     */
    @Size(max = 255)
    private String birthPlace;

    /**
     * Photo de la personne stockée sous forme de tableau d'octets
     */
    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] photo;

    /**
     * Biographie ou notes sur la personne
     */
    @Size(max = 1000)
    private String biography;

    // Relation parent-enfant (parents de cette personne)
    @ManyToMany
    @JoinTable(
        name = "person_parents",
        joinColumns = @JoinColumn(name = "child_id"),
        inverseJoinColumns = @JoinColumn(name = "parent_id")
    )
    private Set<Person> parents = new HashSet<>();

    // Relation parent-enfant (enfants de cette personne)
    @ManyToMany(mappedBy = "parents")
    private Set<Person> children = new HashSet<>();

    // Relation avec l'utilisateur qui a créé cette personne
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Relations avec d'autres personnes (pour les algorithmes de graphe)
    @ManyToMany
    @JoinTable(
        name = "person_relationships",
        joinColumns = @JoinColumn(name = "person1_id"),
        inverseJoinColumns = @JoinColumn(name = "person2_id")
    )
    private Set<Person> relatedPersons = new HashSet<>();

    @ElementCollection
    @CollectionTable(
        name = "person_relationship_types",
        joinColumns = @JoinColumn(name = "person_id")
    )
    @Column(name = "relationship_type")
    private Set<String> relationshipTypes = new HashSet<>();

    @ElementCollection
    @CollectionTable(
        name = "person_relationship_weights",
        joinColumns = @JoinColumn(name = "person_id")
    )
    @Column(name = "relationship_weight")
    private Map<Long, Integer> relationshipWeights = new HashMap<>();

    // Constructeurs
    public Person() {
    }

    public Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public LocalDate getDeathDate() {
        return deathDate;
    }

    public void setDeathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public Set<Person> getParents() {
        return parents;
    }

    public void setParents(Set<Person> parents) {
        this.parents = parents;
    }

    public Set<Person> getChildren() {
        return children;
    }

    public void setChildren(Set<Person> children) {
        this.children = children;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Méthodes utilitaires pour gérer les relations familiales
     */
    
    /**
     * Ajoute un parent à cette personne et met à jour la relation bidirectionnelle
     * 
     * @param parent La personne à ajouter comme parent
     */
    public void addParent(Person parent) {
        this.parents.add(parent);
        parent.getChildren().add(this);
    }

    /**
     * Supprime un parent de cette personne et met à jour la relation bidirectionnelle
     * 
     * @param parent La personne à retirer des parents
     */
    public void removeParent(Person parent) {
        this.parents.remove(parent);
        parent.getChildren().remove(this);
    }

    /**
     * Ajoute un enfant à cette personne et met à jour la relation bidirectionnelle
     * 
     * @param child La personne à ajouter comme enfant
     */
    public void addChild(Person child) {
        this.children.add(child);
        child.getParents().add(this);
    }

    /**
     * Supprime un enfant de cette personne et met à jour la relation bidirectionnelle
     * 
     * @param child La personne à retirer des enfants
     */
    public void removeChild(Person child) {
        this.children.remove(child);
        child.getParents().remove(this);
    }
}
