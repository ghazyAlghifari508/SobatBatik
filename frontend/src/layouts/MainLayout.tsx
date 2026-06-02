import { Link, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { ShoppingCart, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            SobatBatik
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Hai, {user?.name}</span>
                {user?.role === 'user' && (
                  <Link to="/user/orders">
                    <Button variant="outline" size="sm">Pesanan Saya</Button>
                  </Link>
                )}
                {(user?.role === 'store' || user?.role === 'admin') && (
                  <Link to={`/${user.role}`}>
                    <Button variant="default" size="sm">Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">Daftar</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SobatBatik. Platform e-commerce batik Indonesia.
      </footer>
      <Toaster />
    </div>
  )
}
