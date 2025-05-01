package com.genealogy.back_ro.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "persons")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    private LocalDate birthDate;

    private LocalDate deathDate;

    @Size(max = 255)
    private String birthPlace;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] photo;

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

    // Méthodes utilitaires pour ajouter/supprimer des relations
    public void addParent(Person parent) {
        this.parents.add(parent);
        parent.getChildren().add(this);
    }

    public void removeParent(Person parent) {
        this.parents.remove(parent);
        parent.getChildren().remove(this);
    }

    public void addChild(Person child) {
        this.children.add(child);
        child.getParents().add(this);
    }

    public void removeChild(Person child) {
        this.children.remove(child);
        child.getParents().remove(this);
    }
}
