import { useOrderStore } from '../../store/useOrderStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react'

export default function OrderHistory() {
  const { user } = useAuthStore()
  const { orders } = useOrderStore()
  
  const myOrders = orders.filter(o => o.user_id === user?.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu': return <Clock className="w-4 h-4 text-warning" />
      case 'Dikemas': return <Package className="w-4 h-4 text-info" />
      case 'Dikirim': return <Truck className="w-4 h-4 text-primary" />
      case 'Selesai': return <CheckCircle2 className="w-4 h-4 text-success" />
      default: return null
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'outline'
      case 'Selesai': return 'default'
      default: return 'secondary'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan</h1>

      {myOrders.length === 0 ? (
        <Card className="text-center py-12 text-muted-foreground">
          <p>Anda belum memiliki riwayat pesanan.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 py-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Order ID: {order._id.toUpperCase()}
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status) as any} className="flex items-center gap-1.5 px-3 py-1 text-sm">
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item._id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Toko: {item.store_name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.quantity} barang x Rp {item.price_at_purchase.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="font-medium text-right">
                        Rp {(item.quantity * item.price_at_purchase).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat Pengiriman</p>
                      <p className="text-sm font-medium mt-1">{order.shipping_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Belanja</p>
                      <p className="font-bold text-lg text-primary">Rp {order.total_price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
