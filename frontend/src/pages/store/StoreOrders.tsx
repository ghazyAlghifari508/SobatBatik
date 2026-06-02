import { useOrderStore } from '../../store/useOrderStore'
import type { OrderStatus } from '../../store/useOrderStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function StoreOrders() {
  const { user } = useAuthStore()
  const { orders, updateOrderStatus } = useOrderStore()
  
  // Filter orders that contain items from this store
  const storeOrders = orders.filter(order => 
    order.items.some(item => item.store_id === user?.id || item.store_name === user?.name)
  )

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
    toast.success(`Status pesanan diperbarui menjadi ${newStatus}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu': return <Clock className="w-4 h-4" />
      case 'Dikemas': return <Package className="w-4 h-4" />
      case 'Dikirim': return <Truck className="w-4 h-4" />
      case 'Selesai': return <CheckCircle2 className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pesanan Masuk</h1>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Pembeli</TableHead>
              <TableHead>Item Pesanan</TableHead>
              <TableHead>Total (Porsi Toko)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ubah Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Belum ada pesanan masuk.</TableCell>
              </TableRow>
            ) : (
              storeOrders.map(order => {
                const storeItems = order.items.filter(i => i.store_id === user?.id || i.store_name === user?.name)
                const storeTotal = storeItems.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0)
                
                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-xs font-mono">{order._id.toUpperCase()}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user_name}</div>
                      <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={order.shipping_address}>
                        {order.shipping_address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="text-sm space-y-1">
                        {storeItems.map(item => (
                          <li key={item._id}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="font-medium">Rp {storeTotal.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1.5 whitespace-nowrap">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={order.status} 
                        onValueChange={(val: OrderStatus) => handleStatusChange(order._id, val)}
                        disabled={order.status === 'Selesai'}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Menunggu">Menunggu</SelectItem>
                          <SelectItem value="Dikemas">Dikemas</SelectItem>
                          <SelectItem value="Dikirim">Dikirim</SelectItem>
                          <SelectItem value="Selesai">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
