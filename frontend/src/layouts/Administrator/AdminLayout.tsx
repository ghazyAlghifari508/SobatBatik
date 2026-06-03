import { Outlet, Link, useLocation } from 'react-router-dom'
import { Store, LayoutDashboard, CheckSquare, Users, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()

  // Data menu navigasi
  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Persetujuan Toko', path: '/admin/approvals', icon: <CheckSquare className="w-5 h-5" /> },
    { title: 'Monitoring', path: '/admin/monitoring', icon: <Store className="w-5 h-5" /> },
    { title: 'Manajemen Pengguna', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Store className="w-6 h-6" /> SobatBatik Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header / Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Administrator Utama</p>
              <p className="text-xs text-gray-500">admin@sobatbatik.com</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (di sinilah AdminApprovals bakal muncul) */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}