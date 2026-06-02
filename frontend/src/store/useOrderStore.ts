import { create } from 'zustand'

export type OrderStatus = 'Menunggu' | 'Dikemas' | 'Dikirim' | 'Selesai'

export interface OrderItem {
  _id: string
  product_id: string
  store_id: string
  store_name: string
  name: string
  quantity: number
  price_at_purchase: number
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

interface OrderState {
  orders: Order[]
  addOrder: (order: Omit<Order, '_id' | 'status' | 'created_at'>) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
}

const mockOrders: Order[] = [
  {
    _id: "o1",
    user_id: "u1",
    user_name: "Budi",
    shipping_address: "Jl. Sudirman No. 1, Jakarta",
    total_price: 350000,
    status: "Dikemas",
    created_at: new Date().toISOString(),
    items: [
      {
        _id: "i1",
        product_id: "p1",
        store_id: "s1",
        store_name: "Batik Kencana",
        name: "Batik Tulis Lasem",
        quantity: 1,
        price_at_purchase: 350000
      }
    ]
  }
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
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o._id === orderId ? { ...o, status } : o)
  }))
}))
