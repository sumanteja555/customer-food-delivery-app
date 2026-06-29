import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { MenuItem } from '@/data/restaurants';

export type CartLine = {
  restaurantId: string;
  item: MenuItem;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  totalPrice: number;
  addItem: (restaurantId: string, item: MenuItem) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  quantityFor: (itemId: string) => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((restaurantId: string, item: MenuItem) => {
    setLines((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { restaurantId, item, quantity: 1 }];
    });
  }, []);

  const incrementItem = useCallback((itemId: string) => {
    setLines((current) =>
      current.map((line) =>
        line.item.id === itemId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    );
  }, []);

  const decrementItem = useCallback((itemId: string) => {
    setLines((current) =>
      current
        .map((line) =>
          line.item.id === itemId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const quantityFor = useCallback(
    (itemId: string) => lines.find((line) => line.item.id === itemId)?.quantity ?? 0,
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      totalItems: lines.reduce((total, line) => total + line.quantity, 0),
      totalPrice: lines.reduce((total, line) => total + line.item.price * line.quantity, 0),
      addItem,
      incrementItem,
      decrementItem,
      quantityFor,
      clearCart,
    }),
    [addItem, clearCart, decrementItem, incrementItem, lines, quantityFor],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
