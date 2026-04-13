import express from 'express';
import { AvaliacaoRepository } from '../../infrastructure/db/AvaliacaoRepository.js';
import { AvaliarProdutoUseCase } from '../../application/AvaliarProdutoUseCase.js';
import { ListarAvaliacoesPorProdutoUseCase } from '../../application/ListarAvaliacoesPorProdutoUseCase.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const avaliacaoRepo = new AvaliacaoRepository();
const avaliar = new AvaliarProdutoUseCase(avaliacaoRepo);
const listarAvaliacoes = new ListarAvaliacoesPorProdutoUseCase(avaliacaoRepo);

// POST /api/avaliacoes — rate a product (auth required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { produtoId, nota, comentario } = req.body;
    const avaliacao = await avaliar.execute({
      clienteId: req.user.id,
      produtoId,
      nota: Number(nota),
      comentario,
    });
    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/avaliacoes/produto/:produtoId — public
router.get('/produto/:produtoId', async (req, res) => {
  try {
    const result = await listarAvaliacoes.execute(req.params.produtoId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
