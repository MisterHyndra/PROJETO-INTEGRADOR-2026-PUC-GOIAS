import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
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
    precoMax: 999,
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
    <div className="min-h-screen bg-[#f6f2ea] pb-16">
      <section className="border-b border-[#d9d1c4] bg-[#f8f5ef] px-4 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-arabica/70">Catalog</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.98] text-espresso md:text-6xl">
              Cafes de origem para quem compra com o olho e escolhe pelo perfil sensorial.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-arabica">
              Uma pagina mais limpa e editorial, com filtros discretos e foco em colecoes, lotes e
              leitura de produto.
            </p>
          </div>
          <div className="border border-[#d9d1c4] bg-white p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-arabica/70">Curadoria da casa</p>
            <p className="mt-4 font-serif text-3xl text-espresso">
              {produtos.length} cafe{produtos.length === 1 ? '' : 's'} disponiveis agora.
            </p>
            <p className="mt-4 text-sm leading-7 text-arabica">
              Navegue por torra, processo e faixa de preco para encontrar um perfil mais delicado,
              mais achocolatado ou mais frutado.
            </p>
            <div className="mt-8 flex gap-6 text-sm text-espresso">
              <span className="border-b border-[#c8beb1] pb-1">Entrega nacional</span>
              <span className="border-b border-[#c8beb1] pb-1">Status em tempo real</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit border border-[#d9d1c4] bg-white p-6 md:sticky md:top-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-espresso">Filtros</h2>
            <button
              onClick={() => setFiltros({ torra: '', processo: '', precoMin: 0, precoMax: 999 })}
              className="text-xs uppercase tracking-[0.2em] text-arabica"
            >
              Limpar
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-[11px] uppercase tracking-[0.25em] text-arabica/70">
                Torra
              </label>
              <select
                value={filtros.torra}
                onChange={(e) => setFiltros({ ...filtros, torra: e.target.value })}
                className="w-full border border-[#d8d0c4] bg-[#faf7f2] px-4 py-3 text-sm text-espresso outline-none transition-colors focus:border-espresso"
              >
                <option value="">Todas</option>
                {torras.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-[11px] uppercase tracking-[0.25em] text-arabica/70">
                Processo
              </label>
              <select
                value={filtros.processo}
                onChange={(e) => setFiltros({ ...filtros, processo: e.target.value })}
                className="w-full border border-[#d8d0c4] bg-[#faf7f2] px-4 py-3 text-sm text-espresso outline-none transition-colors focus:border-espresso"
              >
                <option value="">Todos</option>
                {processos.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-[11px] uppercase tracking-[0.25em] text-arabica/70">
                Faixa de preco
              </label>
              <p className="mb-4 text-sm text-espresso">R$ {filtros.precoMin} ate R$ {filtros.precoMax}</p>
              <input
                type="range"
                min="0"
                max="999"
                value={filtros.precoMax}
                onChange={(e) => setFiltros({ ...filtros, precoMax: parseInt(e.target.value) })}
                className="w-full accent-[#7c5432]"
              />
            </div>

            <div className="border-t border-[#ece4d8] pt-6 text-sm leading-7 text-arabica">
              <p>
                Perfis mais claros e florais costumam aparecer nas torras leves e processos
                lavados.
              </p>
              <p className="mt-3">
                Se quiser mais corpo e chocolate, experimente torra media ou escura.
              </p>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-8 flex flex-col gap-4 border-b border-[#ddd4c7] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-arabica/70">Colecao atual</p>
              <h2 className="mt-2 font-serif text-3xl text-espresso">Todos os cafes</h2>
            </div>
            <p className="text-sm text-arabica">
              {produtos.length} resultado{produtos.length === 1 ? '' : 's'}
            </p>
          </div>

          {loading ? (
            <div className="border border-[#d9d1c4] bg-white px-6 py-20 text-center">
              <div className="mx-auto w-fit">
                <div className="mb-4 text-6xl">☕</div>
                <p className="text-lg font-semibold text-arabica">Preparando a selecao do dia...</p>
              </div>
            </div>
          ) : produtos.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {produtos.map((produto) => (
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
            <div className="border border-[#d9d1c4] bg-white px-6 py-20 text-center">
              <p className="mb-3 font-serif text-3xl text-espresso">Nada encontrado por aqui.</p>
              <p className="mx-auto max-w-lg text-sm leading-7 text-arabica">
                Tente limpar os filtros ou explorar outro processo de fermentacao, outra torra ou
                uma faixa maior de preco.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-espresso"
              >
                Voltar para home
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
