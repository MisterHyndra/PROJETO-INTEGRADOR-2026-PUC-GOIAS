import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Auth } from './pages/Auth';
import { MinhaConta } from './pages/MinhaConta';
import { Admin } from './pages/Admin';
import { Carrinho } from './pages/Carrinho';
import { Checkout } from './pages/Checkout';
import { ProdutoPage } from './pages/Produto';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/produto/:id" element={<ProdutoPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
