import { create } from 'zustand';
import { CartState, CartItem } from '@/types/product';

interface CartStore extends CartState {
  addItem: (item: CartItem, currentStock: number) => boolean;
  removeItem: (productId: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const useCart = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addItem: (item: CartItem, currentStock: number) => {
    let success = false;

    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);

      // Check if the new quantity would exceed available stock
      if (item.quantity > currentStock) {
        return state; // Return current state without changes
      }

      success = true; // Mark operation as successful

      if (existing) {
        // Replace the existing quantity instead of adding
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: item.quantity }
              : i
          ),
        };
      }

      return { ...state, items: [...state.items, item] };
    });

    return success;
  },
  removeItem: (productId: number) =>
    set((state) => ({
      ...state,
      items: state.items.filter((i) => i.productId !== productId),
    })),
  setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
}));

export default useCart;