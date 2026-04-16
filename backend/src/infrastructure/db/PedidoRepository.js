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
        historicoStatus: {
          create: {
            status: dados.status || 'AGUARDANDO_PAGAMENTO',
            origem: dados.origemStatus || 'API',
          },
        },
      },
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
    });
    return new Pedido(data);
  }

  async buscarPorId(id) {
    const data = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!data) return null;
    return new Pedido(data);
  }

  async listarPorCliente(clienteId) {
    const data = await prisma.pedido.findMany({
      where: { clienteId },
      include: {
        itens: { include: { produto: true } },
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((p) => new Pedido(p));
  }

  async buscarPorClienteId(clienteId) {
    return this.listarPorCliente(clienteId);
  }

  async listarTodos() {
    const data = await prisma.pedido.findMany({
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return data.map((p) => new Pedido(p));
  }

  async buscarTodos() {
    return this.listarTodos();
  }

  async atualizar(pedido) {
    const data = await prisma.pedido.update({
      where: { id: pedido.id },
      data: { status: pedido.status },
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
    });
    return new Pedido(data);
  }

  async atualizarStatus(id, status, origem = 'ADMIN') {
    const data = await prisma.pedido.update({
      where: { id },
      data: {
        status,
        historicoStatus: {
          create: {
            status,
            origem,
          },
        },
      },
      include: {
        itens: { include: { produto: true } },
        cliente: true,
        historicoStatus: { orderBy: { createdAt: 'asc' } },
      },
    });

    return new Pedido(data);
  }

  async deletar(id) {
    return prisma.pedido.update({
      where: { id },
      data: {
        status: 'CANCELADO',
        historicoStatus: {
          create: {
            status: 'CANCELADO',
            origem: 'API',
          },
        },
      },
    });
  }
}
