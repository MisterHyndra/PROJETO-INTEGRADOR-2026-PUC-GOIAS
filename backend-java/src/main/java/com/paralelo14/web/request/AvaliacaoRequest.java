package com.paralelo14.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AvaliacaoRequest(
    @NotBlank String produtoId,
    @NotNull @Min(1) @Max(5) Integer nota,
    String comentario
) {
}
