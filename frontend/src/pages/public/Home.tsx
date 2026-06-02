import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const { products } = useProductStore()
  const { addItem } = useCartStore()

  const handleAddToCart = (product: any) => {
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang!`)
  }

  return (
    <div className="space-y-8">
      <section className="bg-primary text-primary-foreground p-12 rounded-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Temukan Keindahan Batik Nusantara</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          SobatBatik menghadirkan koleksi batik autentik dari berbagai pengrajin lokal di seluruh Indonesia.
        </p>
      </section>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Koleksi Terbaru</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter(p => p.is_active).map(product => (
            <Card key={product._id} className="flex flex-col overflow-hidden">
              <div className="aspect-square bg-muted relative">
                <img 
                  src={product.image_urls[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <Badge className="absolute top-2 right-2">{product.origin_region}</Badge>
              </div>
              <CardHeader className="p-4 flex-1">
                <div className="text-sm text-muted-foreground mb-1">{product.store_name}</div>
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="font-bold text-lg">
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
