package com.paralelo14.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paralelo14.domain.entity.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, String> {
    List<Produto> findByAtivoTrueOrderByNomeAsc();
    List<Produto> findByAtivoTrueAndTorraIgnoreCaseOrderByNomeAsc(String torra);
    List<Produto> findByAtivoTrueAndProcessoIgnoreCaseOrderByNomeAsc(String processo);
    List<Produto> findByAtivoTrueAndPrecoBetweenOrderByNomeAsc(BigDecimal precoMin, BigDecimal precoMax);
    List<Produto> findAllByOrderByNomeAsc();
}
