import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import prisma from '../infrastructure/db/prismaClient.js';
dotenv.config({ quiet: true });

export class AutenticarClienteUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute({ email, senha }) {
    const cliente = await this.clienteRepository.buscarPorEmail(email);
    if (!cliente) throw new Error('Credenciais inválidas');

    const senhaOk = await bcrypt.compare(senha, cliente.senhaHash);
    if (!senhaOk) throw new Error('Credenciais inválidas');

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email, role: cliente.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.deleteMany({ where: { clienteId: cliente.id } });
    await prisma.refreshToken.create({
      data: {
        clienteId: cliente.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      token,
      refreshToken,
      cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, role: cliente.role },
    };
  }
}
