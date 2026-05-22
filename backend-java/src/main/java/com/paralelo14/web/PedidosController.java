package com.paralelo14.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.domain.entity.Pedido;
import com.paralelo14.domain.enums.StatusPedido;
import com.paralelo14.service.LojaService;
import com.paralelo14.service.dto.CriarPedidoInput;
import com.paralelo14.service.dto.PedidoItemInput;
import com.paralelo14.web.request.AtualizarStatusLegadoRequest;
import com.paralelo14.web.request.AtualizarStatusPedidoRequest;
import com.paralelo14.web.request.CriarPedidoRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
@Validated
public class PedidosController {

    private final LojaService lojaService;

    public PedidosController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(Authentication authentication, @RequestAttribute("userId") String userId,
                                        @Valid @RequestBody CriarPedidoRequest request) {
        CriarPedidoInput input = new CriarPedidoInput(
            userId,
            request.itens().stream().map(item -> new PedidoItemInput(item.produtoId(), item.quantidade())).toList(),
            request.tipoFrete(),
            request.metodoPagamento()
        );
        return ResponseEntity.status(202).body(lojaService.criarPedido(input));
    }

    @GetMapping
    public List<Pedido> listar(Authentication authentication, @RequestAttribute("userId") String userId) {
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return lojaService.listarPedidos(userId, admin);
    }

    @GetMapping("/{id}")
    public Pedido buscarPorId(Authentication authentication, @RequestAttribute("userId") String userId, @PathVariable String id) {
        Pedido pedido = lojaService.buscarPedidoPorId(id);
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin && !pedido.getCliente().getId().equals(userId)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Acesso negado");
        }
        return pedido;
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Pedido atualizarStatus(@PathVariable String id, @Valid @RequestBody AtualizarStatusPedidoRequest request) {
        return lojaService.atualizarStatusPedido(id, StatusPedido.valueOf(request.status()), "ADMIN");
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Pedido atualizarStatusLegado(@PathVariable String id, @Valid @RequestBody AtualizarStatusLegadoRequest request) {
        return lojaService.atualizarStatusPedido(id, StatusPedido.valueOf(request.novoStatus()), "ADMIN");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(Authentication authentication, @RequestAttribute("userId") String userId, @PathVariable String id) {
        Pedido pedido = lojaService.buscarPedidoPorId(id);
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin && !pedido.getCliente().getId().equals(userId)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Acesso negado");
        }
        lojaService.cancelarPedido(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Pedido cancelado com sucesso"));
    }
}
