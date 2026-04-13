import { useState, useCallback } from 'react';

type CartItem = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  [key: string]: any;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((produto: Omit<CartItem, 'quantidade'>, quantidade = 1) => {
    setItems(prev => {
      const exist = prev.some(item => item.id === produto.id);
      if (exist) {
        return prev.map(item =>
          item.id === produto.id
            ? ({ ...item, quantidade: item.quantidade + quantidade } as CartItem)
            : item
        );
      }
      return [...prev, { ...produto, quantidade } as CartItem];
    });
  }, []);

  const removeItem = useCallback((produtoId: string) => {
    setItems(prev => prev.filter(item => item.id !== produtoId));
  }, []);

  const updateQuantidade = useCallback((produtoId: string, quantidade: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return { items, addItem, removeItem, updateQuantidade, clear, total };
}
