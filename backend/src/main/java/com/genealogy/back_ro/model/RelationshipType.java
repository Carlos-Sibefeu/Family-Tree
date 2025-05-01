package com.genealogy.back_ro.model;

public enum RelationshipType {
    PARENT_CHILD(1),       // Relation parent-enfant (poids 1)
    GRANDPARENT(2),        // Relation grand-parent (poids 2)
    SIBLING(2),            // Relation frère/sœur (poids 2)
    UNCLE_AUNT(3),         // Relation oncle/tante (poids 3)
    COUSIN(4),             // Relation cousin (poids 4)
    SPOUSE(1);             // Relation conjoint (poids 1)

    private final int defaultWeight;

    RelationshipType(int defaultWeight) {
        this.defaultWeight = defaultWeight;
    }

    public int getDefaultWeight() {
        return defaultWeight;
    }
}
