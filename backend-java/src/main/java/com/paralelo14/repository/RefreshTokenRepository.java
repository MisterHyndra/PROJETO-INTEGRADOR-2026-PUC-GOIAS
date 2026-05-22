package com.paralelo14.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paralelo14.domain.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByClienteId(String clienteId);
    void deleteByToken(String token);
}
