export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  origem?: string;
  altitudeM?: number;
  processo?: string;
  torra?: string;
  imagemUrl?: string;
  ativo: boolean;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  enderecos: Endereco[];
}

export interface Endereco {
  id: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  status: 'AGUARDANDO_PAGAMENTO' | 'PROCESSANDO' | 'SEPARANDO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  itens: ItemPedido[];
  subtotal: number;
  frete: number;
  total: number;
  metodoPagamento?: string;
  createdAt: string;
  updatedAt: string;
}