import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const { loginWithData } = useAuthStore()
  const navigate = useNavigate()

  const passwordMatch = password && confirm && password === confirm
  const passwordStrength = password.length >= 8 ? (password.length >= 12 ? 'kuat' : 'sedang') : password.length > 0 ? 'lemah' : ''

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    
    try {
      // Panggil API register ke backend
      const res = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      })
      
      if (res.data.success) {
        // Setelah berhasil daftar, langsung login dan set token/user data
        loginWithData(res.data.data.user, res.data.data.token)
        navigate('/')
      }
    } catch (error: any) {
      console.error('Register failed:', error)
      alert(error.response?.data?.message || 'Registrasi gagal. Pastikan API backend berjalan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-[#FDFBF7] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 batik-pattern opacity-5" />
        <div className="relative flex flex-col justify-center px-14 text-stone-800">
          <Link to="/" className="inline-block mb-14 group transition-transform hover:-translate-y-2">
             <img src="/logo.png" alt="SobatBatik Logo" className="w-72 h-auto mix-blend-multiply drop-shadow-sm" />
          </Link>
          <h2 className="text-3xl font-bold mb-4 leading-tight text-stone-900">Bergabung Bersama<br />Pecinta Batik Indonesia</h2>
          <p className="text-stone-600 mb-10">Daftarkan diri dan mulai perjalanan Anda mengeksplorasi kekayaan batik nusantara.</p>
          <div className="space-y-4">
            {[
              'Akses ke 500+ koleksi eksklusif',
              'Notifikasi koleksi & promo terbaru',
              'Riwayat pesanan tersimpan aman',
              'Daftar menjadi penjual batik',
            ].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8B4513]/10 text-[#8B4513] flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-stone-700 font-medium text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Register Form */}
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
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Buat Akun</h1>
            <p className="text-muted-foreground mt-2">Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
            </p>
          </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="register-name">Nama Lengkap</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-phone">Nomor Telepon</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="08xx-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1 flex-1">
                      {['lemah', 'sedang', 'kuat'].map((s, i) => (
                        <div key={s} className={cn(
                          'h-1.5 flex-1 rounded-full transition-colors',
                          passwordStrength === 'lemah' && i === 0 ? 'bg-red-500' :
                            passwordStrength === 'sedang' && i <= 1 ? 'bg-yellow-500' :
                              passwordStrength === 'kuat' ? 'bg-green-500' : 'bg-muted'
                        )} />
                      ))}
                    </div>
                    <span className={cn('text-xs font-medium',
                      passwordStrength === 'kuat' ? 'text-green-600' :
                        passwordStrength === 'sedang' ? 'text-yellow-600' : 'text-red-600'
                    )}>
                      {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-confirm">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className={cn('h-11 rounded-xl pr-10', confirm && (passwordMatch ? 'border-green-500' : 'border-red-400'))}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirm && !passwordMatch && (
                  <p className="text-xs text-red-500">Password tidak cocok</p>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={cn(
                    'w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-all',
                    agreed ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
                  )}
                >
                  {agreed && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-muted-foreground">
                  Saya menyetujui{' '}
                  <Link to="#" className="text-primary hover:underline">Syarat & Ketentuan</Link>{' '}
                  dan{' '}
                  <Link to="#" className="text-primary hover:underline">Kebijakan Privasi</Link>
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-2xl text-base font-semibold"
                disabled={loading || !agreed || !passwordMatch}
              >
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mendaftar...</> : 'Buat Akun'}
              </Button>
            </form>
        </div>
      </div>
    </div>
  )
}
