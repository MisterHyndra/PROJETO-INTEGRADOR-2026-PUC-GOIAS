export class AtualizarStatusPedidoUseCase {
  constructor(pedidoRepository, socketAdapter = null) {
    this.pedidoRepository = pedidoRepository;
    this.socketAdapter = socketAdapter;
  }

  async execute({ pedidoId, novoStatus }) {
    const pedido = await this.pedidoRepository.buscarPorId(pedidoId);
    if (!pedido) throw new Error('Pedido não encontrado');

    pedido.atualizarStatus(novoStatus);
    const atualizado = await this.pedidoRepository.atualizar(pedido);

    // Notify via WebSocket (Observer Pattern)
    if (this.socketAdapter) {
      this.socketAdapter.emitirStatusPedido(pedidoId, novoStatus);
    }

    return atualizado;
  }
}
