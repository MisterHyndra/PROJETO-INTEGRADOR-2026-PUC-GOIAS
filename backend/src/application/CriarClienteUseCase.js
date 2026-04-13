import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export class CriarClienteUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute({ nome, email, senha, cpf, telefone }) {
    const existing = await this.clienteRepository.buscarPorEmail(email);
    if (existing) throw new Error('E-mail já cadastrado');

    const senhaHash = await bcrypt.hash(senha, 12);
    const cliente = await this.clienteRepository.salvar({ nome, email, senhaHash, cpf, telefone });

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email, role: cliente.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, role: cliente.role },
    };
  }
}
