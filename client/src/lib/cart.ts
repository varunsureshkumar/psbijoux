import { create } from 'zustand';
import { CartState, CartItem } from '@/types/product';

const useCart = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  addItem: (item: CartItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId: number) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

export default useCart;
