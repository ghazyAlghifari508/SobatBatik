import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/axios'
import { Clock, CheckCircle2, XCircle, Store, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ApplicationData {
  _id: string
  store_name: string
  description: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  applied_at: string
  reviewed_at: string | null
}

export default function StorePending() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore()
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Guard: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('sobatbatik_token')
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  // If user is already a store, redirect
  useEffect(() => {
    if (user?.role === 'store') {
      navigate('/store', { replace: true })
    }
  }, [user, navigate])

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get('/store-applications/application/status')
      if (res.data.success) {
        const app = res.data.data
        setApplication(app)

        // If approved, update user role and redirect to store dashboard
        if (app.status === 'approved') {
          updateUser({ role: 'store' })
          
          if (app.new_token) {
            localStorage.setItem('sobatbatik_token', app.new_token)
          }

          // Small delay to show the success UI, then redirect
          setTimeout(() => {
            navigate('/store', { replace: true })
          }, 2500)
        }

        // Jika status ditolak, kita biarkan saja (jangan auto-logout atau hapus).
        // User dapat melihat alasan penolakan, lalu klik "Daftar Ulang" yang akan memanggil logout() dan navigasi.
        if (app.status === 'rejected') {
          // No action needed here, UI will handle displaying the rejected state
        }
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Tidak ada pengajuan toko ditemukan.')
      } else if (err.response?.status === 401) {
        navigate('/login', { replace: true })
      } else {
        setError('Gagal memuat status pengajuan.')
      }
    } finally {
      setLoading(false)
    }
  }, [updateUser, navigate])

  useEffect(() => {
    fetchStatus()

    // Poll every 5 seconds to check for approval
    const interval = setInterval(() => {
      fetchStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchStatus])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat status pengajuan...</p>
        </div>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="max-w-md text-center p-8">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">Kembali ke Beranda</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 batik-pattern opacity-5" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#8B4513]/5 animate-float" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#D4A017]/5 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-lg mx-4">
        <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
          
          {/* Header */}
          <div className="gradient-hero px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm mb-5">
              {application?.status === 'pending' && <Clock className="h-10 w-10 text-white" />}
              {application?.status === 'approved' && <CheckCircle2 className="h-10 w-10 text-white" />}
              {application?.status === 'rejected' && <XCircle className="h-10 w-10 text-white" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {application?.status === 'pending' && 'Menunggu Persetujuan'}
              {application?.status === 'approved' && 'Toko Disetujui! 🎉'}
              {application?.status === 'rejected' && 'Pengajuan Ditolak'}
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              {application?.status === 'pending' && 'Pengajuan toko Anda sedang ditinjau oleh tim admin kami'}
              {application?.status === 'approved' && 'Selamat! Anda akan diarahkan ke dashboard toko'}
              {application?.status === 'rejected' && 'Mohon maaf, pengajuan toko Anda belum dapat disetujui'}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-6">
            
            {/* Store Info */}
            <div className="bg-muted/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{application?.store_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Diajukan {application?.applied_at ? new Date(application.applied_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0 w-20">Deskripsi</span>
                  <span className="text-foreground">{application?.description}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground shrink-0 w-20">Alamat</span>
                  <span className="text-foreground">{application?.address}</span>
                </div>
              </div>
            </div>

            {/* Status-specific content */}
            {application?.status === 'pending' && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Sedang ditinjau admin</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Halaman ini akan otomatis memperbarui. Anda tidak perlu me-refresh secara manual.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchStatus}
                  className="rounded-xl"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cek Status
                </Button>
              </div>
            )}

            {application?.status === 'approved' && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-700 rounded-2xl p-4 text-sm">
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-2" />
                  <p className="font-medium">Toko Anda sudah aktif!</p>
                  <p className="text-green-600 mt-1">Mengalihkan ke dashboard toko...</p>
                </div>
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}

            {application?.status === 'rejected' && (
              <div className="space-y-4">
                <div className="bg-red-50 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-red-800 mb-2">Alasan Penolakan:</p>
                  <p className="text-sm text-red-700">{application.rejection_reason}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => { logout(); navigate('/register'); }} 
                    className="flex-1 rounded-xl"
                  >
                    Daftar Ulang
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex-1 rounded-xl"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
