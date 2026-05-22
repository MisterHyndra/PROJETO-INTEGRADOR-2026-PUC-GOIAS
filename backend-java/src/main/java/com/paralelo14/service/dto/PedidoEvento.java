package com.paralelo14.service.dto;

import java.io.Serializable;

public record PedidoEvento(String pedidoId, String clienteId) implements Serializable {
	private static final long serialVersionUID = 1L;
}
