import { create } from 'zustand';
import { CartState, CartItem } from '@/types/product';

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const useCart = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addItem: (item: CartItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, item] };
    }),
  removeItem: (productId: number) =>
    set((state) => ({
      ...state,
      items: state.items.filter((i) => i.productId !== productId),
    })),
  setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
}));

export default useCart;