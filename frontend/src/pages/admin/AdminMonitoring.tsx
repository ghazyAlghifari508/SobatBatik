import { useOrderStore } from '../../store/useOrderStore'
import { useProductStore } from '../../store/useProductStore'
import { useStoreAppStore } from '../../store/useStoreAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'

export default function AdminMonitoring() {
  const { orders } = useOrderStore()
  const { products } = useProductStore()
  const { applications } = useStoreAppStore()

  // Mock users
  const mockUsers = [
    { id: 'u1', name: 'Budi', email: 'budi@example.com', role: 'user', created: '2023-01-10' },
    { id: 'u2', name: 'Siti', email: 'siti@example.com', role: 'user', created: '2023-02-15' },
    { id: 's1', name: 'Toko Batik Kencana', email: 'kencana@example.com', role: 'store', created: '2023-01-20' },
    { id: 'a1', name: 'Admin', email: 'admin@sobatbatik.com', role: 'admin', created: '2023-01-01' },
  ]

  // Mock Active Stores
  const activeStores = [
    { id: 's1', name: 'Batik Kencana', owner: 'Pak Kencana', products: products.filter(p => p.store_id === 's1').length, joined: '2023-01-20' },
    ...applications.filter(a => a.status === 'Disetujui').map(a => ({
      id: a.user_id, name: a.store_name, owner: a.user_name, products: 0, joined: new Date(a.applied_at).toISOString().split('T')[0]
    }))
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Monitoring Sistem</h1>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Log Transaksi</TabsTrigger>
          <TabsTrigger value="users">Pengguna Terdaftar</TabsTrigger>
          <TabsTrigger value="stores">Toko Aktif</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Log Transaksi Global (Read-Only)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Pembeli</TableHead>
                    <TableHead>Total Nilai</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">Belum ada transaksi.</TableCell>
                    </TableRow>
                  ) : (
                    orders.map(order => (
                      <TableRow key={order._id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{order._id}</TableCell>
                        <TableCell>{order.user_name}</TableCell>
                        <TableCell className="font-medium text-primary">Rp {order.total_price.toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'store' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Toko Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Toko</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Jumlah Produk</TableHead>
                    <TableHead>Bergabung Sejak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeStores.map(store => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium text-primary">{store.name}</TableCell>
                      <TableCell>{store.owner}</TableCell>
                      <TableCell>{store.products} produk</TableCell>
                      <TableCell>{new Date(store.joined).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
