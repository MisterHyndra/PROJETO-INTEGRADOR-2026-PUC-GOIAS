package com.paralelo14.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paralelo14.domain.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, String> {
    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByCpf(String cpf);
}
