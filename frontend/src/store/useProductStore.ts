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
  sizes?: {
    S: number;
    M: number;
    L: number;
    XL: number;
  }
  created_at: string
  updated_at: string
}

export interface SearchParams {
  search?: string
  category?: string
  region?: string
  min_price?: number
  max_price?: number
  sort?: string
  page?: number
  limit?: number
}

export interface Pagination {
  page: number
  limit: number
  totalProducts: number
  totalPages: number
}

interface ProductState {
  products: Product[]
  loading: boolean
  pagination: Pagination | null
  lastSearchParams: SearchParams | null
  setProducts: (products: Product[]) => void
  fetchPublicProducts: (params?: SearchParams) => Promise<void>
  addProduct: (product: Omit<Product, '_id' | 'is_active'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  pagination: null,
  lastSearchParams: null,
  setProducts: (products) => set({ products }),
  fetchPublicProducts: async (params?: SearchParams) => {
    set({ loading: true, lastSearchParams: params ?? null })
    try {
      // Build query string from non-empty params
      const query = new URLSearchParams()
      if (params?.search?.trim()) query.set('search', params.search.trim())
      if (params?.category && params.category !== 'Semua Kategori') query.set('category', params.category)
      if (params?.region && params.region !== 'Semua Daerah') query.set('region', params.region)
      if (params?.min_price != null) query.set('min_price', String(params.min_price))
      if (params?.max_price != null) query.set('max_price', String(params.max_price))
      if (params?.sort) query.set('sort', params.sort)
      if (params?.page) query.set('page', String(params.page))
      if (params?.limit) query.set('limit', String(params.limit))

      const url = `/products${query.toString() ? `?${query.toString()}` : ''}`
      const res = await api.get(url)

      if (res.data.success) {
        set({
          products: res.data.data,
          pagination: res.data.pagination ?? null,
        })
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
