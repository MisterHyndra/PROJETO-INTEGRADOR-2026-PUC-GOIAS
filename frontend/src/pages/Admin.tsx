import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: string;
  estoque: number;
  origem?: string;
  altitudeM?: number;
  torra: string;
  processo: string;
  imagemUrl?: string;
}

interface Pedido {
  id: string;
  cliente: { nome: string; email: string };
  status: string;
  total: string;
  createdAt: string;
  itens: Array<{
    id: string;
    produto: { nome: string };
    quantidade: number;
    precoUnitario: string;
  }>;
}

interface Stats {
  totalPedidos: number;
  pedidosHoje: number;
  receitaTotal: string;
  totalProdutos: number;
  estoqueBaixo: number;
  pedidosProcessando: number;
}

type AdminTab = 'dashboard' | 'produtos' | 'pedidos';

export function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    estoque: '',
    origem: '',
    altitudeM: '',
    processo: '',
    torra: '',
    descricao: '',
    imagemUrl: '',
  });

  useEffect(() => {
    validarAcesso();
    carregarDados();
  }, []);

  const validarAcesso = () => {
    const cliente = localStorage.getItem('cliente');
    if (!cliente) {
      navigate('/auth');
      return;
    }

    const dados = JSON.parse(cliente);
    if (dados.role !== 'ADMIN') {
      navigate('/');
    }
  };

  const carregarDados = async () => {
    try {
      const [respProdutos, respPedidos, respStats] = await Promise.all([
        api.get('/admin/produtos'),
        api.get('/admin/pedidos'),
        api.get('/admin/stats'),
      ]);
      setProdutos(respProdutos.data);
      setPedidos(respPedidos.data);
      setStats(respStats.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdicionarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
        origem: formData.origem,
        altitudeM: formData.altitudeM ? parseInt(formData.altitudeM) : null,
        processo: formData.processo,
        torra: formData.torra,
        imagemUrl: formData.imagemUrl || null,
      };

      if (editingProduct) {
        await api.put(`/admin/produtos/${editingProduct.id}`, payload);
      } else {
        await api.post('/admin/produtos', payload);
      }

      setFormData({
        nome: '',
        preco: '',
        estoque: '',
        origem: '',
        altitudeM: '',
        processo: '',
        torra: '',
        descricao: '',
        imagemUrl: '',
      });
      setEditingProduct(null);
      setShowForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleEditarProduto = (produto: Produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
      origem: produto.origem || '',
      altitudeM: produto.altitudeM ? String(produto.altitudeM) : '',
      processo: produto.processo || '',
      torra: produto.torra || '',
      descricao: produto.descricao || '',
      imagemUrl: produto.imagemUrl || '',
    });
    setShowForm(true);
  };

  const handleExcluirProduto = async (produtoId: string) => {
    try {
      await api.delete(`/admin/produtos/${produtoId}`);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleAtualizarStatusPedido = async (pedidoId: string, novoStatus: string) => {
    try {
      await api.patch(`/admin/pedidos/${pedidoId}/status`, { status: novoStatus });
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const statusColors: { [key: string]: string } = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-800',
    PROCESSANDO: 'bg-blue-100 text-blue-800',
    SEPARANDO: 'bg-purple-100 text-purple-800',
    ENVIADO: 'bg-cyan-100 text-cyan-800',
    ENTREGUE: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  const statusOptions = [
    'AGUARDANDO_PAGAMENTO',
    'PROCESSANDO',
    'SEPARANDO',
    'ENVIADO',
    'ENTREGUE',
    'CANCELADO',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-espresso font-serif mb-2">Painel Administrativo</h1>
          <p className="text-arabica">Gerencie produtos e pedidos</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border-b-4 border-gold flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-4 font-bold transition-colors ${
              activeTab === 'dashboard'
                ? 'text-gold bg-cream'
                : 'text-espresso hover:text-arabica'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('produtos')}
            className={`px-6 py-4 font-bold transition-colors ${
              activeTab === 'produtos'
                ? 'text-gold bg-cream'
                : 'text-espresso hover:text-arabica'
            }`}
          >
            Produtos ({produtos.length})
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-6 py-4 font-bold transition-colors ${
              activeTab === 'pedidos'
                ? 'text-gold bg-cream'
                : 'text-espresso hover:text-arabica'
            }`}
          >
            Pedidos ({pedidos.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-8">
          {activeTab === 'dashboard' && stats && (
            <div>
              <h2 className="text-3xl font-bold text-espresso mb-8 font-serif">Dashboard</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-cream p-6 rounded-lg border-2 border-parchment">
                  <h3 className="text-lg font-semibold text-espresso mb-2">Total de Pedidos</h3>
                  <p className="text-3xl font-bold text-gold">{stats.totalPedidos}</p>
                </div>
                <div className="bg-cream p-6 rounded-lg border-2 border-parchment">
                  <h3 className="text-lg font-semibold text-espresso mb-2">Pedidos Hoje</h3>
                  <p className="text-3xl font-bold text-gold">{stats.pedidosHoje}</p>
                </div>
                <div className="bg-cream p-6 rounded-lg border-2 border-parchment">
                  <h3 className="text-lg font-semibold text-espresso mb-2">Receita Total</h3>
                  <p className="text-3xl font-bold text-gold">R$ {stats.receitaTotal}</p>
                </div>
                <div className="bg-cream p-6 rounded-lg border-2 border-parchment">
                  <h3 className="text-lg font-semibold text-espresso mb-2">Produtos Ativos</h3>
                  <p className="text-3xl font-bold text-gold">{stats.totalProdutos}</p>
                </div>
                <div className="bg-cream p-6 rounded-lg border-2 border-parchment">
                  <h3 className="text-lg font-semibold text-espresso mb-2">Pedidos Processando</h3>
                  <p className="text-3xl font-bold text-gold">{stats.pedidosProcessando}</p>
                </div>
              </div>

              {stats.estoqueBaixo > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Alerta de Estoque</h3>
                  <p className="text-red-700">{stats.estoqueBaixo} produto(s) com estoque baixo (≤10 unidades)</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-espresso mb-4">Status dos Pedidos</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      pedidos.reduce((acc, pedido) => {
                        acc[pedido.status] = (acc[pedido.status] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                          {status}
                        </span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-espresso mb-4">Pedidos Recentes</h3>
                  <div className="space-y-3">
                    {pedidos.slice(0, 5).map((pedido) => (
                      <div key={pedido.id} className="border border-parchment rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-espresso">{pedido.cliente.nome}</p>
                            <p className="text-sm text-arabica">{new Date(pedido.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gold">R$ {pedido.total}</p>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[pedido.status] || 'bg-gray-100 text-gray-800'}`}>
                              {pedido.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produtos' && (
            <div>
              <div className="mb-8">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-gold text-espresso hover:bg-arabica"
                >
                  {showForm ? 'Cancelar' : '+ Novo Produto'}
                </Button>
              </div>

              {showForm && (
                <form onSubmit={handleAdicionarProduto} className="mb-8 p-6 bg-cream rounded-lg border-2 border-parchment">
                  <h3 className="text-2xl font-bold text-espresso mb-6 font-serif">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Input
                      type="text"
                      name="nome"
                      placeholder="Nome do Produto"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="number"
                      name="preco"
                      placeholder="Preço (R$)"
                      step="0.01"
                      value={formData.preco}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="number"
                      name="estoque"
                      placeholder="Quantidade em Estoque"
                      value={formData.estoque}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      type="text"
                      name="origem"
                      placeholder="Origem do Café"
                      value={formData.origem}
                      onChange={handleInputChange}
                    />
                    <Input
                      type="number"
                      name="altitudeM"
                      placeholder="Altitude (metros)"
                      value={formData.altitudeM}
                      onChange={handleInputChange}
                    />
                    <select
                      name="torra"
                      value={formData.torra}
                      onChange={handleInputChange}
                      className="px-4 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="">Selecione a Torra</option>
                      <option value="Leve">Leve</option>
                      <option value="Média">Média</option>
                      <option value="Escura">Escura</option>
                      <option value="Muito Escura">Muito Escura</option>
                    </select>
                    <select
                      name="processo"
                      value={formData.processo}
                      onChange={handleInputChange}
                      className="px-4 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                    >
                      <option value="">Selecione o Processo</option>
                      <option value="Natural">Natural</option>
                      <option value="Lavado">Lavado</option>
                      <option value="Honey">Honey</option>
                      <option value="Anaeróbico">Anaeróbico</option>
                    </select>
                    <Input
                      type="url"
                      name="imagemUrl"
                      placeholder="URL da Imagem"
                      value={formData.imagemUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <textarea
                    name="descricao"
                    placeholder="Descrição do Produto"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold mb-4 resize-none"
                    rows={4}
                  />

                  <Button type="submit" className="bg-gold text-espresso hover:bg-arabica">
                    {editingProduct ? 'Salvar Alterações' : 'Salvar Produto'}
                  </Button>
                </form>
              )}

              {/* Produtos Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtos.map(produto => (
                  <div key={produto.id} className="border-2 border-parchment rounded-lg p-4 hover:shadow-lg transition-shadow">
                    {produto.imagemUrl && (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="text-lg font-bold text-espresso mb-2 font-serif">{produto.nome}</h4>
                    <div className="space-y-1 mb-4 text-sm text-arabica">
                      <p>Preço: <span className="font-bold text-gold">R$ {Number(produto.preco).toFixed(2)}</span></p>
                      <p>Estoque: <span className="font-bold">{produto.estoque} unidades</span></p>
                      {produto.torra && <p>Torra: <span className="font-bold">{produto.torra}</span></p>}
                      {produto.processo && <p>Processo: <span className="font-bold">{produto.processo}</span></p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditarProduto(produto)}
                        className="w-1/2 text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-1/2 text-sm"
                        onClick={() => handleExcluirProduto(produto.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="space-y-6">
              {pedidos.length === 0 ? (
                <p className="text-center text-arabica py-12">Nenhum pedido encontrado</p>
              ) : (
                pedidos.map(pedido => (
                  <div key={pedido.id} className="border-2 border-parchment rounded-lg p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-arabica">Pedido</p>
                        <p className="font-bold text-espresso">#{pedido.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-arabica">Cliente</p>
                        <p className="font-bold text-espresso">{pedido.cliente.nome}</p>
                        <p className="text-sm text-arabica">{pedido.cliente.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-arabica">Data</p>
                        <p className="font-bold text-espresso">
                          {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 border-t border-parchment pt-4">
                      {pedido.itens.map(item => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-parchment">
                          <div>
                            <p className="text-espresso font-bold">{item.produto.nome}</p>
                            <p className="text-sm text-arabica">Qtd: {item.quantidade}</p>
                          </div>
                          <p className="text-espresso font-bold">
                            R$ {(Number(item.precoUnitario) * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-arabica">Total</p>
                        <p className="text-2xl font-bold text-gold">R$ {Number(pedido.total).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-arabica mb-2">Status</p>
                        <select
                          value={pedido.status}
                          onChange={(e) => handleAtualizarStatusPedido(pedido.id, e.target.value)}
                          className={`w-full px-4 py-2 rounded font-bold focus:outline-none ${statusColors[pedido.status]}`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
