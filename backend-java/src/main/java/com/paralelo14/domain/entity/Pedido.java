package com.paralelo14.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.paralelo14.domain.enums.StatusPedido;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "pedidos")
public class Pedido extends AbstractStringIdEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "clienteId", nullable = false)
    private Cliente cliente;

    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "\"StatusPedido\"")
    private StatusPedido status = StatusPedido.AGUARDANDO_PAGAMENTO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal frete;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "metodoPagamento")
    private String metodoPagamento;

    @Column(name = "tipoFrete")
    private String tipoFrete;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    @OrderBy("createdAt ASC")
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PedidoStatusHistorico> historicoStatus = new LinkedHashSet<>();

    @PrePersist
    void prePersistPedido() {
        LocalDateTime agora = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = agora;
        }
        updatedAt = agora;
    }

    @PreUpdate
    void preUpdatePedido() {
        updatedAt = LocalDateTime.now();
    }
}
