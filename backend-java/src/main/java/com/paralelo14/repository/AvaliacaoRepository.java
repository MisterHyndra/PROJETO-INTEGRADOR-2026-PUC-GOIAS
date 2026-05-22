package com.paralelo14.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.paralelo14.domain.entity.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, String> {

    @EntityGraph(attributePaths = {"cliente"})
    List<Avaliacao> findByProdutoIdOrderByCreatedAtDesc(String produtoId);

    Optional<Avaliacao> findByClienteIdAndProdutoId(String clienteId, String produtoId);
}
