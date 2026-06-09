import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye, AlertTriangle, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn, getImageUrl } from '@/lib/utils'
import type { Product } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (product.sizes) {
      const availableSizes = Object.entries(product.sizes).filter(([_, stock]) => Number(stock) > 0)
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0][0])
      }
    }
    
    setQuantity(1)
    setIsModalOpen(true)
  }

  const handleConfirmAddToCart = () => {
    if (product.sizes && Object.keys(product.sizes).some(k => Number((product.sizes as any)[k]) > 0) && !selectedSize) {
      toast.error('Pilih ukuran terlebih dahulu')
      return
    }

    const success = addItem(product, selectedSize || undefined, quantity)
    if (success) {
      toast.success(`${product.name} ditambahkan ke keranjang!`, {
        description: `Rp ${(product.price * quantity).toLocaleString('id-ID')}`,
      })
      setIsModalOpen(false)
    } else {
      toast.error('Stok tidak mencukupi!', {
        description: 'Anda telah mencapai batas maksimal stok produk ini di keranjang.'
      })
    }
  }

  return (
    <>
      <Link
        to={`/product/${product._id}`}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl bg-card card-hover',
          'border border-border/60 shadow-sm',
          className
        )}
      >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={getImageUrl(product.image_urls?.[0])}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'w-full h-full object-cover card-image',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock === 0 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black text-white shadow-sm border border-white/20">
              HABIS
            </span>
          )}
          {product.is_new && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary text-primary-foreground shadow-sm">
              Baru
            </span>
          )}
        </div>

        {/* Region Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium glass text-white shadow-sm backdrop-blur-md">
            {product.origin_region}
          </span>
        </div>



        {/* Quick View */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass backdrop-blur-md text-white text-xs font-medium">
            <Eye className="h-3.5 w-3.5" />
            Lihat Detail
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Store & Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">{product.store_name}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-md shrink-0">
            {product.category}
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3 w-3',
                  i < Math.floor(product.rating || 0)
                    ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{(product.rating || 0).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
        </div>

        {/* Price + Cart Button */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="space-y-0.5">
            <div className="text-base font-bold text-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          </div>

          <Button
            size="icon"
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
            aria-label="Tambah ke keranjang"
            className="h-8 w-8 rounded-xl shadow-sm"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Low Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[11px] text-[hsl(0_65%_30%)] font-medium flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Sisa {product.stock} produk
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-[11px] text-muted-foreground font-medium">Stok habis</p>
        )}
      </div>
    </Link>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]" onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Pilih Ukuran & Jumlah</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-3">
              <img src={getImageUrl(product.image_urls?.[0])} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                <p className="text-primary font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && Object.keys(product.sizes).some(k => Number((product.sizes as any)[k]) > 0) && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Ukuran</label>
                <div className="flex gap-2">
                  {Object.entries(product.sizes).map(([size, stock]) => {
                    const available = Number(stock) > 0
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'w-10 h-10 rounded-xl border text-sm font-medium transition-all',
                          selectedSize === size
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 text-foreground',
                          !available && 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
                        )}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Jumlah</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      const maxStock = selectedSize && product.sizes 
                        ? Number(product.sizes[selectedSize as keyof typeof product.sizes]) || 0
                        : product.stock
                      setQuantity(Math.min(maxStock, quantity + 1))
                    }}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Tersisa {selectedSize && product.sizes ? Number(product.sizes[selectedSize as keyof typeof product.sizes]) || 0 : product.stock} buah
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleConfirmAddToCart}>Masukkan Keranjang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
