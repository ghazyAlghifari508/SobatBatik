import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOrderStore } from '@/store/useOrderStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { OrderStatus } from '@/store/useOrderStore'
import { Button } from '@/components/ui/button'
import { Package, ChevronDown, ChevronUp, Eye, Loader2, Star, MessageSquare, CheckCircle2 } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  Menunggu: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
  Dikemas: { label: 'Sedang Dikemas', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  Dikirim: { label: 'Dalam Pengiriman', color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  Selesai: { label: 'Selesai', color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-500' },
}

export default function OrderHistory() {
  const { orders, loading, fetchOrders } = useOrderStore()
  const { user } = useAuthStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('Semua')

  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set())

  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewProduct, setReviewProduct] = useState<{ id: string, name: string, orderId: string } | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const openReviewModal = (productId: string, productName: string, orderId: string) => {
    setReviewProduct({ id: productId, name: productName, orderId })
    setRating(5)
    setComment('')
    setReviewModalOpen(true)
  }

  const submitReview = async () => {
    if (!reviewProduct) return
    if (rating < 1 || rating > 5) return toast.error('Rating tidak valid')
    
    setSubmittingReview(true)
    try {
      const res = await api.post(`/products/${reviewProduct.id}/reviews`, {
        order_id: reviewProduct.orderId,
        rating,
        comment
      })
      if (res.data.success) {
        toast.success('Ulasan berhasil dikirim!')
        setReviewedProductIds(prev => new Set([...prev, reviewProduct.id]))
        setReviewModalOpen(false)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim ulasan')
    } finally {
      setSubmittingReview(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!orders.length || !user) return
    const checkReviewed = async () => {
      const reviewed = new Set<string>()
      const productIds = new Set<string>()
      
      orders.forEach(o => {
        if (o.status === 'Selesai') {
          o.items.forEach(i => productIds.add(i.product_id))
        }
      })
      
      for (const pId of Array.from(productIds)) {
        try {
          const res = await api.get(`/products/${pId}/reviews`)
          if (res.data.success) {
            const alreadyReviewed = res.data.data.some(
              (r: { user_id: string }) => r.user_id === user.id
            )
            if (alreadyReviewed) reviewed.add(pId)
          }
        } catch { /* skip */ }
      }
      setReviewedProductIds(reviewed)
    }
    checkReviewed()
  }, [orders, user?.id])

  const statuses = ['Semua', 'Menunggu', 'Dikemas', 'Dikirim', 'Selesai']

  const filtered = filterStatus === 'Semua'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Belum Ada Pesanan</h2>
        <p className="text-muted-foreground mb-8">Mulai belanja untuk melihat riwayat pesanan Anda di sini.</p>
        <Button size="lg" className="rounded-2xl px-8" asChild>
          <Link to="/shop">Mulai Belanja</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pesanan Saya</h1>
        <p className="text-muted-foreground mt-1">{orders.length} total pesanan</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
              filterStatus === s
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:border-primary hover:text-primary'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-muted-foreground">Tidak ada pesanan dengan status "{filterStatus}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const cfg = statusConfig[order.status]
            const isExpanded = expandedId === order._id

            return (
              <div key={order._id} className="glass-card rounded-2xl overflow-hidden">
                {/* Order Header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm font-mono text-primary">{order._id}</span>
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          cfg.color
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-base font-bold text-primary">
                          Rp {order.total_price.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-muted-foreground">{order.items.length} produk</div>
                      </div>
                    </div>
                  </div>

                  {/* Product Thumbnails Preview */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item._id} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-muted">
                            <img src={getImageUrl(item.image_url)} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg border-2 border-white bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground ml-1 truncate">
                      {order.items[0].product_name}
                      {order.items.length > 1 && ` +${order.items.length - 1} lainnya`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5"
                      asChild
                    >
                      <Link to={`/user/orders/${order._id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                      </Link>
                    </Button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-all"
                    >
                      {isExpanded ? <><ChevronUp className="h-3.5 w-3.5" />Sembunyikan</> : <><ChevronDown className="h-3.5 w-3.5" />Lihat Item</>}
                    </button>
                  </div>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 bg-muted/30 space-y-3 animate-fade-in">
                    {order.items.map(item => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          {item.image_url
                            ? <img src={getImageUrl(item.image_url)} alt={item.product_name} className="w-full h-full object-cover" />
                            : <Package className="h-5 w-5 m-auto mt-3.5 text-muted-foreground" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.store_name} · × {item.quantity}
                            {item.size ? ` · Ukuran: ${item.size}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold shrink-0 mb-2">
                            Rp {(item.price_at_purchase * item.quantity).toLocaleString('id-ID')}
                          </p>
                          {order.status === 'Selesai' && (
                            reviewedProductIds.has(item.product_id) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 px-2 border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive/5 opacity-80 cursor-not-allowed"
                                disabled
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Diulas
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 px-2"
                                onClick={() => openReviewModal(item.product_id, item.product_name, order._id)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Ulas
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Beri Ulasan Produk</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-sm font-medium mb-3">{reviewProduct?.name}</p>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star className={cn('h-8 w-8', rating >= star ? 'fill-[hsl(43_85%_48%)] text-[hsl(43_85%_48%)]' : 'text-muted-foreground/30')} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="comment" className="text-sm font-medium">Komentar (Opsional)</label>
              <Textarea
                id="comment"
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModalOpen(false)} disabled={submittingReview}>Batal</Button>
            <Button onClick={submitReview} disabled={submittingReview}>
              {submittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
