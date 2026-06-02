import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductStore } from '../../store/useProductStore'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { ShoppingCart, ArrowLeft, Store } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { addItem } = useCartStore()
  
  const product = products.find(p => p._id === id)

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang!`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Katalog
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-muted rounded-xl overflow-hidden aspect-square">
          <img 
            src={product.image_urls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.origin_region}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center text-muted-foreground gap-2">
              <Store className="w-4 h-4" />
              <span>{product.store_name}</span>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-primary">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
          
          <div className="prose prose-sm text-foreground/80">
            <p>{product.description}</p>
          </div>
          
          <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Ketersediaan</span>
              <span className="font-medium">Sisa {product.stock} stok</span>
            </div>
            <Button 
              size="lg" 
              className="w-full gap-2" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
