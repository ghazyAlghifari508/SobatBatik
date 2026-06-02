import { create } from 'zustand'

export type AppStatus = 'Menunggu' | 'Disetujui' | 'Ditolak'

export interface StoreApplication {
  _id: string
  user_id: string
  user_name: string
  store_name: string
  description: string
  address: string
  status: AppStatus
  rejection_reason?: string
  applied_at: string
}

interface StoreAppState {
  applications: StoreApplication[]
  applyStore: (app: Omit<StoreApplication, '_id' | 'status' | 'rejection_reason' | 'applied_at'>) => void
  updateStatus: (id: string, status: AppStatus, reason?: string) => void
}

const mockApps: StoreApplication[] = [
  {
    _id: "app1",
    user_id: "u2",
    user_name: "Siti",
    store_name: "Batik Tiga Negeri",
    description: "Menjual batik tulis khas Pekalongan",
    address: "Pekalongan Utara",
    status: "Menunggu",
    applied_at: new Date().toISOString()
  }
]

export const useStoreAppStore = create<StoreAppState>((set) => ({
  applications: mockApps,
  applyStore: (app) => set((state) => ({
    applications: [{
      ...app,
      _id: Math.random().toString(36).substr(2, 9),
      status: 'Menunggu',
      applied_at: new Date().toISOString()
    }, ...state.applications]
  })),
  updateStatus: (id, status, reason) => set((state) => ({
    applications: state.applications.map(app => 
      app._id === id ? { ...app, status, rejection_reason: reason } : app
    )
  }))
}))
