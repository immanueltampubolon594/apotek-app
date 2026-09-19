import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, type: 'increase' | 'decrease') => void; // Fungsi baru
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  updateQuantity: (id, type) => set((state) => ({
    items: state.items.map((i) => {
      if (i.id === id) {
        const newQty = type === 'increase' ? i.quantity + 1 : i.quantity - 1;
        return { ...i, quantity: newQty > 0 ? newQty : 1 }; // Minimal 1
      }
      return i;
    }),
  })),
  clearCart: () => set({ items: [] }),
}));