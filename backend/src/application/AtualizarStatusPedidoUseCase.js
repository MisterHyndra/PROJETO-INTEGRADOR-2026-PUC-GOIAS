export class AtualizarStatusPedidoUseCase {
  constructor(pedidoRepository, socketAdapter = null) {
    this.pedidoRepository = pedidoRepository;
    this.socketAdapter = socketAdapter;
  }

  async execute({ pedidoId, novoStatus, origem = 'ADMIN' }) {
    const pedido = await this.pedidoRepository.buscarPorId(pedidoId);
    if (!pedido) throw new Error('Pedido não encontrado');

    pedido.atualizarStatus(novoStatus);
    const atualizado = await this.pedidoRepository.atualizarStatus(pedido.id, novoStatus, origem);

    // Notify via WebSocket (Observer Pattern)
    if (this.socketAdapter) {
      this.socketAdapter.emitirStatusPedido(pedidoId, novoStatus, pedido.clienteId);
    }

    return atualizado;
  }
}
