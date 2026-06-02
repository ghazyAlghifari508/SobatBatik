import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/useCartStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useOrderStore } from '../../store/useOrderStore'
import { useProductStore } from '../../store/useProductStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card'
import { toast } from 'sonner'

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { addOrder } = useOrderStore()
  const { products, setProducts } = useProductStore()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      toast.error('Silakan isi alamat pengiriman')
      return
    }

    if (!user) {
      toast.error('Anda harus login untuk melakukan checkout')
      return
    }

    // Process order creation
    addOrder({
      user_id: user.id,
      user_name: user.name,
      shipping_address: address,
      total_price: totalPrice,
      items: items.map(item => ({
        _id: Math.random().toString(36).substr(2, 9),
        product_id: item._id,
        store_id: item.store_id,
        store_name: item.store_name,
        name: item.name,
        quantity: item.quantity,
        price_at_purchase: item.price
      }))
    })

    // Reduce stock from products
    const updatedProducts = products.map(product => {
      const cartItem = items.find(i => i._id === product._id)
      if (cartItem) {
        return { ...product, stock: Math.max(0, product.stock - cartItem.quantity) }
      }
      return product
    })
    setProducts(updatedProducts)

    clearCart()
    toast.success('Pesanan berhasil dibuat!')
    navigate('/user/orders')
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alamat Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Penerima</Label>
                <Input value={user?.name || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea 
                  id="address" 
                  placeholder="Contoh: Jl. Merdeka No. 10, RT 01/02, Kelurahan, Kecamatan, Kota..."
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-4">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium shrink-0">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total Pembayaran</span>
                <span className="text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg">Buat Pesanan</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
