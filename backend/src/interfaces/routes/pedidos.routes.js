import express from 'express';
import { PedidoRepository } from '../../infrastructure/db/PedidoRepository.js';
import { ProdutoRepository } from '../../infrastructure/db/ProdutoRepository.js';
import { CriarPedidoUseCase } from '../../application/CriarPedidoUseCase.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const pedidoRepo = new PedidoRepository();
const produtoRepo = new ProdutoRepository();

// POST /api/pedidos — create order (auth required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itens, tipoFrete, metodoPagamento } = req.body;
    if (!itens || itens.length === 0)
      return res.status(400).json({ message: 'Carrinho vazio' });

    const criarPedido = new CriarPedidoUseCase(pedidoRepo, produtoRepo, req.app.locals.publisher);
    const pedido = await criarPedido.execute({
      clienteId: req.user.id,
      itens,
      tipoFrete,
      metodoPagamento,
    });
    res.status(202).json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/pedidos — list user orders or all orders (if admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'ADMIN') {
      // Admin pode ver todos os pedidos
      const pedidos = await pedidoRepo.buscarTodos();
      res.json(pedidos);
    } else {
      // Usuário vê apenas seus pedidos
      const pedidos = await pedidoRepo.buscarPorClienteId(req.user.id);
      res.json(pedidos);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/pedidos/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pedido = await pedidoRepo.buscarPorId(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
    if (pedido.clienteId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Acesso negado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/pedidos/:id — update order status (admin)
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status é obrigatório' });

    const pedido = await pedidoRepo.atualizarStatus(req.params.id, status);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/pedidos/:id/status — update order status (admin - rota antiga)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { novoStatus } = req.body;
    if (!novoStatus) return res.status(400).json({ message: 'Status é obrigatório' });

    const pedido = await pedidoRepo.atualizarStatus(req.params.id, novoStatus);
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/pedidos/:id — cancel order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pedido = await pedidoRepo.buscarPorId(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
    if (pedido.clienteId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Acesso negado' });

    await pedidoRepo.deletar(req.params.id);
    res.json({ message: 'Pedido cancelado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
