import { useState } from 'react'
import { useStoreAppStore } from '../../store/useStoreAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Store, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function StoreApplication() {
  const { user } = useAuthStore()
  const { applications, applyStore } = useStoreAppStore()
  
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')

  // Check if user has an existing application
  const existingApp = applications.find(app => app.user_id === user?.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    applyStore({
      user_id: user.id,
      user_name: user.name,
      store_name: storeName,
      description,
      address
    })
    
    toast.success('Pengajuan toko berhasil dikirim!')
  }

  if (existingApp) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              {existingApp.status === 'Menunggu' && <Clock className="w-8 h-8 text-warning" />}
              {existingApp.status === 'Disetujui' && <CheckCircle2 className="w-8 h-8 text-success" />}
              {existingApp.status === 'Ditolak' && <AlertCircle className="w-8 h-8 text-destructive" />}
            </div>
            <CardTitle className="text-2xl">Status Pengajuan Toko</CardTitle>
            <CardDescription>
              Status saat ini: <strong className="text-foreground">{existingApp.status}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-3 gap-4 text-sm border-b pb-4">
              <span className="text-muted-foreground">Nama Toko</span>
              <span className="col-span-2 font-medium">{existingApp.store_name}</span>
              
              <span className="text-muted-foreground">Tanggal Pengajuan</span>
              <span className="col-span-2 font-medium">
                {new Date(existingApp.applied_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            {existingApp.status === 'Ditolak' && existingApp.rejection_reason && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pengajuan Ditolak</AlertTitle>
                <AlertDescription>
                  Alasan: {existingApp.rejection_reason}
                </AlertDescription>
              </Alert>
            )}

            {existingApp.status === 'Disetujui' && (
              <Alert className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle>Selamat!</AlertTitle>
                <AlertDescription>
                  Pengajuan toko Anda telah disetujui. Silakan login menggunakan role "Store" untuk mengakses Dashboard.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Mulai Berjualan di SobatBatik</CardTitle>
          <CardDescription>
            Isi formulir pengajuan berikut untuk membuka toko Anda sendiri.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input 
                id="storeName" 
                placeholder="Contoh: Batik Kencana" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Deskripsi Toko</Label>
              <Textarea 
                id="desc" 
                placeholder="Ceritakan tentang toko Anda dan jenis batik yang dijual..." 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr">Alamat Toko</Label>
              <Textarea 
                id="addr" 
                placeholder="Alamat lengkap operasional toko" 
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardContent>
            <Button type="submit" className="w-full" size="lg">Ajukan Pembukaan Toko</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
