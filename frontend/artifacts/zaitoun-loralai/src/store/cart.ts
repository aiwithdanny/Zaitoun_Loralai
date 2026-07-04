import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        set((state: CartStore) => {
          const existingItem = state.items.find((i: CartItem) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i: CartItem) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },

      removeItem: (id: number) => {
        set((state: CartStore) => ({
          items: state.items.filter((i: CartItem) => i.id !== id),
        }));
      },

      updateQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state: CartStore) => ({
          items: state.items.map((i: CartItem) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },
    }),
    {
      name: 'zaitoun-cart-storage',
    }
  )
);
