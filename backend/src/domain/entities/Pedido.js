export class Pedido {
  constructor({
    id,
    clienteId,
    status = 'AGUARDANDO_PAGAMENTO',
    itens = [],
    subtotal = 0,
    frete = 0,
    total = 0,
  }) {
    this.id = id;
    this.clienteId = clienteId;
    this.status = status;
    this.itens = itens;
    this.subtotal = subtotal;
    this.frete = frete;
    this.total = total;
  }

  calcularTotal() {
    this.total = Number((this.subtotal + this.frete).toFixed(2));
    return this.total;
  }

  atualizarStatus(novoStatus) {
    const statusValidos = [
      'AGUARDANDO_PAGAMENTO',
      'PROCESSANDO',
      'SEPARANDO',
      'ENVIADO',
      'ENTREGUE',
      'CANCELADO',
    ];

    if (!statusValidos.includes(novoStatus)) {
      throw new Error(`Status inválido: ${novoStatus}`);
    }

    this.status = novoStatus;
  }
}