import { Produto } from '../src/domain/entities/Produto.js';

describe('Produto', () => {
  it('deve reduzir estoque corretamente', () => {
    const produto = new Produto({
      id: '1',
      nome: 'Café Especial',
      preco: 50.00,
      estoque: 10,
      ativo: true
    });

    produto.reduzirEstoque(3);

    expect(produto.estoque).toBe(7);
  });

  it('deve lançar erro se estoque insuficiente', () => {
    const produto = new Produto({
      id: '1',
      nome: 'Café Especial',
      preco: 50.00,
      estoque: 5,
      ativo: true
    });

    expect(() => produto.reduzirEstoque(10)).toThrow('Estoque insuficiente');
  });
});