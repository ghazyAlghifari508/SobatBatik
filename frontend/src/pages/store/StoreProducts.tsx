import { useState } from 'react'
import { useProductStore } from '../../store/useProductStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Switch } from '../../components/ui/switch'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StoreProducts() {
  const { user } = useAuthStore()
  const { products, addProduct, deleteProduct, toggleProductStatus } = useProductStore()
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', origin_region: '', image_urls: ''
  })

  // Filter products by this store
  const storeProducts = products.filter(p => p.store_id === user?.id || p.store_name === user?.name)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    addProduct({
      store_id: user!.id,
      store_name: user!.name,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      origin_region: formData.origin_region,
      image_urls: formData.image_urls ? [formData.image_urls] : ['https://images.unsplash.com/photo-1584483758362-e6e23dbcb1eb?w=500&q=80']
    })

    toast.success('Produk berhasil ditambahkan!')
    setIsAddOpen(false)
    setFormData({ name: '', description: '', price: '', stock: '', category: '', origin_region: '', image_urls: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produk Saya</h1>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Produk</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>Masukkan detail produk batik yang ingin Anda jual.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label>Nama Produk</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Stok Awal</Label>
                    <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Asal Daerah</Label>
                    <Input value={formData.origin_region} onChange={e => setFormData({...formData, origin_region: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL Gambar</Label>
                  <Input placeholder="https://..." value={formData.image_urls} onChange={e => setFormData({...formData, image_urls: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                <Button type="submit">Simpan Produk</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Belum ada produk.</TableCell>
              </TableRow>
            ) : (
              storeProducts.map(product => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img src={product.image_urls[0]} alt="" className="w-10 h-10 rounded object-cover bg-muted" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={product.is_active} 
                        onCheckedChange={() => toggleProductStatus(product._id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive" onClick={() => {
                        deleteProduct(product._id)
                        toast.success('Produk dihapus')
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
