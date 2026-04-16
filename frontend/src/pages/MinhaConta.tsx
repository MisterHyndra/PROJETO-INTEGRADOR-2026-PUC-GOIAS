import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { api, authAPI } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  role: string;
}

interface Pedido {
  id: string;
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

export function MinhaConta() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dados');

  const { socket } = useWebSocket(cliente?.id);

  useEffect(() => {
    if (cliente?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [cliente, navigate]);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (pedidos.length > 0 && cliente?.id) {
      const onPedidoAtualizado = (data: { pedidoId: string; status: string }) => {
        setPedidos(prev =>
          prev.map(p => (p.id === data.pedidoId ? { ...p, status: data.status } : p))
        );
      };

      socket?.on('pedido:status:updated', onPedidoAtualizado);

      return () => {
        socket?.off('pedido:status:updated', onPedidoAtualizado);
      };
    }
  }, [socket, pedidos.length, cliente?.id]);

  const carregarDados = async () => {
    try {
      const responseCliente = await authAPI.me();
      setCliente(responseCliente.data);
      localStorage.setItem('cliente', JSON.stringify(responseCliente.data));

      const responsePedidos = await api.get('/pedidos');
      setPedidos(responsePedidos.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authAPI.logout(refreshToken);
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cliente');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-espresso text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-cream py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-espresso text-xl mb-4">Você precisa estar logado</p>
          <Button onClick={() => navigate('/auth')}>Ir para Login</Button>
        </div>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-800',
    PROCESSANDO: 'bg-blue-100 text-blue-800',
    SEPARANDO: 'bg-purple-100 text-purple-800',
    ENVIADO: 'bg-cyan-100 text-cyan-800',
    ENTREGUE: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-espresso text-cream p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold font-serif mb-2">{cliente.nome}</h1>
                <p className="text-cream/80">{cliente.email}</p>
              </div>
              <Button onClick={handleLogout} className="bg-gold text-espresso hover:bg-arabica">
                Sair
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-parchment flex">
            <button
              onClick={() => setActiveTab('dados')}
              className={`px-6 py-4 font-bold transition-colors ${
                activeTab === 'dados'
                  ? 'text-gold border-b-4 border-gold'
                  : 'text-espresso hover:text-arabica'
              }`}
            >
              Meus Dados
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-6 py-4 font-bold transition-colors ${
                activeTab === 'pedidos'
                  ? 'text-gold border-b-4 border-gold'
                  : 'text-espresso hover:text-arabica'
              }`}
            >
              Meus Pedidos ({pedidos.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'dados' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-espresso mb-2">Nome</label>
                    <p className="text-arabica">{cliente.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-espresso mb-2">Email</label>
                    <p className="text-arabica">{cliente.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-espresso mb-2">CPF</label>
                    <p className="text-arabica">{cliente.cpf}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-espresso mb-2">Telefone</label>
                    <p className="text-arabica">{cliente.telefone || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-espresso mb-2">Permissão</label>
                  <div className="inline-block bg-gold text-espresso px-4 py-2 rounded font-bold">
                    {cliente.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div className="space-y-6">
                {pedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-arabica text-lg">Você ainda não tem pedidos</p>
                    <Button onClick={() => navigate('/catalogo')} className="mt-4">
                      Explorar Catálogo
                    </Button>
                  </div>
                ) : (
                  pedidos.map(pedido => (
                    <div key={pedido.id} className="border-2 border-parchment rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-arabica">Pedido #{pedido.id.slice(0, 8)}</p>
                          <p className="text-sm text-arabica">
                            {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded font-bold text-sm ${statusColors[pedido.status]}`}>
                          {pedido.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="mb-4 border-t border-parchment pt-4">
                        {pedido.itens.map(item => (
                          <div key={item.id} className="flex justify-between py-2">
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

                      <div className="border-t border-parchment pt-4">
                        <p className="flex justify-between text-lg font-bold text-espresso">
                          <span>Total:</span>
                          <span>R$ {Number(pedido.total).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
