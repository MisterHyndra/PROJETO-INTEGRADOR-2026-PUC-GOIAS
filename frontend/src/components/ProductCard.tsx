import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Badge } from './Badge';

interface ProductCardProps {
  product: {
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
  };
  onAddToCart: (product: {
    id: string;
    nome: string;
    preco?: number | string;
    imagemUrl?: string;
  }) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const preco = Number(product.preco ?? 0).toFixed(2);
  const placeholderTone =
    product.processo === 'Honey' ? 'from-[#ded5c6] to-[#f5efe7]' : 'from-[#efe8dc] to-[#f8f6f0]';

  return (
    <article className="group overflow-hidden border border-[#ded7ca] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(34,24,18,0.12)]">
      <div
        className={`relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br ${placeholderTone}`}
      >
        {product.imagemUrl ? (
          <img
            src={product.imagemUrl}
            alt={product.nome}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-center text-espresso">
            <div className="mb-4 text-7xl opacity-80">☕</div>
            <p className="font-serif text-base">{product.nome}</p>
          </div>
        )}

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.processo && <Badge variant="default">{product.processo}</Badge>}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <Link to={`/produto/${product.id}`} className="block">
          <h3 className="font-serif text-2xl leading-tight text-espresso transition-colors group-hover:text-arabica">
            {product.nome}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-2">
          {product.altitudeM && <Badge variant="altitude">Altitude {product.altitudeM}m</Badge>}
          {product.torra && <Badge variant="torra">Torra {product.torra}</Badge>}
        </div>

        <p className="min-h-[3.5rem] text-sm leading-6 text-arabica">
          {product.descricao || 'Microlote de origem com perfil limpo, doce e finalizacao delicada.'}
        </p>

        <div className="flex items-end justify-between border-t border-[#e8e1d5] pt-5">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-arabica/70">A partir de</p>
            <span className="font-serif text-3xl text-espresso">R$ {preco}</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/produto/${product.id}`}
              className="inline-flex items-center justify-center border border-[#d5cec1] px-4 py-2 text-sm font-medium text-espresso transition-colors hover:border-espresso hover:bg-[#f4efe7]"
            >
              Ver
            </Link>
            <Button variant="primary" size="sm" onClick={() => onAddToCart(product)}>
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
