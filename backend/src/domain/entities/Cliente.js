export class Cliente {
  constructor({
    id,
    nome,
    email,
    senhaHash,
    cpf,
    telefone = null,
    enderecos = [],
  }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senhaHash = senhaHash;
    this.cpf = cpf;
    this.telefone = telefone;
    this.enderecos = enderecos;
  }

  adicionarEndereco(endereco) {
    this.enderecos.push(endereco);
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}