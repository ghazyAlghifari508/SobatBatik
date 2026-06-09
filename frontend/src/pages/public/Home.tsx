import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { useProductStore } from '@/store/useProductStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useRef } from 'react'
import { getImageUrl } from '@/lib/utils'

export default function Home() {
  const { products, fetchPublicProducts } = useProductStore()
  const { isAuthenticated } = useAuthStore()
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPublicProducts()
  }, [fetchPublicProducts])

  // Infinite auto-scroll and drag-to-scroll logic
  useEffect(() => {
    const slider = carouselRef.current
    if (!slider) return

    let animationFrameId: number
    let isHovered = false
    let isDown = false
    let startX: number
    let scrollLeft: number

    let fractionalScroll = 0

    // Auto scroll logic
    const autoScroll = () => {
      // Only auto-scroll if it's actually scrollable
      if (slider.scrollWidth > slider.clientWidth) {
        if (!isHovered && !isDown) {
          fractionalScroll += 0.5 // Kecepatan scroll
          if (fractionalScroll >= 1) {
            const intScroll = Math.floor(fractionalScroll)
            slider.scrollLeft += intScroll
            fractionalScroll -= intScroll
          }
          
          if (slider.scrollLeft >= slider.scrollWidth / 2) {
            slider.scrollLeft = 0
            fractionalScroll = 0
          }
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    // Drag to scroll logic
    const mouseDown = (e: MouseEvent) => {
      isDown = true
      slider.style.cursor = 'grabbing'
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
    }
    const mouseLeave = () => {
      isDown = false
      isHovered = false
      slider.style.cursor = 'grab'
    }
    const mouseUp = () => {
      isDown = false
      slider.style.cursor = 'grab'
    }
    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 2
      slider.scrollLeft = scrollLeft - walk
    }
    const mouseEnter = () => {
      isHovered = true
    }

    slider.style.cursor = 'grab'
    slider.addEventListener('mousedown', mouseDown)
    slider.addEventListener('mouseleave', mouseLeave)
    slider.addEventListener('mouseup', mouseUp)
    slider.addEventListener('mousemove', mouseMove)
    slider.addEventListener('mouseenter', mouseEnter)
    
    // Touch events for hover pausing
    const touchStart = () => { isHovered = true }
    const touchEnd = () => { isHovered = false }
    slider.addEventListener('touchstart', touchStart, { passive: true })
    slider.addEventListener('touchend', touchEnd)

    animationFrameId = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
      slider.removeEventListener('mousedown', mouseDown)
      slider.removeEventListener('mouseleave', mouseLeave)
      slider.removeEventListener('mouseup', mouseUp)
      slider.removeEventListener('mousemove', mouseMove)
      slider.removeEventListener('mouseenter', mouseEnter)
      slider.removeEventListener('touchstart', touchStart)
      slider.removeEventListener('touchend', touchEnd)
    }
  }, [products])

  const allActive = products.filter(p => p.is_active)

  // Best Seller: Berdasarkan jumlah ulasan terbanyak (menggambarkan paling banyak terjual)
  const bestSellerProducts = [...allActive].sort((a, b) => {
    if (b.reviews_count !== a.reviews_count) return (b.reviews_count || 0) - (a.reviews_count || 0);
    return (b.rating || 0) - (a.rating || 0);
  }).slice(0, 4)

  // Produk Terbaru: Berdasarkan tanggal dibuat paling baru
  const newestProducts = [...allActive].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).slice(0, 7)

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
          BEST SELLER
          ============================ */}
      <section className="py-20 bg-[hsl(37_30%_91%)] relative">
        <div className="absolute inset-0 batik-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Paling Banyak Terjual</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Best Seller</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {bestSellerProducts.length > 0
              ? bestSellerProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
              : <p className="text-muted-foreground col-span-full">Belum ada produk best seller.</p>
            }
          </div>
        </div>
      </section>

      {/* Aesthetic Ornament Divider */}
      <div className="w-full flex justify-center items-center py-12 opacity-60">
        <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent to-[hsl(43_85%_48%)]" />
        <div className="mx-6 text-[hsl(43_85%_48%)]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="h-[1px] w-1/4 bg-gradient-to-l from-transparent to-[hsl(43_85%_48%)]" />
      </div>

      {/* ============================
          NEW ARRIVALS
          ============================ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-[hsl(43_85%_42%)] uppercase tracking-widest mb-3">Terbaru</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Koleksi Baru</h2>
        </div>
        {newestProducts.length > 0 ? (
          (() => {
            // Kita pastikan array punya cukup elemen agar selalu bisa di-scroll (min 7 item per setengah bagian)
            let baseItems = [...newestProducts]
            while (baseItems.length > 0 && baseItems.length < 7) {
              baseItems = [...baseItems, ...newestProducts]
            }
            // Duplikasi 2 kali persis untuk efek infinite scroll yang mulus
            const displayProducts = [...baseItems, ...baseItems]

            return (
              <div className="relative w-full overflow-hidden pb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
                {/* Fading edges */}
                <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                
                <div 
                  ref={carouselRef}
                  id="infinite-carousel"
                  className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden select-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {displayProducts.map((product, index) => (
                    <div key={`${product._id}-${index}`} className="w-[180px] sm:w-[220px] shrink-0 pointer-events-none">
                  <div className="pointer-events-auto h-full">
                    <Link 
                      to={`/product/${product._id}`}
                      className="block group relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-muted border border-border/40 shadow-lg"
                      draggable={false}
                    >
                    <img 
                      src={getImageUrl(product.image_urls?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white text-black shadow-md">
                        BARU
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1.5 truncate">
                        {product.store_name}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[hsl(43_100%_75%)] text-sm font-bold">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <div className="w-7 h-7 rounded-full glass border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-md">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
            )
          })()
        ) : (
          <p className="text-muted-foreground">Belum ada produk terbaru.</p>
        )}
      </section>


      {/* ============================
          CULTURAL POSTER
          ============================ */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border/50">
          <div className="absolute inset-0 bg-[hsl(37_30%_91%)]" />
          <div className="absolute inset-0 batik-pattern opacity-10 mix-blend-multiply" />
          
          <div className="relative z-10 py-16 px-8 md:px-16 text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Pesona Mahakarya Nusantara
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed italic">
              "Batik bukan sekadar selembar kain, melainkan jalinan doa, filosofi, dan mahakarya seni yang telah diakui dunia. Mari lestarikan warisan budaya Indonesia dengan bangga."
            </p>
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



    </div>
  )
}
