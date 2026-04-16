import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  variantId: number;
  sku: string;
  productName: string;
  price: number;
  quantity: number;
  attributes: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existing = currentItems.find(item => item.variantId === newItem.variantId);
      if (existing) {
        return currentItems.map(item => 
          item.variantId === newItem.variantId 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeItem = (variantId: number) => {
    setItems((current) => current.filter(item => item.variantId !== variantId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be defined within boundaries');
  }
  return context;
};
