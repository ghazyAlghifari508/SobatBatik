import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'
import { cn, getImageUrl } from '@/lib/utils'

export default function Wishlist() {
  const { products, fetchPublicProducts } = useProductStore()
  const { addItem } = useCartStore()

  useEffect(() => {
    if (products.length === 0) fetchPublicProducts()
  }, [products.length, fetchPublicProducts])

  // Static wishlist — seeded with some products
  const [wishlistIds, setWishlistIds] = useState<string[]>(['p1', 'p4', 'p7', 'p8', 'p10'])

  const wishlistProducts = products.filter(p => wishlistIds.includes(p._id))

  const removeFromWishlist = (id: string) => {
    setWishlistIds(prev => prev.filter(i => i !== id))
    toast.info('Dihapus dari wishlist')
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang!`)
  }

  if (wishlistIds.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Wishlist Kosong</h2>
        <p className="text-muted-foreground mb-8">
          Simpan produk favorit Anda ke wishlist untuk membelinya nanti.
        </p>
        <Button size="lg" className="rounded-2xl px-8" asChild>
          <Link to="/shop">Jelajahi Produk</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wishlist</h1>
          <p className="text-muted-foreground mt-1">{wishlistIds.length} produk tersimpan</p>
        </div>
        <Button variant="outline" className="rounded-xl" asChild>
          <Link to="/shop">Tambah Produk</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlistProducts.map(product => {
          const discountedPrice = product.discount_percent
            ? product.price * (1 - product.discount_percent / 100)
            : null

          return (
            <div
              key={product._id}
              className="group glass-card rounded-2xl overflow-hidden card-hover"
            >
              {/* Image */}
              <Link to={`/product/${product._id}`} className="block relative aspect-[4/3] overflow-hidden">
                <img
                  src={getImageUrl(product.image_urls?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover card-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Remove from wishlist */}
                <button
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(product._id) }}
                  aria-label="Hapus dari wishlist"
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl glass flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50/80 transition-all"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </Link>

              {/* Content */}
              <div className="p-4 space-y-2.5">
                <p className="text-xs text-muted-foreground">{product.store_name}</p>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn('h-3 w-3',
                        i < Math.floor(product.rating || 0)
                          ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]'
                          : 'text-muted-foreground/30'
                      )} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary">
                      Rp {(discountedPrice ?? product.price).toLocaleString('id-ID')}
                    </p>
                    {discountedPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                  {product.discount_percent && (
                    <span className="text-xs font-bold text-[hsl(0_65%_30%)] bg-[hsl(0_65%_30%/0.1)] px-2 py-0.5 rounded-md">
                      -{product.discount_percent}%
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 h-9 rounded-xl text-xs gap-1.5"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.stock === 0 ? 'Habis' : 'Ke Keranjang'}
                  </Button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    aria-label="Hapus dari wishlist"
                    className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
