package com.paralelo14.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.paralelo14.service.dto.PedidoEvento;

@Component
public class PedidoProducer {

    private final RabbitTemplate rabbitTemplate;
    private volatile boolean connected = true;

    public PedidoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(PedidoEvento evento) {
        rabbitTemplate.convertAndSend(RabbitConfig.PEDIDOS_QUEUE, evento, message -> {
            message.getMessageProperties().setHeader("x-retries", 0);
            return message;
        });
        connected = true;
    }

    public boolean isConnected() {
        return connected;
    }

    public void markDisconnected() {
        connected = false;
    }
}
