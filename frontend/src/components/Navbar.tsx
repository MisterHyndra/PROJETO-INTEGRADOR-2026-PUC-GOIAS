import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useCartContext } from '../contexts/CartContext';

interface Cliente {
  id: string;
  nome: string;
  role: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const clienteData = localStorage.getItem('cliente');
    if (clienteData) {
      setCliente(JSON.parse(clienteData));
    }
  }, []);

  const navigate = useNavigate();
  const { count } = useCartContext();

  return (
    <nav className="bg-espresso text-cream shadow-2xl sticky top-0 z-50 border-b-4 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">☕</span>
            <div>
              <div className="text-2xl font-bold text-gold font-serif">Paralelo 14</div>
              <div className="text-xs text-cream text-opacity-70">Cafés Especiais</div>
            </div>
          </a>

          <div className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-gold transition-colors font-semibold">Home</a>
            <a href="/catalogo" className="hover:text-gold transition-colors font-semibold">Catálogo</a>
            <a href="/sobre" className="hover:text-gold transition-colors font-semibold">Sobre</a>
            <a href="/contato" className="hover:text-gold transition-colors font-semibold">Contato</a>
          </div>

          <div className="flex items-center space-x-4">
            {cliente ? (
              <>
                <span className="text-sm hidden sm:inline">Olá, <span className="text-gold font-bold">{cliente.nome.split(' ')[0]}</span></span>
                <a href="/minha-conta" className="hover:text-gold transition-colors text-sm font-semibold">
                  Minha Conta
                </a>
                {cliente.role === 'ADMIN' && (
                  <a href="/admin" className="hover:text-gold transition-colors text-sm font-semibold bg-gold/20 px-3 py-1 rounded">
                    Admin
                  </a>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('cliente');
                    setCliente(null);
                    window.location.href = '/';
                  }}
                  className="text-sm font-semibold hover:text-gold transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <a href="/auth" className="text-sm font-semibold hover:text-gold transition-colors">
                Login
              </a>
            )}
            <Button
              variant="gold"
              size="sm"
              onClick={() => navigate('/carrinho')}
            >
              🛒 Carrinho{count > 0 ? ` (${count})` : ''}
            </Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl text-gold">
            ☰
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-arabica space-y-3">
            <a href="/" className="block py-2 hover:text-gold font-semibold">Home</a>
            <a href="/catalogo" className="block py-2 hover:text-gold font-semibold">Catálogo</a>
            <a href="/sobre" className="block py-2 hover:text-gold font-semibold">Sobre</a>
            <a href="/contato" className="block py-2 hover:text-gold font-semibold">Contato</a>
            {cliente && (
              <>
                <a href="/minha-conta" className="block py-2 hover:text-gold font-semibold">Minha Conta</a>
                {cliente.role === 'ADMIN' && (
                  <a href="/admin" className="block py-2 hover:text-gold font-semibold">Admin</a>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('cliente');
                    setCliente(null);
                    window.location.href = '/';
                  }}
                  className="block py-2 hover:text-gold font-semibold"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
