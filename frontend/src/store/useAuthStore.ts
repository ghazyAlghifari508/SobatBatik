import { create } from 'zustand'

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
  login: (email: string, role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, role) => set({
    user: {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    },
    isAuthenticated: true
  }),
  logout: () => set({ user: null, isAuthenticated: false })
}))
