import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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
      { expiresIn: '7d' }
    );

    return {
      token,
      cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, role: cliente.role },
    };
  }
}
