import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { Role } from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, UserCheck, ShieldCheck, Truck, Lock, User, Store, Settings, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('user')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login(email, role)
    if (role === 'admin') navigate('/admin')
    else if (role === 'store') navigate('/store')
    else navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#FDFBF7] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 batik-pattern opacity-5" />
        <div className="relative flex flex-col justify-center px-16 text-stone-800">
          <Link to="/" className="inline-block mb-16 group transition-transform hover:-translate-y-2">
             <img src="/logo.png" alt="SobatBatik Logo" className="w-72 h-auto mix-blend-multiply drop-shadow-sm" />
          </Link>
          <h2 className="text-4xl font-bold mb-4 leading-tight text-stone-900">
            Selamat Datang<br />Kembali!
          </h2>
          <p className="text-stone-600 text-lg mb-10">
            Masuk ke akun Anda dan temukan ribuan koleksi batik autentik Indonesia.
          </p>
          <div className="space-y-5">
            {[
              { icon: ShieldCheck, text: '500+ Produk Batik Autentik' },
              { icon: Truck, text: 'Pengiriman ke Seluruh Indonesia' },
              { icon: Lock, text: 'Transaksi Aman & Terpercaya' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 text-[#8B4513] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-stone-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative">
        <div className="relative w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="inline-block relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#8B4513]/5 to-[#D4A017]/5 rounded-3xl blur-xl opacity-50" />
              <div className="relative p-3 bg-[#FDFBF7] rounded-2xl shadow-sm border border-border/50 transition-transform group-hover:-translate-y-1">
                <img src="/logo.png" alt="SobatBatik" className="h-12 w-auto mix-blend-multiply" />
              </div>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Masuk</h1>
            <p className="text-muted-foreground mt-2">Belum punya akun?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Daftar gratis</Link>
            </p>
          </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <button type="button" className="text-xs text-primary hover:underline">Lupa password?</button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Role Selector */}
              <div className="space-y-1.5 p-3 rounded-xl bg-muted/60 border border-border/50">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" /> Mode Demo — Pilih Peran
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {([
                    { value: 'user', label: 'Pembeli', icon: User },
                    { value: 'store', label: 'Penjual', icon: Store },
                    { value: 'admin', label: 'Admin', icon: Settings },
                  ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={cn(
                        'flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium border-2 transition-all',
                        role === value
                          ? 'border-primary bg-primary/8 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      <Icon className="h-5 w-5 mb-0.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-2xl text-base font-semibold"
                disabled={loading}
              >
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Masuk...</> : 'Masuk'}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Dengan masuk, Anda menyetujui{' '}
              <Link to="#" className="text-primary hover:underline">Syarat & Ketentuan</Link>{' '}dan{' '}
              <Link to="#" className="text-primary hover:underline">Kebijakan Privasi</Link> kami.
            </p>
        </div>
      </div>
    </div>
  )
}
