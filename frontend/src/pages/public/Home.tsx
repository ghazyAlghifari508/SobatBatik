import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/useProductStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export default function Home() {
  const { products, fetchPublicProducts } = useProductStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchPublicProducts()
  }, [fetchPublicProducts])

  const allActive = products.filter(p => p.is_active)

  // Produk Pilihan: Berdasarkan rating tertinggi, lalu jumlah ulasan
  const highQualityProducts = [...allActive].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviews_count - a.reviews_count;
  }).slice(0, 4)

  // Produk Terbaru: Berdasarkan tanggal dibuat paling baru
  const newestProducts = [...allActive].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).slice(0, 4)

  return (
    <div className="overflow-x-hidden">

      {/* ============================
          HERO SECTION
          ============================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 batik-pattern-dense opacity-20" />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 animate-float" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-[hsl(43_85%_48%/0.15)] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 text-[hsl(43_85%_68%)]" />
              Koleksi Batik Autentik Nusantara
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Temukan{' '}
              <span className="text-gradient-gold">
                Keindahan
              </span>
              <br />
              Batik Indonesia
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-10">
              SobatBatik menghadirkan koleksi batik autentik dari pengrajin lokal terbaik di seluruh nusantara —
              dirajut dengan cinta, diwariskan lintas generasi.
            </p>

            <div className="flex flex-wrap gap-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-13 text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
                    asChild
                  >
                    <Link to="/login">
                      Masuk Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 rounded-2xl px-8 h-13 text-base font-semibold backdrop-blur-sm"
                    asChild
                  >
                    <Link to="/register">Daftar Sekarang</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 h-13 text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
                    asChild
                  >
                    <Link to="/shop">
                      Belanja Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 rounded-2xl px-8 h-13 text-base font-semibold backdrop-blur-sm"
                    asChild
                  >
                    <Link to="/shop">Jelajahi Koleksi</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: '500+', label: 'Produk Batik' },
                { value: '50+', label: 'Pengrajin Lokal' },
                { value: '10.000+', label: 'Pembeli Puas' },
              ].map(({ value, label }) => (
                <div key={label} className="text-white">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-white/70">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ============================
          FEATURED PRODUCTS
          ============================ */}
      <section className="py-20 bg-[hsl(37_30%_91%)] relative">
        <div className="absolute inset-0 batik-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Koleksi Unggulan</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Produk Pilihan</h2>
            </div>
            <Button variant="outline" className="rounded-xl self-start sm:self-auto" asChild>
              <Link to="/shop">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {highQualityProducts.length > 0
              ? highQualityProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              : <p className="text-muted-foreground col-span-full">Belum ada produk pilihan.</p>
            }
          </div>
        </div>
      </section>


      {/* ============================
          NEW ARRIVALS
          ============================ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Terbaru</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Koleksi Baru</h2>
          </div>
          <Button variant="outline" className="rounded-xl self-start sm:self-auto" asChild>
            <Link to="/shop?sort=newest">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {newestProducts.length > 0
            ? newestProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            : <p className="text-muted-foreground col-span-full">Belum ada produk terbaru.</p>
          }
        </div>
      </section>


      {/* ============================
          BENEFITS
          ============================ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Shield, title: '100% Autentik', desc: 'Setiap produk terverifikasi langsung dari pengrajin batik Indonesia', color: 'text-primary' },
            { Icon: Truck, title: 'Pengiriman Cepat', desc: 'Estimasi 2-5 hari kerja ke seluruh Indonesia dengan kemasan aman', color: 'text-[hsl(43_85%_42%)]' },
            { Icon: RotateCcw, title: 'Mudah Dikembalikan', desc: 'Tidak puas? Kembalikan produk dalam 14 hari tanpa pertanyaan', color: 'text-[hsl(0_65%_30%)]' },
            { Icon: Lock, title: 'Pembayaran Aman', desc: 'Transaksi dilindungi enkripsi SSL berstandar bank', color: 'text-green-600' },
          ].map(({ Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/60 card-hover">
              <div className={`w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>



    </div>
  )
}
