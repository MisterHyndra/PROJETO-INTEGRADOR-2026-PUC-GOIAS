package com.paralelo14.service.dto;

import java.util.List;

public record CriarPedidoInput(String clienteId, List<PedidoItemInput> itens, String tipoFrete, String metodoPagamento) {
}
