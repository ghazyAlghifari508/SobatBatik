import { useState } from 'react'
import { useStoreAppStore } from '../../store/useStoreAppStore'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Check, X, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminApprovals() {
  const { applications, updateStatus } = useStoreAppStore()
  
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const pendingApps = applications.filter(app => app.status === 'Menunggu')
  const historyApps = applications.filter(app => app.status !== 'Menunggu')

  const handleApprove = (id: string) => {
    updateStatus(id, 'Disetujui')
    toast.success('Pengajuan toko berhasil disetujui!')
  }

  const handleRejectClick = (id: string) => {
    setSelectedAppId(id)
    setRejectionReason('')
    setIsRejectOpen(true)
  }

  const submitReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan wajib diisi!')
      return
    }
    if (selectedAppId) {
      updateStatus(selectedAppId, 'Ditolak', rejectionReason)
      toast.success('Pengajuan toko berhasil ditolak.')
    }
    setIsRejectOpen(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Persetujuan Toko Baru</h1>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengaju</TableHead>
                <TableHead>Nama Toko</TableHead>
                <TableHead>Deskripsi & Alamat</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    Tidak ada pengajuan toko yang menunggu persetujuan.
                  </TableCell>
                </TableRow>
              ) : (
                pendingApps.map(app => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">{app.user_name}</TableCell>
                    <TableCell className="font-bold text-primary">{app.store_name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm line-clamp-1 mb-1">{app.description}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{app.address}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(app.applied_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleRejectClick(app._id)}>
                          <X className="w-4 h-4 mr-1" /> Tolak
                        </Button>
                        <Button size="sm" className="bg-success text-white hover:bg-success/90" onClick={() => handleApprove(app._id)}>
                          <Check className="w-4 h-4 mr-1" /> Setujui
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

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Riwayat Pengajuan
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Toko</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">Belum ada riwayat.</TableCell>
                </TableRow>
              ) : (
                historyApps.map(app => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">{app.store_name}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === 'Disetujui' ? 'default' : 'destructive'}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-sm">
                      {app.status === 'Ditolak' ? app.rejection_reason : 'Toko aktif dan beroperasi.'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Pengajuan Toko</DialogTitle>
            <DialogDescription>
              Mohon berikan alasan penolakan yang jelas. Alasan ini akan dibaca oleh pemohon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alasan Penolakan</Label>
              <Textarea 
                placeholder="Contoh: Deskripsi toko kurang jelas, alamat tidak valid..." 
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={submitReject}>Konfirmasi Penolakan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
