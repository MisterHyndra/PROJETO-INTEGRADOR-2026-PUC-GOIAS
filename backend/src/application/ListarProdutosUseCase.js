export class ListarProdutosUseCase {
  constructor(produtoRepository) {
    this.produtoRepository = produtoRepository;
  }

  async execute(filtros = {}) {
    return await this.produtoRepository.listar(filtros);
  }
}