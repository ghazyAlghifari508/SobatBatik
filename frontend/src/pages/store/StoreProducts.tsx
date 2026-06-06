import { useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command'
import { Plus, Edit, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import { cn, getImageUrl } from '../../lib/utils'
import { toast } from 'sonner'

const KATEGORI_OPTIONS = ["Batik Cap", "Batik Tulis", "Batik Printing", "Batik Tenun"];
const DAERAH_OPTIONS = ["Solo", "Yogyakarta", "Pekalongan", "Cirebon", "Madura", "Lasem", "Garut", "Tasikmalaya", "Betawi", "Bali", "Papua", "Kalimantan", "Palembang", "Minangkabau"];

export default function StoreProducts() {
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', origin_region: '', image_urls: ''
  })
  const [sizes, setSizes] = useState({ S: 0, M: 0, L: 0, XL: 0 })
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [openKategori, setOpenKategori] = useState(false)
  const [openDaerah, setOpenDaerah] = useState(false)

  const [storeProducts, setStoreProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/store')
      if (res.data.success) {
        setStoreProducts(res.data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error('Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddClick = () => {
    setEditId(null)
    setFormData({ name: '', description: '', price: '', category: '', origin_region: '', image_urls: '' })
    setSizes({ S: 0, M: 0, L: 0, XL: 0 })
    setImageFile(null)
    setIsOpen(true)
  }

  const handleEditClick = (product: any) => {
    setEditId(product._id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      origin_region: product.origin_region,
      image_urls: product.image_urls?.[0] || ''
    })
    setSizes(product.sizes || { S: 0, M: 0, L: 0, XL: 0 })
    setImageFile(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', parseInt(formData.price.replace(/\D/g, '') || '0').toString());
      payload.append('sizes', JSON.stringify(sizes));
      payload.append('category', formData.category);
      payload.append('origin_region', formData.origin_region);
      
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editId) {
        await api.patch(`/products/${editId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Produk berhasil diperbarui!')
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Produk berhasil ditambahkan!')
      }
      setIsOpen(false)
      fetchProducts()
    } catch (error) {
      toast.error(`Gagal ${editId ? 'memperbarui' : 'menambah'} produk`)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/products/${deleteId}`)
      toast.success('Produk dihapus')
      fetchProducts()
    } catch (error) {
      toast.error('Gagal menghapus produk')
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/products/${id}/status`)
      fetchProducts()
    } catch (error) {
      toast.error('Gagal mengubah status produk')
    }
  }

  if (loading) return <div className="p-8 text-center">Memuat produk...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produk Saya</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick} className="gap-2"><Plus className="w-4 h-4" /> Tambah Produk</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
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
                    <Input type="text" placeholder="Contoh: Rp 50.000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Stok per Ukuran</Label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <div key={size} className="flex flex-col gap-1 w-full">
                          <Label className="text-[10px] text-muted-foreground text-center">{size}</Label>
                          <Input 
                            type="number" 
                            min="0"
                            className="px-1 text-center"
                            value={sizes[size as keyof typeof sizes]} 
                            onChange={e => setSizes({...sizes, [size]: parseInt(e.target.value) || 0})} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Popover open={openKategori} onOpenChange={setOpenKategori}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openKategori}
                          className="w-full justify-between font-normal"
                        >
                          {formData.category || "Pilih Kategori..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Cari kategori..." />
                          <CommandList>
                            <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {KATEGORI_OPTIONS.map((kategori) => (
                                <CommandItem
                                  key={kategori}
                                  value={kategori}
                                  onSelect={() => {
                                    setFormData({ ...formData, category: kategori })
                                    setOpenKategori(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", formData.category === kategori ? "opacity-100" : "opacity-0")} />
                                  {kategori}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Khas Daerah</Label>
                    <Popover open={openDaerah} onOpenChange={setOpenDaerah}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDaerah}
                          className="w-full justify-between font-normal"
                        >
                          {formData.origin_region || "Pilih Daerah..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Cari daerah..." />
                          <CommandList>
                            <CommandEmpty>Daerah tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {DAERAH_OPTIONS.map((daerah) => (
                                <CommandItem
                                  key={daerah}
                                  value={daerah}
                                  onSelect={() => {
                                    setFormData({ ...formData, origin_region: daerah })
                                    setOpenDaerah(false)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", formData.origin_region === daerah ? "opacity-100" : "opacity-0")} />
                                  {daerah}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Foto Produk</Label>
                  <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required={!editId} />
                  {editId && formData.image_urls && !imageFile && (
                    <p className="text-sm text-muted-foreground mt-1">Biarkan kosong jika tidak ingin mengubah foto.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                <Button type="submit">{editId ? 'Simpan Perubahan' : 'Simpan Produk'}</Button>
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
                      <img 
                        src={getImageUrl(product.image_urls?.[0])} 
                        alt="" 
                        className="w-10 h-10 rounded object-cover bg-muted" 
                      />
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
                        onCheckedChange={() => handleToggleStatus(product._id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive" onClick={() => setDeleteId(product._id)}>
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

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
