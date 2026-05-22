package com.paralelo14.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.paralelo14.domain.entity.Cliente;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationInMillis;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-minutes:15}") long expirationMinutes) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationInMillis = expirationMinutes * 60_000;
    }

    public String generateToken(Cliente cliente) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationInMillis);

        return Jwts.builder()
            .subject(cliente.getId())
            .claim("id", cliente.getId())
            .claim("email", cliente.getEmail())
            .claim("role", cliente.getRole().name())
            .issuedAt(now)
            .expiration(expiry)
            .signWith(signingKey)
            .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith((javax.crypto.SecretKey) signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public UserDetails toSpringUser(String token) {
        Claims claims = extractAllClaims(token);
        String role = String.valueOf(claims.get("role"));
        return User.withUsername(claims.getSubject())
            .password("")
            .authorities("ROLE_" + role)
            .build();
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }
}
