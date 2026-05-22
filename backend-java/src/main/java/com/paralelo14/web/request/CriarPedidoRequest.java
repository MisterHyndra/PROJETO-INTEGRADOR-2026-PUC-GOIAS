package com.paralelo14.web.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record CriarPedidoRequest(
    @NotEmpty List<@Valid PedidoItemRequest> itens,
    String tipoFrete,
    String metodoPagamento
) {
}
