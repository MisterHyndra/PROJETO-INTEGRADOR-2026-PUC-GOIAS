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

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="bg-gradient-to-br from-espresso to-arabica h-48 flex items-center justify-center relative overflow-hidden">
        {product.imagemUrl ? (
          <img src={product.imagemUrl} alt={product.nome} className="h-full w-full object-cover hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="text-cream text-center">
            <div className="text-6xl mb-2">☕</div>
            <p className="text-sm font-serif">{product.nome}</p>
          </div>
        )}
      </div>
      <div className="p-5">
        <Link to={`/produto/${product.id}`} className="block">
          <h3 className="text-lg font-bold text-espresso mb-3 font-serif hover:text-gold transition-colors">
            {product.nome}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.altitudeM && (<Badge variant="altitude">↑ {product.altitudeM}m</Badge>)}
          {product.torra && (<Badge variant="torra">{product.torra}</Badge>)}
        </div>
        <p className="text-sm text-arabica mb-4 line-clamp-2 h-10">{product.descricao}</p>
        <div className="flex justify-between items-center pt-4 border-t border-parchment">
          <span className="text-2xl font-bold text-gold font-serif">R$ {preco}</span>
          <div className="flex gap-2">
            <Link
              to={`/produto/${product.id}`}
              className="inline-flex items-center justify-center rounded-md border border-parchment px-3 py-2 text-sm font-medium text-espresso transition-colors hover:border-gold hover:text-gold"
            >
              Ver
            </Link>
            <Button variant="primary" size="sm" onClick={() => onAddToCart(product)}>
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
