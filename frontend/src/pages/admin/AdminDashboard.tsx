import { useOrderStore } from '../../store/useOrderStore'
import { useProductStore } from '../../store/useProductStore'
import { useStoreAppStore } from '../../store/useStoreAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Users, Store, ShoppingCart, Activity } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '../../components/ui/chart'

export default function AdminDashboard() {
  const { orders } = useOrderStore()
  const { products } = useProductStore()
  const { applications } = useStoreAppStore()

  // In a real app we'd fetch users, here we just mock
  const totalUsers = 150
  
  const activeStores = new Set(products.map(p => p.store_id)).size + applications.filter(a => a.status === 'Disetujui').length
  const totalTransactions = orders.length
  
  const totalGMV = orders.reduce((sum, order) => sum + order.total_price, 0)

  // Mock platform growth data
  const growthData = [
    { month: 'Jan', users: 100, transactions: 150 },
    { month: 'Feb', users: 120, transactions: 200 },
    { month: 'Mar', users: 150, transactions: 250 },
    { month: 'Apr', users: 180, transactions: 300 },
    { month: 'Mei', users: 220, transactions: 400 },
    { month: 'Jun', users: totalUsers, transactions: totalTransactions * 10 },
  ]

  const chartConfig = {
    users: {
      label: "Pengguna",
      color: "hsl(var(--primary))",
    },
    transactions: {
      label: "Transaksi",
      color: "hsl(var(--secondary))",
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toko Aktif</CardTitle>
            <Store className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStores}</div>
            <p className="text-xs text-muted-foreground">Termasuk toko baru bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Order berjalan & selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GMV Platform</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalGMV.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Gross Merchandise Value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pertumbuhan Platform</CardTitle>
          <CardDescription>Perbandingan jumlah pengguna baru dan volume transaksi selama 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ChartContainer config={chartConfig} className="h-full w-full min-h-[350px]">
              <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" name="Pengguna" dataKey="users" stroke="var(--color-users)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" name="Transaksi" dataKey="transactions" stroke="var(--color-transactions)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
