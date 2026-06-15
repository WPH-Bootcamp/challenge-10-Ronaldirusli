import { create } from 'zustand';
import { MenuItem, CartItem } from '@/types';

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  cleanCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addToCart: (item) =>
    set((state) => {
      const existingIndex = state.cartItems.findIndex(
        (i) => i.menuItem.id === item.id
      );
      if (existingIndex > -1) {
        const newItems = [...state.cartItems];
        newItems[existingIndex].quantity += 1;
        return { cartItems: newItems };
      }
      return {
        cartItems: [...state.cartItems, { menuItem: item, quantity: 1 }],
      };
    }),

  removeFromCart: (menuItemId: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.menuItem.id !== menuItemId),
    })),

  updateQuantity: (menuItemId: string, quantity: number) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          cartItems: state.cartItems.filter(
            (i) => i.menuItem.id !== menuItemId
          ),
        };
      }
      return {
        cartItems: state.cartItems.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i
        ),
      };
    }),

  cleanCart: () => set({ cartItems: [] }),

  getTotalPrice: () => {
    return get().cartItems.reduce<number>(
      (total: number, item: CartItem) =>
        total + item.menuItem.price * item.quantity,
      0
    );
  },
}));
