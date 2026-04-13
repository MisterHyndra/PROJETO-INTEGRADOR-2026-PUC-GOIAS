import express from 'express';
import { ProdutoRepository } from '../../infrastructure/db/ProdutoRepository.js';
import { PedidoRepository } from '../../infrastructure/db/PedidoRepository.js';
import { AtualizarStatusPedidoUseCase } from '../../application/AtualizarStatusPedidoUseCase.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const produtoRepo = new ProdutoRepository();
const pedidoRepo = new PedidoRepository();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// GET /api/admin/produtos — all products (including inactive)
router.get('/produtos', async (req, res) => {
  try {
    const produtos = await produtoRepo.listarTodos();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/produtos — create product
router.post('/produtos', async (req, res) => {
  try {
    const produto = await produtoRepo.salvar(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/admin/produtos/:id — update product
router.put('/produtos/:id', async (req, res) => {
  try {
    const produto = await produtoRepo.atualizar({ id: req.params.id, ...req.body });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/admin/produtos/:id — soft delete
router.delete('/produtos/:id', async (req, res) => {
  try {
    await produtoRepo.deletar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────

// GET /api/admin/pedidos — all orders
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await pedidoRepo.listarTodos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/admin/pedidos/:id/status — update order status
router.patch('/pedidos/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const socketAdapter = req.app.locals.socketAdapter;
    const useCase = new AtualizarStatusPedidoUseCase(pedidoRepo, socketAdapter);
    const pedido = await useCase.execute({ pedidoId: req.params.id, novoStatus: status });
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const pedidos = await pedidoRepo.listarTodos();
    const produtos = await produtoRepo.listarTodos();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const pedidosHoje = pedidos.filter((p) => new Date(p.createdAt) >= hoje);
    const receitaTotal = pedidos
      .filter((p) => p.status !== 'CANCELADO')
      .reduce((sum, p) => sum + Number(p.total), 0);
    const estoqueBaixo = produtos.filter((p) => p.estoque <= 10 && p.ativo);
    const pedidosProcessando = pedidos.filter((p) => p.status === 'PROCESSANDO').length;
    res.json({
      totalPedidos: pedidos.length,
      pedidosHoje: pedidosHoje.length,
      receitaTotal: receitaTotal.toFixed(2),
      totalProdutos: produtos.filter((p) => p.ativo).length,
      estoqueBaixo: estoqueBaixo.length,
      pedidosProcessando,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
