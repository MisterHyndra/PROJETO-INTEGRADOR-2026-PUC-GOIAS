import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useCartContext } from '../contexts/CartContext';

export function Carrinho() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clear, total } = useCartContext();

  const clienteData = typeof window !== 'undefined' ? localStorage.getItem('cliente') : null;
  const cliente = clienteData ? JSON.parse(clienteData) : null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!cliente) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-espresso font-serif">Carrinho</h1>
            <p className="text-arabica mt-2">Confira seus itens antes de finalizar o pedido.</p>
          </div>
          <Button variant="gold" onClick={() => navigate('/catalogo')}>
            Continuar Comprando
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-espresso text-xl mb-4">Seu carrinho está vazio.</p>
            <Button onClick={() => navigate('/catalogo')}>Ir para Catálogo</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 border border-parchment">
                  <div className="flex gap-4 items-center">
                    {item.imagemUrl ? (
                      <img src={item.imagemUrl} alt={item.nome} className="w-28 h-28 object-cover rounded-lg" />
                    ) : (
                      <div className="w-28 h-28 bg-espresso/10 rounded-lg flex items-center justify-center text-3xl">☕</div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-espresso font-serif">{item.nome}</h2>
                      <p className="text-arabica">R$ {item.preco.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <label className="text-sm text-espresso">Quantidade</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantidade}
                          onChange={e => updateQuantity(item.id, Number(e.target.value))}
                          className="w-20 px-3 py-2 border-2 border-parchment rounded"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-espresso">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-4 text-rose-600 hover:text-rose-800"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-parchment">
              <h2 className="text-2xl font-bold text-espresso font-serif mb-4">Resumo</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-arabica">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-arabica">
                  <span>Frete</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="border-t border-parchment pt-4 flex justify-between text-xl font-bold text-espresso">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-8 bg-gold text-espresso hover:bg-arabica"
              >
                Ir para Checkout
              </Button>
              <Button onClick={clear} variant="secondary" className="w-full mt-4">
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
