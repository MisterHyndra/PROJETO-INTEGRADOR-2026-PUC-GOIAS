import express from 'express';
import { ProdutoRepository } from '../../infrastructure/db/ProdutoRepository.js';
import { ListarProdutosUseCase } from '../../application/ListarProdutosUseCase.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const produtoRepository = new ProdutoRepository();
const listarProdutos = new ListarProdutosUseCase(produtoRepository);

// GET /api/produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await listarProdutos.execute(req.query);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/produtos/:id
router.get('/:id', async (req, res) => {
  try {
    const produto = await produtoRepository.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/produtos - Criar novo produto (Admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, origem, altitudeM, processo, torra, imagemUrl } = req.body;
    
    if (!nome || !preco || !estoque) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const novoProduto = {
      nome,
      descricao,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      origem,
      altitudeM: altitudeM ? parseInt(altitudeM) : null,
      processo,
      torra,
      imagemUrl,
      ativo: true
    };

    const produto = await produtoRepository.salvar(novoProduto);
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/produtos/:id - Atualizar produto (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const produto = await produtoRepository.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    const atualizado = { ...produto, ...req.body, id: req.params.id };
    const resultado = await produtoRepository.atualizar(atualizado);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/produtos/:id - Deletar produto (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const produto = await produtoRepository.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    await produtoRepository.deletar(req.params.id);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;