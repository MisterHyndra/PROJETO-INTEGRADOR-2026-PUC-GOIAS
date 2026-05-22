package com.paralelo14.domain.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "avaliacoes", uniqueConstraints = @UniqueConstraint(columnNames = { "clienteId", "produtoId" }))
public class Avaliacao extends AbstractStringIdEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "clienteId", nullable = false)
    private Cliente cliente;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produtoId", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer nota;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersistAvaliacao() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
