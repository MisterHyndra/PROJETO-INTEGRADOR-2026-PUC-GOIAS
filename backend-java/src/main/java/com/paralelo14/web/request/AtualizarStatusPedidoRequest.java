package com.paralelo14.web.request;

import jakarta.validation.constraints.NotBlank;

public record AtualizarStatusPedidoRequest(@NotBlank String status) {
}
