package com.paralelo14.web;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.domain.entity.Produto;
import com.paralelo14.service.LojaService;
import com.paralelo14.service.dto.ProdutoFiltro;
import com.paralelo14.web.request.ProdutoRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/produtos")
@Validated
public class ProdutosController {

    private final LojaService lojaService;

    public ProdutosController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @GetMapping
    public List<Produto> listar(
        @RequestParam(required = false) String torra,
        @RequestParam(required = false) String processo,
        @RequestParam(required = false) BigDecimal precoMin,
        @RequestParam(required = false) BigDecimal precoMax
    ) {
        return lojaService.listarProdutos(new ProdutoFiltro(torra, processo, precoMin, precoMax));
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable String id) {
        return lojaService.buscarProdutoPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest request) {
        return ResponseEntity.status(201).body(lojaService.criarProduto(toEntity(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Produto atualizar(@PathVariable String id, @Valid @RequestBody ProdutoRequest request) {
        return lojaService.atualizarProduto(id, toEntity(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable String id) {
        lojaService.removerProduto(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Produto deletado com sucesso"));
    }

    private Produto toEntity(ProdutoRequest request) {
        Produto produto = new Produto();
        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setPreco(request.preco());
        produto.setEstoque(request.estoque());
        produto.setOrigem(request.origem());
        produto.setAltitudeM(request.altitudeM());
        produto.setProcesso(request.processo());
        produto.setTorra(request.torra());
        produto.setImagemUrl(request.imagemUrl());
        produto.setAtivo(request.ativo());
        return produto;
    }
}
