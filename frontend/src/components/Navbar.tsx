import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useCartContext } from '../contexts/CartContext';
import { authAPI } from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  role: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const syncCliente = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await authAPI.me();
        setCliente(response.data);
        localStorage.setItem('cliente', JSON.stringify(response.data));
      } catch {
        const clienteData = localStorage.getItem('cliente');
        if (clienteData) {
          setCliente(JSON.parse(clienteData));
        }
      }
    };

    syncCliente();
  }, []);

  const navigate = useNavigate();
  const { count } = useCartContext();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
    <nav className="bg-[#f7f3eb]/95 text-espresso sticky top-0 z-50 border-b border-[#d8d0c4] backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center border border-[#d8d0c4] bg-white text-2xl text-espresso"
          >
            ☰
          </button>

          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div>
              <div className="text-2xl font-serif text-espresso">Paralelo 14</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-arabica/70">Cafes Especiais</div>
            </div>
          </a>

          <div className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-arabica transition-colors text-sm font-semibold uppercase tracking-[0.18em]">Home</a>
            <a href="/catalogo" className="hover:text-arabica transition-colors text-sm font-semibold uppercase tracking-[0.18em]">Catalogo</a>
            <a href="/minha-conta" className="hover:text-arabica transition-colors text-sm font-semibold uppercase tracking-[0.18em]">Conta</a>
          </div>

          <div className="flex items-center space-x-4">
            {cliente ? (
              <>
                <span className="text-sm hidden lg:inline text-arabica">
                  Ola, <span className="text-espresso font-bold">{cliente.nome.split(' ')[0]}</span>
                </span>
                {cliente.role === 'ADMIN' && (
                  <a href="/admin" className="text-sm font-semibold bg-[#ede4d7] px-3 py-1.5 text-espresso">
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
                  className="text-sm font-semibold hover:text-arabica transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <a href="/auth" className="text-sm font-semibold hover:text-arabica transition-colors">
                Login
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-[#d3c9bb] bg-white hover:bg-[#f0e9dd] hover:text-espresso"
              onClick={() => navigate('/carrinho')}
            >
              Carrinho{count > 0 ? ` (${count})` : ''}
            </Button>
          </div>
        </div>

      </div>
    </nav>
    {isOpen && (
      <div className="fixed inset-0 z-[60] md:hidden">
        <button
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu"
        />
        <div className="absolute left-0 top-0 h-full w-[78vw] max-w-[320px] border-r border-[#ddd4c7] bg-[#f8f4ec] p-6 shadow-[24px_0_80px_rgba(28,20,12,0.18)]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl text-espresso">Paralelo 14</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-arabica/70">Menu</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center border border-[#d8d0c4] bg-white text-lg"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <a href="/" className="block border border-[#ddd4c7] bg-white px-4 py-3 font-semibold">Home</a>
            <a href="/catalogo" className="block border border-[#ddd4c7] bg-white px-4 py-3 font-semibold">Catalogo</a>
            <a href="/minha-conta" className="block border border-[#ddd4c7] bg-white px-4 py-3 font-semibold">Minha Conta</a>
            {cliente?.role === 'ADMIN' && (
              <a href="/admin" className="block border border-[#ddd4c7] bg-white px-4 py-3 font-semibold">Admin</a>
            )}
          </div>

          <div className="mt-8 border-t border-[#e5dccf] pt-6">
            {cliente ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('cliente');
                  setCliente(null);
                  window.location.href = '/';
                }}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-espresso"
              >
                Sair
              </button>
            ) : (
              <a href="/auth" className="text-sm font-semibold uppercase tracking-[0.18em] text-espresso">
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
