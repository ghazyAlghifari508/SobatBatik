import { Outlet, useLocation, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/store/useAuthStore'

export default function MainLayout() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  // Jika store atau admin mencoba mengakses area publik (termasuk root /), redirect ke dashboard mereka
  if (isAuthenticated && user) {
    if (user.role === 'store' && !location.pathname.startsWith('/store')) {
      return <Navigate to="/store" replace />
    }
    if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />
    }
  }

  // Cegah user biasa yang sudah login masuk kembali ke halaman auth
  if (isAuthenticated && user?.role === 'user' && isAuthPage) {
    const { hasPendingStoreApp } = useAuthStore.getState()
    if (hasPendingStoreApp) {
      return <Navigate to="/store/pending" replace />
    }
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}
      <Toaster richColors position="top-right" />
    </div>
  )
}
