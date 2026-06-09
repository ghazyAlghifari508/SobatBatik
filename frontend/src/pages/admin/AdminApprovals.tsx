import { useState, useEffect } from 'react'
import { api } from '@/lib/axios'
import { Card } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Check, X, FileText, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Application {
  _id: string
  user_id: { _id: string; name: string; email: string } | string
  store_name: string
  description: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  applied_at: string
  reviewed_at?: string
}

export default function AdminApprovals() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteAppId, setSelectedDeleteAppId] = useState<string | null>(null)

  const fetchApplications = async () => {
    try {
      const res = await api.get('/store-applications')
      if (res.data.success) {
        setApplications(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err)
      toast.error('Gagal memuat daftar pengajuan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const getUserName = (app: Application) => {
    if (typeof app.user_id === 'object' && app.user_id !== null) {
      return app.user_id.name
    }
    return '-'
  }

  const getUserEmail = (app: Application) => {
    if (typeof app.user_id === 'object' && app.user_id !== null) {
      return app.user_id.email
    }
    return ''
  }

  const pendingApps = applications.filter(app => app.status === 'pending')
  const historyApps = applications.filter(app => app.status !== 'pending')

  const handleApprove = async (id: string) => {
    setActionLoading(id)
    try {
      const res = await api.patch(`/store-applications/${id}/approve`)
      if (res.data.success) {
        toast.success('Pengajuan toko berhasil disetujui!')
        fetchApplications()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyetujui pengajuan')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectClick = (id: string) => {
    setSelectedAppId(id)
    setRejectionReason('')
    setIsRejectOpen(true)
  }

  const submitReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan wajib diisi!')
      return
    }
    if (!selectedAppId) return

    setActionLoading(selectedAppId)
    try {
      const res = await api.patch(`/store-applications/${selectedAppId}/reject`, {
        rejection_reason: rejectionReason
      })
      if (res.data.success) {
        toast.success('Pengajuan toko berhasil ditolak.')
        fetchApplications()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menolak pengajuan')
    } finally {
      setActionLoading(null)
      setIsRejectOpen(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setSelectedDeleteAppId(id)
    setIsDeleteOpen(true)
  }

  const submitDelete = async () => {
    if (!selectedDeleteAppId) return;
    
    setActionLoading(selectedDeleteAppId)
    try {
      const res = await api.delete(`/store-applications/${selectedDeleteAppId}`)
      if (res.data.success) {
        toast.success('Riwayat pengajuan berhasil dihapus')
        fetchApplications()
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus riwayat')
    } finally {
      setActionLoading(null)
      setIsDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Persetujuan Toko Baru</h1>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Pengaju</TableHead>
                <TableHead className="w-[200px]">Nama Toko</TableHead>
                <TableHead>Deskripsi & Alamat</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap">Tanggal</TableHead>
                <TableHead className="text-right w-[150px]">Aksi</TableHead>
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
                    <TableCell>
                      <div>
                        <div className="font-medium">{getUserName(app)}</div>
                        <div className="text-xs text-muted-foreground">{getUserEmail(app)}</div>
                      </div>
                    </TableCell>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive border-destructive hover:bg-destructive/10" 
                          onClick={() => handleRejectClick(app._id)}
                          disabled={actionLoading === app._id}
                        >
                          <X className="w-4 h-4 mr-1" /> Tolak
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 text-white hover:bg-green-700" 
                          onClick={() => handleApprove(app._id)}
                          disabled={actionLoading === app._id}
                        >
                          {actionLoading === app._id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          Setujui
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
                <TableHead className="w-[200px]">Pengaju</TableHead>
                <TableHead className="w-[200px]">Nama Toko</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Belum ada riwayat.</TableCell>
                </TableRow>
              ) : (
                historyApps.map(app => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getUserName(app)}</div>
                        <div className="text-xs text-muted-foreground">{getUserEmail(app)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{app.store_name}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === 'approved' ? 'default' : 'destructive'}>
                        {app.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-sm">
                      {app.status === 'rejected' ? app.rejection_reason : 'Toko aktif dan beroperasi.'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteClick(app._id)}
                        disabled={actionLoading === app._id}
                      >
                        {actionLoading === app._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
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
            <Button 
              variant="destructive" 
              onClick={submitReject}
              disabled={actionLoading !== null}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Konfirmasi Penolakan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Riwayat Pengajuan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus riwayat pengajuan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button 
              variant="destructive" 
              onClick={submitDelete}
              disabled={actionLoading !== null}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Hapus Riwayat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
