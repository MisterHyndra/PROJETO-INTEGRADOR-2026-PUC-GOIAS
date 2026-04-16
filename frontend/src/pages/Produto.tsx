import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { useCartContext } from '../contexts/CartContext';

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number | string;
  estoque: number;
  origem?: string;
  altitudeM?: number;
  processo?: string;
  torra?: string;
  imagemUrl?: string;
}

export function ProdutoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const response = await api.get(`/produtos/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-cream py-16 text-center text-espresso">Carregando produto...</div>;
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-cream py-16 text-center">
        <p className="mb-4 text-xl text-espresso">Produto não encontrado.</p>
        <Button onClick={() => navigate('/catalogo')}>Voltar ao catálogo</Button>
      </div>
    );
  }

  const preco = Number(produto.preco ?? 0).toFixed(2);

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {produto.imagemUrl ? (
            <img src={produto.imagemUrl} alt={produto.nome} className="h-full min-h-[420px] w-full object-cover" />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-espresso to-arabica text-8xl text-cream">
              ☕
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-arabica">Paralelo 14 Cafes Especiais</p>
          <h1 className="mb-4 font-serif text-5xl font-bold text-espresso">{produto.nome}</h1>
          <p className="mb-6 text-lg leading-8 text-arabica">
            {produto.descricao || 'Cafe especial de origem goiana com perfil sensorial sofisticado.'}
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            {produto.altitudeM && <Badge variant="altitude">Altitude {produto.altitudeM}m</Badge>}
            {produto.torra && <Badge variant="torra">{produto.torra}</Badge>}
            {produto.processo && <Badge variant="default">{produto.processo}</Badge>}
          </div>

          <div className="mb-8 grid gap-4 rounded-xl bg-cream p-5 text-sm text-espresso md:grid-cols-2">
            <div>
              <p className="font-semibold">Origem</p>
              <p>{produto.origem || 'Goias'}</p>
            </div>
            <div>
              <p className="font-semibold">Estoque</p>
              <p>{produto.estoque} unidade(s)</p>
            </div>
            <div>
              <p className="font-semibold">Notas do barista</p>
              <p>Doçura elevada, acidez equilibrada e finalizacao limpa.</p>
            </div>
            <div>
              <p className="font-semibold">Moagem sugerida</p>
              <p>Media para coado, fina para espresso.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-parchment pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-arabica">Preco</p>
              <p className="font-serif text-4xl font-bold text-gold">R$ {preco}</p>
            </div>
            <Button
              className="px-8 py-3 text-lg"
              onClick={() =>
                addItem({
                  id: produto.id,
                  nome: produto.nome,
                  preco: Number(produto.preco ?? 0),
                  imagemUrl: produto.imagemUrl,
                })
              }
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
