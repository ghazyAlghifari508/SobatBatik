import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Lock, Mail, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/useProductStore'
import { categories, testimonials } from '@/data/dummyData'
import { useState, useEffect } from 'react'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < rating ? 'text-[hsl(43_85%_48%)]' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  )
}

export default function Home() {
  const { products, fetchPublicProducts } = useProductStore()
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchPublicProducts()
  }, [fetchPublicProducts])

  const featuredProducts = products.filter(p => p.is_active && p.is_featured).slice(0, 4)
  const newProducts = products.filter(p => p.is_active && p.is_new).slice(0, 4)
  const allActive = products.filter(p => p.is_active)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
    alert('Terima kasih! Anda telah berlangganan newsletter SobatBatik.')
  }

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
          CATEGORIES
          ============================ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Jelajahi</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Kategori Pilihan</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan berbagai koleksi batik yang sesuai dengan gaya dan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.label}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border/60 card-hover cursor-pointer"
            >
              <div className="absolute inset-0 batik-dots opacity-50" />
              <div className="relative">
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cat.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                <div className="mt-3 text-xs font-medium text-[hsl(43_85%_42%)]">{cat.count} produk</div>
              </div>
              <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
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
            {featuredProducts.length > 0
              ? featuredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              : allActive.slice(0, 4).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ============================
          PROMO BANNER
          ============================ */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 lg:p-16 text-white">
          <div className="absolute inset-0 batik-pattern-dense opacity-15" />
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-8 bottom-0 w-48 h-48 rounded-full bg-[hsl(43_85%_48%/0.2)]" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm font-medium mb-5">
                <span className="w-2 h-2 rounded-full bg-[hsl(43_85%_68%)] animate-pulse-soft" />
                Promo Spesial
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Diskon Hingga <span className="text-[hsl(43_85%_68%)]">25%</span>
                <br />untuk Koleksi Batik Tulis
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Promo terbatas untuk koleksi batik tulis asli pilihan. Gunakan kode <strong className="text-[hsl(43_85%_68%)]">BATIKTULIS25</strong>
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 font-semibold"
                asChild
              >
                <Link to="/shop">Klaim Promo</Link>
              </Button>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-8xl font-black text-white/10 select-none leading-none">25%</div>
              <div className="text-2xl font-bold text-[hsl(43_85%_68%)]">OFF</div>
            </div>
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
          {newProducts.length > 0
            ? newProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            : allActive.slice(4, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
          }
        </div>
      </section>

      {/* ============================
          TESTIMONIALS
          ============================ */}
      <section className="py-20 bg-[hsl(37_30%_91%)] relative">
        <div className="absolute inset-0 batik-pattern opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Ulasan</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Kata Mereka</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {testimonials.map((t) => (
              <div key={t.id} className="glass-card rounded-2xl p-6 space-y-4">
                <StarRating rating={t.rating} />
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{t.comment}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="w-9 h-9 rounded-full gradient-hero flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* ============================
          NEWSLETTER
          ============================ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(25_50%_15%)]" />
        <div className="absolute inset-0 batik-pattern opacity-10" />
        <div className="absolute inset-0 batik-dots opacity-20" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-[hsl(43_85%_68%)]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tetap Update dengan Koleksi Terbaru
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Daftarkan email Anda dan dapatkan notifikasi koleksi baru, promo eksklusif, dan cerita di balik setiap batik.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="newsletter-email-input"
              className="flex-1 h-12 px-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-[hsl(43_85%_58%)] focus:bg-white/15 transition-all"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-6 rounded-2xl bg-[hsl(43_85%_48%)] hover:bg-[hsl(43_85%_42%)] text-[hsl(25_50%_12%)] font-semibold shrink-0"
            >
              Berlangganan
            </Button>
          </form>
          <p className="text-white/40 text-xs mt-4">
            Tidak ada spam. Berhenti berlangganan kapan saja.
          </p>
        </div>
      </section>

    </div>
  )
}
