export class Avaliacao {
  constructor({ id, clienteId, produtoId, nota, comentario = null, createdAt }) {
    if (nota < 1 || nota > 5) throw new Error('Nota deve ser entre 1 e 5');
    this.id = id;
    this.clienteId = clienteId;
    this.produtoId = produtoId;
    this.nota = nota;
    this.comentario = comentario;
    this.createdAt = createdAt;
  }
}
