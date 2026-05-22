package com.paralelo14.messaging;

import java.util.Map;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.paralelo14.service.LojaService;
import com.paralelo14.service.dto.PedidoEvento;

@Component
public class PedidoConsumer {

    private final LojaService lojaService;
    private final RabbitTemplate rabbitTemplate;
    private final PedidoProducer pedidoProducer;

    public PedidoConsumer(LojaService lojaService, RabbitTemplate rabbitTemplate, PedidoProducer pedidoProducer) {
        this.lojaService = lojaService;
        this.rabbitTemplate = rabbitTemplate;
        this.pedidoProducer = pedidoProducer;
    }

    @RabbitListener(queues = RabbitConfig.PEDIDOS_QUEUE)
    public void consume(PedidoEvento evento, Message message) {
        int retries = ((Number) message.getMessageProperties().getHeaders().getOrDefault("x-retries", 0)).intValue();
        try {
            lojaService.processarPedidoFila(evento.pedidoId());
        } catch (Exception ex) {
            if (retries >= 3) {
                rabbitTemplate.convertAndSend(RabbitConfig.DLX, RabbitConfig.DLQ, evento, deadMessage -> {
                    deadMessage.getMessageProperties().getHeaders().putAll(Map.of(
                        "x-retries", retries,
                        "x-error-message", ex.getMessage()
                    ));
                    return deadMessage;
                });
                return;
            }

            rabbitTemplate.convertAndSend(RabbitConfig.PEDIDOS_QUEUE, evento, retryMessage -> {
                retryMessage.getMessageProperties().setHeader("x-retries", retries + 1);
                return retryMessage;
            });
            pedidoProducer.markDisconnected();
        }
    }
}
