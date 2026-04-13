export class ListarAvaliacoesPorProdutoUseCase {
  constructor(avaliacaoRepository) {
    this.avaliacaoRepository = avaliacaoRepository;
  }

  async execute(produtoId) {
    const avaliacoes = await this.avaliacaoRepository.listarPorProduto(produtoId);
    const media =
      avaliacoes.length > 0
        ? avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length
        : 0;
    return { avaliacoes, media: Number(media.toFixed(1)), total: avaliacoes.length };
  }
}
