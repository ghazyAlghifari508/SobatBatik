import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { useOrderStore } from '@/store/useOrderStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { shippingMethods, paymentMethods } from '@/data/dummyData'
import { Check, Loader2, MapPin, Truck, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const { placeOrder } = useOrderStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', province: '', zip: '',
  })
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id)
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id)

  const shippingMethod = shippingMethods.find(s => s.id === selectedShipping)!
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingMethod.price

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    placeOrder({
      items,
      shipping_address: `${form.address}, ${form.city}, ${form.province} ${form.zip}`,
      total_price: total,
    })
    clearCart()
    toast.success('Pesanan berhasil dibuat!')
    navigate('/user/orders')
    setLoading(false)
  }

  const steps = [
    { n: 1, label: 'Pengiriman', Icon: MapPin },
    { n: 2, label: 'Pembayaran', Icon: CreditCard },
    { n: 3, label: 'Konfirmasi', Icon: Check },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map(({ n, label, Icon }, i) => (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => n < step && setStep(n)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm',
                  step > n
                    ? 'bg-primary border-primary text-primary-foreground cursor-pointer'
                    : step === n
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground bg-card cursor-not-allowed'
                )}
              >
                {step > n ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
              </button>
              <span className={cn('text-xs font-medium', step >= n ? 'text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-colors',
                step > n ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Form Area */}
        <div className="lg:col-span-2">

          {/* Step 1: Shipping Info */}
          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Informasi Pengiriman</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-name">Nama Penerima</Label>
                  <Input id="checkout-name" placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-phone">No. Telepon</Label>
                  <Input id="checkout-phone" placeholder="08xx-xxxx-xxxx" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input id="checkout-email" type="email" placeholder="nama@email.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="checkout-address">Alamat Lengkap</Label>
                  <textarea
                    id="checkout-address"
                    placeholder="Jl. Contoh No. 1, RT/RW..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-city">Kota</Label>
                  <Input id="checkout-city" placeholder="Jakarta" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-province">Provinsi</Label>
                  <Input id="checkout-province" placeholder="DKI Jakarta" value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-zip">Kode Pos</Label>
                  <Input id="checkout-zip" placeholder="12345" value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    required className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Metode Pengiriman</h3>
                </div>
                <div className="space-y-2">
                  {shippingMethods.map(m => (
                    <label
                      key={m.id}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all',
                        selectedShipping === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={m.id}
                          checked={selectedShipping === m.id}
                          onChange={() => setSelectedShipping(m.id)}
                          className="accent-primary"
                        />
                        <div>
                          <div className="font-medium text-sm">{m.name} — {m.provider}</div>
                          <div className="text-xs text-muted-foreground">{m.duration}</div>
                        </div>
                      </div>
                      <div className="font-semibold text-sm text-primary">
                        {m.price === 0 ? 'Gratis' : `Rp ${m.price.toLocaleString('id-ID')}`}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-12 rounded-2xl"
                onClick={() => setStep(2)}
                disabled={!form.name || !form.address || !form.city}
              >
                Lanjut ke Pembayaran
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Metode Pembayaran</h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map(m => (
                  <label
                    key={m.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      selectedPayment === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <input type="radio" name="payment" value={m.id}
                      checked={selectedPayment === m.id}
                      onChange={() => setSelectedPayment(m.id)}
                      className="accent-primary" />
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-medium text-sm">{m.name}</span>
                  </label>
                ))}
              </div>

              {/* Payment placeholder form */}
              {selectedPayment === 'transfer' && (
                <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2 animate-fade-in">
                  <p className="text-sm font-semibold">Informasi Rekening</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Bank: BCA</p>
                    <p>No. Rekening: <span className="font-mono font-bold text-foreground">1234-5678-90</span></p>
                    <p>Atas Nama: PT SobatBatik Indonesia</p>
                  </div>
                  <p className="text-xs text-[hsl(43_85%_42%)] mt-2">* Lakukan transfer sebelum 24 jam setelah order dibuat</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button size="lg" className="flex-1 h-12 rounded-2xl" onClick={() => setStep(3)}>
                  Review Pesanan
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold">Konfirmasi Pesanan</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alamat Pengiriman</p>
                  <p className="text-sm font-medium">{form.name}</p>
                  <p className="text-sm text-muted-foreground">{form.address}, {form.city}, {form.province} {form.zip}</p>
                  <p className="text-sm text-muted-foreground">{form.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Metode Pengiriman</p>
                  <p className="text-sm font-medium">{shippingMethod.name} — {shippingMethod.provider}</p>
                  <p className="text-sm text-muted-foreground">{shippingMethod.duration}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pembayaran</p>
                  <p className="text-sm font-medium">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl" onClick={() => setStep(2)}>Kembali</Button>
                <Button
                  size="lg"
                  className="flex-1 h-12 rounded-2xl font-semibold"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</> : 'Buat Pesanan'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary (sticky) */}
        <div>
          <div className="glass-card rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold text-base mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkir</span>
                <span>Rp {shippingMethod.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
