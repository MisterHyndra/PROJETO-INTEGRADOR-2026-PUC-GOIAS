import { Pedido } from '../src/domain/entities/Pedido.js';

describe('Pedido', () => {
  it('deve calcular total com subtotal e frete', () => {
    const pedido = new Pedido({
      id: '1',
      clienteId: 'cliente1',
      subtotal: 100.00,
      frete: 20.00,
    });

    pedido.calcularTotal();

    expect(pedido.total).toBe(120.00);
  });

  it('deve lançar erro para status inválido', () => {
    const pedido = new Pedido({
      id: '1',
      clienteId: 'cliente1',
    });

    expect(() => pedido.atualizarStatus('INVALIDO')).toThrow('Status inválido');
  });

  it('deve atualizar status corretamente', () => {
    const pedido = new Pedido({
      id: '1',
      clienteId: 'cliente1',
      status: 'AGUARDANDO_PAGAMENTO',
    });

    pedido.atualizarStatus('PROCESSANDO');

    expect(pedido.status).toBe('PROCESSANDO');
  });
});