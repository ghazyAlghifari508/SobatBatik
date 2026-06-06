import { create } from 'zustand'
import { api } from '@/lib/axios'

export interface Product {
  _id: string
  store_id: string
  store_name: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  origin_region: string
  image_urls: string[]
  is_active: boolean
  rating: number
  reviews_count: number
  material: string
  pattern: string
  is_new?: boolean
  is_featured?: boolean
  discount_percent?: number
}

interface ProductState {
  products: Product[]
  loading: boolean
  setProducts: (products: Product[]) => void
  fetchPublicProducts: () => Promise<void>
  addProduct: (product: Omit<Product, '_id' | 'is_active'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  fetchPublicProducts: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/products')
      if (res.data.success) {
        set({ products: res.data.data })
      }
    } catch (error) {
      console.error('Failed to fetch public products:', error)
    } finally {
      set({ loading: false })
    }
  },
  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      ...product,
      _id: Math.random().toString(36).substr(2, 9),
      is_active: true
    }]
  })),
  updateProduct: (id, data) => set((state) => ({
    products: state.products.map(p => p._id === id ? { ...p, ...data } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p._id !== id)
  })),
  toggleProductStatus: (id) => set((state) => ({
    products: state.products.map(p => p._id === id ? { ...p, is_active: !p.is_active } : p)
  }))
}))
