package com.paralelo14.web;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.domain.entity.Cliente;
import com.paralelo14.service.LojaService;
import com.paralelo14.web.request.LoginRequest;
import com.paralelo14.web.request.LogoutRequest;
import com.paralelo14.web.request.RefreshRequest;
import com.paralelo14.web.request.SignupRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final LojaService lojaService;

    public AuthController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping({"/register", "/signup"})
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(201).body(
            lojaService.cadastrarCliente(request.nome(), request.email(), request.senha(), request.cpf(), request.telefone())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(lojaService.autenticar(request.email(), request.senha()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication, @RequestAttribute("userId") String userId) {
        Cliente cliente = lojaService.buscarClientePorId(userId);
        return ResponseEntity.ok(Map.of(
            "id", cliente.getId(),
            "nome", cliente.getNome(),
            "email", cliente.getEmail(),
            "cpf", cliente.getCpf(),
            "telefone", cliente.getTelefone(),
            "role", cliente.getRole().name()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
        var result = lojaService.refresh(request.refreshToken());
        return ResponseEntity.ok(Map.of(
            "token", result.token(),
            "refreshToken", result.refreshToken(),
            "cliente", result.cliente()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) LogoutRequest request) {
        lojaService.logout(request == null ? null : request.refreshToken());
        return ResponseEntity.noContent().build();
    }
}
