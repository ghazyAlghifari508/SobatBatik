import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/ProductCard'
import {
  ShoppingCart, Store, Star, Minus, Plus,
  Heart, Share2, Shield, Truck, PackageX, Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, getImageUrl } from '@/lib/utils'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading, fetchPublicProducts } = useProductStore()
  const { addItem } = useCartStore()

  useEffect(() => {
    if (products.length === 0) {
      fetchPublicProducts()
    }
  }, [products.length, fetchPublicProducts])

  const product = products.find(p => p._id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')

  if (loading && !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p>Memuat detail produk...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <PackageX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <Button onClick={() => navigate('/shop')}>Kembali ke Toko</Button>
      </div>
    )
  }

  const related = products
    .filter(p => p.is_active && p._id !== id && (p.category === product.category || p.origin_region === product.origin_region))
    .slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product)
    toast.success(`${product.name} × ${quantity} ditambahkan ke keranjang!`)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addItem(product)
    navigate('/cart')
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const dummyReviews = [
    { id: 1, name: 'Anisa R.', rating: 5, date: '10 Nov 2024', comment: 'Kualitas luar biasa! Warna sangat cerah dan bahan nyaman dipakai.', avatar: 'AR' },
    { id: 2, name: 'Budi S.', rating: 4, date: '5 Nov 2024', comment: 'Motifnya indah dan sesuai foto. Pengiriman cepat. Sangat puas!', avatar: 'BS' },
    { id: 3, name: 'Citra M.', rating: 5, date: '1 Nov 2024', comment: 'Sudah beli beberapa kali di sini, selalu memuaskan. Recommended!', avatar: 'CM' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Toko</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">

        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted group">
            <img
              src={getImageUrl(product.image_urls?.[activeImage] || product.image_urls?.[0])}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.is_new && (
              <div className="absolute top-4 left-4">
                <Badge className="rounded-xl text-sm px-3 py-1">Baru</Badge>
              </div>
            )}
            {product.discount_percent && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-xl text-sm font-bold bg-[hsl(0_65%_30%)] text-white">
                  -{product.discount_percent}%
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex gap-3">
              {product.image_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                    activeImage === i ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={getImageUrl(url)} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-xl">{product.category}</Badge>
            <Badge variant="outline" className="rounded-xl">{product.origin_region}</Badge>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Store className="h-4 w-4" />
              <Link to="/shop" className="hover:text-primary transition-colors">{product.store_name}</Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(product.rating || 0)
                      ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">({product.reviews_count || 0} ulasan)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-primary">
              Rp {(product.discount_percent
                ? product.price * (1 - product.discount_percent / 100)
                : product.price
              ).toLocaleString('id-ID')}
            </div>
            {product.discount_percent && (
              <div className="text-xl text-muted-foreground line-through mb-1">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Material', value: product.material },
              { label: 'Motif', value: product.pattern },
              { label: 'Asal Daerah', value: product.origin_region },
              { label: 'Stok', value: `${product.stock} pcs` },
            ].map(({ label, value }) => (
              <div key={label} className="glass-card rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                <div className="text-sm font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>

          {/* Size Selector */}
          {product.category !== 'Kain' && product.category !== 'Aksesori' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">Ukuran</p>
                <button className="text-xs text-primary hover:underline">Panduan Ukuran</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-11 h-11 rounded-xl text-sm font-medium border-2 transition-all',
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border hover:border-primary text-foreground'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Jumlah</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0 rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  disabled={quantity >= product.stock}
                  aria-label="Tambah jumlah"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">Sisa {product.stock} produk</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              size="lg"
              className="flex-1 h-13 rounded-2xl text-base font-semibold gap-2 shadow-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 h-13 rounded-2xl text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Beli Sekarang
            </Button>
          </div>

          {/* Secondary actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                wishlisted
                  ? 'border-red-400 text-red-500 bg-red-50'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              )}
            >
              <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
              {wishlisted ? 'Tersimpan' : 'Simpan'}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.info('Link disalin!') }}
            >
              <Share2 className="h-4 w-4" /> Bagikan
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span>Produk 100% autentik</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>Gratis ongkir min. Rp 300rb</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="glass-card rounded-3xl p-8 mb-12">
        <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
        <p className="text-foreground/80 leading-relaxed">{product.description}</p>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Ulasan Pembeli</h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < Math.floor(product.rating || 0) ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]' : 'text-muted-foreground/30')} />
              ))}
            </div>
            <span className="font-bold">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">dari {product.reviews_count || 0} ulasan</span>
          </div>
        </div>
        <div className="space-y-4">
          {dummyReviews.map(review => (
            <div key={review.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full gradient-hero flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{review.name}</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]' : 'text-muted-foreground/30')} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
