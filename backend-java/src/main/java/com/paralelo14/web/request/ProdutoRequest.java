package com.paralelo14.web.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProdutoRequest(
    @NotBlank String nome,
    String descricao,
    @NotNull BigDecimal preco,
    @NotNull @Min(0) Integer estoque,
    String origem,
    Integer altitudeM,
    String processo,
    String torra,
    String imagemUrl,
    Boolean ativo
) {
}
