export class Produto {
  constructor({
    id,
    nome,
    descricao,
    preco,
    estoque,
    origem,
    altitudeM,
    processo,
    torra,
    imagemUrl,
    ativo = true
  }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.estoque = estoque;
    this.origem = origem;
    this.altitudeM = altitudeM;
    this.processo = processo;
    this.torra = torra;
    this.imagemUrl = imagemUrl;
    this.ativo = ativo;
  }

  reduzirEstoque(quantidade) {
    if (this.estoque < quantidade) {
      throw new Error('Estoque insuficiente');
    }
    this.estoque -= quantidade;
  }
}