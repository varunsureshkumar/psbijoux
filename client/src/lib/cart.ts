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
  addItem: (item: CartItem, currentStock: number) => {
    let success = false;

    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      const existingQuantity = existing?.quantity || 0;
      const newQuantity = item.quantity;
      const totalQuantity = existingQuantity + newQuantity;

      // Check if adding the item would exceed available stock
      if (totalQuantity > currentStock) {
        return state; // Return current state without changes
      }

      success = true; // Mark operation as successful
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: totalQuantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, item] };
    });

    return success; // Return whether the operation was successful
  },
  removeItem: (productId: number) =>
    set((state) => ({
      ...state,
      items: state.items.filter((i) => i.productId !== productId),
    })),
  setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
}));

export default useCart;