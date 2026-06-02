import { create } from 'zustand'

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
}

interface ProductState {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, '_id' | 'is_active'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductStatus: (id: string) => void
}

const mockProducts: Product[] = [
  {
    _id: "p1",
    store_id: "s1",
    store_name: "Batik Kencana",
    name: "Batik Tulis Lasem",
    description: "Batik tulis asli dari Lasem dengan motif klasik.",
    price: 350000,
    stock: 10,
    category: "Pria",
    origin_region: "Lasem",
    image_urls: ["https://images.unsplash.com/photo-1605808892462-8178a9cbbff4?w=500&q=80"],
    is_active: true
  },
  {
    _id: "p2",
    store_id: "s2",
    store_name: "Griya Batik Solo",
    name: "Kemeja Batik Solo Modern",
    description: "Kemeja batik Solo dengan desain modern cocok untuk kerja.",
    price: 250000,
    stock: 25,
    category: "Pria",
    origin_region: "Solo",
    image_urls: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&q=80"],
    is_active: true
  },
  {
    _id: "p3",
    store_id: "s1",
    store_name: "Batik Kencana",
    name: "Kain Batik Pekalongan",
    description: "Kain batik Pekalongan motif pesisir warna cerah.",
    price: 150000,
    stock: 50,
    category: "Kain",
    origin_region: "Pekalongan",
    image_urls: ["https://images.unsplash.com/photo-1592881180860-6b2cba50bd07?w=500&q=80"],
    is_active: true
  }
]

export const useProductStore = create<ProductState>((set) => ({
  products: mockProducts,
  setProducts: (products) => set({ products }),
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
