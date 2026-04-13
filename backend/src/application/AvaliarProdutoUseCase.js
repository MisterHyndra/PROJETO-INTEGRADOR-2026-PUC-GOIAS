export class AvaliarProdutoUseCase {
  constructor(avaliacaoRepository) {
    this.avaliacaoRepository = avaliacaoRepository;
  }

  async execute({ clienteId, produtoId, nota, comentario }) {
    if (nota < 1 || nota > 5) throw new Error('Nota deve ser entre 1 e 5');

    const existente = await this.avaliacaoRepository.buscarPorClienteEProduto(clienteId, produtoId);

    if (existente) {
      existente.nota = nota;
      existente.comentario = comentario || null;
      return await this.avaliacaoRepository.atualizar(existente);
    }

    return await this.avaliacaoRepository.salvar({ clienteId, produtoId, nota, comentario });
  }
}
