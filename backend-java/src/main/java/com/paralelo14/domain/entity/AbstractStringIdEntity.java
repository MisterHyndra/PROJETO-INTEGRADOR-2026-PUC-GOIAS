package com.paralelo14.domain.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class AbstractStringIdEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @PrePersist
    protected void assignIdIfNecessary() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
    }
}
