package com.paralelo14.web.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PedidoItemRequest(
    @NotBlank String produtoId,
    @NotNull @Min(1) Integer quantidade
) {
}
