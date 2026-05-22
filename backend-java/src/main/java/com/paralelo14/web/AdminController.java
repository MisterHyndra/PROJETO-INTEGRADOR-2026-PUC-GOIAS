package com.paralelo14.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.domain.entity.Pedido;
import com.paralelo14.domain.entity.Produto;
import com.paralelo14.domain.enums.StatusPedido;
import com.paralelo14.service.LojaService;
import com.paralelo14.web.request.AtualizarStatusPedidoRequest;
import com.paralelo14.web.request.ProdutoRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final LojaService lojaService;

    public AdminController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @GetMapping("/produtos")
    public List<Produto> listarProdutos() {
        return lojaService.listarTodosProdutos();
    }

    @PostMapping("/produtos")
    public ResponseEntity<Produto> criarProduto(@Valid @RequestBody ProdutoRequest request) {
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
        return ResponseEntity.status(201).body(lojaService.criarProduto(produto));
    }

    @PutMapping("/produtos/{id}")
    public Produto atualizarProduto(@PathVariable String id, @Valid @RequestBody ProdutoRequest request) {
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
        return lojaService.atualizarProduto(id, produto);
    }

    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable String id) {
        lojaService.removerProduto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return lojaService.listarPedidos(null, true);
    }

    @PatchMapping("/pedidos/{id}/status")
    public Pedido atualizarStatus(@PathVariable String id, @Valid @RequestBody AtualizarStatusPedidoRequest request) {
        return lojaService.atualizarStatusPedido(id, StatusPedido.valueOf(request.status()), "ADMIN");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        return ResponseEntity.ok(lojaService.dashboardStats());
    }
}
