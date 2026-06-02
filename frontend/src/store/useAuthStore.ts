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
  token: string | null
  login: (email: string, role: Role) => void
  loginWithData: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
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
  logout: () => {
    localStorage.removeItem('sobatbatik_token')
    set({ user: null, isAuthenticated: false, token: null })
  }
}))
