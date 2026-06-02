import { create } from 'zustand'
import type { Product } from './useProductStore'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item._id === product._id)
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
    }
    return { items: [...state.items, { ...product, quantity: 1 }] }
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item._id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item._id === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  })),
  clearCart: () => set({ items: [] })
}))
