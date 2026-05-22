package com.paralelo14.web;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paralelo14.messaging.PedidoProducer;

@RestController
public class HealthController {

    private final PedidoProducer pedidoProducer;

    public HealthController(PedidoProducer pedidoProducer) {
        this.pedidoProducer = pedidoProducer;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> messaging = new java.util.HashMap<>();
        messaging.put("connected", pedidoProducer.isConnected());
        messaging.put("mode", "rabbitmq");

        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("status", "ok");
        payload.put("timestamp", LocalDateTime.now());
        payload.put("messaging", messaging);

        return ResponseEntity.ok(payload);
    }
}
