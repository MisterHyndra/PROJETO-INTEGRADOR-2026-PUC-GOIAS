package com.paralelo14.service.dto;

import java.math.BigDecimal;

public record ProdutoFiltro(String torra, String processo, BigDecimal precoMin, BigDecimal precoMax) {
}
