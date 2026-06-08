import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'user' | 'store' | 'admin'

interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  hasPendingStoreApp: boolean
  login: (email: string, role: Role) => void
  loginWithData: (user: User, token: string) => void
  updateUser: (user: Partial<User>) => void
  setPendingStoreApp: (pending: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      hasPendingStoreApp: false,
      login: (email, role) => set({
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role
        },
        isAuthenticated: true,
        token: null
      }),
      loginWithData: (user, token) => {
        localStorage.setItem('sobatbatik_token', token)
        set({ user, isAuthenticated: true, token })
      },
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      setPendingStoreApp: (pending) => set({ hasPendingStoreApp: pending }),
      logout: () => {
        localStorage.removeItem('sobatbatik_token')
        set({ user: null, isAuthenticated: false, token: null, hasPendingStoreApp: false })
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
)
