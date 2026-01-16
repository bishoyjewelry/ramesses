import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RepairCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  turnaroundDays: string;
}

interface RepairCartStore {
  items: RepairCartItem[];
  
  addItems: (items: RepairCartItem[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountedTotal: () => number;
  hasBulkDiscount: () => boolean;
}

export const useRepairCartStore = create<RepairCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItems: (newItems) => {
        const { items } = get();
        const updatedItems = [...items];
        
        newItems.forEach((newItem) => {
          const existingIndex = updatedItems.findIndex(i => i.id === newItem.id);
          if (existingIndex >= 0) {
            updatedItems[existingIndex].quantity += newItem.quantity;
          } else {
            updatedItems.push(newItem);
          }
        });
        
        set({ items: updatedItems });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      getDiscountedTotal: () => {
        const subtotal = get().getSubtotal();
        const totalItems = get().getTotalItems();
        return totalItems >= 2 ? Math.round(subtotal * 0.8) : subtotal;
      },

      hasBulkDiscount: () => {
        return get().getTotalItems() >= 2;
      },
    }),
    {
      name: 'repair-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
