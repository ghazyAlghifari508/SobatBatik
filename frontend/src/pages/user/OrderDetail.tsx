import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrderStore } from '@/store/useOrderStore'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import type { OrderStatus } from '@/store/useOrderStore'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, MapPin, CreditCard, Check, Clock, Truck, CheckCircle, Star, ImagePlus, X, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'

const statusSteps: { status: OrderStatus; label: string; Icon: typeof Clock }[] = [
  { status: 'Menunggu', label: 'Pesanan Dibuat', Icon: Clock },
  { status: 'Dikemas', label: 'Pesanan Dikemas', Icon: Package },
  { status: 'Dikirim', label: 'Dalam Pengiriman', Icon: Truck },
  { status: 'Selesai', label: 'Pesanan Diterima', Icon: CheckCircle },
]

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders } = useOrderStore()
  const { addItem } = useCartStore()
  const { user } = useAuthStore()
  const order = orders.find(o => o._id === id)

  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [buyingAgain, setBuyingAgain] = useState(false)
  // Set of product IDs yang sudah di-review user ini
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set())

  // Saat halaman dibuka: cek produk mana yang sudah di-review user ini
  useEffect(() => {
    if (!order || !user) return
    const checkReviewed = async () => {
      const reviewed = new Set<string>()
      for (const item of order.items) {
        try {
          const res = await api.get(`/products/${item.product_id}/reviews`)
          if (res.data.success) {
            const alreadyReviewed = res.data.data.some(
              (r: { user_id: string }) => r.user_id === user.id
            )
            if (alreadyReviewed) reviewed.add(item.product_id)
          }
        } catch { /* skip per-item error */ }
      }
      setReviewedProductIds(reviewed)
    }
    checkReviewed()
  }, [order?._id, user?.id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReviewImage(file)
    setReviewImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setReviewImage(null)
    setReviewImagePreview(null)
  }

  const resetReviewForm = () => {
    setReviewingItemId(null)
    setComment('')
    setRating(5)
    setReviewImage(null)
    setReviewImagePreview(null)
  }

  const handleSubmitReview = async (productId: string) => {
    if (!comment.trim()) return toast.error('Komentar tidak boleh kosong')
    setSubmittingReview(true)
    try {
      const formData = new FormData()
      formData.append('rating', String(rating))
      formData.append('comment', comment)
      formData.append('order_id', order?._id || '')
      if (reviewImage) formData.append('image', reviewImage)

      const res = await api.post(`/products/${productId}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        toast.success('Ulasan berhasil ditambahkan!')
        // Tandai produk ini sudah di-review — sembunyikan tombol Beri Ulasan
        setReviewedProductIds(prev => new Set([...prev, productId]))
        resetReviewForm()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan ulasan')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleBuyAgain = async () => {
    if (!order) return
    setBuyingAgain(true)
    try {
      // Fetch current product data to check live stock
      let anyAdded = false
      for (const item of order.items) {
        const res = await api.get(`/products/${item.product_id}`)
        if (!res.data.success) continue
        const product = res.data.data

        if (!product.is_active || product.stock === 0) {
          toast.error(`${item.product_name} — stok habis atau produk tidak tersedia`)
          continue
        }

        const added = addItem(product, item.size || undefined)
        if (added) {
          anyAdded = true
        } else {
          toast.error(`${item.product_name} — stok tidak mencukupi`)
        }
      }
      if (anyAdded) {
        toast.success('Produk ditambahkan ke keranjang!')
        navigate('/cart')
      }
    } catch {
      toast.error('Gagal memuat data produk')
    } finally {
      setBuyingAgain(false)
    }
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Pesanan tidak ditemukan</h2>
        <Button onClick={() => navigate('/user/orders')}>Kembali ke Pesanan</Button>
      </div>
    )
  }

  const currentStep = statusSteps.findIndex(s => s.status === order.status)
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const subtotal = order.items.reduce((sum, i) => sum + i.price_at_purchase * i.quantity, 0)
  const shipping = order.total_price - subtotal

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/user/orders')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detail Pesanan</h1>
          <p className="text-sm text-muted-foreground font-mono">{order._id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Status Timeline */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-bold mb-6">Status Pesanan</h2>
            <div className="relative">
              {statusSteps.map(({ status, label, Icon }, i) => {
                const done = i <= currentStep
                const active = i === currentStep
                return (
                  <div key={status} className="flex gap-4 pb-6 last:pb-0 relative">
                    {i < statusSteps.length - 1 && (
                      <div className={cn(
                        'absolute left-4 top-8 w-0.5 h-full -translate-x-0.5',
                        done && i < currentStep ? 'bg-primary' : 'bg-border'
                      )} />
                    )}
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all',
                      done ? 'gradient-hero text-white shadow-md' : 'bg-muted border-2 border-border text-muted-foreground'
                    )}>
                      {i < currentStep
                        ? <Check className="h-4 w-4" />
                        : <Icon className="h-4 w-4" />
                      }
                    </div>
                    <div className={cn('flex-1 pt-1', !done && 'opacity-50')}>
                      <p className={cn('text-sm font-semibold', active && 'text-primary')}>{label}</p>
                      {active && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(order.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ordered Items */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-bold mb-4">Produk yang Dipesan</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item._id}>
                  <div className="flex gap-4 p-3 rounded-xl bg-muted/40">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      {item.image_url
                        ? <img src={getImageUrl(item.image_url)} alt={item.product_name} className="w-full h-full object-cover" />
                        : <Package className="h-6 w-6 m-auto mt-5 text-muted-foreground" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.store_name}</p>
                      <p className="text-xs text-muted-foreground">
                        × {item.quantity}
                        {item.size ? ` · Ukuran: ${item.size}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-primary">
                        Rp {(item.price_at_purchase * item.quantity).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rp {item.price_at_purchase.toLocaleString('id-ID')} / item
                      </p>
                      {order.status === 'Selesai' && (
                        reviewedProductIds.has(item.product_id) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-7 border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive/5 opacity-80 cursor-not-allowed"
                            disabled
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Telah Diulas
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-7"
                            onClick={() => {
                              if (reviewingItemId === item._id) {
                                resetReviewForm()
                              } else {
                                resetReviewForm()
                                setReviewingItemId(item._id)
                              }
                            }}
                          >
                            Beri Ulasan
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Review Form */}
                  {reviewingItemId === item._id && (
                    <div className="mt-3 p-4 bg-background rounded-xl border border-border animate-fade-in space-y-3">
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Rating:</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                              <Star className={cn('w-5 h-5', rating >= star ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]' : 'text-muted-foreground/30')} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Komentar */}
                      <Textarea
                        placeholder="Bagaimana kualitas produk ini?"
                        className="resize-none"
                        rows={3}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />

                      {/* Upload Foto Bukti */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Foto Bukti (opsional, maks. 5MB)</p>
                        {reviewImagePreview ? (
                          <div className="relative w-24 h-24 group">
                            <img src={reviewImagePreview} alt="preview" className="w-full h-full object-cover rounded-xl border border-border" />
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 w-fit cursor-pointer px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors">
                            <ImagePlus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Unggah foto</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={resetReviewForm}>Batal</Button>
                        <Button size="sm" disabled={submittingReview} onClick={() => handleSubmitReview(item.product_id)}>
                          {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Shipping Info */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="font-bold">Alamat Pengiriman</h2>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">{order.user_name}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{order.shipping_address}</p>
          </div>

          {/* Payment Summary */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-primary" />
              <h2 className="font-bold">Ringkasan Pembayaran</h2>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkos Kirim</span>
                <span>{shipping === 0 ? 'Gratis' : `Rp ${shipping.toLocaleString('id-ID')}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rp {order.total_price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {order.status === 'Selesai' && (
              <Button
                className="w-full rounded-xl gap-2"
                onClick={handleBuyAgain}
                disabled={buyingAgain}
              >
                <ShoppingCart className="h-4 w-4" />
                {buyingAgain ? 'Memproses...' : 'Beli Lagi'}
              </Button>
            )}
            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link to="/user/orders">← Kembali ke Pesanan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
