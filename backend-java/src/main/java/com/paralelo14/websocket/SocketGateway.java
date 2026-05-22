package com.paralelo14.websocket;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;

@Component
public class SocketGateway implements InitializingBean, DisposableBean {

    private final SocketIOServer server;
    private final Map<UUID, String> clients = new ConcurrentHashMap<>();

    public SocketGateway(
        @Value("${app.socket.host:0.0.0.0}") String host,
        @Value("${app.socket.port:3002}") int port,
        @Value("${app.socket.allowed-origin:http://localhost:5173}") String allowedOrigin
    ) {
        Configuration configuration = new Configuration();
        configuration.setHostname(host);
        configuration.setPort(port);
        configuration.setOrigin(allowedOrigin);
        this.server = new SocketIOServer(configuration);
    }

    @Override
    public void afterPropertiesSet() {
        server.addConnectListener(client -> clients.put(client.getSessionId(), client.getSessionId().toString()));
        server.addDisconnectListener(client -> clients.remove(client.getSessionId()));
        server.addEventListener("entrar:sala", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String clienteId, AckRequest ackRequest) {
                client.joinRoom("cliente:" + clienteId);
            }
        });
        server.start();
    }

    public void emitirStatusPedido(String pedidoId, String status, String clienteId) {
        Map<String, Object> payload = Map.of(
            "pedidoId", pedidoId,
            "status", status,
            "timestamp", LocalDateTime.now().toString()
        );
        server.getBroadcastOperations().sendEvent("pedido:" + pedidoId + ":status", payload);
        server.getBroadcastOperations().sendEvent("pedido:status:updated", payload);
        if (clienteId != null) {
            server.getRoomOperations("cliente:" + clienteId).sendEvent("pedido:status:updated", payload);
        }
    }

    @Override
    public void destroy() {
        server.stop();
    }
}
