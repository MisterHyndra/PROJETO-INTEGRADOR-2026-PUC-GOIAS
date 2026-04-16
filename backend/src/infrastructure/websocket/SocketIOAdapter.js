export class SocketIOAdapter {
  constructor(io) {
    this.io = io;
  }

  emitirStatusPedido(pedidoId, status, clienteId = null) {
    const payload = { pedidoId, status, timestamp: new Date() };
    this.io.emit(`pedido:${pedidoId}:status`, payload);
    this.io.emit('pedido:status:updated', payload);

    if (clienteId) {
      this.io.to(`cliente:${clienteId}`).emit('pedido:status:updated', payload);
    }
  }

  emitirParaCliente(clienteId, evento, dados) {
    this.io.to(`cliente:${clienteId}`).emit(evento, dados);
  }

  configurar() {
    this.io.on('connection', (socket) => {
      console.log('Cliente WebSocket conectado:', socket.id);

      socket.on('entrar:sala', (clienteId) => {
        socket.join(`cliente:${clienteId}`);
      });

      socket.on('disconnect', () => {
        console.log('Cliente WebSocket desconectado:', socket.id);
      });
    });
  }
}
