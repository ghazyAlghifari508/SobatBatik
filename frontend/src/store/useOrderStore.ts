import { create } from 'zustand'
import type { CartItem } from './useCartStore'

export type OrderStatus = 'Menunggu' | 'Dikemas' | 'Dikirim' | 'Selesai'

export interface OrderItem {
  _id: string
  product_id: string
  store_id: string
  store_name: string
  name: string
  quantity: number
  price_at_purchase: number
  image_url?: string
}

export interface Order {
  _id: string
  user_id: string
  user_name: string
  shipping_address: string
  total_price: number
  status: OrderStatus
  items: OrderItem[]
  created_at: string
}

interface PlaceOrderPayload {
  items: CartItem[]
  shipping_address: string
  total_price: number
}

interface OrderState {
  orders: Order[]
  addOrder: (order: Omit<Order, '_id' | 'status' | 'created_at'>) => void
  placeOrder: (payload: PlaceOrderPayload) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
}

const mockOrders: Order[] = [
  {
    _id: "o1",
    user_id: "u1",
    user_name: "Siti Rahayu",
    shipping_address: "Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan 12180",
    total_price: 615000,
    status: "Selesai",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    items: [
      {
        _id: "i1",
        product_id: "p1",
        store_id: "s1",
        store_name: "Batik Kencana",
        name: "Batik Tulis Lasem Merah",
        quantity: 1,
        price_at_purchase: 350000,
        image_url: "https://images.unsplash.com/photo-1605808892462-8178a9cbbff4?w=400&q=80"
      },
      {
        _id: "i2",
        product_id: "p3",
        store_id: "s1",
        store_name: "Batik Kencana",
        name: "Kain Batik Pekalongan Pesisir",
        quantity: 1,
        price_at_purchase: 150000,
        image_url: "https://images.unsplash.com/photo-1592881180860-6b2cba50bd07?w=400&q=80"
      }
    ]
  },
  {
    _id: "o2",
    user_id: "u1",
    user_name: "Siti Rahayu",
    shipping_address: "Jl. Anggrek No. 7, Menteng, Jakarta Pusat 10310",
    total_price: 520000,
    status: "Dikirim",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    items: [
      {
        _id: "i3",
        product_id: "p4",
        store_id: "s3",
        store_name: "Warisan Batik Yogya",
        name: "Dress Batik Yogyakarta Klasik",
        quantity: 1,
        price_at_purchase: 485000,
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80"
      }
    ]
  },
  {
    _id: "o3",
    user_id: "u1",
    user_name: "Siti Rahayu",
    shipping_address: "Jl. Melati No. 23, Sukajadi, Bandung 40161",
    total_price: 330000,
    status: "Dikemas",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    items: [
      {
        _id: "i4",
        product_id: "p9",
        store_id: "s6",
        store_name: "Aksesori Batik Nusantara",
        name: "Tas Batik Tenun Dayak",
        quantity: 1,
        price_at_purchase: 275000,
        image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80"
      }
    ]
  },
]

export const useOrderStore = create<OrderState>((set) => ({
  orders: mockOrders,
  addOrder: (order) => set((state) => ({
    orders: [{
      ...order,
      _id: Math.random().toString(36).substr(2, 9),
      status: 'Menunggu',
      created_at: new Date().toISOString()
    }, ...state.orders]
  })),
  placeOrder: (payload) => set((state) => {
    const newOrder: Order = {
      _id: 'ORD-' + Date.now(),
      user_id: 'u1',
      user_name: 'User',
      shipping_address: payload.shipping_address,
      total_price: payload.total_price,
      status: 'Menunggu',
      created_at: new Date().toISOString(),
      items: payload.items.map(item => ({
        _id: Math.random().toString(36).substr(2, 9),
        product_id: item._id,
        store_id: item.store_id,
        store_name: item.store_name,
        name: item.name,
        quantity: item.quantity,
        price_at_purchase: item.price,
        image_url: item.image_urls[0],
      }))
    }
    return { orders: [newOrder, ...state.orders] }
  }),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o._id === orderId ? { ...o, status } : o)
  }))
}))
