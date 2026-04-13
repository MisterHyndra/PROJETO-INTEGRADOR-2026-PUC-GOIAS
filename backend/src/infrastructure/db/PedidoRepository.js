import prisma from './prismaClient.js';
import { IPedidoRepository } from '../../domain/ports/IPedidoRepository.js';
import { Pedido } from '../../domain/entities/Pedido.js';

export class PedidoRepository extends IPedidoRepository {
  async salvar(dados) {
    const data = await prisma.pedido.create({
      data: {
        clienteId: dados.clienteId,
        status: dados.status || 'AGUARDANDO_PAGAMENTO',
        subtotal: dados.subtotal,
        frete: dados.frete,
        total: dados.total,
        metodoPagamento: dados.metodoPagamento || null,
        tipoFrete: dados.tipoFrete || null,
        itens: {
          create: dados.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
        },
      },
      include: { itens: { include: { produto: true } }, cliente: true },
    });
    return new Pedido(data);
  }

  async buscarPorId(id) {
    const data = await prisma.pedido.findUnique({
      where: { id },
      include: { itens: { include: { produto: true } }, cliente: true },
    });
    if (!data) return null;
    return new Pedido(data);
  }

  async listarPorCliente(clienteId) {
    const data = await prisma.pedido.findMany({
      where: { clienteId },
      include: { itens: { include: { produto: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((p) => new Pedido(p));
  }

  async listarTodos() {
    const data = await prisma.pedido.findMany({
      include: { itens: { include: { produto: true } }, cliente: true },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((p) => new Pedido(p));
  }

  async atualizar(pedido) {
    const data = await prisma.pedido.update({
      where: { id: pedido.id },
      data: { status: pedido.status },
      include: { itens: { include: { produto: true } }, cliente: true },
    });
    return new Pedido(data);
  }
}
