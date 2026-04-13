import prisma from './prismaClient.js';
import { IAvaliacaoRepository } from '../../domain/ports/IAvaliacaoRepository.js';
import { Avaliacao } from '../../domain/entities/Avaliacao.js';

export class AvaliacaoRepository extends IAvaliacaoRepository {
  async salvar(dados) {
    const data = await prisma.avaliacao.create({
      data: {
        clienteId: dados.clienteId,
        produtoId: dados.produtoId,
        nota: dados.nota,
        comentario: dados.comentario || null,
      },
      include: { cliente: { select: { nome: true } } },
    });
    return new Avaliacao(data);
  }

  async buscarPorClienteEProduto(clienteId, produtoId) {
    const data = await prisma.avaliacao.findUnique({
      where: { clienteId_produtoId: { clienteId, produtoId } },
    });
    if (!data) return null;
    return new Avaliacao(data);
  }

  async listarPorProduto(produtoId) {
    return await prisma.avaliacao.findMany({
      where: { produtoId },
      include: { cliente: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async atualizar(avaliacao) {
    const data = await prisma.avaliacao.update({
      where: { clienteId_produtoId: { clienteId: avaliacao.clienteId, produtoId: avaliacao.produtoId } },
      data: { nota: avaliacao.nota, comentario: avaliacao.comentario },
      include: { cliente: { select: { nome: true } } },
    });
    return new Avaliacao(data);
  }
}
