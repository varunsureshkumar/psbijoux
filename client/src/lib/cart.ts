import { create } from 'zustand';
import { CartState, CartItem } from '@/types/product';
import { useInventory } from '@/hooks/use-inventory';

interface CartStore extends CartState {
  addItem: (item: CartItem, currentStock: number) => boolean;
  removeItem: (productId: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const useCart = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addItem: (item: CartItem, currentStock: number) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      const newQuantity = (existing?.quantity || 0) + item.quantity;

      // Check if adding the item would exceed available stock
      if (newQuantity > currentStock) {
        return state; // Return current state without changes
      }

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: newQuantity }
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