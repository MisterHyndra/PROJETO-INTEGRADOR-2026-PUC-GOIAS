package com.paralelo14.web.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
    @NotBlank String nome,
    @Email @NotBlank String email,
    @NotBlank String senha,
    @NotBlank String cpf,
    String telefone
) {
}
