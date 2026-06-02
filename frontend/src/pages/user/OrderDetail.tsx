import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrderStore } from '@/store/useOrderStore'
import type { OrderStatus } from '@/store/useOrderStore'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, MapPin, CreditCard, Check, Clock, Truck, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusSteps: { status: OrderStatus; label: string; Icon: typeof Clock }[] = [
  { status: 'Menunggu', label: 'Pembayaran Dikonfirmasi', Icon: Clock },
  { status: 'Dikemas', label: 'Pesanan Dikemas', Icon: Package },
  { status: 'Dikirim', label: 'Dalam Pengiriman', Icon: Truck },
  { status: 'Selesai', label: 'Pesanan Diterima', Icon: CheckCircle },
]

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders } = useOrderStore()
  const order = orders.find(o => o._id === id)

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
                <div key={item._id} className="flex gap-4 p-3 rounded-xl bg-muted/40">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      : <Package className="h-6 w-6 m-auto mt-5 text-muted-foreground" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.store_name}</p>
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-primary">
                      Rp {(item.price_at_purchase * item.quantity).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Rp {item.price_at_purchase.toLocaleString('id-ID')} / item
                    </p>
                  </div>
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
              <Button className="w-full rounded-xl">Beli Lagi</Button>
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
