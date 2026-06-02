import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore()

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCartIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Keranjang Belanja Kosong</h2>
        <p className="text-muted-foreground mb-6">Anda belum menambahkan produk apapun ke keranjang.</p>
        <Link to="/">
          <Button>Mulai Belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead className="text-center">Kuantitas</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                        <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">Rp {item.price.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Ringkasan Belanja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Harga ({items.length} Barang)</span>
              <span className="font-medium">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold">Total Tagihan</span>
              <span className="font-bold text-primary text-lg">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/checkout" className="w-full">
              <Button className="w-full gap-2" size="lg">
                Beli Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
