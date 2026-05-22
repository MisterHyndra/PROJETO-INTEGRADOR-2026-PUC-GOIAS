package com.paralelo14.service.dto;

public record AuthResult(String token, String refreshToken, ClienteResumo cliente) {
}
