import { create } from 'zustand'
import type { Product } from './useProductStore'

export interface CartItem extends Product {
  cartItemId: string
  quantity: number
  selectedSize?: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, selectedSize?: string) => boolean
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, selectedSize) => {
    const state = get()
    const cartItemId = selectedSize ? `${product._id}-${selectedSize}` : product._id
    const existingItem = state.items.find(item => item.cartItemId === cartItemId)
    
    // Determine max stock available for this specific size or overall
    const maxStock = selectedSize && product.sizes 
      ? product.sizes[selectedSize as keyof typeof product.sizes] || 0
      : product.stock || 0

    if (maxStock === 0) return false; // Cannot add out of stock items

    if (existingItem) {
      if (existingItem.quantity >= maxStock) {
        return false; // Reached maximum stock
      }
      set({
        items: state.items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
      return true;
    }
    set({ items: [...state.items, { ...product, cartItemId, quantity: 1, selectedSize }] })
    return true;
  },
  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter(item => item.cartItemId !== cartItemId)
  })),
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map(item => {
      if (item.cartItemId === cartItemId) {
        const maxStock = item.selectedSize && item.sizes 
          ? item.sizes[item.selectedSize as keyof typeof item.sizes] || 0
          : item.stock || 0
        return { ...item, quantity: Math.min(Math.max(1, quantity), maxStock) }
      }
      return item
    })
  })),
  clearCart: () => set({ items: [] })
}))
