import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { useCartContext } from '../contexts/CartContext';

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco?: number | string;
  estoque?: number;
  origem?: string;
  altitudeM?: number;
  processo?: string;
  torra?: string;
  imagemUrl?: string;
}

export function Catalogo() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtros, setFiltros] = useState({
    torra: '',
    processo: '',
    precoMin: 0,
    precoMax: 999
  });
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartContext();

  useEffect(() => {
    carregarProdutos();
  }, [filtros]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos', { params: filtros });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const torras = ['Leve', 'Média', 'Escura', 'Muito Escura'];
  const processos = ['Natural', 'Lavado', 'Honey', 'Anaeróbico'];

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-espresso mb-3 font-serif">Catálogo de Produtos</h1>
          <p className="text-arabica text-lg">Explore nossos cafés de especialidade</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border-2 border-parchment">
              <h2 className="text-lg font-bold text-espresso mb-6 font-serif">Filtros</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-espresso mb-3">Torra</label>
                <select
                  value={filtros.torra}
                  onChange={(e) => setFiltros({ ...filtros, torra: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                >
                  <option value="">Todas</option>
                  {torras.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-espresso mb-3">Processo</label>
                <select
                  value={filtros.processo}
                  onChange={(e) => setFiltros({ ...filtros, processo: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-parchment rounded text-espresso focus:outline-none focus:border-gold"
                >
                  <option value="">Todos</option>
                  {processos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-espresso mb-3">
                  Preço: R$ {filtros.precoMin} - R$ {filtros.precoMax}
                </label>
                <input
                  type="range"
                  min="0"
                  max="999"
                  value={filtros.precoMax}
                  onChange={(e) => setFiltros({ ...filtros, precoMax: parseInt(e.target.value) })}
                  className="w-full accent-gold"
                />
              </div>

              <Button variant="primary" className="w-full" onClick={carregarProdutos}>
                Aplicar Filtros
              </Button>
            </div>
          </div>

          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="text-6xl mb-4 animate-bounce">☕</div>
                  <p className="text-arabica text-lg font-semibold">Carregando produtos...</p>
                </div>
              </div>
            ) : produtos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {produtos.map(produto => (
                  <ProductCard
                    key={produto.id}
                    product={produto}
                    onAddToCart={(p) =>
                      addItem({
                        id: p.id,
                        nome: p.nome,
                        preco: Number(p.preco ?? 0),
                        imagemUrl: p.imagemUrl,
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl">
                <p className="text-arabica text-2xl font-serif mb-4">☕</p>
                <p className="text-arabica text-lg">Nenhum produto encontrado com esses filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
