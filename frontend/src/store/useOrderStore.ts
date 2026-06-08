import { create } from 'zustand'
import { api } from '@/lib/axios'
import type { CartItem } from './useCartStore'

export type OrderStatus = 'Menunggu' | 'Dikemas' | 'Dikirim' | 'Selesai'

export interface OrderItem {
  _id: string
  product_id: string
  store_id: string
  store_name: string
  product_name: string
  quantity: number
  price_at_purchase: number
  image_url?: string
  size?: string
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
  loading: boolean
  fetchOrders: () => Promise<void>
  placeOrder: (payload: PlaceOrderPayload) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  payOrder: (orderId: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  fetchOrders: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/orders/my')
      if (res.data.success) {
        set({ orders: res.data.data })
      }
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      set({ loading: false })
    }
  },
  placeOrder: async (payload) => {
    try {
      const res = await api.post('/orders', payload)
      if (res.data.success) {
        // Optimistically update
        set((state) => ({ orders: [res.data.data, ...state.orders] }))
      }
    } catch (error) {
      console.error('Failed to place order', error)
      throw error
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      set((state) => ({
        orders: state.orders.map(o => o._id === orderId ? { ...o, status } : o)
      }))
    } catch (error) {
      console.error('Failed to update status', error)
      throw error
    }
  },
  payOrder: async (orderId) => {
    try {
      const res = await api.patch(`/orders/${orderId}/pay`)
      if (res.data.success) {
        set((state) => ({
          orders: state.orders.map(o => o._id === orderId ? { ...o, status: 'Dikemas' } : o)
        }))
      }
    } catch (error) {
      console.error('Failed to pay order', error)
      throw error
    }
  }
}))
