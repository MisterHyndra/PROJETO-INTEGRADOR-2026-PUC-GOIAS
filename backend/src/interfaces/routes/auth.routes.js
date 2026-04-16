import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ClienteRepository } from '../../infrastructure/db/ClienteRepository.js';
import { CriarClienteUseCase } from '../../application/CriarClienteUseCase.js';
import { AutenticarClienteUseCase } from '../../application/AutenticarClienteUseCase.js';
import prisma from '../../infrastructure/db/prismaClient.js';

dotenv.config({ quiet: true });

const router = express.Router();
const clienteRepo = new ClienteRepository();
const criarCliente = new CriarClienteUseCase(clienteRepo);
const autenticar = new AutenticarClienteUseCase(clienteRepo);

// POST /api/auth/register (alias para signup)
router.post('/register', async (req, res) => {
  try {
    const result = await criarCliente.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status =
      error.message.includes('já cadastrado') ||
      error.message.includes('Unique constraint failed')
        ? 409
        : 400;
    res.status(status).json({ message: error.message });
  }
});

// POST /api/auth/signup (rota antiga)
router.post('/signup', async (req, res) => {
  try {
    const result = await criarCliente.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status =
      error.message.includes('já cadastrado') ||
      error.message.includes('Unique constraint failed')
        ? 409
        : 400;
    res.status(status).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await autenticar.execute({ email, senha });
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }

    const persisted = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { cliente: true },
    });

    if (!persisted || persisted.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
    }

    const token = jwt.sign(
      {
        id: persisted.cliente.id,
        email: persisted.cliente.email,
        role: persisted.cliente.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      token,
      cliente: {
        id: persisted.cliente.id,
        nome: persisted.cliente.nome,
        email: persisted.cliente.email,
        role: persisted.cliente.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
