import express from 'express';
import { ClienteRepository } from '../../infrastructure/db/ClienteRepository.js';
import { CriarClienteUseCase } from '../../application/CriarClienteUseCase.js';
import { AutenticarClienteUseCase } from '../../application/AutenticarClienteUseCase.js';

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
    const status = error.message.includes('já cadastrado') ? 409 : 400;
    res.status(status).json({ message: error.message });
  }
});

// POST /api/auth/signup (rota antiga)
router.post('/signup', async (req, res) => {
  try {
    const result = await criarCliente.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    const status = error.message.includes('já cadastrado') ? 409 : 400;
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

export default router;
