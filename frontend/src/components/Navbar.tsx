import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useCartStore } from '@/store/useCartStore'
import {
  ShoppingCart, Heart, Search, User, LogOut, Menu, X,
  ChevronDown, Store, LayoutDashboard, Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Toko', to: '/shop' },
  { label: 'Tentang', to: '/about' },
  { label: 'Kontak', to: '/contact' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { items } = useCartStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-warm shadow-sm border-b border-[hsl(25_20%_82%/0.5)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group shrink-0"
            >
              <div className="p-1.5 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl border border-border/50 shadow-sm transition-all group-hover:shadow-md group-hover:scale-105">
                <img src="/logo.png" alt="SobatBatik" className="h-9 w-auto object-contain" />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive(link.to)
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-foreground/70 hover:text-primary"
                onClick={() => setSearchOpen(true)}
                id="navbar-search-btn"
                aria-label="Cari produk"
              >
                <Search className="h-4.5 w-4.5" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-foreground/70 hover:text-primary"
                asChild
              >
                <Link to="/wishlist" aria-label="Wishlist">
                  <Heart className="h-4.5 w-4.5" />
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-foreground/70 hover:text-primary relative"
                asChild
              >
                <Link to="/cart" aria-label="Keranjang belanja">
                  <ShoppingCart className="h-4.5 w-4.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 rounded-full gradient-hero text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Profile / Auth */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      id="navbar-profile-btn"
                      className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-foreground/80 group-hover:text-primary max-w-[80px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 glass-card rounded-2xl shadow-xl mt-2 p-1">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    {user.role === 'user' && (
                      <>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                          <Link to="/user/profile" className="flex items-center gap-2.5">
                            <User className="h-4 w-4" /> Profil Saya
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                          <Link to="/user/orders" className="flex items-center gap-2.5">
                            <Package className="h-4 w-4" /> Pesanan Saya
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                          <Link to="/user/apply-store" className="flex items-center gap-2.5">
                            <Store className="h-4 w-4" /> Daftar Jadi Penjual
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {(user.role === 'store' || user.role === 'admin') && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to={`/${user.role}`} className="flex items-center gap-2.5">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2.5" /> Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-sm rounded-xl" asChild>
                    <Link to="/login">Masuk</Link>
                  </Button>
                  <Button size="sm" className="h-8 px-3 text-sm rounded-xl" asChild>
                    <Link to="/register">Daftar</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl lg:hidden ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-warm border-t border-border/50 animate-fade-in">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl" asChild>
                    <Link to="/login">Masuk</Link>
                  </Button>
                  <Button className="flex-1 rounded-xl" asChild>
                    <Link to="/register">Daftar</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl glass-card rounded-2xl shadow-2xl p-2 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3 px-2">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Cari batik, motif, atau daerah asal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground py-3"
                id="navbar-search-input"
              />
              <Button type="submit" size="sm" className="rounded-xl">Cari</Button>
            </form>
            <div className="px-4 pb-3 pt-1">
              <p className="text-xs text-muted-foreground">Tekan Esc untuk menutup</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
