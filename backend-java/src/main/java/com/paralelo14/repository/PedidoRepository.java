package com.paralelo14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.paralelo14.domain.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, String> {

    @Override
    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    java.util.Optional<Pedido> findById(String id);

    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    List<Pedido> findByClienteIdOrderByCreatedAtDesc(String clienteId);

    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    List<Pedido> findAllByOrderByCreatedAtDesc();

    @Override
    @EntityGraph(attributePaths = {"cliente", "itens", "itens.produto"})
    List<Pedido> findAll();
}
