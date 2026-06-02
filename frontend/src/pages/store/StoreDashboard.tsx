import { useAuthStore } from '../../store/useAuthStore'
import { useOrderStore } from '../../store/useOrderStore'
import { useProductStore } from '../../store/useProductStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Package, ShoppingBag, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '../../components/ui/chart'

export default function StoreDashboard() {
  const { user } = useAuthStore()
  const { orders } = useOrderStore()
  const { products } = useProductStore()

  // Filter data for this store only
  const storeProducts = products.filter(p => p.store_name === user?.name || p.store_id === user?.id)
  
  // Aggregate orders containing this store's products
  const storeOrders = orders.filter(order => 
    order.items.some(item => item.store_id === user?.id || item.store_name === user?.name)
  )

  const totalRevenue = storeOrders.reduce((sum, order) => {
    const storeItems = order.items.filter(i => i.store_id === user?.id || i.store_name === user?.name)
    return sum + storeItems.reduce((s, i) => s + (i.price_at_purchase * i.quantity), 0)
  }, 0)

  const activeProducts = storeProducts.filter(p => p.is_active).length
  const totalStock = storeProducts.reduce((sum, p) => sum + p.stock, 0)
  
  // Mock chart data
  const revenueData = [
    { name: 'Senin', revenue: totalRevenue * 0.1 },
    { name: 'Selasa', revenue: totalRevenue * 0.15 },
    { name: 'Rabu', revenue: totalRevenue * 0.2 },
    { name: 'Kamis', revenue: totalRevenue * 0.1 },
    { name: 'Jumat', revenue: totalRevenue * 0.25 },
    { name: 'Sabtu', revenue: totalRevenue * 0.15 },
    { name: 'Minggu', revenue: totalRevenue * 0.05 },
  ]

  const productData = storeProducts.map(p => ({
    name: p.name.substring(0, 15) + '...',
    sales: Math.floor(Math.random() * 50) + 10
  })).slice(0, 5)

  const chartConfig = {
    revenue: {
      label: "Pendapatan",
      color: "hsl(var(--primary))",
    },
    sales: {
      label: "Penjualan",
      color: "hsl(var(--secondary))",
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Aktif</CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeOrders.filter(o => o.status === 'Menunggu' || o.status === 'Dikemas').length}
            </div>
            <p className="text-xs text-muted-foreground">Pesanan perlu diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">Dari total {storeProducts.length} produk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sisa Stok Global</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Pcs tersedia di gudang</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren Pendapatan</CardTitle>
            <CardDescription>Pendapatan toko Anda selama 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>5 produk dengan penjualan tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px]">
                <BarChart data={productData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
