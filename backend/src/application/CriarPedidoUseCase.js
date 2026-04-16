import { SedexStrategy, PACStrategy, RetiradaStrategy } from '../domain/strategies/FreteStrategy.js';

export class CriarPedidoUseCase {
  constructor(pedidoRepository, produtoRepository, publisher = null) {
    this.pedidoRepository = pedidoRepository;
    this.produtoRepository = produtoRepository;
    this.publisher = publisher;
  }

  async execute({ clienteId, itens, tipoFrete = 'PAC', metodoPagamento }) {
    const estrategias = {
      SEDEX: new SedexStrategy(),
      PAC: new PACStrategy(),
      RETIRADA: new RetiradaStrategy(),
    };
    const estrategia = estrategias[tipoFrete] || estrategias['PAC'];

    let subtotal = 0;
    const itensEnriquecidos = [];

    for (const item of itens) {
      const produto = await this.produtoRepository.buscarPorId(item.produtoId);
      if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);
      if (produto.estoque < item.quantidade)
        throw new Error(`Estoque insuficiente para: ${produto.nome}`);

      const precoUnitario = Number(produto.preco);
      subtotal += precoUnitario * item.quantidade;
      itensEnriquecidos.push({ ...item, precoUnitario });
    }

    const frete = estrategia.calcular();
    const total = subtotal + frete;

    const pedido = await this.pedidoRepository.salvar({
      clienteId,
      status: 'PROCESSANDO',
      subtotal: subtotal.toFixed(2),
      frete: frete.toFixed(2),
      total: total.toFixed(2),
      metodoPagamento: metodoPagamento || 'CARTAO',
      tipoFrete,
      itens: itensEnriquecidos,
    });

    // Publish to RabbitMQ – graceful fallback if unavailable
    if (this.publisher) {
      try {
        await this.publisher.publishPedido({
          pedidoId: pedido.id,
          clienteId: pedido.clienteId,
        });
      } catch (err) {
        console.warn('Aviso: falha ao publicar na fila RabbitMQ:', err.message);
      }
    }

    return pedido;
  }
}
