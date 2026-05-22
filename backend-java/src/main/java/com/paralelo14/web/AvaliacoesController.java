package com.paralelo14.web;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.service.LojaService;
import com.paralelo14.web.request.AvaliacaoRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/avaliacoes")
@Validated
public class AvaliacoesController {

    private final LojaService lojaService;

    public AvaliacoesController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping
    public ResponseEntity<?> avaliar(@RequestAttribute("userId") String userId,
                                     @Valid @RequestBody AvaliacaoRequest request) {
        return ResponseEntity.status(201).body(
            lojaService.avaliarProduto(userId, request.produtoId(), request.nota(), request.comentario())
        );
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<?> listar(@PathVariable String produtoId) {
        return ResponseEntity.ok(lojaService.listarAvaliacoesPorProduto(produtoId));
    }
}
