import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { LayoutDashboard, Package, ShoppingBag, Users, CheckSquare, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  
  const storeLinks = [
    { href: '/store', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/store/products', label: 'Produk Saya', icon: Package },
    { href: '/store/orders', label: 'Pesanan Masuk', icon: ShoppingBag },
  ]
  
  const adminLinks = [
    { href: '/admin', label: 'Monitoring', icon: LayoutDashboard },
    { href: '/admin/approvals', label: 'Persetujuan Toko', icon: CheckSquare },
    { href: '/admin/monitoring', label: 'Pengguna & Toko', icon: Users },
  ]
  
  const links = user?.role === 'admin' ? adminLinks : storeLinks

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-[#FDFBF7] rounded-xl shadow-sm border border-border/50 transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="SobatBatik Logo" className="h-8 w-auto mix-blend-multiply" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground hidden sm:block">
              {user?.role === 'admin' ? 'Admin Panel' : 'Store Panel'}
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.href
            return (
              <Link key={link.href} to={link.href}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className="w-full justify-start gap-3"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b bg-background flex items-center px-8">
          <h1 className="text-lg font-semibold">
            {links.find(l => l.href === location.pathname)?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
