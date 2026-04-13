import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useCartContext } from '../contexts/CartContext';
import { api } from '../services/api';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [tipoFrete, setTipoFrete] = useState('PAC');
  const [metodoPagamento, setMetodoPagamento] = useState('CARTAO');

  const freteOptions = {
    PAC: 15.00,
    SEDEX: 25.00,
    RETIRADA: 0.00,
  };

  const subtotal = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const frete = freteOptions[tipoFrete as keyof typeof freteOptions];
  const totalComFrete = subtotal + frete;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho');
    }
  }, [items, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pedidoData = {
        itens: items.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
        tipoFrete,
        metodoPagamento,
      };

      await api.post('/pedidos', pedidoData);
      clear();
      navigate('/minha-conta', { state: { message: 'Pedido realizado com sucesso!' } });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-espresso font-serif mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-espresso mb-6">Resumo do Pedido</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-espresso">{item.nome}</p>
                    <p className="text-sm text-arabica">Quantidade: {item.quantidade}</p>
                  </div>
                  <p className="font-bold text-gold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete ({tipoFrete}):</span>
                <span>R$ {frete.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-gold">R$ {totalComFrete.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Formulário de Checkout */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-espresso mb-6">Informações de Entrega e Pagamento</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Frete */}
              <div>
                <label className="block text-espresso font-semibold mb-2">Tipo de Frete</label>
                <select
                  value={tipoFrete}
                  onChange={(e) => setTipoFrete(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                >
                  <option value="PAC">PAC - R$ 15,00 (5-10 dias úteis)</option>
                  <option value="SEDEX">SEDEX - R$ 25,00 (1-3 dias úteis)</option>
                  <option value="RETIRADA">Retirada na Loja - R$ 0,00</option>
                </select>
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-espresso font-semibold mb-2">Método de Pagamento</label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                >
                  <option value="CARTAO">Cartão de Crédito</option>
                  <option value="PIX">PIX</option>
                  <option value="BOLETO">Boleto Bancário</option>
                </select>
              </div>

              {/* Endereço (simplificado - em produção, buscar endereços do usuário) */}
              {tipoFrete !== 'RETIRADA' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-espresso">Endereço de Entrega</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="CEP"
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Estado"
                      required
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Cidade"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Bairro"
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        type="text"
                        placeholder="Logradouro"
                        required
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="Número"
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-espresso hover:bg-arabica py-3 text-lg font-bold"
              >
                {loading ? 'Processando...' : `Finalizar Compra - R$ ${totalComFrete.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}