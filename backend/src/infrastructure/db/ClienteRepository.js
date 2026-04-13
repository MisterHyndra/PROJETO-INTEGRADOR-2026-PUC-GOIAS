import prisma from './prismaClient.js';
import { IClienteRepository } from '../../domain/ports/IClienteRepository.js';
import { Cliente } from '../../domain/entities/Cliente.js';

export class ClienteRepository extends IClienteRepository {
  async buscarPorId(id) {
    const data = await prisma.cliente.findUnique({ where: { id }, include: { enderecos: true } });
    if (!data) return null;
    return new Cliente(data);
  }

  async buscarPorEmail(email) {
    const data = await prisma.cliente.findUnique({ where: { email }, include: { enderecos: true } });
    if (!data) return null;
    return new Cliente(data);
  }

  async salvar(dados) {
    const data = await prisma.cliente.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash: dados.senhaHash,
        cpf: dados.cpf,
        telefone: dados.telefone || null,
        role: dados.role || 'CLIENTE',
      },
    });
    return new Cliente(data);
  }

  async atualizar(cliente) {
    const data = await prisma.cliente.update({
      where: { id: cliente.id },
      data: { nome: cliente.nome, telefone: cliente.telefone },
    });
    return new Cliente(data);
  }
}
