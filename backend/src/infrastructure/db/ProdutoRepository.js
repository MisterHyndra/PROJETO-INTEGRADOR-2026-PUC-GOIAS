import prisma from './prismaClient.js';
import { IProdutoRepository } from '../../domain/ports/IProdutoRepository.js';
import { Produto } from '../../domain/entities/Produto.js';

export class ProdutoRepository extends IProdutoRepository {
  async buscarPorId(id) {
    const data = await prisma.produto.findUnique({ where: { id } });
    if (!data) return null;
    return new Produto(data);
  }

  async listar(filtros = {}) {
    const where = { ativo: true };
    if (filtros.torra) where.torra = filtros.torra;
    if (filtros.processo) where.processo = filtros.processo;
    if (filtros.precoMin || filtros.precoMax) {
      where.preco = {};
      if (filtros.precoMin) where.preco.gte = Number(filtros.precoMin);
      if (filtros.precoMax) where.preco.lte = Number(filtros.precoMax);
    }
    const data = await prisma.produto.findMany({ where });
    return data.map((item) => new Produto(item));
  }

  async listarTodos() {
    const data = await prisma.produto.findMany({ orderBy: { nome: 'asc' } });
    return data.map((item) => new Produto(item));
  }

  async salvar(produto) {
    const data = await prisma.produto.create({
      data: {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        estoque: produto.estoque,
        origem: produto.origem,
        altitudeM: produto.altitudeM ? Number(produto.altitudeM) : null,
        processo: produto.processo,
        torra: produto.torra,
        imagemUrl: produto.imagemUrl || null,
        ativo: produto.ativo !== undefined ? produto.ativo : true,
      },
    });
    return new Produto(data);
  }

  async atualizar(produto) {
    const data = await prisma.produto.update({
      where: { id: produto.id },
      data: {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        estoque: produto.estoque !== undefined ? Number(produto.estoque) : undefined,
        origem: produto.origem,
        altitudeM: produto.altitudeM ? Number(produto.altitudeM) : null,
        processo: produto.processo,
        torra: produto.torra,
        imagemUrl: produto.imagemUrl !== undefined ? produto.imagemUrl : undefined,
        ativo: produto.ativo !== undefined ? produto.ativo : undefined,
      },
    });
    return new Produto(data);
  }

  async deletar(id) {
    await prisma.produto.update({ where: { id }, data: { ativo: false } });
  }
}