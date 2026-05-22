package com.paralelo14.service.dto;

public record DashboardStats(long totalPedidos, long pedidosHoje, String receitaTotal, long totalProdutos,
                             long estoqueBaixo, long pedidosProcessando, boolean mensageriaAtiva) {
}
