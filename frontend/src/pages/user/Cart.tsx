import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, Gift, Lock, Truck, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 300000 ? 0 : 15000
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Keranjang Kosong</h2>
        <p className="text-muted-foreground mb-8">
          Tambahkan produk batik favorit Anda ke keranjang untuk mulai berbelanja.
        </p>
        <Button size="lg" className="rounded-2xl px-8" onClick={() => navigate('/shop')}>
          Mulai Belanja
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Keranjang Belanja</h1>
        <p className="text-muted-foreground mt-1">{items.length} produk dipilih</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <Link to={`/product/${item._id}`} className="shrink-0">
                <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={item.image_urls[0]}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{item.store_name}</p>
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors truncate pr-4">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{item.origin_region} · {item.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    aria-label="Hapus item"
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-1 rounded-xl border border-border w-fit overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Kurangi"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Tambah"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rp {item.price.toLocaleString('id-ID')} / item
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Code */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Kode Promo</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan kode promo"
                id="cart-promo-input"
                className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="outline" className="h-10 rounded-xl px-4 text-sm">Terapkan</Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="glass-card rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-5">Ringkasan Belanja</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} produk)</span>
                <span className="font-medium text-foreground">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkos Kirim</span>
                <span className={cn('font-medium', shipping === 0 ? 'text-green-600' : 'text-foreground')}>
                  {shipping === 0 ? 'GRATIS' : `Rp ${shipping.toLocaleString('id-ID')}`}
                </span>
              </div>
              {subtotal < 300000 && (
                <p className="text-xs text-[hsl(43_85%_42%)] bg-[hsl(43_85%_48%/0.1)] rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <Gift className="h-3.5 w-3.5" /> Tambah Rp {(300000 - subtotal).toLocaleString('id-ID')} lagi untuk gratis ongkir!
                </p>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary text-xl">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <Button
              size="lg"
              className="w-full mt-5 h-12 rounded-2xl text-base font-semibold gap-2"
              asChild
            >
              <Link to="/checkout">
                Lanjut ke Checkout <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full mt-2 text-sm text-muted-foreground"
              asChild
            >
              <Link to="/shop">← Lanjut Belanja</Link>
            </Button>

            {/* Trust badges */}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              {[
                { icon: Lock, text: 'Pembayaran 100% aman' },
                { icon: Truck, text: 'Pengiriman cepat & terpercaya' },
                { icon: RotateCcw, text: 'Garansi pengembalian 14 hari' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="text-xs text-muted-foreground flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
