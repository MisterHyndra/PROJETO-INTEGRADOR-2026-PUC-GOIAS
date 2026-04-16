import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';

type AuthMode = 'login' | 'cadastro';

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '',
    telefone: '',
    confirmaSenha: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        senha: formData.senha,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('cliente', JSON.stringify(response.data.cliente));
      const destination = response.data.cliente?.role === 'ADMIN' ? '/admin' : '/minha-conta';
      navigate(destination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.senha !== formData.confirmaSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        senha: formData.senha,
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('cliente', JSON.stringify(response.data.cliente));
      navigate('/minha-conta');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'login' ? handleLogin : handleCadastro;

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-espresso font-serif">☕</h1>
          <h2 className="text-2xl font-bold text-espresso mt-4 font-serif">
            {mode === 'login' ? 'Entrar' : 'Cadastre-se'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cadastro' && (
            <>
              <Input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="cpf"
                placeholder="CPF (xxx.xxx.xxx-xx)"
                value={formData.cpf}
                onChange={handleInputChange}
                required
              />
              <Input
                type="tel"
                name="telefone"
                placeholder="Telefone (opcional)"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <Input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleInputChange}
            required
          />

          {mode === 'cadastro' && (
            <Input
              type="password"
              name="confirmaSenha"
              placeholder="Confirmar senha"
              value={formData.confirmaSenha}
              onChange={handleInputChange}
              required
            />
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'cadastro' : 'login');
                setError('');
              }}
              className="text-gold font-bold hover:text-arabica transition-colors"
            >
              {mode === 'login' ? 'Cadastre-se' : 'Entre aqui'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
